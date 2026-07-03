"""
gerador_afiliados_ml.py
========================
Automação semi-manual para gerar links de afiliado no Mercado Livre.

Fluxo por bloco:
    1. Script lê o próximo bloco de 30 links do TXT
    2. Abre a página do gerador de links do ML
    3. Cola os links no textarea
    4. Você faz o processo manual (clica Gerar, copia os resultados, etc.)
    5. Pressiona ENTER no terminal para o script passar pro próximo bloco
    6. Repete até acabar todos os blocos

Requisitos:
    pip install selenium webdriver-manager

Seletores confirmados via DevTools:
    - Textarea de input: textarea[name="url-0"] ou aria-label "Insira 1 ou mais URLs"
    - Botão Gerar:       button[name="Gerar"] ou aria-label "Gerar"
"""

import re
import time
import subprocess
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

# ============================================================
# CONFIG
# ============================================================

CAMINHO_TXT = "links_para_gerar.txt"   # relativo ao diretório do script
URL_GERADOR  = "https://www.mercadolivre.com.br/afiliados/linkbuilder"

# ============================================================
# SELETORES — confirmados via DevTools
# ============================================================

# Textarea onde os links são colados
# Accessibility Name: "Insira 1 ou mais URLs separados por 1 linha"
SELETORES_TEXTAREA = [
    '//textarea[contains(@aria-label,"URL")]',
    '//textarea[contains(@aria-label,"url")]',
    '//textarea[contains(@name,"url")]',
    '//textarea[contains(@class,"andes-form-control__field")]',
    '//textarea',
]

# Botão "Gerar"
# Accessibility Name: "Gerar", Role: button
SELETORES_BOTAO_GERAR = [
    '//button[@aria-label="Gerar"]',
    '//button[normalize-space(text())="Gerar"]',
    '//button[contains(@class,"andes-button")][.//text()[contains(.,"Gerar")]]',
    '//button[@type="submit"]',
]

# ============================================================
# UTILIDADES
# ============================================================

def log(msg: str):
    from datetime import datetime
    print(f"[{datetime.now():%H:%M:%S}] {msg}", flush=True)


def ler_blocos(caminho_txt: str) -> list[dict]:
    """
    Lê o TXT e retorna uma lista de blocos no formato:
    [
        {"numero": 1, "links": ["url1", "url2", ...]},
        {"numero": 2, "links": [...]},
        ...
    ]
    """
    texto = Path(caminho_txt).read_text(encoding="utf-8")
    partes = re.split(r"=== BLOCO (\d+) ===", texto)

    blocos = []
    # partes[0] = texto antes do primeiro bloco (vazio)
    # partes[1] = "1", partes[2] = links do bloco 1
    # partes[3] = "2", partes[4] = links do bloco 2 ...
    for i in range(1, len(partes), 2):
        numero = int(partes[i])
        links_raw = partes[i + 1].strip().splitlines()
        links = [l.strip() for l in links_raw if l.strip().startswith("http")]
        if links:
            blocos.append({"numero": numero, "links": links})

    return blocos


def iniciar_driver() -> webdriver.Chrome:
    op = webdriver.ChromeOptions()
    perfil_path = str(Path.home() / ".ml_afiliados_profile")
    op.add_argument(f"--user-data-dir={perfil_path}")
    op.add_argument("--profile-directory=Default")
    op.add_argument("--no-sandbox")
    op.add_argument("--disable-dev-shm-usage")
    op.add_argument("--disable-blink-features=AutomationControlled")
    op.add_experimental_option("excludeSwitches", ["enable-automation"])
    op.add_experimental_option("useAutomationExtension", False)
    op.add_argument("--start-maximized")
    drv = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=op
    )
    drv.execute_script(
        "Object.defineProperty(navigator,'webdriver',{get:()=>undefined})"
    )
    return drv


def achar(driver, seletores: list, timeout: int = 15):
    fim = time.time() + timeout
    while time.time() < fim:
        for xpath in seletores:
            try:
                el = driver.find_element(By.XPATH, xpath)
                if el.is_displayed():
                    return el
            except NoSuchElementException:
                pass
        time.sleep(0.5)
    raise TimeoutException(
        f"Elemento não encontrado em {timeout}s:\n  " + "\n  ".join(seletores)
    )


def copiar_texto_clipboard(texto: str):
    """Copia texto para o clipboard via xclip."""
    try:
        subprocess.run(
            ["xclip", "-selection", "clipboard"],
            input=texto.encode("utf-8"),
            check=True, timeout=5
        )
    except FileNotFoundError:
        log("⚠️  xclip não instalado: sudo apt install xclip")
        raise


