from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Connect to MySQL
db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",  # Change if needed
    password="",  # Update with your MySQL password
    database="iothub"
)
cursor = db.cursor()

# Create database if not exists
cursor.execute("CREATE DATABASE IF NOT EXISTS iothub")
cursor.execute("""
CREATE TABLE IF NOT EXISTS iothub.MQTTNodered (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT,
    humidity FLOAT,
    moisture INT,
    voltage FLOAT
)
""")
db.commit()

@app.route("/save_data", methods=["POST"])
def save_data():
    try:
        data = request.json
        cursor.execute(
            "INSERT INTO MQTTNodered (temperature, humidity, moisture, voltage) VALUES (%s, %s, %s, %s)",
            (data["temperature"], data["humidity"], data["moisture"], data["voltage"])
        )
        db.commit()
        return jsonify({"message": "Data saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_data", methods=["GET"])
def get_data():
    cursor.execute("SELECT * FROM MQTTNodered")
    data = cursor.fetchall()
    return jsonify(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
