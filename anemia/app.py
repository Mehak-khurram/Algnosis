from flask import Flask, render_template, request, jsonify
import numpy as np
import joblib
from flask_cors import CORS  # <-- Add this import
from process_image import process_image

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load pre-trained model
print("Loading model...")
model = joblib.load('model/random_forest_classifier.pkl')
print("Model loaded successfully.")

@app.route('/', methods=['GET', 'POST'])
def index():
    result = None
    if request.method == 'POST':
        print("POST request received.")
        try:
            # Debugging: Check form values
            print("Form data:", request.form)

            hemoglobin = float(request.form['hemoglobin'])
            mcv = float(request.form['mcv'])
            mch = float(request.form['mch'])
            mchc = float(request.form['mchc'])
            gender = request.form['gender']

            # Convert gender to binary (0 for Female, 1 for Male)
            gender_binary = 1 if gender.lower() == 'male' else 0
            print(f"Parsed inputs: Hemoglobin={hemoglobin}, MCV={mcv}, MCH={mch}, MCHC={mchc}, Gender={gender} (Binary={gender_binary})")

            # Prepare the input features
            features = np.array([[gender_binary, hemoglobin, mch, mchc, mcv]])
            print("Prepared features:", features)

            # Predict the result
            prediction = model.predict(features)[0]
            print("Model prediction:", prediction)

            result = 'Anemic' if prediction == 1 else 'Not Anemic'
            print("Result:", result)

        except Exception as e:
            print("Error occurred:", str(e))
            result = f"Error: {e}"

    # Debugging: Check final result before rendering
        print("Final result to render:", result)
        return jsonify({"result": result})
    return render_template('index.html', result=result)

@app.route('/predict-image', methods=['POST'])
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
        prediction = model.predict(features)[0]
        result = 'Anemic' if prediction == 1 else 'Not Anemic'
        print("Debug: Prediction result:", result)  # Debug: Prediction result

        # Return the prediction result as JSON
        response = jsonify({"result": result, "features": extracted_features})
        print("Debug: Response prepared successfully.")  # Debug: Response ready
        return response

    except Exception as e:
        print("Error during image processing:", str(e))  # Debug: Exception details
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
