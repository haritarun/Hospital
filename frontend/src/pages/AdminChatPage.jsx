import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { FaBell, FaPaperPlane, FaSmile, FaPaperclip } from "react-icons/fa";
import Picker from "emoji-picker-react";

const socket = socketIOClient("http://localhost:3002");

const AdminDashboard = () => {
  const [userChats, setUserChats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null); // Initially, no user is selected
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);

  const adminName = "Admin"; // Admin name is fixed

  // Load users and chat data
  useEffect(() => {
    socket.emit("getAllUsersWithLastChat");

    socket.on("allUsersWithLastChat", (usersWithChats) => {
      setUserChats(
        usersWithChats.reduce((acc, user) => {
          acc[user.username] = user;
          return acc;
        }, {})
      );
    });

    if (selectedUser) {
      socket.emit("loadChat", selectedUser);
    }

    socket.on("chatHistory", (messages) => setChats(messages));

    socket.on("message", (msg) => {
      setUserChats((prev) => {
        const updated = { ...prev };
        updated[msg.username] = {
          ...updated[msg.username],
          lastMessage: msg.message,
          timestamp: new Date(msg.timestamp),
          unreadCount: selectedUser === msg.username ? 0 : (updated[msg.username]?.unreadCount || 0) + 1,
        };
        return updated;
      });

      if (msg.username === selectedUser || msg.to === selectedUser) {
        setChats((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("allUsersWithLastChat");
      socket.off("chatHistory");
      socket.off("message");
    };
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", selectedUser);
      setUserChats((prev) => ({
        ...prev,
        [selectedUser]: {
          ...prev[selectedUser],
          unreadCount: 0,
        },
      }));
    }
  }, [selectedUser]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    socket.emit("loadChat", user);
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const chatData = {
      username: adminName,
      message,
      avatar: "https://example.com/admin-avatar.jpg",
      to: selectedUser,
      timestamp: new Date(),
    };

    socket.emit("newMessage", chatData);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleBack = () => {
    setSelectedUser(null);
    setChats([]);
  };

  const sortedUsers = Object.entries(userChats)
    .sort(([, a], [, b]) => new Date(b.timestamp) - new Date(a.timestamp))
    .filter(([username]) => username !== adminName)
    .map(([username, details]) => ({ username, ...details }));

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleEmojiClick = (event, emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-blue-50">
      {/* User List */}
      <div
        className={`w-full md:w-1/3 shadow-md overflow-y-auto bg-white ${
          selectedUser ? "hidden md:block" : "block"
        }`}
      >
        <header className="flex justify-between items-center p-4 bg-blue-100 border-b border-blue-300">
          <h2 className="text-lg font-bold text-blue-800">Users</h2>
          <FaBell className="text-blue-600 text-xl cursor-pointer hover:text-blue-800" />
        </header>
        <ul className="divide-y divide-blue-200">
          {sortedUsers.map((user, index) => (
            <li
              key={index}
              onClick={() => handleSelectUser(user.username)}
              className={`p-4 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${selectedUser === user.username ? "bg-blue-100" : ""}`}
            >
              <div>
                <strong className="block text-gray-800">{user.username}</strong>
                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">{new Date(user.timestamp).toLocaleTimeString()}</span>
                {user.unreadCount > 0 && (
                  <span className="text-xs bg-red-500 text-white rounded-full px-2">
                    {user.unreadCount}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-white shadow-md ${selectedUser ? "block" : "hidden md:block"}`}>
        {selectedUser ? (
          <>
            <header className="flex items-center justify-between p-4 bg-blue-100 border-b border-blue-300">
              <h2 className="text-lg font-bold text-blue-900">{selectedUser}</h2>
              <button
                onClick={handleBack}
                className="text-blue-600 hover:text-blue-800 text-lg"
              >
                Back
              </button>
            </header>
            <div className="flex-1 p-4 overflow-y-auto bg-blue-50">
              {chats.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.username === adminName ? "justify-end mt-3" : "justify-start mt-3"}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg shadow-md ${chat.username === adminName ? "bg-blue-500 text-white" : "bg-white"}`}
                  >
                    <span className="text-sm">{chat.message}</span>
                    <span className="text-[50%] text-gray-400 ml-2">
                      {new Date(chat.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <footer className="p-4 border-t border-blue-300 bg-blue-50 flex items-center">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-blue-600 hover:text-blue-800 text-2xl"
              >
                <FaSmile />
              </button>

              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-800 text-2xl ml-4"
              >
                <FaPaperclip />
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />

              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-10">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 mx-2 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />

              <button
                onClick={sendMessage}
                className="text-blue-600 hover:text-blue-800 text-2xl"
              >
                <FaPaperPlane />
              </button>
            </footer>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-blue-600">
            Select a user to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
