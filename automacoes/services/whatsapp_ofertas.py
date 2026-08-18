import json, os, time, tempfile, threading, requests, schedule, random
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
# CONFIGURACAO
# ============================================================

GRUPOS_DESTINO = [
    "Garimpos Originais", # Seu grupo principal
]

# Delays de segurança
DELAY_ENTRE_MSG = 8    # segundos entre cada oferta no mesmo grupo
DELAY_MIN_GRUPO = 45   # segundos entre a troca de grupos
DELAY_MAX_GRUPO = 90   # segundos entre a troca de grupos

CAMINHO_JSON     = "ofertas_mercadolivre.json"
LIMITE_DIARIO    = 30
TAMANHO_LOTE     = 4   # 4 ofertas disparadas por lote em cada grupo

HORARIOS_DISPARO = ["06:00", "08:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"]
LINK_GRUPO       = "https://chat.whatsapp.com/KRUPdha04CWGBZ454CL7b9"

_estado = {
    "data_atual":    None,
    "enviadas_hoje": 0,
    "indice_fila":   0,
    "fila_do_dia":   [],
    "enviados_ids":  set(),
    "driver":        None,
    "lock":          threading.Lock(),
}

# ============================================================
# SELETORES
# ============================================================
SELETORES_BUSCA = [
    "//div[@contenteditable='true'][@data-tab='3']",
    "//input[@type='text' and contains(@class, 'html-input')]"
]

SELETORES_MSG = [
    '//div[@data-testid="conversation-compose-box-input"]//div[@contenteditable="true"]',
    '//footer//div[@contenteditable="true"]'
]

SELETORES_ENVIAR_MSG = [
    '//button[@aria-label="Enviar"]',
    '//span[@data-testid="send"]/ancestor::button'
]

SELETORES_CLIP = [
    '//div[@title="Anexar"]',
    '//span[@data-testid="plus"]',
    '//button[@aria-label="Anexar"]'
]

SELETORES_INPUT_ARQUIVO = [
    '//input[@type="file"]'
]

SELETORES_LEGENDA = [
    '//div[@data-testid="media-caption-input-container"]//div[@contenteditable="true"]',
    '//div[contains(@class, "lexical-rich-text-input")]//div[@contenteditable="true"]'
]

SELETORES_ENVIAR_FOTO = [
    '//div[@role="button"]//span[@data-testid="send"]',
    '//div[@role="button"][@aria-label="Enviar"]'
]

SELETORES_CARREGADO = [
    "//div[@id='pane-side']",
    "//button[@aria-label='Conversas']"
]

# ============================================================
# UTILS & FUNÇÕES AUXILIARES
# ============================================================

