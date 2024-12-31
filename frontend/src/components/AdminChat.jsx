import React, { useState } from 'react';

const AdminChat = () => {
  const [messages, setMessages] = useState([
    { user: 'admin', text: 'Hello! How can I assist you today?' },
    { user: 'user', text: 'I need help with my account.' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { user: 'admin', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className={msg.user === 'admin' ? 'text-right' : 'text-left'}>
              <div
                className={`inline-block p-2 rounded-lg ${msg.user === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-l-lg"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-r-lg ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
