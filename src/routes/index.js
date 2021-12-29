const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const router = express.Router();

router.post('/send-mail', (req, res) => {
    const { name, email, phone, message } = req.body;
    const contentHtml = `
    <h1>Contact Information</h1>
    <ul>
        <li>name: ${name}</li>
        <li>email: ${email}</li>
        <li>phone: ${phone}</li>
    </ul>
    <p>${message}</p>
    `;

    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

    const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    async function sendMail() {
        try{
            const accessToken = await oAuth2Client.getAccessToken();
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: "avel01@gmail.com",
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken,
                }
            });
            const mailOptions = {
                from: "Pagination web Nodemailer <avel01@gmail.com>",
                to:"ai123@gmail.com",
                subject: "Nodemailer Tutorial",
                html: contentHtml,
            };

            const result = await transporter.sendMail(mailOptions);
            return result;
        } catch(err) {
            console.log(err);
        }
    }
    sendMail()
        .then((result) => res.status(200).send("SEND OK"))
        .catch((error) => console.log(error.message));
});

module.exports = router;