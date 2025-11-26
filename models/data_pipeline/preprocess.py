import pandas as pd
import csv
from sklearn.model_selection import train_test_split
import tensorflow as tf
import tensorflow_decision_forests as tfdf
from sklearn.model_selection import train_test_split
import numpy as np




def format_data_by_csv(csv):
    data = pd.read_csv(csv)

    data['price'] = (
        data['price']
        .str.replace('$', '', regex=False)
        .str.replace(',', '', regex=False)
        .astype(float)
    )
    data = data[data['timestamp'].str.match(r'^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+$')]
    data["timestamp"] = pd.to_datetime(data["timestamp"], format="%Y-%m-%d %H:%M:%S.%f")

    return data

def prepare_data(df):
    df["Year"] = df["timestamp"].dt.year
    df["Month"] = df["timestamp"].dt.month
    df["Day"] = df["timestamp"].dt.day
    df["Hour"] = df["timestamp"].dt.hour
    df["Minute"] = df["timestamp"].dt.minute
    df["Second"] = df["timestamp"].dt.second

    df = df.drop(columns=["timestamp"])

    dataset = tfdf.keras.pd_dataframe_to_tf_dataset(
        df,
        label="price",
        task=tfdf.keras.Task.REGRESSION
    )

    for features, label in dataset.take(5):
        print("Features:", features)
        print("Label:", label.numpy())

    X = df.drop(columns=['price'])
    y = df['price']

    return train_test_split(X, y, test_size=0.2, random_state=42)

print(prepare_data(format_data_by_csv('/home/joao/pricecast/scraper/data/Ethereumprice.csv')))