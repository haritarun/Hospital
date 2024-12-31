import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaPaperPlane, FaSmile, FaPaperclip } from "react-icons/fa"; // FaSmile for emojis, FaPaperclip for file upload
import Picker from "emoji-picker-react"; // Importing an emoji picker package

const socket = socketIOClient("http://localhost:3002");

const UserChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to control emoji picker visibility
  const [file, setFile] = useState(null); // File state for attachments
  const chatContainerRef = useRef(null); // Ref for chat container

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          showErrorPopup("No user email found. Please log in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/details?email=${email}`
        );
        if (response.status === 200) {
          const user = response.data;
          setDetails(user);
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setEmail(user.email);
          setPhoneNumber(user.phoneNumber || "");
          setAddress(user.address || "");
          setImageUrl(user.imageUrl || "");
          localStorage.setItem("firstName", user.firstName);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        showErrorPopup("Failed to load UserChatPage details.");
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
        setChats((prev) => [...prev, msg]);
      });
    }

    return () => {
      socket.off("chatHistory");
      socket.off("message");
    };
  }, [firstName]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const chatData = {
      username: firstName,
      message,
      avatar: "https://example.com/user-avatar.jpg", // Dynamic avatar could be added here
      to: "Admin",
      timestamp: new Date(),
      file,
    };

    socket.emit("newMessage", chatData);
    setMessage("");
    setFile(null); // Clear file after sending message

    // Auto-scroll to the latest message
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
    setShowEmojiPicker(false); // Close emoji picker after selection
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const showErrorPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const renderImage = () => {
    if (imageUrl) {
      return (
        <img
          className="object-cover w-24 h-24 p-1 rounded-full ring-2 ring-green-300"
          src={imageUrl}
          alt="UserChatPage Avatar"
        />
      );
    } else {
      return (
        <div className="flex items-center justify-center w-24 h-24 p-1 rounded-full ring-2 ring-green-300 bg-gray-400 text-white text-3xl font-bold">
          {firstName.charAt(0).toUpperCase()}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-blue-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen
            ? "fixed inset-0 z-50 w-64 bg-gray-800 text-white transition-all"
            : "hidden md:block"
        } md:block bg-gray-800 text-white flex flex-col`}
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
          <Link
            to="/userchatpage"
            className="block py-2 text-center px-4 rounded hover:bg-green-700 transition"
          >
            Chat
          </Link>
          <Link
            to="/UserChatPage"
            className="block text-center py-2 px-4 rounded hover:bg-green-700 transition"
          >
            UserChatPage
          </Link>
          <a
            href="/myorders"
            className="block text-center py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Myorders
          </a>
          <a
            href="#"
            className="block text-center py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Activity
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? "overflow-hidden" : ""}`}>
        {/* Header */}
        <header className="bg-white shadow px-4 md:px-6 py-4 mb:h-full flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="block md:hidden p-2 bg-green-800 text-white rounded"
            >
              ☰
            </button>
            <h1 className="text-lg md:text-xl font-bold uppercase">
              Welcome, {firstName} {lastName}
            </h1>
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
        <div className="flex flex-col w-full h-full max-w-full mx-auto bg-blue-100 rounded-lg shadow-lg" style={{ marginBottom: 0, paddingBottom: 0 }}>
          <div
            ref={chatContainerRef}
            className="p-4 overflow-y-auto flex-1 space-y-3"
            style={{
              maxHeight: "calc(100vh - 200px)",
              overflowY: "auto",
              wordWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {chats.map((chat, index) => (
              <div key={index} className={`flex items-start ${chat.username === firstName ? "justify-end" : "justify-start"}`}>
                <img
                  src={imageUrl || `https://ui-avatars.com/api/?name=${firstName}+${lastName}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className={`p-2 rounded-lg max-w-xs ${chat.username === firstName ? "bg-green-200" : "bg-gray-200"}`} style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
                  <p className="text-sm">{chat.message}</p>
                  {chat.file && (
                    <a href={URL.createObjectURL(chat.file)} className="text-blue-500 text-sm" download>
                      Download File
                    </a>
                  )}
                  <span className="text-xs text-gray-400">{new Date(chat.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex items-center p-4 bg-blue-100 rounded-b-lg mt-14">
            <div className="flex space-x-2 items-center">
              {/* File Upload */}
              <label htmlFor="file-upload" className="cursor-pointer text-xl">
                <FaPaperclip />
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {/* Emoji Picker */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-xl"
              >
                <FaSmile />
              </button>
              {showEmojiPicker && (
                <Picker onEmojiClick={handleEmojiClick} className="absolute bottom-16 left-4 z-50" />
              )}
            </div>

            <input
              type="text"
              className="flex-1 p-2 ml-2 rounded-l-lg border border-gray-300 outline-none"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            <button
              className="p-2 ml-2 bg-green-500 text-white rounded-r-lg"
              onClick={sendMessage}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;














// import React, { useState } from 'react';
// import { FaPaperPlane, FaSmile, FaPaperclip } from 'react-icons/fa';
// import Picker from 'emoji-picker-react';

// const ChatApp = () => {
//   const [message, setMessage] = useState('');
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [file, setFile] = useState(null);

//   const handleEmojiClick = (event, emojiObject) => {
//     setMessage((prev) => prev + emojiObject.emoji);
//     setShowEmojiPicker(false);
//   };

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       setChatHistory([...chatHistory, { text: message, sender: 'user', file }]);
//       setMessage('');
//       setFile(null); // Clear file after sending message
//     }
//   };

//   const handleFileChange = (event) => {
//     const uploadedFile = event.target.files[0];
//     setFile(uploadedFile);
//   };

//   return (
//     <div className="h-screen flex flex-col bg-blue-50">
//       {/* Chat Header */}
//       <header className="flex items-center justify-between p-4 bg-blue-100 border-b border-blue-300">
//         <h2 className="text-lg font-bold text-blue-900">Chat</h2>
//       </header>

//       {/* Chat Messages */}
//       <div className="flex-1 p-4 overflow-y-auto">
//         {chatHistory.length === 0 ? (
//           <div className="text-center text-blue-600">Start a conversation...</div>
//         ) : (
//           <div className="space-y-3">
//             {chatHistory.map((message, index) => (
//               <div
//                 key={index}
//                 className={`p-3 rounded-lg text-white ${
//                   message.sender === 'user' ? 'bg-blue-600 ml-auto' : 'bg-blue-300 mr-auto'
//                 } w-fit max-w-xs`}
//               >
//                 {message.text}
//                 {message.file && (
//                   <div className="mt-2 text-sm text-blue-200">
//                     File: {message.file.name}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Chat Input */}
//       <footer className="p-4 border-t border-blue-300 bg-blue-50 flex items-center">
//         <div className="relative flex items-center">
//           {/* Emoji Button */}
//           <button
//             onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//             className="text-blue-600 hover:text-blue-800 text-2xl"
//           >
//             <FaSmile />
//           </button>

//           {/* File Attachment Button */}
//           <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-800 text-2xl ml-4">
//             <FaPaperclip />
//           </label>
//           <input
//             type="file"
//             id="file-upload"
//             className="hidden"
//             onChange={handleFileChange}
//           />

//           {/* Emoji Picker */}
//           {showEmojiPicker && (
//             <div className="absolute bottom-12 left-0 z-10">
//               <Picker onEmojiClick={handleEmojiClick} />
//             </div>
//           )}
//         </div>

//         {/* Message Input */}
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 mx-2 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
//         />

//         {/* Send Button */}
//         <button
//           onClick={handleSendMessage}
//           className="text-blue-600 hover:text-blue-800 text-2xl"
//         >
//           <FaPaperPlane />
//         </button>
//       </footer>
//     </div>
//   );
// };

// export default ChatApp;