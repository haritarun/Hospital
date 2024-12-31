import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaPaperPlane, FaSmile } from "react-icons/fa"; 
import Picker from 'emoji-picker-react'; 

const socket = socketIOClient("http://localhost:3002");

const UserChatPage = () => {
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
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatContainerRef = useRef(null); 

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
          localStorage.setItem('firstName', user.firstName);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        showErrorPopup('Failed to load UserChatPage details.');
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (firstName) {
      socket.emit("userLogin", firstName);

      socket.on("chatHistory", (messages) => {
        setChats(messages);
      });
      
      socket.on("message", (msg) => {
        console.log("New message received:", msg);
        setChats((prev) => [...prev, msg]);
      });
    }

    return () => {
      socket.off("chatHistory");
      socket.off("message");
    };
  }, [firstName]);

  const sendMessage = () => {
    if (!message) return;

    const chatData = {
      username: firstName,
      message,
      avatar: "https://example.com/user-avatar.jpg", 
      to: "Admin",
      timestamp: new Date(),
    };

    console.log("Sending message:", chatData);
    socket.emit("newMessage", chatData);
    setMessage("");

    
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage();
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
    setShowEmojiPicker(false); 
  };

  const showErrorPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const renderImage = () => {
    if (imageUrl) {
      return <img className="object-cover w-24 h-24 p-1 rounded-full ring-2 ring-green-300" src={imageUrl} alt="UserChatPage Avatar" />;
    } else {
      return (
        <div className="flex items-center justify-center w-24 h-24 p-1 rounded-full ring-2 ring-green-300 bg-gray-400 text-white text-3xl font-bold">
          {firstName.charAt(0).toUpperCase()}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-blue-100"> {/* Updated background color */}
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
          <Link to="/UserChatPage" className="block text-center py-2 px-4 rounded hover:bg-green-700 transition">UserChatPage</Link>
          <a href="/myorders" className="block text-center py-2 px-4 rounded hover:bg-green-700 transition">Myorders</a>
          <a href="#" className="block text-center py-2 px-4 rounded hover:bg-green-700 transition">Activity</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? "overflow-hidden" : ""}`}>
        {/* Header */}
        <header className="bg-blue-100 shadow px-4 md:px-6 py-4 mb:h-full flex justify-between items-center sticky top-0 z-20">
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
              alt="UserChatPage"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border"
            />
          </div>
        </header>

        {/* Chat Section */}
        <div className="flex flex-col w-full h-full max-w-full mx-auto bg-blue-50 rounded-lg shadow-lg" style={{ marginBottom: 0, paddingBottom: 0 }}>
          <div
            ref={chatContainerRef}
            className="p-4 overflow-y-auto flex-1 space-y-3"
            style={{
              maxHeight: "calc(100vh - 140px)",
              overflowY: "auto",
              wordWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {chats.map((chat, index) => (
              <div key={index} className={`flex items-start ${chat.username === firstName ? "justify-end" : "justify-start"}`}>
               
                <div className={`p-2 rounded-lg max-w-xl ${chat.username === firstName ? "bg-blue-200" : "bg-white"}`} style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
                  <span className="text-sm pr-4">{chat.message}</span>
                  <span className="text-[50%] text-gray-400">{new Date(chat.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Emoji Picker and Input Area */}
          <div className="flex p-3 border-t border-green-200 space-x-2 bg-white ">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ marginBottom: "0" }} // Ensure no margin below
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FaSmile size={20} />
            </button>
            <button
              onClick={sendMessage}
              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FaPaperPlane size={20} />
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 left-0 z-50">
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;


