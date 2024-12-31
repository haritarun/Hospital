import axios from 'axios';

// API call to get all active users
export const getUsers = async () => {
  try {
    const response = await axios.get('/api/users');  // Adjust based on your route
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// API call to get chat history with a specific user
export const getChatHistory = async (userId) => {
  try {
    const response = await axios.get(`/api/chats/${userId}`);  // Adjust based on your route
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};
