import React, { useState } from "react";
import logo from '../assets/img/logo.png';  
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [popupMessage, setPopupMessage] = useState(''); 
    const [showPopup, setShowPopup] = useState(false);    
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const navigate = useNavigate();


    const showErrorPopup = (message) => {
        setPopupMessage(message);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000); 
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Handle login logic
    const handleLogin = async () => {
        if (!email || !password) {
            if (!email) {
                showErrorPopup('Email is required.');
            }
            if (!password) {
                showErrorPopup('Password is required.');
            }
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/login', {
                email: email,
                password: password,
            });
            
            
            localStorage.setItem('email', email);  
            if (response.status === 200) {
                navigate('/userdashboard');
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    showErrorPopup('Incorrect password. Please try again.');
                } else if (err.response.status === 404) {
                    showErrorPopup('User not found. Please check your email.');
                } else {
                    showErrorPopup('Something went wrong. Please try again later.');
                }
            } else {
                showErrorPopup('Network error. Please check your connection.');
            }
        }
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
            <div className="w-11/12 sm:w-5/12 lg:w-4/12 xl:w-4/12 max-w-lg bg-white shadow sm:rounded-lg flex justify-center overflow-hidden">
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
                            {/* Google Sign-In Button */}
                            <div className="w-full mb-6">
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
                                    <span className="ml-3 text-sm">
                                        Sign In with Google
                                    </span>
                                </button>
                            </div>

                            <div className="my-8 border-b text-center">
                                <div
                                    className="leading-none px-2 inline-block text-xs text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2"
                                >
                                    Or sign In with Cartesian E-mail
                                </div>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
                                {/* Email Field */}
                                <input
                                    className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white transition-all duration-300"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-label="Email"
                                />
                                
                                {/* Password Field */}
                                <div className="relative mt-4">
                                    <input
                                        className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white transition-all duration-300"
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        aria-label="Password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 text-gray-600"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {passwordVisible ? (
                                            <EyeOffIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="mt-4 tracking-wide font-semibold bg-green-400 text-white w-full py-3 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                >
                                    <svg
                                        className="w-5 h-5 -ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span className="ml-2 text-sm">Sign In</span>
                                </button>
                            </form>

                            {/* Error Popup */}
                            {showPopup && (
                                <div className="absolute top-0 right-0 mt-5 mr-5 p-4 bg-red-500 text-white rounded-lg shadow-lg">
                                    {popupMessage}
                                </div>
                            )}

                            {/* Register Link */}
                            <p className="mt-4 text-xs text-gray-600 text-center">
                                You don't have an account? Please <Link to="/register" className="font-bold text-blue-700">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Optional: Background image section */}
                <div className="flex-1 bg-green-100 text-center hidden lg:flex">
                    <div
                        className="m-8 xl:m-12 w-[80%] bg-contain bg-center bg-no-repeat"
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
