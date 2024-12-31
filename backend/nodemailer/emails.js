const { transporter } = require('./nodemailer.js');
const { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require('./emailTemplates.js');

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const info = await transporter.sendMail({
      from: 'marrapumani12@gmail.com', 
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    });
    console.log("Verification email sent successfully", info.messageId);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

const sendWelcomeEmail = async (email, username) => {
  try {
    const info = await transporter.sendMail({
      from: 'marrapumani12@gmail.com',
      to: email,
      subject: "Welcome to Our App!",
      html: WELCOME_EMAIL_TEMPLATE.replace("{username}", username),
    });
    console.log("Welcome email sent successfully", info.messageId);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

const sendResetPasswordEmail = async (email, resetURL) => {
  try {
    const info = await transporter.sendMail({
      from: 'marrapumani12@gmail.com',
      to: email,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
    console.log("Password reset email sent successfully", info.messageId);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};

const sendResetSuccessfulEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: 'marrapumani12@gmail.com',
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password reset success email sent successfully", info.messageId);
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    throw new Error(`Error sending password reset success email: ${error.message}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessfulEmail,
};