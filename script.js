let users = [];

function register() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const newUser = {
        username: username,
        email: email,
        password: password
    };

    users.push(newUser);
    alert('Registration successful!');

    console.log(users);

    // Redirect to login page after registration
    window.location.href = "login.html";
}

function login() {
    const usernameOrEmail = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password);

    if (user) {
        alert('Login successful!');
        window.location.href = "plantmonitoring.html"; // Replace "home.html" with your actual home page
    } else {
        alert('Invalid username or password.');
    }
}
