import React, { useState, useEffect } from 'react';
import ChatList from '../components/ChatList';  // For displaying all users
import UserChat from '../components/UserChat';  // For chatting with selected user
import AdminChat from '../components/AdminChat';  // For admin-to-admin chat (optional)
import { getUsers, getChatHistory } from '../utils/api';  // Utility functions to interact with backend API

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null); // User selected for chat
  const [users, setUsers] = useState([]); // All active users
  const [chatHistory, setChatHistory] = useState([]); // Chat history with the selected user

  // Fetch the list of users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();  // API call to fetch users
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch chat history when a user is selected
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (selectedUser) {
        try {
          const chatData = await getChatHistory(selectedUser.id);  // API call to fetch chat history
          setChatHistory(chatData);
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      }
    };

    fetchChatHistory();
  }, [selectedUser]);

  const handleSelectUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!selectedUser ? (
        // Display the ChatList for admin to select a user
        <ChatList users={users} onSelectUser={handleSelectUser} />
      ) : (
        // Once a user is selected, show the UserChat component
        <UserChat user={selectedUser} chatHistory={chatHistory} />
      )}
    </div>
  );
};

export default ChatPage;