def processar_bloco(driver, bloco: dict):
    """
    Cola os links do bloco no textarea da página do ML.
    Retorna True se colou com sucesso.
    """
    numero  = bloco["numero"]
    links   = bloco["links"]
    texto   = "\n".join(links)
    total   = len(links)

    log(f"📋 Bloco {numero}: {total} links")

    # Garante que está na página certa
    if "linkbuilder" not in driver.current_url:
        driver.get(URL_GERADOR)
        time.sleep(3)

    # Localiza o textarea
    try:
        textarea = achar(driver, SELETORES_TEXTAREA, timeout=15)
    except TimeoutException:
        log("❌ Textarea não encontrado. Verifique se está logado no ML.")
        return False

    # Limpa o campo e cola os links via clipboard
    driver.execute_script("arguments[0].value = '';", textarea)
    driver.execute_script("arguments[0].click();", textarea)
    time.sleep(0.3)

    # Seleciona tudo e deleta (garante limpeza)
    textarea.send_keys(Keys.CONTROL + "a")
    textarea.send_keys(Keys.DELETE)
    time.sleep(0.2)

    # Cola via clipboard (mais confiável para textos longos com URLs)
    copiar_texto_clipboard(texto)
    textarea.send_keys(Keys.CONTROL + "v")
    time.sleep(1)

    # Verifica se colou (conta linhas no valor atual)
    valor_atual = driver.execute_script("return arguments[0].value;", textarea)
    linhas_coladas = len([l for l in valor_atual.strip().splitlines() if l.strip()])
    log(f"✅ {linhas_coladas}/{total} links colados no textarea")

    return True


def aguardar_confirmacao(numero_bloco: int, total_blocos: int):
    """
    Pausa o script e aguarda o usuário confirmar no terminal.
    """
    print()
    print("─" * 55)
    print(f"  BLOCO {numero_bloco}/{total_blocos} colado no textarea.")
    print()
    print("  Agora faça manualmente:")
    print("  1. Clique em 'Gerar'")
    print("  2. Aguarde os links afiliados aparecerem")
    print("  3. Copie os resultados que precisar")
    print()
    print("  Quando terminar, pressione ENTER aqui para")
    print("  o script colar o próximo bloco.")
    print("─" * 55)
    input("  ▶  Pressione ENTER para continuar... ")
    print()


# ============================================================
# MAIN
# ============================================================

def main():
    print("=" * 55)
    print("  Gerador de Links Afiliados — Mercado Livre")
    print("=" * 55)

    # Lê o TXT
    base_dir   = Path(__file__).parent
    caminho_txt = base_dir / CAMINHO_TXT

    if not caminho_txt.exists():
        raise FileNotFoundError(f"TXT não encontrado: {caminho_txt}")

    blocos = ler_blocos(str(caminho_txt))
    total  = len(blocos)
    log(f"📦 {total} bloco(s) encontrado(s) no TXT")

    if total == 0:
        log("❌ Nenhum bloco encontrado. Verifique o formato do TXT.")
        return

    # Pergunta de qual bloco começar (útil se interromper no meio)
    print()
    inicio = input(f"  A partir de qual bloco começar? [1–{total}, padrão=1]: ").strip()
    inicio = int(inicio) if inicio.isdigit() else 1
    inicio = max(1, min(inicio, total))
    print()

    # Inicia o Chrome
    log("🌐 Iniciando Chrome...")
    driver = iniciar_driver()

    try:
        driver.get(URL_GERADOR)
        log(f"📄 Página carregada: {URL_GERADOR}")
        log("⚠️  Certifique-se de estar logado na conta de afiliados do ML.")
        print()
        input("  Pressione ENTER quando estiver pronto para começar... ")
        print()

        # Processa cada bloco
        for bloco in blocos:
            if bloco["numero"] < inicio:
                continue

            sucesso = processar_bloco(driver, bloco)

            if not sucesso:
                print()
                continuar = input(
                    f"  ⚠️  Bloco {bloco['numero']} falhou. "
                    "Continuar para o próximo? [s/N]: "
                ).strip().lower()
                if continuar != "s":
                    break
                continue

            # Último bloco — não precisa aguardar confirmação
            if bloco["numero"] == blocos[-1]["numero"]:
                log("🎉 Último bloco colado! Processo concluído.")
                print()
                input("  Pressione ENTER para fechar o navegador... ")
            else:
                aguardar_confirmacao(bloco["numero"], total)

                # Recarrega a página para limpar o estado antes do próximo bloco
                driver.get(URL_GERADOR)
                time.sleep(2)

    except KeyboardInterrupt:
        log("⛔ Interrompido pelo usuário.")
    finally:
        driver.quit()
        log("🔒 Navegador fechado.")


if __name__ == "__main__":
    main()
