// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Create an Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/plant-monitoring-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the User model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String, // 'user' or 'admin'
});

const User = mongoose.model('User', userSchema);

// Create a session store
const sessionStore = new session.MemoryStore();

// Configure Express to use sessions
app.use(session({
  secret: 'your-secret-key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
}));

// Define the login route for users
app.post('/login/user', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal Server Error' });
    } else if (!user) {
      res.status(401).send({ message: 'Invalid username or password' });
    } else if (user.role !== 'user') {
      res.status(401).send({ message: 'Invalid username or password' });
    } else {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: 'Internal Server Error' });
        } else if (!isValid) {
          res.status(401).send({ message: 'Invalid username or password' });
        } else {
          req.session.userId = user._id;
          req.session.role = user.role;
          res.redirect('/plant_monitoring.html');
        }
      });
    }
  });
});

// Define the login route for admins
app.post('/login/admin', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal Server Error' });
    } else if (!user) {
      res.status(401).send({ message: 'Invalid username or password' });
    } else if (user.role !== 'admin') {
      res.status(401).send({ message: 'Invalid username or password' });
    } else {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: 'Internal Server Error' });
        } else if (!isValid) {
          res.status(401).send({ message: 'Invalid username or password' });
        } else {
          req.session.userId = user._id;
          req.session.role = user.role;
          res.redirect('/admin-dashboard.html');
        }
      });
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});