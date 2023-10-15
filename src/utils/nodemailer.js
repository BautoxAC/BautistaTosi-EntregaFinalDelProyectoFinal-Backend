import nodemailer from 'nodemailer'
import config from '../config/env.config.js'
import { newMessage } from './utils.js'
import { fileURLToPath } from 'url'
const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.mailSender,
    pass: config.passMailSender
  }
})
export async function sendMail (emailReceiver, subject, html) {
  try {
    await transport.sendMail({
      from: config.mailSender,
      to: emailReceiver,
      subject,
      html
    })
    newMessage('success', 'the email was sent', subject)
  } catch (e) {
    newMessage('failure', 'Failed to send an email', e.toString(), fileURLToPath(import.meta.url))
  }
}
