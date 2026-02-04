const nodemailer = require('nodemailer');
require('dotenv').config();
const earlyLoginTemplate = require('../mailTamplate/earlyLogin');

const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    },
});

const emailSentTracker = new Map(); // Track notification emails sent per day

const sendNotification = async ({ to, subject, templateVars }) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const trackerKey = `${to}-${subject}-${today}`;

        if (emailSentTracker.has(trackerKey)) {
            console.log("Notification email already sent today.");
            return;
        }

        const html = earlyLoginTemplate(templateVars);
        await transport.sendMail({
            from: process.env.AUTH_EMAIL,
            to,
            subject,
            html,
        });

        console.log(`Notification email sent to ${to} - ${subject}`);
        emailSentTracker.set(trackerKey, true); // Mark email as sent for today

        // Optional: Clear the tracker at midnight
        setTimeout(() => {
            emailSentTracker.delete(trackerKey);
        }, getMillisecondsUntilMidnight());
    } catch (err) {
        console.error('Error sending notification email:', err);
    }
};

const getMillisecondsUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return midnight - now;
};

module.exports = sendNotification;
