import nodemailer from 'nodemailer';
import { send } from 'process';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_password'
    }
});

// Function to send email with token using nodemailer
export async function sendEmailToken(email: string, token: string) {
    const message = `Your one-time password: ${token}`;

    try {
        const info = await transporter.sendMail({
            from: 'your_email@gmail.com',
            to: email,
            subject: 'Your one-time password',
            text: message
        });

        console.log('Email sent:', info.response);
        return info;

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

sendEmailToken('himu09854@gmail.com', '134567')
