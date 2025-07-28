from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Replace with your actual Gemini API key
GEMINI_API_KEY = 'AIzaSyC5gUXTgHdAlKuZf2jJvldR2IRPMIS0QZE'

@app.route('/api/generate-report', methods=['POST'])
def generate_report():
    try:
        data = request.get_json()
        doctor_report = data.get('doctorReport', '')

        if not doctor_report:
            return jsonify({"error": "doctorReport is missing"}), 400

        # Prompt to send to Gemini
        prompt = f"""
Doctor's Notes:
{doctor_report}

Please generate a concise medical report and 3-5 summary points for the patient.
"""

        # Use gemini-2.0-flash model endpoint
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }

        response = requests.post(url, json=payload)
        print("Gemini API status:", response.status_code)
        print("Gemini API response:", response.text)

        if response.status_code != 200:
            return jsonify({"error": "Gemini API request failed"}), 500

        result = response.json()
        candidates = result.get("candidates", [])
        if not candidates:
            return jsonify({"error": "No candidates returned from Gemini"}), 500

        content = candidates[0].get("content", {})
        parts = content.get("parts", [])
        if not parts or not parts[0].get("text"):
            return jsonify({"error": "No generated text found"}), 500

        text = parts[0]["text"]
        return jsonify({"generatedReport": text})

    except Exception as e:
        print("Internal server error:", str(e))
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5001, debug=True)