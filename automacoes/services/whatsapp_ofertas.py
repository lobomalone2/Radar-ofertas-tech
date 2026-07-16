import json, os, time, tempfile, threading, requests, schedule, subprocess, random
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

HORARIOS_DISPARO = ["08:00", "11:00", "18:00", "22:00"]

# Controle de IDs já enviados hoje — evita repetição mesmo com random
_enviados_hoje: set = set()

_estado = {
    "data_atual":    None,
    "enviadas_hoje": 0,
    "indice_fila":   0,
    "fila_do_dia":   [],
    "driver":        None,
    "lock":          threading.Lock(),
}

# ============================================================
# SELETORES
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

# ============================================================
# UTILIDADES
# ============================================================

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

# ============================================================
# OFERTAS — lógica de seleção aleatória com controle de repetição
# ============================================================

def carregar_ofertas(caminho: str) -> list:
    with open(caminho, "r", encoding="utf-8") as f:
        d = json.load(f)
    return [d] if isinstance(d, dict) else d


def filtrar_e_ordenar(ofertas: list) -> list:
    """
    Estratégia de seleção com aleatoriedade controlada:

    1. Divide as ofertas em dois grupos:
       - TOP: as 40% com maior desconto (produtos mais quentes, maior chance de aparecer)
       - RESTO: os demais (rotacionam pra não ficar sempre os mesmos)

    2. Sorteia aleatoriamente combinando os dois grupos:
       - 60% das vagas para o TOP (garante qualidade)
       - 40% das vagas para o RESTO (garante variedade)

    3. Remove IDs já enviados hoje (evita repetição no mesmo dia)

    4. Embaralha a ordem final — assim mesmo os tops aparecem
       em posições diferentes a cada lote.

    Resultado: a cada execução a fila é diferente, sem nunca
    repetir um produto no mesmo dia, mas priorizando os melhores.
    """
    global _enviados_hoje

    # Filtra hot=True se existir o campo, senão usa todos
    tem_hot = any("hot" in o for o in ofertas)
    candidatos = [o for o in ofertas if o.get("hot", True)] if tem_hot else ofertas[:]

    # Remove os já enviados hoje
    candidatos = [o for o in candidatos if o.get("id") not in _enviados_hoje]

    if not candidatos:
        # Todos já foram enviados — reseta o histórico do dia e usa todos
        log("🔄 Todos os produtos já foram exibidos hoje. Reiniciando histórico de rotação.")
        _enviados_hoje.clear()
        candidatos = [o for o in ofertas if o.get("hot", True)] if tem_hot else ofertas[:]

    # Ordena por desconto para separar top e resto
    candidatos_ordenados = sorted(
        candidatos,
        key=lambda o: o.get("desconto", 0),
        reverse=True
    )

    total = len(candidatos_ordenados)
    corte = max(1, int(total * 0.4))  # top 40%

    grupo_top   = candidatos_ordenados[:corte]
    grupo_resto = candidatos_ordenados[corte:]

    # Calcula quantas vagas para cada grupo dentro do LIMITE_DIARIO
    vagas_top   = min(len(grupo_top),   int(LIMITE_DIARIO * 0.6))
    vagas_resto = min(len(grupo_resto), LIMITE_DIARIO - vagas_top)

    # Sorteia aleatoriamente dentro de cada grupo
    selecionados_top   = random.sample(grupo_top,   vagas_top)
    selecionados_resto = random.sample(grupo_resto, vagas_resto) if grupo_resto else []

    # Junta e embaralha a ordem final
    fila = selecionados_top + selecionados_resto
    random.shuffle(fila)

    log(
        f"🎲 Fila do dia: {len(fila)} ofertas "
        f"({vagas_top} top + {vagas_resto} variedade) | "
        f"já enviados hoje: {len(_enviados_hoje)}"
    )
    return fila


def resetar_estado_diario():
    global _enviados_hoje

    p = Path(CAMINHO_JSON)
    if not p.exists():
        log(f"❌ JSON não encontrado: {p}"); return

    # Reseta o set de enviados ao virar o dia
    _enviados_hoje = set()

    fila = filtrar_e_ordenar(carregar_ofertas(str(p)))
    _estado.update({
        "data_atual":    date.today(),
        "enviadas_hoje": 0,
        "indice_fila":   0,
        "fila_do_dia":   fila,
    })
    log(f"🗓️  Estado resetado para {date.today()} — {len(fila)} oferta(s) na fila.")


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
    preco_linha = ""
    if preco and desc:
        preco_linha = f"\n💰 De R$ {orig} por *R$ {preco}*  ➡️  {desc}% OFF 🔥"
    elif preco:
        preco_linha = f"\n💰 *R$ {preco}*"
    return (
        f"*{titulo}*{preco_linha}\n\n"
        f"🛒 *ACHADO TECH NO MERCADO LIVRE!!*\n\n"
        f"🔗 {link}\n\n"
        f"👉 Veja mais em: {LINK_SITE}"
    )

