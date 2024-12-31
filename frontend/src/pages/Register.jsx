import React, { useState } from "react";
import logo from '../assets/img/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Uday@1234');
  const [confirmPassword, setConfirmPassword] = useState('Uday@1234');
  const [firstName, setFirstName] = useState('Uday');
  const [lastName, setLastName] = useState('tarun');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);  // New loading state

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  const validateName = (name) => /^[A-Za-z]{2,}$/.test(name);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const showErrorPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!validateName(firstName)) {
      showErrorPopup("First name must contain only alphabets and be at least 2 characters long.");
      return;
    }
    if (!validateName(lastName)) {
      showErrorPopup("Last name must contain only alphabets and be at least 2 characters long.");
      return;
    }
    if (!validateEmail(email)) {
      showErrorPopup("Invalid email format.");
      return;
    }
    if (!validatePassword(password)) {
      showErrorPopup("Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one digit, and one special character.");
      return;
    }
    if (password !== confirmPassword) {
      showErrorPopup("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Register user
      const res = await axios.post('http://localhost:3000/register', {
        firstName,
        lastName,
        email,
        password,
      });
      if (res.status === 201) {
        const otpRes = await axios.post("http://localhost:3000/send-otp", { email,firstName,lastName});
        setMessage(otpRes.data.message);
        setIsOtpSent(true);
        const data = { otp: otpRes.data.otp, email,firstName,lastName,password };
        navigate('/mailotp', { state: data });
      }

    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response && error.response.status === 400 && error.response.data.error === 'Email is already registered') {
        showErrorPopup("Email is already registered.");
      } else {
        showErrorPopup("Failed to register. Please try again later.");
      }
    } finally {
      setLoading(false);  // Hide loader after the process is done
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
      <div className="w-11/12 sm:w-5/12 lg:w-4/12 xl:w-4/12 max-w-lg bg-white shadow sm:rounded-lg flex justify-center">
        <div className="w-full p-4 sm:p-8">
          <div>
            <img
              src={logo}
              className="max-w-full h-auto mx-auto"
              style={{ maxWidth: '100px' }}
              alt="Logo"
            />
          </div>
          <div className="mt-8 flex flex-col items-center">
            <div className="w-full flex-1 mt-6">
              <div className="flex flex-col items-center">
                <button
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-2 bg-green-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                >
                  <div className="bg-white p-1 rounded-full">
                    <svg
                      className="w-4"
                      viewBox="0 0 533.5 544.3"
                    >
                      <path
                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                        fill="#4285f4"
                      />
                      <path
                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                        fill="#34a853"
                      />
                      <path
                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                        fill="#fbbc04"
                      />
                      <path
                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                        fill="#ea4335"
                      />
                    </svg>
                  </div>
                  <span className="ml-3 text-sm">Sign In with Google</span>
                </button>
              </div>

              <div className="my-8 border-b text-center">
                <div
                  className="leading-none px-2 inline-block text-xs text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2"
                >
                  Or Sign Up
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
                <div className="w-full flex space-x-4">
                  <div className="w-1/2">
                    <input
                      className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white mt-4"
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white mt-4"
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <input
                  className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white mt-4"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password and Confirm Password Fields */}
                <div className="relative mb-4">
                  <input
                    className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white mt-4"
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-7 text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="relative mb-4">
                  <input
                    className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white"
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-600"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {confirmPasswordVisible ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold mt-6"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Loading..." : "Create Account"}
                </button>
              </form>

              {loading && (
                <div className="absolute inset-0 bg-gray-800 opacity-50 flex justify-center items-center z-10">
                  <svg className="container">
                    <rect className="boxes"></rect>
                  </svg>
                </div>
              )}

              <div className="mt-8 text-center text-xs text-gray-500">
                Already have an account? <Link to="/login" className="text-green-500">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-green-100 text-center hidden lg:flex">
                    <div
                        className="m-8 xl:m-12 w-[80%] bg-contain bg-center bg-no-repeat"
                    ></div>
                </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-red-400 p-4 rounded-lg shadow-lg">
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
