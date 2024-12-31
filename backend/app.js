const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const Tablets = require('./models/tablets.js');


// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const { userLoginEvent, userLogoutEvent, loadChatHistory, getAllUsersWithLastChatHistory, newMessage, handleDisconnect } = require('./controllers/userChatController.js');
const { table } = require('console');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Socket.IO configuration
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is up and running!' });
});

// Routes
app.use(authRoutes);
app.use(userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id); 

  // Handle user login
  socket.on("userLogin", userLoginEvent);

  // Handle user logout
  socket.on("userLogout", userLogoutEvent);

  // Load chat history for the admin or specific user
  socket.on("loadChat", loadChatHistory);

  socket.on("getAllUsersWithLastChat", getAllUsersWithLastChatHistory);

  socket.on("newMessage", newMessage); 

  // Handle user disconnect
  socket.on("disconnect", handleDisconnect);
});

server.listen(3002, () => {
  console.log("Server is running on port 3002");
});


// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });
