from datetime import datetime, timedelta
import pandas as pd
import joblib
import numpy as np
from sklearn import preprocessing
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model



def predictBudget(budgetList, monthToPredict, cateogry):

    constantBaseMonth = datetime.strptime("Jun 30 2021", "%b %d %Y")

    monthToPredict = datetime.strptime(monthToPredict, "%b %d %Y")

    delta = monthToPredict - constantBaseMonth

    if cateogry == "socialgood":
        stock_name = "ABNB"

    if cateogry == "education":
        stock_name = "EDU"

    if cateogry == "humanservices":
        stock_name = "WFC"

    if cateogry == "health":
        stock_name = "BEP"

    if cateogry == "environment":
        stock_name = "GPS"
    
    model = load_model(f"models/{stock_name}_LSTM.h5")
    

    df = pd.read_csv(f"data/{stock_name}.csv")

    df['Date'] = pd.to_datetime(df['Date'])
    df.set_axis(df['Date'], inplace=True)
    df.drop(columns=['Open', 'High', 'Low', 'Volume'], inplace=True)

    train_data, test_data = df[3:int(len(df)*0.9)], df[int(len(df)*0.9):]

    train = train_data.iloc[:, 0:1].values 
    

    scaler = MinMaxScaler()
    train_scaled = scaler.fit_transform(train)

    data = df["Close"].values

    time = 7


    prediction_list = data[-time:]
    prediction_list = prediction_list.reshape((-1,1))

    prediction_list = scaler.transform(prediction_list)
    
    for _ in range(delta.days):
        x = prediction_list[-time:]
        x = x.reshape((1, time, 1))
        out = model.predict(x)
        prediction_list = np.append(prediction_list, out)

    forecast = prediction_list[time-1:]


    ratio = forecast[-1] / forecast[0]

    lastToPredict = budgetList[-1]

    predictionForNext = lastToPredict + (lastToPredict * ratio)

    return predictionForNext

    



    
