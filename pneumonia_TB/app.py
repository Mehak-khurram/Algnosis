from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # <-- Add this import
from diagnosis_api.views import diagnosis_api


app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
#CORS(app)  # Enable CORS for all routes

app.register_blueprint(diagnosis_api, url_prefix="")

if __name__ == '__main__':
    app.run(debug=True, port=5051)
