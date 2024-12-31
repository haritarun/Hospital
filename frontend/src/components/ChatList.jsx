import React from 'react';

const ChatList = ({ users, onSelectUser }) => {
   
  if (!Array.isArray(users)) {
    return <div className="p-4 text-red-500">Error: No users available</div>;
  }

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Active Users</h2>
        <ul className="space-y-2">
          {users.length === 0 ? (
            <li className="text-gray-500">No active users</li>
          ) : (
            users.map((user) => (
              <li
                key={user.id}
                onClick={() => onSelectUser(user.id)}
                className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-100 rounded-md">
                <div className="font-semibold">{user.name}</div>
                <div className="text-gray-500">{user.status}</div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
