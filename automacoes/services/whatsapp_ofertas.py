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
# CONFIG
# ============================================================
NOME_GRUPO       = "Garimpos Originais"
CAMINHO_JSON     = "ofertas_mercadolivre.json"

LIMITE_DIARIO    = 30
TAMANHO_LOTE     = 4
DELAY_ENTRE_MSG  = 8

HORARIOS_DISPARO = ["06:00", "08:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"]

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
    "//input[@type='text' and contains(@class, 'html-input')]"
]

SELETORES_CARD_GRUPO = [
    f'//span[@title="{NOME_GRUPO}"]/ancestor::div[@data-testid="cell-frame-container"]',
    f'//span[@title="{NOME_GRUPO}"]'
]

SELETORES_MSG = [
    '//div[@data-testid="conversation-compose-box-input"]//p',
    '//footer//div[@contenteditable="true"]'
]

SELETORES_ENVIAR_MSG = [
    '//button[@aria-label="Enviar"]',
    '//span[@data-testid="send"]/ancestor::button'
]

SELETORES_LEGENDA = [
    '//div[@data-testid="media-caption-input-container"]//div[@contenteditable="true"]',
    '//footer//div[@contenteditable="true"]'
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
# UTILIDADES & OFERTAS
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

def limpar_e_digitar(driver, el, texto: str):
    driver.execute_script("arguments[0].focus();", el)
    time.sleep(0.2)
    el.send_keys(Keys.CONTROL + "a")
    el.send_keys(Keys.BACKSPACE)
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

    # O embaralhamento acontece UMA ÚNICA VEZ ao carregar o dia
    random.shuffle(candidatos)
    return candidatos

def resetar_estado_diario():
    fila = carregar_e_embaralhar_fila()
    _estado.update({
        "data_atual":    date.today(),
        "enviadas_hoje": 0,
        "indice_fila":   0,
        "fila_do_dia":   fila,
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
    
    preco_linha = ""
    if preco and desc:
        preco_linha = f"\n💰 De R$ {orig} por *R$ {preco}* ➡️  {desc}% OFF 🔥"
    elif preco:
        preco_linha = f"\n💰 *R$ {preco}*"
        
    return (
        f"*{titulo}*{preco_linha}\n\n"
        f"🛒 *ACHADO TECH NO MERCADO LIVRE!!*\n\n"
        f"🔗 {link}\n\n"
    )

# ============================================================
# SELENIUM
# ============================================================
def abrir_grupo(driver):
    log(f"🔍 Buscando grupo: '{NOME_GRUPO}'")
    campo = achar(driver, SELETORES_BUSCA, timeout=20)
    driver.execute_script("arguments[0].click();", campo)
    campo.send_keys(Keys.CONTROL + "a")
    campo.send_keys(Keys.DELETE)
    
    for letra in NOME_GRUPO:
        campo.send_keys(letra)
        time.sleep(0.03)
        
    time.sleep(1.0)
    campo.send_keys(Keys.ENTER)
    time.sleep(2.0)
    
    try:
        clicar(driver, SELETORES_CARD_GRUPO, timeout=5)
    except TimeoutException:
        primeiro = driver.find_element(By.XPATH, '//div[@id="pane-side"]//div[@data-testid="cell-frame-container"]')
        driver.execute_script("arguments[0].click();", primeiro)
    time.sleep(2.0)

def enviar_foto_com_legenda(driver, caminho_foto: str, legenda: str):
    input_file = driver.find_element(By.XPATH, '//input[@type="file"]')
    input_file.send_keys(os.path.abspath(caminho_foto))
    
    # Espera até a janela de legenda aparecer com a foto
    campo_legenda = achar(driver, SELETORES_LEGENDA, timeout=12)
    limpar_e_digitar(driver, campo_legenda, legenda)
    time.sleep(1.0)
    
    clicar(driver, SELETORES_ENVIAR_FOTO, timeout=10)
    time.sleep(3.0)

def enviar_texto(driver, texto: str):
    campo = achar(driver, SELETORES_MSG, timeout=15)
    clicar(driver, SELETORES_MSG)
    limpar_e_digitar(driver, campo, texto)
    time.sleep(6.0) # Espera preview do link
    
    try:
        clicar(driver, SELETORES_ENVIAR_MSG, timeout=5)
    except TimeoutException:
        campo.send_keys(Keys.ENTER)
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
            log(f"⚠️ Erro ao enviar foto: {e}. Cancelando janela modal...")
            try:
                driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
            except:
                pass
            time.sleep(1.0)
            
    # Se não tinha foto ou a foto deu erro, envia em texto
    enviar_texto(driver, msg)

# ============================================================
# EXECUÇÃO DO LOTE
# ============================================================
def executar_lote():
    if _estado["data_atual"] != date.today():
        resetar_estado_diario()

    with _estado["lock"]:
        # Pega o lote EXATAMENTE na ordem da fila sem re-embaralhar
        lote = proximo_lote()
        if not lote:
            log("📭 Fila do dia vazia ou limite atingido.")
            return

        log(f"🚀 Disparando lote com {len(lote)} oferta(s)...")
        driver = _estado["driver"]

        try:
            driver.refresh()
            achar(driver, SELETORES_CARREGADO, timeout=60)
            time.sleep(3.0)
            abrir_grupo(driver)
        except Exception as e:
            log(f"❌ Erro ao abrir grupo: {e}")
            return

        with tempfile.TemporaryDirectory() as pasta:
            for i, oferta in enumerate(lote):
                try:
                    publicar_oferta(driver, oferta, pasta)
                    log(f"✅ Oferta {oferta.get('id', '?')} enviada.")
                except Exception as e:
                    log(f"❌ Erro na oferta {oferta.get('id', '?')}: {e}")
                finally:
                    # O PONTEIRO AVANÇA SEMPRE para não travar a fila no mesmo item
                    _estado["enviadas_hoje"] += 1
                    _estado["indice_fila"]   += 1

                if i < len(lote) - 1:
                    time.sleep(DELAY_ENTRE_MSG)

        log(f"🏁 Lote finalizado | Progresso hoje: {_estado['enviadas_hoje']}/{LIMITE_DIARIO}")

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
    
    # Roda o primeiro lote assim que abre
    # executar_lote()

    for h in HORARIOS_DISPARO:
        schedule.every().day.at(h).do(executar_lote)
        log(f"📅 Agendado para as {h}")

    while True:
        schedule.run_pending()
        time.sleep(30)

if __name__ == "__main__":
    main()