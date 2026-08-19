import json, os, time, requests, schedule, random
from datetime import datetime, date
from pathlib import Path
from dotenv import load_dotenv

# ============================================================
# CONFIGURAÇÃO EVOLUTION API & BOT
# ============================================================

load_dotenv()

EVOLUTION_URL = os.getenv("EVOLUTION_URL", "http://localhost:8080")
INSTANCE_NAME = os.getenv("INSTANCE_NAME", "bot-promocoes2")          
API_KEY = os.getenv("WPP_CLIENT_SECRET")


GRUPOS_DESTINO = [
    {"nome": "Garimpos Originais", "jid": "120363427383187788@g.us"}
]

LINK_SITE = 'www.radarofertastech.app.br'


DELAY_ENTRE_MSG = 20     
DELAY_GRUPO     = 60   

CAMINHO_JSON     = "ofertas_mercadolivre.json"
LIMITE_DIARIO    = 40
TAMANHO_LOTE     = 4

HORARIOS_DISPARO = ["06:00", "08:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"]

_estado = {
    "data_atual":    None,
    "enviadas_hoje": 0,
    "indice_fila":   0,
    "fila_do_dia":   [],
    "enviados_ids":  set()
}


def log(msg: str):
    print(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {msg}", flush=True)

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

    preco_linha = ""
    if preco and desc:
        preco_linha = f"\n💰 De R$ {orig} por *R$ {preco}* ➡️  {desc}% OFF 🔥"
    elif preco:
        preco_linha = f"\n💰 *R$ {preco}*"

    topo_sorteado   = random.choice(chamadas_topo)
    banner_sorteado = random.choice(banners_ml)

    return (
        f"{topo_sorteado}{preco_linha}\n\n"
        f"{banner_sorteado}\n\n"
        f"🔗 {link}"
        f"\n\n💡 Confira mais ofertas em: {LINK_SITE}"
    )



def disparar_mensagem_evolution(grupo_jid: str, oferta: dict) -> bool:
    """
    Envia a oferta (foto + mensagem na legenda) via HTTP usando Evolution API.
    Aumentado o timeout para evitar travamento em download de imagens.
    """
    msg_texto = formatar_msg(oferta)
    url_foto = oferta.get("foto") or oferta.get("imagem") or ""

    headers = {
        "apikey": API_KEY,
        "Content-Type": "application/json"
    }


    if url_foto and url_foto.startswith("http"):
        endpoint = f"{EVOLUTION_URL}/message/sendMedia/{INSTANCE_NAME}"
        payload = {
            "number": grupo_jid,
            "media": url_foto,
            "mediatype": "image",
            "caption": msg_texto
        }
    else:
        endpoint = f"{EVOLUTION_URL}/message/sendText/{INSTANCE_NAME}"
        payload = {
            "number": grupo_jid,
            "text": msg_texto
        }

    try:

        res = requests.post(endpoint, json=payload, headers=headers, timeout=(10, 60))
        res.raise_for_status()
        log(f"   ✅ Oferta enviada: {oferta.get('titulo')[:30]}...")
        return True
    except requests.exceptions.Timeout:
        log(f"   ⚠️ Timeout ao enviar '{oferta.get('titulo')[:30]}...'. Prosseguindo para a próxima.")
        return False
    except Exception as e:
        log(f"   ❌ Erro ao enviar oferta via API: {e}")
        return False


def executar_lote():
    if _estado["data_atual"] != date.today():
        log("🌅 Novo dia — resetando estado.")
        resetar_estado_diario()

    lote = proximo_lote()
    if not lote:
        log("📭 Fila vazia ou limite diário atingido.")
        return

    log(f"🚀 Disparando Lote de {len(lote)} oferta(s) para {len(GRUPOS_DESTINO)} grupo(s)...")

    for i, grupo in enumerate(GRUPOS_DESTINO):
        nome_grupo = grupo["nome"]
        jid_grupo  = grupo["jid"]

        log(f"📌 Processando Grupo: '{nome_grupo}'")

        for idx, oferta_atual in enumerate(lote):
            log(f"   📦 Oferta {idx+1}/{len(lote)} no grupo '{nome_grupo}'")
            disparar_mensagem_evolution(jid_grupo, oferta_atual)
            
            # Delay de 8 segundos entre mensagens dentro do mesmo grupo
            if idx < len(lote) - 1:
                log(f"   ⏳ Aguardando {DELAY_ENTRE_MSG}s antes da próxima mensagem...")
                time.sleep(DELAY_ENTRE_MSG)

        # Pausa entre grupos se houver mais de um configurado
        if i < len(GRUPOS_DESTINO) - 1:
            log(f"⏳ Aguardando {DELAY_GRUPO}s até o próximo grupo...")
            time.sleep(DELAY_GRUPO)

    _estado["enviadas_hoje"] += len(lote)
    _estado["indice_fila"]   += len(lote)
    for of in lote:
        if of.get("id"):
            _estado["enviados_ids"].add(of.get("id"))

    log(f"✅ Ciclo concluído | Ofertas enviadas hoje: {_estado['enviadas_hoje']}/{LIMITE_DIARIO}")




def main():
    resetar_estado_diario()
    
    # Roda o primeiro lote na inicialização
    executar_lote()

    # Agenda os próximos lotes nos horários definidos
    for h in HORARIOS_DISPARO:
        schedule.every().day.at(h).do(executar_lote)
        log(f"📅 Agendado disparo para as {h}")

    log("🤖 Bot com Evolution API ativo e aguardando horários...")
    while True:
        schedule.run_pending()
        time.sleep(30)

if __name__ == "__main__":
    main()