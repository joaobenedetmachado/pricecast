from ml.predict import return_predictions
import pandas as pd
csv_path = "/home/joao/pricecast/scraper/data/Ethereumprice.csv"
df = pd.read_csv(csv_path)
df["price"] = df["price"].str.replace("$", "", regex=False).str.replace(",", "", regex=False).astype(float)

predictions = return_predictions(df, days_to_predict=7, window_size=30)

for p in predictions:
    print(p)
