#directive = '/home/joao/pricecast/scraper/directives/coinmarketcap.yaml'
import producer
import sys
import db_utils
from bson.json_util import dumps
import utils
import json
import csv

res = db_utils.get_elements_by_part("bitcoin", "coin")
json_str = dumps(res)
data = json.loads(json_str)

utils.parse_coin_to_csv(data)



if __name__ == "__main__":
    if len(sys.argv) > 1:
        res = db_utils.get_elements_by_part(sys.argv[1], "coin")
        json_str = dumps(res)
        data = json.loads(json_str)

        utils.parse_coin_to_csv(data)
    else:
        print("no arg received")
