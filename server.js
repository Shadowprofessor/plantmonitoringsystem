    const express = require('express');
    const nodemailer = require('nodemailer');
    const cors = require('cors');
    const bodyParser = require('body-parser');

    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
        auth: {
            user: 'your-email@gmail.com', // Your email
            pass: 'your-email-password' // Your email password or app password
        }
    });

    // Route to handle password reset email
    app.post('/send-reset-link', (req, res) => {
        const email = req.body.email;

        // Set up email options
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: 'Here is the link to reset your password: [Reset Link]'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error sending email.');
            }
            console.log('Email sent: ' + info.response);
            res.status(200).send('Password reset link sent to ' + email);
        });
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
