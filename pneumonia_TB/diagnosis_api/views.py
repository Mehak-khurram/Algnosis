from flask import render_template, request, jsonify
import numpy as np
import joblib
import os
import numpy as np
from PIL import Image
from flask import Blueprint, request, jsonify
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename

diagnosis_api = Blueprint('diagnosis_api', __name__)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))



# Load models
try:
    model_path = os.path.join(BASE_DIR, 'model', 'pneumonia_model.h5')
    pneumonia_model = load_model(model_path)
    print(f"Pneumonia model loaded successfully!")
except Exception as e:
    pneumonia_model = None
    print(f"Failed to load pneumonia model: {e}")

try:
    tb_model_path = os.path.join(BASE_DIR, 'model', 'tb_model.h5')
    tb_model = load_model(tb_model_path)
    print(f"TB model loaded successfully!")
except Exception as e:
    tb_model = None
    print(f"Failed to load TB model: {e}")

def preprocess_image(file, target_size):
    img = Image.open(file).convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    print(f"image preprocessed successfully")
    return img_array

@diagnosis_api.before_request
def log_request_info():
    print(f"➡️ Incoming request: {request.method} {request.path}")


########################## Working on Pneumonia here ###############################

@diagnosis_api.route('/pneumonia/upload', methods=['POST'])
def upload_report():
    if pneumonia_model is None:
        return jsonify({'error': 'Pneumonia model not available.'}), 503

    file = request.files.get('image')
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    if file.mimetype not in ['image/jpeg', 'image/png']:
        return jsonify({'error': 'Invalid file type. Only JPG and PNG are supported.'}), 400

    try:
        img_array = preprocess_image(file, target_size=(220,220))
        preds = pneumonia_model.predict(img_array)
        pred_class = int(preds[0][0] > 0.5)
        confidence = float(preds[0][0]) if pred_class == 1 else 1 - float(preds[0][0])
        result = 'Pneumonia' if pred_class == 1 else 'Normal'
        return jsonify({'diagnosis': result, 'confidence': 90})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
############################ Tuber Culosis ######################################

@diagnosis_api.route('/tb/upload', methods=['POST'])
def upload_tb_report():
    if tb_model is None:
        return jsonify({'error': 'TB model not available.'}), 503

    file = request.files.get('image')
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    if file.mimetype not in ['image/jpeg', 'image/png']:
        return jsonify({'error': 'Invalid file type. Only JPG and PNG are supported.'}), 400

    try:
        img_array = preprocess_image(file,  target_size=(28,28))
        preds = tb_model.predict(img_array)
        print("prediction done successfully")
        pred_class = int(preds[0][0] > 0.5)
        confidence = float(preds[0][0]) if pred_class == 1 else 1 - float(preds[0][0])
        result = 'Normal' if pred_class == 1 else 'TB'
        print("diagnosis is " + result)
        response = jsonify({'diagnosis': result, 'confidence': 90})
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 500

