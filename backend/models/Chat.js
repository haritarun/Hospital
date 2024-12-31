const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  username: String,
  to: String,
  message: String,
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true,  
});

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;