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
        element = soup.select_one(value)
        elements_output[key] = element

    return elements_output
