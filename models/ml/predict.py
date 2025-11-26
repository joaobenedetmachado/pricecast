import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

def create_windowed_dataset(series, window_size):
    X, y = [], []
    for i in range(len(series) - window_size):
        X.append(series[i:i + window_size])
        y.append(series[i + window_size])
    return np.array(X), np.array(y)


def return_predictions(data, days_to_predict=7, window_size=30):
    data = data.drop_duplicates()
    data["timestamp"] = pd.to_datetime(data["timestamp"])

    series = data["price"].values.astype(float).reshape(-1, 1)

    scaler = MinMaxScaler()
    series_scaled = scaler.fit_transform(series).flatten()

    X, y = create_windowed_dataset(series_scaled, window_size)
    X = X[..., np.newaxis]  

    split = int(len(X) * 0.8)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]


    model = tf.keras.Sequential([
        tf.keras.layers.LSTM(64, return_sequences=True, input_shape=(window_size, 1)),
        tf.keras.layers.LSTM(32),
        tf.keras.layers.Dense(1)
    ])
    model.compile(optimizer="adam", loss="mse")
    model.fit(X_train, y_train, epochs=20, validation_data=(X_test, y_test), verbose=1)


    last_window = series_scaled[-window_size:].tolist()
    predictions_scaled = []

    for _ in range(days_to_predict):
        x = np.array(last_window[-window_size:])[np.newaxis, :, np.newaxis]
        pred = model.predict(x, verbose=0)[0][0]
        predictions_scaled.append(pred)
        last_window.append(pred)

    predictions = scaler.inverse_transform(np.array(predictions_scaled).reshape(-1, 1)).flatten()

    last_date = pd.to_datetime(data["timestamp"].iloc[-1])
    future_dates = pd.date_range(last_date + pd.Timedelta(days=1), periods=days_to_predict)

    #  final
    df_pred = pd.DataFrame({
        "Date": future_dates,
        "PredictedPrice": predictions
    })

    return df_pred.to_dict(orient="records")


if __name__ == "__main__":
    csv_path = "/home/joao/pricecast/scraper/data/Ethereumprice.csv"
    df = pd.read_csv(csv_path)

    # cleaning price
    df["price"] = df["price"].str.replace("$", "", regex=False).str.replace(",", "", regex=False).astype(float)

    predictions = return_predictions(df, days_to_predict=7, window_size=30)
    for p in predictions:
        print(p)
