import producer
import sys
directive = '/home/joao/pricecast/scraper/directives/coinmarketcap.yaml'

if __name__ == "__main__":
    if len(sys.argv) > 1:
        data = producer.call_producer(sys.argv[1])
    else:
        print("no arg received")
