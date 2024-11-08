from flask import Flask, request, jsonify
import json
import datetime

app = Flask(__name__)

# In-memory dictionaries to store users and activity logs
users = {}
activity_logs = {}

# Load data from files at the start
def load_data():
    global users, activity_logs
    try:
        with open('users.json', 'r') as user_file:
            users = json.load(user_file)
    except FileNotFoundError:
        users = {}
    
    try:
        with open('activity_logs.json', 'r') as log_file:
            activity_logs = json.load(log_file)
    except FileNotFoundError:
        activity_logs = {}

# Save data to files
def save_data():
    with open('users.json', 'w') as user_file:
        json.dump(users, user_file, indent=4)
    with open('activity_logs.json', 'w') as log_file:
        json.dump(activity_logs, log_file, indent=4)

# Log activity
def log_activity(user_id, activity):
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    if user_id not in activity_logs:
        activity_logs[user_id] = []
    activity_logs[user_id].append({'date': timestamp, 'activity': activity, 'user': user_id})
    save_data()

# Register User
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username in users:
        return jsonify({"message": "Username already exists!"}), 400
    else:
        users[username] = {'password': password}
        log_activity(username, 'User Registration')
        save_data()
        return jsonify({"message": "User registered successfully!"}), 201

# Login User
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username in users and users[username]['password'] == password:
        log_activity(username, 'User Login')
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"message": "Invalid username or password."}), 401

# Update Settings
@app.route('/update-settings', methods=['POST'])
def update_settings():
    data = request.json
    username = data.get('username')
    settings = data.get('settings')
    
    log_activity(username, f'Settings Updated: {settings}')
    return jsonify({"message": "Settings updated successfully!"}), 200

# Get Activity Logs
@app.route('/get-logs', methods=['GET'])
def get_logs():
    return jsonify(activity_logs), 200

# Initialize data
load_data()

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
