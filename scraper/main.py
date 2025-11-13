import producer

directive = '/home/joao/pricecast/scraper/directives/mercadolivre.yaml'

data = producer.call_producer(directive)
