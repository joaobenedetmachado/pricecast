import requests
from bs4 import BeautifulSoup

url = "https://example.com"

response = requests.get(url)
response.raise_for_status()  

soup = BeautifulSoup(response.text, "html.parser")

finders = ['h1', 'p']

elements_output = []

for selectors in finders:
    element = soup.select_one(selectors)
    elements_output.append(element)

print(elements_output)