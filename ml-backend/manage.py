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

        # Prompt: formal report + clean recommendations
        prompt = f"""
You are an AI medical assistant. Below are raw doctor's notes based on a patient's diagnostic findings.
Your task is to rewrite them as a formal, structured medical report followed by exactly three clinical recommendations.

1. The report should be written in professional medical language as a paragraph (no headings or lists).
2. After the report, add a section titled "Recommendations:" followed by 3 concise bullet points.
3. Format each bullet point with a bullet (•), but do not use dashes (-), asterisks (*), or quotation marks.
4. Make the recommendations medically actionable and relevant to the doctor's notes.

Doctor's notes:
{doctor_report}
"""

        # Gemini model endpoint
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }

        response = requests.post(url, json=payload)
        print("Gemini API status:", response.status_code)

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

        full_text = parts[0]["text"]

        # Try extracting recommendations after "Recommendations:"
        summary_points = []
        if "Recommendations:" in full_text:
            rec_section = full_text.split("Recommendations:")[-1]
            summary_points = [line.strip()[1:].strip() for line in rec_section.strip().split('\n') if line.strip().startswith("•")]

        return jsonify({
            "generatedReport": full_text.strip(),
            "summaryPoints": summary_points
        })

    except Exception as e:
        print("Internal server error:", str(e))
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5001, debug=True)