def log(msg: str):
    print(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {msg}", flush=True)

def baixar_imagem(url_imagem: str, pasta_destinatario: str) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(url_imagem, headers=headers, timeout=10)
        if res.status_code == 200:
            caminho_local = os.path.join(pasta_destinatario, "temp_oferta.jpg")
            with open(caminho_local, "wb") as f:
                f.write(res.content)
            return caminho_local
    except Exception as e:
        log(f"⚠️ Falha ao baixar imagem: {e}")
    return ""

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
    driver.execute_script("arguments[0].focus();", el)
    time.sleep(0.2)
    
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
        time.sleep(0.05)
        if i < len(linhas) - 1:
            el.send_keys(Keys.SHIFT + Keys.ENTER)
    time.sleep(0.3)

# ============================================================
# FUNÇÕES DE ENVIO DE MENSAGENS
# ============================================================

def enviar_texto(driver, msg: str):
    log("💬 Enviando mensagem em texto simples...")
    campo_msg = achar(driver, SELETORES_MSG, timeout=15)
    digitar(driver, campo_msg, msg)
    
    # Delay essencial para o WhatsApp Web carregar o preview (card com imagem/título)
    log("⏳ Aguardando carregamento do link preview...")
    time.sleep(8)
    
    try:
        clicar(driver, SELETORES_ENVIAR_MSG, timeout=5)
    except TimeoutException:
        campo_msg.send_keys(Keys.ENTER)
        
    time.sleep(2.0)
    log("✅ Texto enviado!")

def enviar_foto_com_legenda(driver, caminho_foto: str, legenda: str):
    log("🖼️ Preparando envio de imagem...")
    
    # 1. Clica no botão de anexar (+ / clipe)
    clicar(driver, SELETORES_CLIP, timeout=10)
    time.sleep(1.2)

    input_file = None

    # Tática 1: Tenta achar o input especificamente filho do botão "Fotos e vídeos"
    try:
        input_file = driver.find_element(
            By.XPATH, 
            '//button[@aria-label="Fotos e vídeos"]//input[@type="file"]'
        )
    except NoSuchElementException:
        pass

    # Tática 2: Fallback direto no 9º input (índice 8) conforme a estrutura do seu navegador
    if not input_file:
        inputs = driver.find_elements(By.XPATH, '//input[@type="file"]')
        if len(inputs) >= 9:
            input_file = inputs[8] # 9º elemento (índice 8)
        elif inputs:
            input_file = inputs[-1] # Pega o último caso haja menos que 9

    if not input_file:
        raise NoSuchElementException("Nenhum input de foto/vídeo foi encontrado após abrir o menu.")

    # 2. Injeta o caminho absoluto do arquivo no input correto
    input_file.send_keys(os.path.abspath(caminho_foto))
    time.sleep(3.5)  # Aguarda a modal de pré-visualização carregar

    # 3. Digita a legenda na caixa de texto da foto
    log("📝 Digitando legenda na foto...")
    campo_legenda = achar(driver, SELETORES_LEGENDA, timeout=15)
    digitar(driver, campo_legenda, legenda)
    time.sleep(1.5)

    # 4. Envia a foto
    log("🚀 Enviando foto com legenda...")
    try:
        clicar(driver, SELETORES_ENVIAR_FOTO, timeout=10)
    except TimeoutException:
        campo_legenda.send_keys(Keys.ENTER)
        
    time.sleep(3.0)
    log("✅ Foto com legenda enviada com sucesso!")

# ============================================================
# FILA E FORMATTAÇÃO
# ============================================================

def carregar_e_embaralhar_fila():
    p = Path(CAMINHO_JSON)
    if not p.exists():
        log(f"❌ JSON não encontrado: {p}")
        return []

    with open(p, "r", encoding="utf-8") as f:
        d = json.load(f)
    
    ofertas = [d] if isinstance(d, dict) else d
    candidatos = []
    
    for oferta in ofertas:
        link = str(oferta.get('link') or oferta.get('url') or "").strip().lower()
        if link.startswith(('meli.', 'https://meli', 'http://meli')):
            candidatos.append(oferta)

    random.shuffle(candidatos)
    return candidatos

def resetar_estado_diario():
    fila = carregar_e_embaralhar_fila()
    _estado.update({
        "data_atual":    date.today(),
        "enviadas_hoje": 0,
        "indice_fila":   0,
        "fila_do_dia":   fila,
        "enviados_ids":  set()
    })
    log(f"🗓️ Estado resetado para {date.today()} — {len(fila)} oferta(s) prontas na fila.")

def proximo_lote() -> list:
    fila   = _estado["fila_do_dia"]
    inicio = _estado["indice_fila"]
    restam = LIMITE_DIARIO - _estado["enviadas_hoje"]
    
    if restam <= 0 or inicio >= len(fila):
        return []
        
    fim = min(inicio + TAMANHO_LOTE, len(fila), inicio + restam)
    return fila[inicio:fim]

def formatar_msg(oferta: dict) -> str:
    titulo = oferta.get("titulo", "Produto")
    link   = oferta.get("link", "")
    preco  = oferta.get("preco", "")
    desc   = oferta.get("desconto", "")
    orig   = oferta.get("precoOriginal", "")

    chamadas_topo = [
        f"*{titulo}*",
        f"🔥 *{titulo}*",
        f"⚡ *{titulo}*",
        f"🚨 *{titulo}*"
    ]

    banners_ml = [
        "🛒 *ACHADO NO MERCADO LIVRE!!*",
        "🛒 *PROMOÇÃO IMPERDÍVEL NO MERCADO LIVRE!*",
        "🛒 *ACHADINHO DO DIA NO MERCADO LIVRE!*",
        "🛒 *DESCONTO ESPECIAL NO MERCADO LIVRE!!*"
    ]

    chamadas_grupo = [
        "Divulgue o grupo para mais pessoas encontrarem essas ofertas! 😉",
        "Compartilhe o link do grupo com os amigos para não perderem nenhuma promoção! 👇",
        "Ajude nosso grupo a crescer! Envie o link para quem gosta de economizar: 😉",
        "Gostou da oferta? Compartilhe nosso grupo para mais achadinhos como este! 🚀"
    ]

    preco_linha = ""
    if preco and desc:
        preco_linha = f"\n💰 De R$ {orig} por *R$ {preco}* ➡️  {desc}% OFF 🔥"
    elif preco:
        preco_linha = f"\n💰 *R$ {preco}*"

    topo_sorteado    = random.choice(chamadas_topo)
    banner_sorteado  = random.choice(banners_ml)
    rodape_sorteado  = random.choice(chamadas_grupo)

    return (
        f"{topo_sorteado}{preco_linha}\n\n"
        f"{banner_sorteado}\n\n"
        f"🔗 {link}\n\n"
        # f"{rodape_sorteado}\n"
        # f"{LINK_GRUPO}"
    )

# ============================================================
# SELENIUM NAVEGAÇÃO
# ============================================================

def abrir_grupo(driver, nome_grupo: str):
    log(f"🔍 Buscando grupo: '{nome_grupo}'")
    campo = achar(driver, SELETORES_BUSCA, timeout=20)
    driver.execute_script("arguments[0].click();", campo)
    time.sleep(0.5)
    
    campo.send_keys(Keys.CONTROL + "a")
    campo.send_keys(Keys.DELETE)
    time.sleep(0.3)
    
    for letra in nome_grupo:
        campo.send_keys(letra)
        time.sleep(0.05)
    time.sleep(1.0)
    campo.send_keys(Keys.ENTER)
    time.sleep(2.0)
    
    seletores_card_atual = [
        f'//span[@title="{nome_grupo}"]/ancestor::div[@data-testid="cell-frame-container"]',
        f'//span[@title="{nome_grupo}"]/ancestor::div[@role="row"]',
        f'//span[@title="{nome_grupo}"]',
        f'//span[contains(@title, "{nome_grupo[:10]}")]'
    ]
    
    try:
        clicar(driver, seletores_card_atual, timeout=10)
        log(f"✅ Grupo '{nome_grupo}' aberto com sucesso!")
    except TimeoutException:
        primeiro = driver.find_element(
            By.XPATH,
            '//div[@id="pane-side"]//div[@data-testid="cell-frame-container"]'
        )
        driver.execute_script("arguments[0].click();", primeiro)
        log(f"✅ Grupo '{nome_grupo}' aberto via clique genérico!")
    time.sleep(2.0)

def publicar_oferta(driver, oferta: dict, pasta_temp: str):
    titulo = oferta.get("titulo", "Produto")
    log(f"  📦 Processando: {titulo[:40]}...")
    
    msg = formatar_msg(oferta)
    url_foto = oferta.get("imagem") or oferta.get("foto") or ""
    caminho_foto = baixar_imagem(url_foto, pasta_temp) if url_foto else ""

    if caminho_foto and os.path.exists(caminho_foto):
        try:
            enviar_foto_com_legenda(driver, caminho_foto, msg)
            return
        except Exception as e:
            log(f"⚠️ Erro ao enviar foto: {e}. Cancelando janela modal e tentando em texto...")
            try:
                driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
            except:
                pass
            time.sleep(1.0)
            
    enviar_texto(driver, msg)

# ============================================================
# EXECUÇÃO DO LOTE (4 OFERTAS POR GRUPO)
# ============================================================

def executar_lote():
    if _estado["data_atual"] != date.today():
        log("🌅 Novo dia — resetando estado.")
        resetar_estado_diario()

    with _estado["lock"]:
        lote = proximo_lote() 
        if not lote:
            log("📭 Fila vazia ou limite atingido.")
            return

        log(f"🚀 Disparando Lote de {len(lote)} oferta(s) em {len(GRUPOS_DESTINO)} grupos...")
        driver = _estado["driver"]

        try:
            log("🔄 Recarregando WhatsApp Web para sincronizar...")
            driver.refresh()
            achar(driver, SELETORES_CARREGADO, timeout=90)
            time.sleep(7.0)
        except Exception as e:
            log(f"❌ Erro ao preparar navegador: {e}")
            return

        with tempfile.TemporaryDirectory() as pasta:
            for i, nome_grupo in enumerate(GRUPOS_DESTINO):
                try:
                    abrir_grupo(driver, nome_grupo)
                    
                    # DISPARA AS 4 OFERTAS DO LOTE NO GRUPO ATUAL
                    for idx, oferta_atual in enumerate(lote):
                        log(f"   📦 Oferta {idx+1}/{len(lote)} no grupo '{nome_grupo}'")
                        publicar_oferta(driver, oferta_atual, pasta)
                        
                        # Pausa entre ofertas no mesmo grupo
                        if idx < len(lote) - 1:
                            time.sleep(DELAY_ENTRE_MSG)

                    log(f"   [Grupo {i+1}/{len(GRUPOS_DESTINO)}] Concluído com {len(lote)} ofertas em '{nome_grupo}'")

                except Exception as e:
                    log(f"   ❌ Erro no grupo '{nome_grupo}': {e}")

                # Delay entre a troca de grupos
                if i < len(GRUPOS_DESTINO) - 1:
                    tempo_espera = random.randint(DELAY_MIN_GRUPO, DELAY_MAX_GRUPO)
                    log(f"⏳ Aguardando {tempo_espera}s até o próximo grupo...")
                    time.sleep(tempo_espera)

            # Atualiza os contadores diários após concluir todos os grupos
            _estado["enviadas_hoje"] += len(lote)
            _estado["indice_fila"]   += len(lote)
            for of in lote:
                if of.get("id"):
                    _estado["enviados_ids"].add(of.get("id"))

        log(f"✅ Ciclo do lote concluído | Ofertas acumuladas hoje: {_estado['enviadas_hoje']}/{LIMITE_DIARIO}")

# ============================================================
# MAIN
# ============================================================

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
    log("⏳ Aguardando carregamento do WhatsApp...")
    achar(driver, SELETORES_CARREGADO, timeout=120)
    
    # Roda o primeiro lote assim que inicializa
    executar_lote()

    for h in HORARIOS_DISPARO:
        schedule.every().day.at(h).do(executar_lote)
        log(f"📅 Agendado para as {h}")

    while True:
        schedule.run_pending()
        time.sleep(30)

if __name__ == "__main__":
    main()