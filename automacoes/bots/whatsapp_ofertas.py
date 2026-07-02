import json, os, time, tempfile, threading, requests, schedule, subprocess
from datetime import datetime, date
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

# ============================================================
# CONFIG
# ============================================================
NOME_GRUPO       = "Radar de Ofertas TECH"
LINK_SITE        = "https://www.radarofertastech.app.br/"
CAMINHO_JSON     = "ofertas_mercadolivre.json"

LIMITE_DIARIO    = 20
TAMANHO_LOTE     = 4
DELAY_ENTRE_MSG  = 8

HORARIOS_DISPARO = ["08:00", "11:00", "14:00", "17:00", "20:00"]

_estado = {
    "data_atual":    None,
    "enviadas_hoje": 0,
    "indice_fila":   0,
    "fila_do_dia":   [],
    "driver":        None,
    "lock":          threading.Lock(),
}

# ============================================================
# SELETORES — Corrigidos para formato XPath puro
# ============================================================

SELETORES_BUSCA = [
    "//div[@contenteditable='true'][@data-tab='3']",
    "//input[@id='_r_a_']",
    "//input[@type='text' and contains(@class, 'html-input')]"
]

SELETORES_INPUT_ARQUIVO = [
    '//input[@type="file" and contains(@accept, "image/*")]',
    '//input[@type="file"]'
]

SELETORES_CARD_GRUPO = [
    f'//span[@title="{NOME_GRUPO}"]/ancestor::div[@data-testid="cell-frame-container"]',
    f'//span[@title="{NOME_GRUPO}"]',
    f'//span[contains(@title, "{NOME_GRUPO[:10]}")]'
]
SELETORES_MSG = [
    '//div[@data-testid="conversation-compose-box-input"]//p',
    '//footer//div[@contenteditable="true"]',
    '//div[@contenteditable="true"][@data-tab="10"]'
]

# O botão de enviar que você validou no console F12!
SELETORES_ENVIAR_MSG = [
    '//button[@aria-label="Enviar"]',
    '//button[@data-tab="11"]',
    '//span[@data-testid="send"]/ancestor::button'
]

SELETORES_LEGENDA = [
    '//div[@data-testid="media-caption-input-container"]//div[@contenteditable="true"]',
    '//div[@contenteditable="true"][@data-tab="10"]',
    '//footer//div[@contenteditable="true"]'
]

SELETORES_ENVIAR_FOTO = [
    '//div[@role="button"]//span[@data-testid="send"]',
    '//span[@data-testid="wds-ic-send-filled"]',
    '//div[@role="button"][@aria-label="Enviar"]'
]

SELETORES_CARREGADO = [
    "//div[@id='pane-side']",
    "//button[@aria-label='Conversas']"
]

