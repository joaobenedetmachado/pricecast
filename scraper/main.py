import utils
directive = '/home/joao/pricecast/scraper/directives/wikipedia.yaml'

data = utils.grab_elements_by_directive(directive)

print(data)
