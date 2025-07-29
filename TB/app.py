from flask import Flask, render_template, request, jsonify
from flask_cors import CORS 
from diagnosis_api.views import diagnosis_api


app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
#CORS(app)  # Enable CORS for all routes

app.register_blueprint(diagnosis_api, url_prefix="")

# @app.route('/upload/', methods=['POST'])
# def upload():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
#     file = request.files['image']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400
#     # Here you would process the file and return your result
#     return jsonify({'message': 'Upload received!', 'diagnosis': 'TB Negative', 'confidence': 0.97})

if __name__ == "__main__":
    app.run(debug=False, use_reloader=False, port=9000)