def log(msg: str):
    print(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {msg}", flush=True)

def achar(driver, seletores: list, timeout: int = 10):
    fim = time.time() + timeout
    while time.time() < fim:
        for xpath in seletores:
            try:
                el = driver.find_element(By.XPATH, xpath)
                if el.is_displayed():
                    return el
            except NoSuchElementException:
                pass
        time.sleep(0.4)
    raise TimeoutException(f"Nenhum seletor encontrado em {timeout}s")

def clicar(driver, seletores: list, timeout: int = 10):
    el = achar(driver, seletores, timeout)
    driver.execute_script("arguments[0].click();", el)
    return el

def digitar(driver, el, texto: str):
    linhas = texto.split("\n")
    for i, linha in enumerate(linhas):
        driver.execute_script("""
            const linha = arguments[0];
            const el    = arguments[1];
            el.focus();
            const dt = new DataTransfer();
            dt.setData('text/plain', linha);
            el.dispatchEvent(new ClipboardEvent('paste', {
                clipboardData: dt, bubbles: true, cancelable: true
            }));
        """, linha, el)
        time.sleep(0.1)
        if i < len(linhas) - 1:
            el.send_keys(Keys.SHIFT + Keys.ENTER)
    time.sleep(0.3)

def carregar_ofertas(caminho: str) -> list:
    with open(caminho, "r", encoding="utf-8") as f:
        d = json.load(f)
    return [d] if isinstance(d, dict) else d

def filtrar_e_ordenar(ofertas: list) -> list:
    # Ajustado para lidar com o JSON simplificado se necessário
    return ofertas[:LIMITE_DIARIO]

def resetar_estado_diario():
    p = Path(CAMINHO_JSON)
    if not p.exists():
        log(f"❌ JSON não encontrado: {p}"); return
    fila = filtrar_e_ordenar(carregar_ofertas(str(p)))
    _estado.update({
        "data_atual":    date.today(),
        "enviadas_hoje": 0,
        "indice_fila":   0,
        "fila_do_dia":   fila,
    })
    log(f"🗓️  Fila resetada — {len(fila)} oferta(s) para hoje.")

def proximo_lote() -> list:
    fila   = _estado["fila_do_dia"]
    inicio = _estado["indice_fila"]
    restam = LIMITE_DIARIO - _estado["enviadas_hoje"]
    if restam <= 0 or inicio >= len(fila):
        return []
    fim = min(inicio + TAMANHO_LOTE, len(fila), inicio + restam)
    return fila[inicio:fim]

def baixar_foto(url: str, pasta: str):
    try:
        r = requests.get(url, timeout=15)
        r.raise_for_status()
        from PIL import Image
        import io
        imagem = Image.open(io.BytesIO(r.content))
        if imagem.mode in ("RGBA", "P", "LA"):
            fundo = Image.new("RGB", imagem.size, (255, 255, 255))
            if imagem.mode == "P":
                imagem = imagem.convert("RGBA")
            fundo.paste(imagem, mask=imagem.split()[-1] if imagem.mode in ("RGBA", "LA") else None)
            imagem = fundo
        elif imagem.mode != "RGB":
            imagem = imagem.convert("RGB")
        caminho_jpg = os.path.join(pasta, "foto.jpg")
        imagem.save(caminho_jpg, "JPEG", quality=92)
        return caminho_jpg
    except Exception as e:
        log(f"  ⚠️  Foto: {e}")
        return None

def formatar_msg(oferta: dict) -> str:
    titulo = oferta.get("titulo", "Produto")
    link   = oferta.get("link", "")
    preco  = oferta.get("preco", "")
    desc   = oferta.get("desconto", "")
    orig   = oferta.get("precoOriginal", "")
    preco_linha = ""
    if preco and desc:
        preco_linha = f"\n💰 De R$ {orig} por *R$ {preco}*  ➡️  {desc}% OFF 🔥"
    elif preco:
        preco_linha = f"\n💰 *R$ {preco}*"
    return f"*{titulo}*{preco_linha}\n\n🛒 *ACHADO TECH NO MERCADO LIVRE!!*\n\n🔗 {link}\n\n👉 Veja mais em: {LINK_SITE}"

def abrir_grupo(driver):
    log(f"🔍 Buscando grupo: '{NOME_GRUPO}'")
    campo = achar(driver, SELETORES_BUSCA, timeout=20)
    driver.execute_script("arguments[0].click();", campo)
    time.sleep(0.5)
    campo.send_keys(Keys.CONTROL + "a")
    campo.send_keys(Keys.DELETE)
    time.sleep(0.3)
    for letra in NOME_GRUPO:
        campo.send_keys(letra)
        time.sleep(0.05)
    time.sleep(1.0)
    campo.send_keys(Keys.ENTER)
    time.sleep(4.0) 
    try:
        clicar(driver, SELETORES_CARD_GRUPO, timeout=10)
        log("✅ Grupo aberto com sucesso!")
    except TimeoutException:
        primeiro_resultado = driver.find_element(By.XPATH, '//div[@id="pane-side"]//div[@data-testid="cell-frame-container"]')
        driver.execute_script("arguments[0].click();", primeiro_resultado)
        log("✅ Grupo aberto via clique forçado!")
    time.sleep(2.0)

def arrastar_e_soltar_arquivo(driver, campo_destino, caminho_arquivo):
    """Simula o comportamento de arrastar e soltar um arquivo dentro do chat."""
    js_drop_file = """
        var target = arguments[0];
        var offsetX = arguments[1];
        var offsetY = arguments[2];
        var document = target.ownerDocument || document;
        var window = document.defaultView || window;

        var input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        input.onchange = function (rect) {
          rect.stopPropagation();
          var dataTransfer = { files: this.files, types: ['Files'] };
          ['dragenter', 'dragover', 'drop'].forEach(function (name) {
            var evt = document.createEvent('MouseEvent');
            evt.initMouseEvent(name, !0, !0, window, 0, 0, 0, offsetX, offsetY, !1, !1, !1, !1, 0, null);
            evt.dataTransfer = dataTransfer;
            target.dispatchEvent(evt);
          });
          input.remove();
        };
        document.body.appendChild(input);
        return input;
    """
    input_temporario = driver.execute_script(js_drop_file, campo_destino, 0, 0)
    input_temporario.send_keys(os.path.abspath(caminho_arquivo))

def enviar_foto_com_legenda(driver, caminho_foto, legenda):
    try:
        # 1. Localiza a área principal do chat para soltar a imagem
        container_chat = achar(driver, SELETORES_MSG, timeout=15)
        log("📌 [foto] Área de chat localizada. Iniciando Drag & Drop simulado...")
        
        # Executa o drop simulado do arquivo JPG
        arrastar_e_soltar_arquivo(driver, container_chat, caminho_foto)
        log("📁 Arquivo 'soltado' no chat com sucesso. Aguardando processamento da preview...")
        
        # 2. Aguarda a janela de preview de mídia abrir monitorando o campo de legenda
        campo_legenda = achar(driver, SELETORES_LEGENDA, timeout=15)
        
        # 3. Digita a legenda de forma segura dentro da preview
        log("📝 Digitando legenda na preview de mídia...")
        driver.execute_script("arguments[0].focus();", campo_legenda)
        time.sleep(0.5)
        digitar(driver, campo_legenda, legenda)
        time.sleep(1.5)
        
        # 4. Clica no botão verde de enviar da tela de mídia
        log("🚀 Localizando botão de envio da foto...")
        clicar(driver, SELETORES_ENVIAR_FOTO, timeout=15)
        log("✅ Foto e oferta enviadas com sucesso!")
        
        # Tempo de estabilização pós-envio
        time.sleep(4.0)
    except Exception as e:
        log(f"❌ Erro no fluxo de envio de foto: {e}")
        # Envia um ESC para limpar a tela caso tenha ficado preso na preview
        try:
            driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
        except:
            pass
        raise e

def enviar_texto(driver, texto: str):
    # 1. Localiza o campo onde escrevemos a mensagem
    campo = achar(driver, SELETORES_MSG, timeout=15)
    driver.execute_script("arguments[0].click();", campo)
    driver.execute_script("arguments[0].focus();", campo)
    time.sleep(0.5)
    
    # 2. Injeta o texto estruturado no chat
    log("📝 Digitando o corpo do anúncio...")
    digitar(driver, campo, texto)
    
    # 3. Pausa estratégica para o WhatsApp Web carregar o preview do link (Metadados + Foto)
    log("⏳ Aguardando 15 segundos para o WhatsApp renderizar o preview da foto do link...")
    time.sleep(15.0)
    
    # 4. Localiza e clica no botão de Enviar mapeado no F12
    log("🚀 Clicando no botão Enviar do chat...")
    try:
        clicar(driver, SELETORES_ENVIAR_MSG, timeout=10)
        log("✅ Mensagem e preview enviados com sucesso!")
    except TimeoutException:
        log("⚠️ Botão de clique não respondeu. Tentando enviar via comando de teclado ENTER...")
        campo.send_keys(Keys.ENTER)
        log("✅ Mensagem enviada via tecla ENTER!")
        
    time.sleep(3.0)

def publicar_oferta(driver, oferta: dict, pasta_temp: str):
    titulo = oferta.get("titulo", "Produto")
    log(f"  📦 Preparando envio de texto: {titulo[:55]}...")

    # 1. Gera a mensagem formatada com emojis, preços e o link do Mercado Livre
    msg = formatar_msg(oferta)
    
    # 2. Envia diretamente para o chat normal usando os seletores validados
    enviar_texto(driver, msg)

def executar_lote():

    if _estado["data_atual"] != date.today():
        resetar_estado_diario()
        
    with _estado["lock"]:
        lote = proximo_lote()
        if not lote: 
            return
            
        log(f"🚀 Horário de disparo atingido! Iniciando lote de {len(lote)} ofertas...")
        driver = _estado["driver"]
        
        try:
            # 1. Atualiza a página para limpar o cache e descongelar o WhatsApp Web
            log("🔄 Reiniciando a aba do WhatsApp para evitar travamentos (F5)...")
            driver.refresh()
            
            # 2. Aguarda a interface do WhatsApp voltar a ficar totalmente pronta
            log("⏳ Aguardando recarregamento completo pós-refresh...")
            achar(driver, SELETORES_CARREGADO, timeout=90)
            time.sleep(5.0) # Margem de segurança para estabilizar o DOM
            
            # 3. Agora sim, busca e abre o grupo de ofertas
            abrir_grupo(driver)
            
        except Exception as e:
            log(f"❌ Erro ao preparar o navegador ou abrir o grupo: {e}")
            return
            
        # 4. Processa o envio do lote de texto
        with tempfile.TemporaryDirectory() as pasta:
            for i, oferta in enumerate(lote):
                try:
                    publicar_oferta(driver, oferta, pasta)
                    _estado["enviadas_hoje"] += 1
                    _estado["indice_fila"]   += 1
                except Exception as e:
                    log(f"   ❌ Erro na oferta: {e}")
                    
                if i < len(lote) - 1: 
                    time.sleep(DELAY_ENTRE_MSG)

def main():
    resetar_estado_diario()
    op = webdriver.ChromeOptions()
    perfil = os.path.join(Path.home(), ".whatsapp_bot_profile")
    op.add_argument(f"--user-data-dir={perfil}")
    op.add_argument("--no-sandbox")
    op.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=op)
    _estado["driver"] = driver
    driver.get("https://web.whatsapp.com")
    log("⏳ Aguardando QR Code...")
    achar(driver, SELETORES_CARREGADO, timeout=120)
    
    for h in HORARIOS_DISPARO:
        schedule.every().day.at(h).do(executar_lote)
    
    log("🧪 Disparando lote inicial...")
    executar_lote()

    while True:
        schedule.run_pending()
        time.sleep(30)

if __name__ == "__main__":
    main()
