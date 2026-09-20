import nodemailer from "nodemailer";
import { config } from 'dotenv'
config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }

})
export async function sendEmailVerification(to ,subject,html) {
    await transporter.sendMail({
        from: `"Ngl-App" <${process.env.EMAIL}>`,
        to:to,
        subject:subject,
        html:html,

    })
}