import nodemailer from 'nodemailer'
import config from '../config/env.config.js'
export const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.mailSender,
    pass: config.passMailSender
  }
})
