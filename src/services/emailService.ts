import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';
import { send } from 'process';

// Create a transporter using Mailtrap SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
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
