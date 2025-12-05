import os
from models.ml.predict import return_predictions
import pandas as pd
csv_path = "/home/joao/pricecast/scraper/data/Bitcoinprice.csv"

def predict_directive(csv_path, days, window_size, epochs=50, batch_size=32, 
                      learning_rate=0.001, optimizer='adam', loss='mse', dropout=0.2):
                      
    df = pd.read_csv(csv_path)
    df["price"] = df["price"].str.replace("$", "", regex=False).str.replace(",", "", regex=False).astype(float)

    model_name = os.path.splitext(os.path.basename(csv_path))[0]
    
    predictions = return_predictions(
        df, 
        days_to_predict=days, 
        window_size=window_size, 
        model_name=model_name,
        epochs=epochs,
        batch_size=batch_size,
        learning_rate=learning_rate,
        optimizer=optimizer,
        loss=loss,
        dropout=dropout
    )

    result = []
    for p in predictions:
        result.append(p)
    
    return result