import utils

DIRECTIVES = [
    '/home/joao/pricecast/scraper/directives/bitcoin.yaml',
    '/home/joao/pricecast/scraper/directives/ethereum.yaml',
]

if __name__ == "__main__":
    utils.run_schedule(DIRECTIVES, interval_minutes=5, run_immediately=True)

