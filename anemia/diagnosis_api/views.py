from flask import render_template, request, jsonify
import numpy as np
import joblib
from process_image import process_image
import os
import numpy as np
from PIL import Image
from flask import Blueprint, request, jsonify
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename

diagnosis_api = Blueprint('diagnosis_api', __name__)

########################### Working on ANEMIA here #######################

# Load pre-trained model
print("Loading model...")
anemiaModel = joblib.load('../model/random_forest_classifier.pkl')
print("Model loaded successfully.")

@diagnosis_api.route('/', methods=['GET'])
def index():
    result = None
    return render_template('test.html', result=result)
    #return render_template('index.html', result=result)

@diagnosis_api.route('/anemia/upload', methods=['POST'])
def upload_image():
    try:
        print("Endpoint '/predict-image' hit.")  # Debug: Endpoint reached
        
        # Check if an image was uploaded
        if 'image' not in request.files:
            print("Debug: No image key in request files.")  # Debug: Missing 'image'
            return jsonify({"error": "No image uploaded"}), 400

        uploaded_file = request.files['image']
        print(f"Debug: Uploaded file name - {uploaded_file.filename}")  # Debug: File name
        
        if uploaded_file.filename == '':
            print("Debug: Uploaded file name is empty.")  # Debug: Empty file name
            return jsonify({"error": "No selected file"}), 400

        # Read the uploaded image
        image_bytes = uploaded_file.read()
        print("Debug: Image bytes read successfully.")  # Debug: Image read

        # Pass the image bytes to `process_image` function
        extracted_features = process_image(image_bytes)
        print("Debug: Extracted features:", extracted_features)  # Debug: Features extracted

        # Extract features from the dictionary
        gender_binary = extracted_features.get('gender')
        hemoglobin = extracted_features.get('hemoglobin')
        mch = extracted_features.get('mch')
        mchc = extracted_features.get('mchc')
        mcv = extracted_features.get('mcv')

        print(f"Debug: Extracted values - Gender: {gender_binary}, Hemoglobin: {hemoglobin}, MCH: {mch}, MCHC: {mchc}, MCV: {mcv}")  # Debug: Feature values

        # Check for missing or invalid features
        if None in [gender_binary, hemoglobin, mch, mchc, mcv]:
            print("Debug: One or more extracted features are missing or invalid.")  # Debug: Missing features
            return jsonify({"error": "Invalid features extracted from image"}), 400

        # Prepare the input features for the model
        features = np.array([[gender_binary, hemoglobin, mch, mchc, mcv]])
        print("Debug: Features prepared for model:", features)  # Debug: Features for model

        # Get prediction from the model
        prediction = anemiaModel.predict(features)[0]
        result = 'Anemic' if prediction == 1 else 'Not Anemic'
        print("Debug: Prediction result:", result)  # Debug: Prediction result

        # Return the prediction result as JSON
        response = jsonify({"diagnosis": result, "confidence": 90})
        print("Debug: Response prepared successfully.")  # Debug: Response ready
        return response

    except Exception as e:
        print("Error during image processing:", str(e))  # Debug: Exception details
        return jsonify({"error": str(e)}), 500

########################## Working on Pneumonia here ###############################


# Load models
try:
    model_path = os.path.join('../model', 'pneumonia_model.h5')
    pneumonia_model = load_model(model_path)
except Exception as e:
    pneumonia_model = None
    print(f"Failed to load pneumonia model: {e}")

try:
    tb_model_path = os.path.join('../models', 'tb_model.h5')
    tb_model = load_model(tb_model_path)
except Exception as e:
    tb_model = None
    print(f"Failed to load TB model: {e}")

def preprocess_image(file):
    img = Image.open(file).convert('RGB')
    img = img.resize((220, 220))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@diagnosis_api.route('/pneumonia/upload', methods=['POST'])
def upload_report():
    if pneumonia_model is None:
        return jsonify({'error': 'Pneumonia model not available.'}), 503

    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    if file.mimetype not in ['image/jpeg', 'image/png']:
        return jsonify({'error': 'Invalid file type. Only JPG and PNG are supported.'}), 400

    try:
        img_array = preprocess_image(file)
        preds = pneumonia_model.predict(img_array)
        pred_class = int(preds[0][0] > 0.5)
        confidence = float(preds[0][0]) if pred_class == 1 else 1 - float(preds[0][0])
        diagnosis = 'Pneumonia' if pred_class == 1 else 'Normal'
        return jsonify({'result': {'diagnosis': diagnosis, 'confidence': round(confidence, 4)}})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
############################ Tuber Culosis ######################################

@diagnosis_api.route('/tb/upload/', methods=['POST'])
def upload_tb_report():
    if tb_model is None:
        return jsonify({'error': 'TB model not available.'}), 503

    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    if file.mimetype not in ['image/jpeg', 'image/png']:
        return jsonify({'error': 'Invalid file type. Only JPG and PNG are supported.'}), 400

    try:
        img_array = preprocess_image(file)
        preds = tb_model.predict(img_array)
        pred_class = int(preds[0][0] > 0.5)
        confidence = float(preds[0][0]) if pred_class == 1 else 1 - float(preds[0][0])
        diagnosis = 'TB' if pred_class == 1 else 'Normal'
        return jsonify({'result': {'diagnosis': diagnosis, 'confidence': round(confidence, 4)}})
    except Exception as e:
        return jsonify({'error': str(e)}), 500