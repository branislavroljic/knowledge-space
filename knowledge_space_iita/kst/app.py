import sys
from flask import Flask, render_template, url_for, request,jsonify, redirect
import pandas as pd

from flask_cors import CORS

from learning_spaces.kst import iita
import pandas as pd

sys.path.append("learning_spaces/")

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "GET":
        data_frame = pd.DataFrame({"a": [1, 0, 1], "b": [0, 1, 0], "c": [0, 1, 1]})
        print(data_frame)
        response = iita(data_frame, v=1)
        print(response)
        return ""
    else:
        return "post"


@app.route("/iita", methods=["POST"])
def iitaEndpoint():
    request_data = request.get_json()
    # print(request_data)
    results = request_data
    # input = {}
    # for res in results:
    #     input[res["studentId"]] = res["responses"]

    data_frame = pd.DataFrame(results)
    response = iita(data_frame, v=1)
    print(response['implications'])
    # print(pd.Series(response).to_json(orient="values"))
    # return pd.Series(response).to_json(orient="values")
    return response['implications']


# @app.route("/<int:id>", methods=["DELETE", "PUT"])
# def delete(id):
#     return redirect("/")


if __name__ == "__main__":
    app.run(debug=True,host='localhost', port=5000)
