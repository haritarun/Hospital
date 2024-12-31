

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          showErrorPopup("No user email found. Please log in.");
          return;
        }

        const response = await axios.get(`http://localhost:3000/details?email=${email}`);
        if (response.status === 200) {
          const user = response.data;
          setDetails(user);
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setEmail(user.email);
          setPhoneNumber(user.phoneNumber || '');
          setAddress(user.address || '');
          setImageUrl(user.imageUrl || '');
          localStorage.setItem('firstName', user.firstName)
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        showErrorPopup('Failed to load profile details.');
      }
    };

    fetchUserDetails();
  }, []);

  const showErrorPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email) {
      showErrorPopup('Please fill in all required fields.');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zAZ]{2,}$/;
    if (!emailPattern.test(email)) {
      showErrorPopup('Please enter a valid email address.');
      return;
    }

    const phonePattern = /^\+?[1-9]\d{1,14}$/;
    if (phoneNumber && !phonePattern.test(phoneNumber)) {
      showErrorPopup('Please enter a valid phone number.');
      return;
    }

    console.log('Profile updated:', { firstName, lastName, email, phoneNumber, address, imageFile });
    const fullName =firstName + ' ' + lastName ;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const renderImage = () => {
    if (imageUrl) {
      return <img className="object-cover w-24 h-24 p-1 rounded-full ring-2 ring-green-300" src={imageUrl} alt="Profile Avatar" />;
    } else {
      return (
        <div className="flex items-center justify-center w-24 h-24 p-1 rounded-full ring-2 ring-green-300 bg-gray-400 text-white text-3xl font-bold">
          {firstName.charAt(0).toUpperCase()}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-green-100">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "fixed inset-0 z-50 w-64 bg-gray-800 text-white transition-all" : "hidden md:block"} md:block bg-gray-800 text-white flex flex-col`}>
        <div className="p-4 text-center font-bold text-xl border-b border-green-700 flex justify-between items-center">
          <span>User Dashboard</span>
          <button
            className="block md:hidden text-green-300 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <Link to="/userchatpage" className="block py-2 text-center px-4 rounded hover:bg-green-700 transition">Chat</Link>
          <Link to="/profile" className="block text-center py-2 px-4 rounded hover:bg-green-700 transition">Profile</Link>
          <a href="/myorders" className="block text-center py-2 px-4 rounded hover:bg-green-700 transition">Myorders</a>
          <a href="#" className="block text-center py-2 px-4 rounded hover:bg-green-700 transition">Activity</a>
        </nav>
        <div className="p-4 border-t border-green-700">
          <Link to="/login"><button className="w-full py-2 px-4 bg-red-600 rounded hover:bg-red-700 transition">Logout</button></Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? "overflow-hidden" : ""}`}>
        {/* Header */}
        <header className="bg-white shadow px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="block md:hidden p-2 bg-green-800 text-white rounded"
            >
              ☰
            </button>
            <h1 className="text-lg md:text-xl font-bold uppercase">Welcome,{firstName} {lastName} </h1>
          </div>
          <div className="flex items-center space-x-4">
          <img
          src={imageUrl || `https://ui-avatars.com/api/?name=${firstName}+${lastName}`}
          alt="Profile"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full border"
        />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-green-100 p-4 md:p-6">
          <div className="text-green-900 flex justify-center items-start pt-6">
            <div className="w-full sm:w-9/12 lg:w-7/12 xl:w-6/12 max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <h2 className="text-xl font-semibold text-center text-green-900">Your Public Profile</h2>

                  <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
                    <div
                      onClick={() => document.getElementById('fileInput').click()}
                      className="cursor-pointer"
                    >
                      {renderImage()}
                    </div>
                    <div className="flex flex-col space-y-3 sm:ml-8">
                      <button
                        type="button"
                        className="py-2 px-5 text-xs font-medium text-green-100 focus:outline-none bg-green-500 rounded-lg border border-green-200 hover:bg-green-900 focus:z-10 focus:ring-4 focus:ring-green-200"
                      >
                        Change picture
                      </button>
                      <button
                        type="button"
                        className="py-2 px-5 text-xs font-medium text-green-900 focus:outline-none bg-white rounded-lg border border-green-200 hover:bg-green-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-green-200"
                      >
                        Delete picture
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="w-full space-y-4 mt-6">
                    <div className="w-full flex space-x-4">
                      <div className="w-1/2">
                        <input
                          className="w-full px-6 py-3 rounded-lg font-medium bg-indigo-50 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white mt-4"
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="w-1/2">
                        <input
                          className="w-full px-6 py-3 rounded-lg bg-indigo-50 font-medium border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white mt-4"
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        className="w-full px-6 py-3 rounded-lg font-medium bg-indigo-50 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <input
                        className="w-full px-6 py-3 rounded-lg font-medium bg-indigo-50 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white"
                        type="tel"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>

                    <div>
                      <textarea
                        className="w-full px-6 py-3 rounded-lg font-medium border bg-indigo-50 border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-green-500 focus:bg-white"
                        placeholder="Your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows="3"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        Save
                      </button>
                    </div>
                  </form>

                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;

