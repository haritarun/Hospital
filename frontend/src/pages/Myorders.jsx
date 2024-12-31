import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Myorders = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

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
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setEmail(user.email);
          setPhoneNumber(user.phoneNumber || '');
          setAddress(user.address || '');
          setImageUrl(user.imageUrl || '');
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-green-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "fixed inset-0 z-50 w-64" : "hidden"
        } md:block bg-gray-800 text-white flex flex-col transition-all`}
      >
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
          <Link to="/userchatpage" className="block py-2 px-4 rounded hover:bg-green-700 transition">
            Chat
          </Link>
          <Link to="/profile" className="block py-2 px-4 rounded hover:bg-green-700 transition">
            Profile
          </Link>
          <a href="/myorders" className="block py-2 px-4 rounded hover:bg-green-700 transition">
            Myorders
          </a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-green-700 transition">
            Activity
          </a>
        </nav>
        <div className="p-4 border-t border-green-700">
          <Link to="/login">
            <button className="w-full py-2 px-4 bg-red-600 rounded hover:bg-red-700 transition">
              Logout
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 p-4 md:p-6 transition-all ${
          isSidebarOpen ? "md:ml-64" : ""
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="block md:hidden p-2 bg-green-800 text-white rounded"
            >
              ☰
            </button>
            <h1 className="text-lg md:text-xl font-bold uppercase">Welcome, {firstName} {lastName}</h1>
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
        <main className="flex-1 bg-white shadow rounded p-4 md:p-6 mt-4 md:mt-6">
          <h2 className="text-lg font-bold mb-4">Recent Activities</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">S NO</th>
                <th className="border p-2">Tablet Name</th>
                <th className="border p-2">Date of Order</th>
                <th className="border p-2">Remainder</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">1</td>
                <td className="border p-2">Dolo 650</td>
                <td className="border p-2">2024-12-19</td>
                <td className="border p-2">Order now</td>
              </tr>
              <tr>
                <td className="border p-2">2</td>
                <td className="border p-2">Dump Data</td>
                <td className="border p-2">2024-12-19</td>
                <td className="border p-2">Order now</td>
              </tr>
              <tr>
                <td className="border p-2">3</td>
                <td className="border p-2">Emo Emo</td>
                <td className="border p-2">2024-12-19</td>
                <td className="border p-2">Order now</td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default Myorders;
