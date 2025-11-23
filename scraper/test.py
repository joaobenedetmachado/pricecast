import db_utils
from bson.json_util import dumps
import json

res = db_utils.get_elements_by_site("https://www.amazon")
json_str = dumps(res)
data = json.loads(json_str)
print(data)


