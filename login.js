document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Simple validation (for demonstration purposes)
    if (username === "admin" && password === "admin123" && role === "admin") {
        document.getElementById('message').innerText = "Welcome Admin!";
    } else if (username === "user" && password === "user123" && role === "user") {
        document.getElementById('message').innerText = "Welcome User!";
    } else {
        document.getElementById('message').innerText = "Invalid credentials. Please try again.";
    }
});