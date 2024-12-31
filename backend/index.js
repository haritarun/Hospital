const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chat");
const Admin = require("./models/Admin");
const Tablets=require("./models/tablets");
const Tablet = require('./models/tablets');


const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });



mongoose.connect('mongodb://127.0.0.1:27017/register', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connected successfully!'))
  .catch((error) => console.error('Database connection error:', error));



const activeUsers = new Map();

// OTP expiration time (2 minutes)
const OTP_EXPIRATION_TIME = 2 * 60 * 1000;
let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tarunbommana798@gmail.com", 
    pass: "fznt ittn egav kajd",   
    
  },
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

// POST route to generate and send OTP
app.post("/send-otp", async (req, res) => {
  const { email,firstName,lastName} = req.body;
  const fullName=firstName+ ' '+lastName;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const otp = generateOTP();
    const expiresAt = Date.now() + OTP_EXPIRATION_TIME;

    otpStore[email] = { otp, expiresAt };

    const mailOptions = {
      from: "tarunbommana798@gmail.com", 
      to: email, 
      subject: "Your OTP Code",
      html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }

    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

   
    .header {
      background-color: #009957;
      color: #fff;
      text-align: center;
      padding: 20px;
    }

    .header img {
      max-width: 120px;
      margin-bottom: 10px;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }

   
    .content {
      padding: 20px;
      text-align: center;
      color: #333;
    }

    .content p {
      font-size: 16px;
      margin: 20px 0;
    }

    .otp-code {
      margin: 30px auto;
      font-size: 40px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #00ba5a;
    }

    
    .footer {
      background-color: #009961;
      color: #fff;
      text-align: center;
      padding: 15px;
      font-size: 14px;
    }

    .footer a {
      color: #fff;
      text-decoration: none;
    }

    .footer p {
      margin: 5px 0;
    }
    .user{
        text-align: start;
    }
  </style>
</head>
<body>
  <div class="email-container">
   
    <div class="header">
      
      <h1>Verify Your E-mail Address</h1>
    </div>


    <div class="content">
      <p class="user">Dear ${fullName},</p>
      <p>
        Thank you for registering at our hospital. To complete your registration,
        please use the following One-Time Password (OTP):
      </p>

      <div class="otp-code">
        ${otp}
      </div>

      <p>
        This OTP is valid for the next 2 minutes. Please do not share this code
        with anyone.
      </p>
      <p>Thanks,<br>The Hospital Team</p>
    </div>

    <div class="footer">
      <p>Get in touch</p>
      <p>+11 111 333 4444</p>
      <p>
        <a href="mailto:info@yourcompany.com">info@yourcompany.com</a>
      </p>
      <p>&copy; 2024 Your Company. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>

      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
});

// POST route to verify OTP
app.post("/verify-otp", async (req, res) => {
  const { email, otp, firstName, lastName, password } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ message: "No OTP found for this email" });
  }

  const { otp: storedOtp, expiresAt } = record;

  // Check if OTP is valid
  if (Date.now() > expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (otp != storedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP is valid, now create the user
  delete otpStore[email];
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  await user.save();
  return res.status(200).json({ message: "OTP verified successfully, user registered." });
});

