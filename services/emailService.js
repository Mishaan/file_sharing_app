const nodemailer = require('nodemailer');

async function sendMail ({ from, to, subject, text, html }) {
    // SMTP setup
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        // also if the key and value are same in javascript ...
        // so the down values can be written as just from, to, ... and so on
        // from: from,
        // to: to,
        // html: html

        from: `inShare <${from}>`,
        to,
        subject,
        text,
        html
    });

    console.log(info);
}

module.exports = sendMail;