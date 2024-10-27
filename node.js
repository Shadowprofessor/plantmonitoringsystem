function sendResetLink() {
    const email = document.getElementById('email').value;

    fetch('http://localhost:3000/send-reset-link', { // Update with your server URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => {
        if (response.ok) {
            alert(`Password reset link sent to ${email}.`);
            window.location.href = 'login.html';
        } else {
            alert('Error sending email. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error sending email. Please try again.');
    });
}
