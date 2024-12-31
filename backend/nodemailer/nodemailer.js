const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 587,
  secure: false,
  auth: { 
    user: "marrapumani12@gmail.com", 
    pass: "jhio mnfz kkkn lvvi"
  }
});
