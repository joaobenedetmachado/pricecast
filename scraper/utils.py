import requests
from bs4 import BeautifulSoup
import yaml


def grab_elements_by_directive(directive):
    with open(directive, 'r') as file:
        dados = yaml.safe_load(file)

    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}

    response = requests.get(dados['site'], headers=headers)
    response.raise_for_status()  

    soup = BeautifulSoup(response.text, "html.parser")
    elements_output = {}

    for key, value in dados['scrape'].items():
        selector = value[0]
        attr = value[1].get('attr')

        element = soup.select_one(selector)

        if element:
            if attr == 'text':
                elements_output[key] = element.get_text(strip=True)
            else:
                elements_output[key] = element.get(attr)
        else:
            elements_output[key] = None


    return elements_output
