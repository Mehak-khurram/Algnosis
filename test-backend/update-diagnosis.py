from flask import Flask
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

app = Flask(__name__)

MONGO_URI = "mongodb+srv://salmanatwork1:Nk76jhlE4Vz9RA13@cluster0.cau7bqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()  
    print("✅ Connected to MongoDB Atlas!")
except ConnectionFailure as e:
    print("❌ Could not connect to MongoDB:", e)

@app.route("/")
def home():
    return "MongoDB connection initialized."

if __name__ == "__main__":
    app.run(debug=True)