# ============================================================
# SELENIUM — WhatsApp Web
# ============================================================

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
        primeiro = driver.find_element(
            By.XPATH,
            '//div[@id="pane-side"]//div[@data-testid="cell-frame-container"]'
        )
        driver.execute_script("arguments[0].click();", primeiro)
        log("✅ Grupo aberto via clique forçado!")
    time.sleep(2.0)


def arrastar_e_soltar_arquivo(driver, campo_destino, caminho_arquivo):
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
    input_temp = driver.execute_script(js_drop_file, campo_destino, 0, 0)
    input_temp.send_keys(os.path.abspath(caminho_arquivo))


def enviar_foto_com_legenda(driver, caminho_foto, legenda):
    try:
        container_chat = achar(driver, SELETORES_MSG, timeout=15)
        log("📌 [foto] Área de chat localizada. Iniciando Drag & Drop simulado...")
        arrastar_e_soltar_arquivo(driver, container_chat, caminho_foto)
        log("📁 Arquivo soltado no chat. Aguardando preview...")
        campo_legenda = achar(driver, SELETORES_LEGENDA, timeout=15)
        log("📝 Digitando legenda na preview...")
        driver.execute_script("arguments[0].focus();", campo_legenda)
        time.sleep(0.5)
        digitar(driver, campo_legenda, legenda)
        time.sleep(1.5)
        log("🚀 Localizando botão de envio da foto...")
        clicar(driver, SELETORES_ENVIAR_FOTO, timeout=15)
        log("✅ Foto e oferta enviadas!")
        time.sleep(4.0)
    except Exception as e:
        log(f"❌ Erro no envio de foto: {e}")
        try:
            driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
        except:
            pass
        raise e


def enviar_texto(driver, texto: str):
    campo = achar(driver, SELETORES_MSG, timeout=15)
    driver.execute_script("arguments[0].click();", campo)
    driver.execute_script("arguments[0].focus();", campo)
    time.sleep(0.5)
    log("📝 Digitando o corpo do anúncio...")
    digitar(driver, campo, texto)
    log("⏳ Aguardando 15s para o WhatsApp renderizar o preview do link...")
    time.sleep(15.0)
    log("🚀 Clicando no botão Enviar...")
    try:
        clicar(driver, SELETORES_ENVIAR_MSG, timeout=10)
        log("✅ Mensagem enviada!")
    except TimeoutException:
        log("⚠️ Botão não encontrado. Enviando via ENTER...")
        campo.send_keys(Keys.ENTER)
        log("✅ Mensagem enviada via ENTER!")
    time.sleep(3.0)


def publicar_oferta(driver, oferta: dict, pasta_temp: str):
    titulo = oferta.get("titulo", "Produto")
    log(f"  📦 Enviando: {titulo[:55]}...")
    msg = formatar_msg(oferta)
    enviar_texto(driver, msg)

# ============================================================
# AGENDAMENTO
# ============================================================

def executar_lote():
    global _enviados_hoje

    if _estado["data_atual"] != date.today():
        log("🌅 Novo dia — resetando estado.")
        resetar_estado_diario()

    with _estado["lock"]:
        lote = proximo_lote()
        if not lote:
            log("📭 Fila vazia ou limite atingido.")
            return

        log(f"🚀 Disparando lote de {len(lote)} ofertas...")
        driver = _estado["driver"]

        try:
            log("🔄 Recarregando WhatsApp Web...")
            driver.refresh()
            achar(driver, SELETORES_CARREGADO, timeout=90)
            time.sleep(5.0)
            abrir_grupo(driver)
        except Exception as e:
            log(f"❌ Erro ao preparar navegador: {e}")
            return

        with tempfile.TemporaryDirectory() as pasta:
            for i, oferta in enumerate(lote):
                try:
                    publicar_oferta(driver, oferta, pasta)
                    _estado["enviadas_hoje"] += 1
                    _estado["indice_fila"]   += 1
                    # Registra o ID como enviado para não repetir hoje
                    _enviados_hoje.add(oferta.get("id"))
                except Exception as e:
                    log(f"   ❌ Erro na oferta {oferta.get('id','?')}: {e}")

                if i < len(lote) - 1:
                    time.sleep(DELAY_ENTRE_MSG)

        log(f"✅ Lote concluído | enviadas hoje: {_estado['enviadas_hoje']}/{LIMITE_DIARIO}")

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
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=op
    )
    _estado["driver"] = driver
    driver.get("https://web.whatsapp.com")
    log("⏳ Aguardando QR Code / carregamento...")
    achar(driver, SELETORES_CARREGADO, timeout=120)

    for h in HORARIOS_DISPARO:
        schedule.every().day.at(h).do(executar_lote)
        log(f"📅 Agendado: {h}")

    log("🧪 Disparando lote inicial...")
    executar_lote()

    while True:
        schedule.run_pending()
        time.sleep(30)


if __name__ == "__main__":
    main()