import requests
from bs4 import BeautifulSoup
import yaml


def grab_elements_by_directive(directive):
    with open(directive, 'r') as file:
        dados = yaml.safe_load(file)

    response = requests.get(dados['site'])
    response.raise_for_status()  

    soup = BeautifulSoup(response.text, "html.parser")
    elements_output = {}

    for key, value in dados['scrape'].items():
        element = soup.select_one(value)
        elements_output[key] = element

    return elements_output
