from flask import Flask, request, jsonify
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import os
import tempfile

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# ✅ Cloudinary config
cloudinary.config(
    cloud_name='dlgj8lqia',
    api_key='837975749361521',
    api_secret='A_14ms616ydGt8tkqdAZ-3bpKs4',
    secure=True
)

@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # # ✅ Save to temp path as a real binary file
        # temp_path = os.path.join(tempfile.gettempdir(), file.filename)
        # file.save(temp_path)

        # ✅ Upload to Cloudinary as raw resource
        upload_result = cloudinary.uploader.upload(
            # temp_path,
            # resource_type='auto',
            # public_id='medical_reports/' + os.path.splitext(file.filename)[0],
            # use_filename=True,
            # unique_filename=False
            file
        )

        # ✅ Force Cloudinary to serve as downloadable PDF
        pdf_url = upload_result.get('secure_url')

        return jsonify({'url': pdf_url})

    except Exception as e:
        import traceback
        print("Upload error:", traceback.format_exc())
        return jsonify({'error': 'Cloudinary upload failed', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(port=13000, debug=True)