require('dotenv').config();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.SMTP_TOKEN
    } 
});


module.exports = transporter;