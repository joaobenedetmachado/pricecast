import pandas as pd
import csv 

def format_data_by_csv(csv):
    data = pd.read_csv(csv)

    data['price'] = (
        data['price']
        .str.replace('$', '', regex=False)
        .str.replace(',', '', regex=False)
        .astype(float)
    )

    return data


print(format_data_by_csv('/home/joao/pricecast/scraper/data/Bitcoinprice.csv'))