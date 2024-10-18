from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Sample credentials for demonstration
USERNAME = 'user'
PASSWORD = 'pass'

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    # Check credentials
    if username == USERNAME and password == PASSWORD:
        return redirect(url_for('plant_monitoring'))
    else:
        return "Invalid credentials. Please try again."

@app.route('/plant_monitoring')
def plant_monitoring():
    return render_template('plantmonitoring.html')

if __name__ == '__main__':
    app.run(debug=True) 