from flask import Flask
import flask
from predict import predictBudget


app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    budgetList = flask.request.json["budgetList"]
    monthToPredict = flask.request.json["monthToPredict"]
    cateogry = flask.request.json["cateogry"]

    budget = predictBudget(budgetList=budgetList, monthToPredict=monthToPredict, cateogry=cateogry)

    return {"budget" :  budget}


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
