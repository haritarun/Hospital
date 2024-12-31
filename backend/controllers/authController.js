const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Admin = require("./models/Admin");



// const { generateTokenAndSetCookie } = require('../utils/genTokenAndSetCookie');
// const { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessfulEmail } = require('../nodemailer/emails');

// const signUp = async (req, res) => {
//     const { name, email, password, confirmPassword } = req.body;
//     try {
//         if (!name || !email || !password || !confirmPassword) {
//             return res.status(400).json({ success: false, message: "All fields are required" });
//         }

//         if (password !== confirmPassword) {
//             return res.status(400).json({ success: false, message: "Passwords do not match" });
//         }
        
//         const oldUser = await User.findOne({ email });
//         if (oldUser) {
//             return res.status(400).json({ success: false, message: "User already exists" });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

//         const newUser = new User({
//             email,
//             name,
//             password: hashedPassword,
//             verificationToken: verificationToken,
//             verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000
//         });

//         await newUser.save();

//         const token = generateTokenAndSetCookie(res, newUser._id);

//         await sendVerificationEmail(newUser.email, verificationToken);
        
//         return res.status(201).json({ 
//             success: true,
//             message: "User created successfully",
//             user: {
//                 ...newUser._doc,
//                 password: undefined
//             },
//             token
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

// const verifyEmail = async (req, res) => {
//     const { verificationCode } = req.body;
//     try {
//         const user = await User.findOne({
//             verificationToken: verificationCode,
//             verificationTokenExpiresAt: { $gt: Date.now() }
//         });

//         if (!user) {
//             return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
//         }

//         user.isVerified = true;
//         user.verificationToken = undefined;
//         user.verificationTokenExpiresAt = undefined;

//         await user.save();
        
//         await sendWelcomeEmail(user.email, user.name);

//         return res.status(200).json({ 
//             success: true, 
//             message: "Email verified successfully",
//             user: {
//                 ...user._doc,
//                 password: undefined
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

// const logOut = (req, res) => {
//     res.clearCookie("token");
//     return res.status(200).json({ success: true, message: "Logged out successfully" });
// }

let activeUsers = new Map();

// OTP expiration time (2 minutes)
const OTP_EXPIRATION_TIME = 2 * 60 * 1000;
let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tarunbommana798@gmail.com", 
    pass: "fznt ittn egav kajd",   
    
  },
});

const sendOtp = async (req, res) => {
    const { email,firstName,lastName} = req.body;
    const fullName=firstName+ ' '+lastName;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      const otp = Math.floor(100000 + Math.random() * 900000);;
      const expiresAt = Date.now() + OTP_EXPIRATION_TIME;
  
      otpStore[email] = { otp, expiresAt };
  
      const mailOptions = {
        from: "tarunbommana798@gmail.com", 
        to: email, 
        subject: "Your OTP Code",
        html: `
          <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
      
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
  
      .email-container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
  
     
      .header {
        background-color: #009957;
        color: #fff;
        text-align: center;
        padding: 20px;
      }
  
      .header img {
        max-width: 120px;
        margin-bottom: 10px;
      }
  
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: bold;
      }
  
     
      .content {
        padding: 20px;
        text-align: center;
        color: #333;
      }
  
      .content p {
        font-size: 16px;
        margin: 20px 0;
      }
  
      .otp-code {
        margin: 30px auto;
        font-size: 40px;
        font-weight: 700;
        letter-spacing: 8px;
        color: #00ba5a;
      }
  
      
      .footer {
        background-color: #009961;
        color: #fff;
        text-align: center;
        padding: 15px;
        font-size: 14px;
      }
  
      .footer a {
        color: #fff;
        text-decoration: none;
      }
  
      .footer p {
        margin: 5px 0;
      }
      .user{
          text-align: start;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
     
      <div class="header">
        
        <h1>Verify Your E-mail Address</h1>
      </div>
  
  
      <div class="content">
        <p class="user">Dear ${fullName},</p>
        <p>
          Thank you for registering at our hospital. To complete your registration,
          please use the following One-Time Password (OTP):
        </p>
  
        <div class="otp-code">
          ${otp}
        </div>
  
        <p>
          This OTP is valid for the next 2 minutes. Please do not share this code
          with anyone.
        </p>
        <p>Thanks,<br>The Hospital Team</p>
      </div>
  
      <div class="footer">
        <p>Get in touch</p>
        <p>+11 111 333 4444</p>
        <p>
          <a href="mailto:info@yourcompany.com">info@yourcompany.com</a>
        </p>
        <p>&copy; 2024 Your Company. All Rights Reserved.</p>
      </div>
    </div>
  </body>
  </html>
  
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
      return res.status(200).json({ message: "OTP sent successfully", otp });
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({ message: "Failed to send OTP. Please try again." });
    }
  }


// const forgotPassword = async (req, res) => {
//     const { email } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ success: false, message: "User not found" });
//         }

//         const resetPasswordToken = crypto.randomBytes(20).toString("hex");
//         user.resetPasswordToken = resetPasswordToken;
//         user.resetPasswordTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
        
//         await user.save();

//         await sendResetPasswordEmail(email, `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`);

//         return res.status(200).json({ success: true, message: "Password reset link sent to your email" });        
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

// const resetPassword = async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;
//     try {
//         const user = await User.findOne({
//             resetPasswordToken: token,
//             resetPasswordTokenExpiresAt: { $gt: Date.now() }
//         })

//         if (!user) {
//             return res.status(400).json({ success: false, message: "Invalid or expired token" });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         user.password = hashedPassword;
//         user.resetPasswordToken = undefined;
//         user.resetPasswordTokenExpiresAt = undefined;

//         await user.save();

//         await sendResetSuccessfulEmail(user.email);

//         return res.status(200).json({ status: true, message: "Password Reset Successful" });
//     } catch (error) {
//         return res.status(500).json({ status: false, message: error.message});
//     }
// }

// const checkAuth = async (req, res) => {
//     try {
//         const user = await User.findOne({ _id: req.userId }).select("-password");
//         if(!user)
//             return res.status(400).json({ success: false, message: "User not found" });
    
//         return res.status(200).json({ success: true, user});
//     } catch (error) {
//         console.log("Error in check auth: ", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

const verifyOtp = async (req, res) => {
    const { email, otp, firstName, lastName, password } = req.body;
  
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
  
    const record = otpStore[email];
  
    if (!record) {
      return res.status(400).json({ message: "No OTP found for this email" });
    }
  
    const { otp: storedOtp, expiresAt } = record;
  
    // Check if OTP is valid
    if (Date.now() > expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP has expired" });
    }
  
    if (otp != storedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  
    // OTP is valid, now create the user
    delete otpStore[email];
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
  
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully, user registered." });
  }

const register = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: 'Email is already registered' });
      }
      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

const adminLogin = async (req, res) => {
  console.log('Admin login request body:', req.body);
  try {
      // Find the user by email
      const user = await Admin.findOne({ email: req.body.email });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Compare the password
      if (user.password !== req.body.password) {
          return res.status(400).json({ error: 'Invalid credentials' });
      }
      res.status(200).json({
          message: 'Login successful',
          user: {
             
              email: user.email,        
          }
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
  }
}

const logIn = async (req, res) => {
    console.log('Login request body:', req.body);
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(401).json({ error: 'Incorrect password' });
        const token = jwt.sign({ id: user._id, email:user.email, },
            'hospital',
            { expiresIn: '1d' }
        );

        res.json({ message: 'Logged in successfully' ,token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
    sendOtp,
    verifyOtp,
    register,
    adminLogin,
    logIn
}
