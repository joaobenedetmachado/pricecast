#directive = '/home/joao/pricecast/scraper/directives/coinmarketcap.yaml'
import producer
import sys
import db_utils
from bson.json_util import dumps
import utils
import json
import csv

res = db_utils.get_elements_by_part("eth", "coin")
json_str = dumps(res)
data = json.loads(json_str)

utils.parse_coin_to_csv(data)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        data = producer.call_producer(sys.argv[1])
    else:
        print("no arg received")
