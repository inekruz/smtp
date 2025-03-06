const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
});

// функция отправки письма
const sendEmailNotification = (email, subject, text) => {
    const mailOptions = {
        from: process.env.user,
        to: email,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Ошибка при отправке письма:', error);
        } else {
            console.log('Письмо отправлено:', info.response);
        }
    });
};

module.exports = { sendEmailNotification };