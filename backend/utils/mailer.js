const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tarunbommana798@gmail.com",
    pass: "your-app-password",
  },
});

module.exports = transporter;
