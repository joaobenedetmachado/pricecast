import os
from models.ml.predict import return_predictions
import pandas as pd
csv_path = "/home/joao/pricecast/scraper/data/Bitcoinprice.csv"

def predict_directive(csv_path, days, window_size):
    df = pd.read_csv(csv_path)
    df["price"] = df["price"].str.replace("$", "", regex=False).str.replace(",", "", regex=False).astype(float)

    # Extract model name from filename, e.g. "Bitcoinprice" from ".../Bitcoinprice.csv"
    model_name = os.path.splitext(os.path.basename(csv_path))[0]
    
    predictions = return_predictions(df, days_to_predict=days, window_size=window_size, model_name=model_name)

    result = []
    for p in predictions:
        result.append(p)
    
    return result

print(predict_directive(csv_path, 7, 30))