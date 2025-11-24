import db_utils
from bson.json_util import dumps
import utils
import json
import csv

res = db_utils.get_elements_by_part("bitcoin", "coin")
json_str = dumps(res)
data = json.loads(json_str)

utils.parse_coin_to_csv(data)