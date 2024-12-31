import React, { useState } from 'react';

const UserChat = () => {
  const [messages, setMessages] = useState([
    { user: 'user', text: 'Hello, I need some help.' },
    { user: 'admin', text: 'Sure, how can I assist you?' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { user: 'user', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.user === 'admin' ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`inline-block p-3 rounded-lg max-w-xs ${
                  msg.user === 'admin' ? 'bg-gray-300 text-black' : 'bg-green-500 text-white'
                }`}>
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
            className="p-2 bg-green-500 text-white rounded-r-lg ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
