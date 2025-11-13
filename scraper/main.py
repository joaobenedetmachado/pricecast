import requests
from bs4 import BeautifulSoup
import yaml

with open('/home/joao/pricecast/scraper/directives/example.yaml', 'r') as file:
    dados = yaml.safe_load(file)


for key, value in dados['scrape'].items():
    print(key, value)



response = requests.get(dados['site'])

response.raise_for_status()  

soup = BeautifulSoup(response.text, "html.parser")


elements_output = {}

for key, value in dados['scrape'].items():
    print(key, value)
    element = soup.select_one(value)
    elements_output[key] = element

print(elements_output)