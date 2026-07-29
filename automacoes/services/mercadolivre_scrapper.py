import requests
from bs4 import BeautifulSoup
import json
import re

def get_mercadolivre_deals(category_id, category_name, affiliate_tag):
    
    base_url = "https://www.mercadolivre.com.br/ofertas"
    params = {
        "promotion_type": "LIGHTNING_DEAL",
        "category": category_id
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://www.mercadolivre.com.br/"
    }

    deals_list = []

    try:
        response = requests.get(base_url, params=params, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        product_cards = soup.find_all('div', class_='poly-card')

        for idx, card in enumerate(product_cards):
            # Título
            title_element = card.find(['a', 'h3', 'p'], class_='poly-component__title')
            titulo = title_element.text.strip() if title_element else 'N/A'

            # Preços
            preco_original = 0.0
            preco_atual = 0.0
            desconto_percentual = 0

            # 1. Tenta encontrar o preço riscado (Original)
            del_element = card.find('del', class_='andes-money-amount')


            if del_element:
                orig_fraction = del_element.find('span', class_='andes-money-amount__fraction')
                if orig_fraction:
                    preco_original = float(orig_fraction.text.replace('.', '').replace(',', '.'))

            # 2. Tenta encontrar o preço atual (Promocional)
            price_containers = card.find_all('span', class_='andes-money-amount')

            for container in price_containers:

                if not container.find_parent('del'):
                    curr_fraction = container.find('span', class_='andes-money-amount__fraction')
                    if curr_fraction:
                        preco_atual = float(curr_fraction.text.replace('.', '').replace(',', '.'))
                        break
            
            # 3. Desconto
            discount_element = card.find('span', class_=re.compile(r'(poly-price__discount|andes-money-amount__discount)'))
            if discount_element:
                match = re.search(r'\d+', discount_element.text)
                if match:
                    desconto_percentual = int(match.group(0))

            if preco_original == 0.0 and preco_atual > 0 and desconto_percentual > 0:
                preco_original = round(preco_atual / (1 - (desconto_percentual / 100)), 2)
            elif preco_original == 0.0:
                preco_original = preco_atual

            # Link com Etiqueta de Afiliado
            link_element = card.find('a', href=True)
            link = link_element['href'] if link_element else 'N/A'
            if link != 'N/A':
                # Anexa a etiqueta de afiliado
                separator = "&" if "?" in link else "?"
                link = f"{link}{separator}matt_tool={affiliate_tag}"

            # Foto
            img_element = card.find('img', class_='poly-component__picture')
            foto = img_element.get('src') or img_element.get('data-src') if img_element else 'N/A'

            # Hot
            highlight = card.find('span', class_='poly-component__highlight')
            hot = True if highlight and "IMPERDÍVEL" in highlight.text.upper() else False

            if titulo != 'N/A' and preco_atual > 0:
                deals_list.append({
                    "id": f"{category_id}-{idx}",
                    "categoria": category_name,
                    "titulo": titulo,
                    "preco": preco_atual,
                    "precoOriginal": preco_original,
                    "desconto": desconto_percentual,
                    "link": link,
                    "foto": foto,
                    "hot": hot,
                    "expiresAt": None
                })

    except Exception as e:
        print(f"Erro ao processar {category_name}: {e}")

    return deals_list

def main():
    AFFILIATE_TAG = "cdbfghaec46766"
    
    categories = {
        "MLB23262": "Calçados",
        "MLB273770": "Sandálias e Chinelos",
        "MLB779362-1": "Tenis",
        "MLB275574": "Sapatilhas",
        "MLB31447": "Roupas",
        "MLB270215": "Moda Fitness",
        "MLB779362": "Camisetas e Regatas"

    }

    all_deals = []
    for cat_id, cat_name in categories.items():
        print(f"Coletando ofertas para: {cat_name}")
        deals = get_mercadolivre_deals(cat_id, cat_name, AFFILIATE_TAG)
        all_deals.extend(deals)

    all_deals.sort(key=lambda x: x['desconto'], reverse=True)

    output_filename = "ofertas_mercadolivre.json"
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(all_deals, f, ensure_ascii=False, indent=2)
    
    print(f"Total de ofertas encontradas: {len(all_deals)}")
    print(f"Ofertas salvas em {output_filename}")

if __name__ == "__main__":
    main()