// Register route (checks for existing email)
app.post('/register', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: 'Email is already registered' });
    }
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/admin_login', async (req, res) => {
  console.log('Admin login request body:', req.body);
  try {
      // Find the user by email
      const user = await Admin.findOne({ email: req.body.email });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Compare the password
      if (user.password !== req.body.password) {
          return res.status(400).json({ error: 'Invalid credentials' });
      }
      res.status(200).json({
          message: 'Login successful',
          user: {
             
              email: user.email,        
          }
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
  }
});app.post('/tablets', async (req, res) => {
  const { tabletName, deskno, mfgDate, expDate, noOfSets } = req.body;

  // Validate input
  if (!tabletName || !deskno || !mfgDate || !expDate || !noOfSets) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check for existing tablet
    const existingTablet = await Tablets.findOne({ tabletName });
    if (existingTablet) {
      return res.status(400).json({ message: 'Tablet already exists' });
    }

    // Create new tablet
    const newTablet = new Tablets({
      tabletName,
      deskno,
      mfgDate: new Date(mfgDate), // Ensure date format
      expDate: new Date(expDate), // Ensure date format
      noOfSets,
    });

    await newTablet.save();
    res.status(201).json({ message: 'Tablet Successfully Added', data: newTablet });
  } catch (err) {
    console.error('Error saving tablet:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});
app.put('/updatetablet', async (req, res) => {
  const { tabletName, deskno, mfgDate, expDate, noOfSets } = req.body;


  if (!tabletName || !deskno || !mfgDate || !expDate || !noOfSets) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    console.log(tabletName, deskno, mfgDate, expDate)
    const data = await Tablets.findOne({tabletName: tabletName})
    console.log(data)
    const updatedTablet = await Tablets.findOneAndUpdate(
      { tabletName }, 
      { 
        deskno, 
        mfgDate: new Date(mfgDate), 
        expDate: new Date(expDate), 
        noOfSets 
      },
      { new: true, runValidators: true } 
    );

    
    if (!updatedTablet) {
      return res.status(404).json({ message: 'Tablet not found' });
    }
    res.status(200).json({ message: 'Tablet updated successfully', data: updatedTablet });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


app.get('/getdata', async (req, res) => {
  try {
    const data = await Tablets.find(); 
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});
app.delete('/delete', async (req, res) => {
  const { tabletName } = req.body;
 
  // Validate request body
  if (!tabletName) {
    return res.status(400).json({ message: 'Tablet name is required' });
  }

  try {
    const deletedTablet = await Tablets.findOneAndDelete({ tabletName });
    if (!deletedTablet) {
      return res.status(404).json({ message: 'Tablet not found' });
    }
    res.status(200).json({ message: 'Tablet deleted successfully', data: deletedTablet });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


app.post('/login', async (req, res) => {
    console.log('Login request body:', req.body);
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(401).json({ error: 'Incorrect password' });
        const token = jwt.sign({ id: user._id, email:user.email, },
            'hospital',
            { expiresIn: '1d' }
        );

        res.json({ message: 'Logged in successfully' ,token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



////////////////////////////////////////////////////////////////
//details for profile
app.get('/details', async (req, res) => {
    const { email } = req.query; 
    if (!email) {
        return res.status(400).json({ error: 'Email parameter is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal server error' });
    }
});


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id); 


  socket.on("userLogin", async (username) => {
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
  });

  // Handle user logout
  socket.on("userLogout", () => {
    activeUsers.delete(socket.id);
    io.emit(
      "activeUsers",
      Array.from(activeUsers.values()).filter((user) => user !== "Admin") // Exclude "Admin"
    );
  });

  // Load chat history for the admin or specific user
  socket.on("loadChat", async (selectedUser) => {
    const messages = await Chat.find({
      $or: [{ username: selectedUser, to: "Admin" }, { username: "Admin", to: selectedUser }],
    }).sort({ timestamp: 1 }); 
    socket.emit("chatHistory", messages);
  });


  socket.on("getAllUsersWithLastChat", async () => {
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
  });
  


  socket.on("newMessage", async (data) => {
    // Force the sender to be "Admin" if the admin sends the message
    const isAdmin = data.username === "Admin";
  
    const messageData = {
      ...data,
      username: isAdmin ? "Admin" : data.username, // Ensure the correct username
    };
  
    const newMessage = new Chat(messageData);
    await newMessage.save();
  
    io.emit("message", messageData); 
  });
  
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    activeUsers.delete(socket.id);
    io.emit(
      "activeUsers",
      Array.from(activeUsers.values()).filter((user) => user !== "Admin") // Exclude "Admin"
    );
  });
});


app.listen(3000, () => {
   console.log("Server is running on port 3000");
});


server.listen(3002, () => {
  console.log("Server running on port3002");
});


