from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)

# Enable CORS for the Flask app
CORS(app)

# MongoDB connection URI
MONGO_URI = "mongodb+srv://salmanatwork1:Nk76jhlE4Vz9RA13@cluster0.cau7bqg.mongodb.net/auth-service?retryWrites=true&w=majority&appName=Cluster0"

# Initialize MongoDB client
client = MongoClient(MONGO_URI)
db = client["auth-service"]
doctors_collection = db["doctor"]

@app.route("/api/doctors", methods=["GET"])
def fetch_doctors():
    try:
        # Fetch all doctors from the database
        doctors = list(doctors_collection.find({}, {"_id": 0}))  
        return jsonify({"success": True, "data": doctors}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=50000)


