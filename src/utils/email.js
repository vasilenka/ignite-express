import nodemailer from 'nodemailer'

// When using gmail, you need to allow 'Less Secure App'
// or else nodemailer can't sign-in to your account to send email
// https://myaccount.google.com/u/0/lesssecureapps?pageId=none

export const transporter = nodemailer.createTransport({
  // name: process.env.EMAIL_NAME,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  secure: true,
  debug: true,
  logger: true
})

export const generateEmailHTML = url => {
  return `
    Please click this link to confirm your email:

    <a href="${url}" style="display: block; text-decoration: none; margin-bottom: 24px; margin-top: 24px;"><button style="width: fit-content; padding: 12px 24px; font-size: 20px; color: '#FFFFFF'; border-radius: 6px; background-color: '#008384'">Confirm Email</button></a>

    or click this link below:
    <a style="display: block" href="${url}">${url}</a>`
}
