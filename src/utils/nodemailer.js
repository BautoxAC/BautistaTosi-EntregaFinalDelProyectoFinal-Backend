import nodemailer from 'nodemailer'
import config from '../config/env.config.js'
const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.mailSender,
    pass: config.passMailSender
  }
})
export async function sendMail (emailReceiver, subject, html) {
  await transport.sendMail({
    from: config.mailSender,
    to: emailReceiver,
    subject,
    html
  })
}
