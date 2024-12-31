const express = require('express');

const { sendOtp, verifyOtp, register, adminLogin, logIn } = require('../controllers/authController.js');
// const { verifyToken } = require('../middleware/verifyToken.js');

const router = express.Router();

// /check-auth => get
// router.get('/check-auth', verifyToken, checkAuth);

// /signup => post
// router.post('/signup', signUp);

// /verify-email => post
// router.post('/verify-email', verifyEmail);

// /logout => post
// router.post('/logout', logOut);

// /login => post
router.post('/login', logIn);

// /forgot-password => post
// router.post('/forgot-password', forgotPassword);

// /reset-password/:token => post
// router.post('/reset-password/:token', resetPassword);

// /send-otp => post
router.post('/send-otp', sendOtp);

// /verify-otp => post
router.post('/verify-otp', verifyOtp);

// /admin_login => post
router.post('/admin_login', adminLogin);

// /register => post
router.post('register', register);

module.exports = router;
