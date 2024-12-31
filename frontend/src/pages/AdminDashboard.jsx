import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminName] = useState("John Doe");

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "fixed inset-0 z-50 w-64" : "hidden"
        } md:block bg-gray-800 text-white flex flex-col transition-all`}
      >
        <div className="p-4 text-center font-bold text-xl border-b border-gray-700 flex justify-between items-center">
          <span>Admin Dashboard</span>
          <button
            aria-label="Close Sidebar"
            className="block md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <Link
            to="/dashboard"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/adminchatpage"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Chats
          </Link>
          <Link
            to="/admincategory"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Store
          </Link>
          <Link
            to="/reports"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Reports
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link to="/login">
            <button className="w-full py-2 px-4 bg-red-600 rounded hover:bg-red-700 transition">
              Logout
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          isSidebarOpen ? "overflow-hidden" : ""
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              aria-label="Toggle Sidebar"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="block md:hidden p-2 bg-gray-800 text-white rounded"
            >
              ☰
            </button>
            <h1 className="text-lg md:text-xl font-bold">Welcome, Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm md:text-base">
              {adminName}
            </span>
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Card Example */}
            <div className="bg-white shadow rounded p-4 md:p-6 text-center">
              <h2 className="text-base md:text-lg font-bold">Total Users</h2>
              <p className="text-2xl md:text-3xl mt-2">1,234</p>
            </div>
            <div className="bg-white shadow rounded p-4 md:p-6 text-center">
              <h2 className="text-base md:text-lg font-bold">Active Sessions</h2>
              <p className="text-2xl md:text-3xl mt-2">56</p>
            </div>
            <div className="bg-white shadow rounded p-4 md:p-6 text-center">
              <h2 className="text-base md:text-lg font-bold">New Signups</h2>
              <p className="text-2xl md:text-3xl mt-2">78</p>
            </div>
            <div className="bg-white shadow rounded p-4 md:p-6 text-center">
              <h2 className="text-base md:text-lg font-bold">Pending Tasks</h2>
              <p className="text-2xl md:text-3xl mt-2">12</p>
            </div>
          </div>

          <div className="mt-4 md:mt-6 bg-white shadow rounded p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold mb-2 md:mb-4">
              Recent Activity
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-1 md:p-2 text-sm md:text-base">
                    User
                  </th>
                  <th className="border-b p-1 md:p-2 text-sm md:text-base">
                    Activity
                  </th>
                  <th className="border-b p-1 md:p-2 text-sm md:text-base">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-1 md:p-2 text-sm md:text-base">Jane Doe</td>
                  <td className="p-1 md:p-2 text-sm md:text-base">Logged in</td>
                  <td className="p-1 md:p-2 text-sm md:text-base">
                    2024-12-20
                  </td>
                </tr>
                <tr>
                  <td className="p-1 md:p-2 text-sm md:text-base">
                    John Smith
                  </td>
                  <td className="p-1 md:p-2 text-sm md:text-base">
                    Updated profile
                  </td>
                  <td className="p-1 md:p-2 text-sm md:text-base">
                    2024-12-19
                  </td>
                </tr>
                <tr>
                  <td className="p-1 md:p-2 text-sm md:text-base">
                    Alice Johnson
                  </td>
                  <td className="p-1 md:p-2 text-sm md:text-base">
                    Created a post
                  </td>
                  <td className="p-1 md:p-2 text-sm md:text-base">
                    2024-12-18
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
