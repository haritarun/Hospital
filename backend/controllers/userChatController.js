const Chat = require("./models/Chat.js");

const userLoginEvent = async (username) => {
    activeUsers.set(socket.id, username);
    io.emit(
      "activeUsers",
      Array.from(activeUsers.values()).filter((user) => user !== "Admin") // Exclude "Admin"
    );

    // Load chat history for the user and Admin
    const messages = await Chat.find({
      $or: [{ username, to: "Admin" }, { username: "Admin", to: username }],
    }).sort({ timestamp: 1 });
    socket.emit("chatHistory", messages); // Send chat history to the user
  }

const userLogoutEvent = () => {
    activeUsers.delete(socket.id);
    io.emit(
      "activeUsers",
      Array.from(activeUsers.values()).filter((user) => user !== "Admin") // Exclude "Admin"
    );
  }

const loadChatHistory = async (selectedUser) => {
    const messages = await Chat.find({
      $or: [{ username: selectedUser, to: "Admin" }, { username: "Admin", to: selectedUser }],
    }).sort({ timestamp: 1 }); 
    socket.emit("chatHistory", messages);
  }

const getAllUsersWithLastChatHistory = async () => {
    const allUsers = await Chat.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$username",
          lastMessage: { $first: "$message" },
          timestamp: { $first: "$timestamp" },
        },
      },
    ]);
  
    // Filter out "Admin" from the user list
    const formattedUsers = allUsers
      .filter((user) => user._id !== "Admin")
      .map((user) => ({
        username: user._id,
        lastMessage: user.lastMessage,
        timestamp: user.timestamp,
        unreadCount: 0, // Initialize unread messages with 0
      }));
  
    socket.emit("allUsersWithLastChat", formattedUsers);
  } 

const newMessage = async (data) => {
    // Force the sender to be "Admin" if the admin sends the message
    const isAdmin = data.username === "Admin";
  
    const messageData = {
      ...data,
      username: isAdmin ? "Admin" : data.username, // Ensure the correct username
    };
  
    const newMessage = new Chat(messageData);
    await newMessage.save(); // Save the message to the database
  
    io.emit("message", messageData); // Broadcast the message to all clients
  }

const handleDisconnect = () => {
    console.log("A user disconnected:", socket.id);
    activeUsers.delete(socket.id);
    io.emit(
      "activeUsers",
      Array.from(activeUsers.values()).filter((user) => user !== "Admin") // Exclude "Admin"
    );
  }

module.exports = {
    userLoginEvent,
    userLogoutEvent,
    loadChatHistory,
    getAllUsersWithLastChatHistory,
    newMessage,
    handleDisconnect,
};