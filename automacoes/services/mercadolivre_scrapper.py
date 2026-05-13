import requests
from bs4 import BeautifulSoup
import json
import re
import os

TRACKING_ID = os.environ.get('ML_TRACKING_ID', 'cdbfghaec46766')

def link_afiliado(url):
    if not url or url == 'N/A':
        return url
    try:
        sep = '&' if '?' in url else '?'
        return f"{url}{sep}matt_tool={TRACKING_ID}"
    except:
        return url

def get_mercadolivre_deals(category_id, category_name):
    base_url = "https://www.mercadolivre.com.br/ofertas"
    params = {
        "promotion_type": "LIGHTNING_DEAL",
        "category": category_id
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
    }

    deals_list = []

    try:
        response = requests.get(base_url, params=params, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        product_cards = soup.find_all('div', class_='poly-card')
        if not product_cards:
            product_cards = soup.find_all('div', class_='ui-item__wrapper')

        for card in product_cards:
            title_element    = card.find(['a', 'h3', 'p'], class_='poly-component__title')
            price_element    = card.find('span', class_='andes-money-amount__fraction')
            discount_element = card.find('span', class_='poly-price__discount')
            link_element     = card.find('a', href=True)
            img_element      = card.find('img')

            title    = title_element.text.strip() if title_element else 'N/A'
            price    = price_element.text.strip()  if price_element else 'N/A'
            discount = discount_element.text.strip() if discount_element else '0%'
            link     = link_element['href'] if link_element else 'N/A'
            foto     = img_element.get('src') or img_element.get('data-src', '') if img_element else ''

            if title != 'N/A' and price != 'N/A':
                discount_value = 0
                if discount != 'N/A':
                    match = re.search(r'\d+', discount)
                    if match:
                        discount_value = int(match.group(0))

                # Converte preco para float
                try:
                    preco_float = float(price.replace('.', '').replace(',', '.'))
                except:
                    preco_float = 0

                deals_list.append({
                    "id":            f"{category_id}-{len(deals_list)}",
                    "categoria":     category_name,
                    "titulo":        title,
                    "preco":         preco_float,
                    "precoOriginal": preco_float,
                    "desconto":      discount_value,
                    "link":          link_afiliado(link),
                    "foto":          foto.replace('-I.jpg', '-O.jpg'),
                    "hot":           discount_value >= 30,
                    "expiresAt":     None
                })

    except Exception as e:
        print(f"Erro ao processar {category_name}: {e}")

    return deals_list

def main():
    categories = {
        "MLB1648": "Informatica",
        "MLB1051": "Eletronicos",
        "MLB1000": "Audio e Video",
    }

    all_deals = []
    for cat_id, cat_name in categories.items():
        print(f"Coletando: {cat_name}...")
        deals = get_mercadolivre_deals(cat_id, cat_name)
        all_deals.extend(deals)
        print(f"  {len(deals)} ofertas encontradas")

    sorted_deals = sorted(all_deals, key=lambda x: x.get('desconto', 0), reverse=True)

    # Salva na pasta do projeto
    output = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ofertas_mercadolivre.json')
    with open(output, 'w', encoding='utf-8') as f:
        json.dump(sorted_deals, f, ensure_ascii=False, indent=2)

    print(f"\nTotal: {len(sorted_deals)} ofertas salvas em {output}")

if __name__ == "__main__":
    main()
