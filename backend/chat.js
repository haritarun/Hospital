

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const Chat = require("./models/chat");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// mongoose.connect("mongodb://localhost:27017/register", );

// const activeUsers = new Map();

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id); 


//   socket.on("userLogin", async (username) => {
//     activeUsers.set(socket.id, username);
//     io.emit(
//       "activeUsers",
//       Array.from(activeUsers.values()).filter((user) => user !== "Admin") // Exclude "Admin"
//     );

//     // Load chat history for the user and Admin
//     const messages = await Chat.find({
//       $or: [{ username, to: "Admin" }, { username: "Admin", to: username }],
//     }).sort({ timestamp: 1 });
//     socket.emit("chatHistory", messages); // Send chat history to the user
//   });

//   // Handle user logout
//   socket.on("userLogout", () => {
//     activeUsers.delete(socket.id);
//     io.emit(
//       "activeUsers",
//       Array.from(activeUsers.values()).filter((user) => user !== "Admin") // Exclude "Admin"
//     );
//   });

//   // Load chat history for the admin or specific user
//   socket.on("loadChat", async (selectedUser) => {
//     const messages = await Chat.find({
//       $or: [{ username: selectedUser, to: "Admin" }, { username: "Admin", to: selectedUser }],
//     }).sort({ timestamp: 1 }); 
//     socket.emit("chatHistory", messages);
//   });


//   socket.on("getAllUsersWithLastChat", async () => {
//     const allUsers = await Chat.aggregate([
//       { $sort: { timestamp: -1 } },
//       {
//         $group: {
//           _id: "$username",
//           lastMessage: { $first: "$message" },
//           timestamp: { $first: "$timestamp" },
//         },
//       },
//     ]);
  
//     // Filter out "Admin" from the user list
//     const formattedUsers = allUsers
//       .filter((user) => user._id !== "Admin")
//       .map((user) => ({
//         username: user._id,
//         lastMessage: user.lastMessage,
//         timestamp: user.timestamp,
//         unreadCount: 0, // Initialize unread messages with 0
//       }));
  
//     socket.emit("allUsersWithLastChat", formattedUsers);
//   });
  


//   socket.on("newMessage", async (data) => {
//     // Force the sender to be "Admin" if the admin sends the message
//     const isAdmin = data.username === "Admin";
  
//     const messageData = {
//       ...data,
//       username: isAdmin ? "Admin" : data.username, // Ensure the correct username
//     };
  
//     const newMessage = new Chat(messageData);
//     await newMessage.save(); // Save the message to the database
  
//     io.emit("message", messageData); // Broadcast the message to all clients
//   });
  

//   // Handle user disconnect
//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//     activeUsers.delete(socket.id);
//     io.emit(
//       "activeUsers",
//       Array.from(activeUsers.values()).filter((user) => user !== "Admin") // Exclude "Admin"
//     );
//   });
// });


// server.listen(300, () => {
//   console.log("Server running on port 3002");
// });