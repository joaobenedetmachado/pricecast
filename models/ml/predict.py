import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import os
from scraper.logger import log

def create_windowed_dataset(series, window_size):
    X, y = [], []
    for i in range(len(series) - window_size):
        X.append(series[i:i + window_size])
        y.append(series[i + window_size])
    return np.array(X), np.array(y)

def return_predictions(data, days_to_predict=7, window_size=30, model_name=None, 
                       epochs=50, batch_size=32, learning_rate=0.001, 
                       optimizer='adam', loss='mse', dropout=0.2):
    
    
    data = data.drop_duplicates()
    data["timestamp"] = pd.to_datetime(data["timestamp"], errors='coerce')
    data = data.dropna(subset=["timestamp"])

    series = data["price"].values.astype(float).reshape(-1, 1)

    scaler = MinMaxScaler()
    series_scaled = scaler.fit_transform(series).flatten()

    X, y = create_windowed_dataset(series_scaled, window_size)
    X = X[..., np.newaxis]  

    model = None
    model_path = None

    if model_name:
        model_filename = f"{model_name}_w{window_size}_e{epochs}_b{batch_size}.keras"
        model_path = os.path.join(os.path.dirname(__file__), "saved_models", model_filename)
        
        if os.path.exists(model_path):
            log(f"Loading model from {model_path}...")
            model = tf.keras.models.load_model(model_path)

    if model is None:
        log(f"Training new model with: epochs={epochs}, batch_size={batch_size}, lr={learning_rate}, optimizer={optimizer}, loss={loss}, dropout={dropout}")
        split = int(len(X) * 0.8)
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]

        model = tf.keras.Sequential([
            tf.keras.layers.LSTM(50, return_sequences=True, input_shape=(window_size, 1)),
            tf.keras.layers.Dropout(dropout),
            tf.keras.layers.LSTM(50),
            tf.keras.layers.Dropout(dropout),
            tf.keras.layers.Dense(25, activation='relu'),
            tf.keras.layers.Dense(1)
        ])
        
        if optimizer.lower() == 'adam':
            opt = tf.keras.optimizers.Adam(learning_rate=learning_rate)
        elif optimizer.lower() == 'sgd':
            opt = tf.keras.optimizers.SGD(learning_rate=learning_rate)
        elif optimizer.lower() == 'rmsprop':
            opt = tf.keras.optimizers.RMSprop(learning_rate=learning_rate)
        else:
            opt = optimizer
            
        model.compile(optimizer=opt, loss=loss)
        model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, 
                 validation_data=(X_test, y_test), verbose=1)

        if model_path:
            log(f"Saving model to {model_path}...")
            os.makedirs(os.path.dirname(model_path), exist_ok=True)
            model.save(model_path)


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

    df_pred["Date"] = df_pred["Date"].dt.strftime('%Y-%m-%d')

    return df_pred.to_dict(orient="records")        


if __name__ == "__main__":
    csv_path = "/home/joao/pricecast/scraper/data/Ethereumprice.csv"
    df = pd.read_csv(csv_path)

    # cleaning price
    df["price"] = df["price"].str.replace("$", "", regex=False).str.replace(",", "", regex=False).astype(float)

    predictions = return_predictions(df, days_to_predict=7, window_size=30)
    for p in predictions:
        print(p)
