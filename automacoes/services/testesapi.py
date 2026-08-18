import requests

url = "http://localhost:8080/group/fetchAllGroups/bot-promocoes2?getParticipants=false"
headers = {
    "apikey": "429683C4C977415CAAFCCE10F7D57E11"
}

try:
    response = requests.get(url, headers=headers, timeout=30)
    print(f"Status Code: {response.status_code}")
    
    dados = response.json()
    
    # Se a API retornar uma lista direta
    if isinstance(dados, list):
        lista_grupos = dados
    # Se a API retornar um objeto com a chave 'groups' ou outra
    elif isinstance(dados, dict):
        lista_grupos = dados.get("groups", dados.get("response", []))
    else:
        lista_grupos = []

    print(f"Total de grupos encontrados: {len(lista_grupos)}\n")

    for grupo in lista_grupos:
        nome = grupo.get("subject") or grupo.get("name") or "Sem nome"
        jid = grupo.get("id") or grupo.get("jid")
        print(f"📌 Grupo: {nome}\n   JID: {jid}\n" + "-"*40)

    if not lista_grupos:
        print("Resposta da API:", dados)

except Exception as e:
    print(f"Erro na requisição: {e}")