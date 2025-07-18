from flask import render_template, request, jsonify
import numpy as np
import joblib
from process_image import process_image
import os
import numpy as np
from PIL import Image
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

diagnosis_api = Blueprint('diagnosis_api', __name__)

########################### Working on ANEMIA here #######################

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Load pre-trained model
print("Loading model...")
model_path = os.path.join(BASE_DIR, 'model', 'random_forest_classifier.pkl')
anemiaModel = joblib.load(model_path)
print("Model loaded successfully.")

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
        
        print("everything working before predict")
        
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
