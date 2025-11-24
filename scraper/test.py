import db_utils
from bson.json_util import dumps
import json

res = db_utils.get_elements_by_part("bitcoin", "coin")
json_str = dumps(res)
data = json.loads(json_str)
print(data[0])

