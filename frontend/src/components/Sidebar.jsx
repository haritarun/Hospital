import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faSignOutAlt, 
  faHome, 
  faInfoCircle, 
  faCogs, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons';

function Sidebar({ isOpen, toggleSidebar, handleLogout }) {
  return (
    <div
      className={`transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-200 w-64 p-4 font-bold border shadow-lg z-50 fixed lg:relative lg:block h-full`}
    >
      {/* Close Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden absolute top-4 right-4 text-gray-600 text-2xl"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <h3 className="text-lg font-jost font-bold mb-4">UDAY SAI</h3>

      {/* Navigation Links */}
      <nav>
        <Link
          to="/"
          className="flex items-center mb-6 font-jost text-gray-800 hover:text-red-500 hover:bg-gray-300 transition duration-300 ease-in-out p-3 rounded"
        >
          <FontAwesomeIcon icon={faHome} className="mr-2" />
          Home
        </Link>

        <Link
          to="/about"
          className="flex items-center mb-6 font-jost text-gray-800 hover:text-red-500 hover:bg-gray-300 transition duration-300 ease-in-out p-3 rounded"
        >
          <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
          About
        </Link>

        <Link
          to="/services"
          className="flex items-center mb-6 font-jost text-gray-800 hover:text-red-500 hover:bg-gray-300 transition duration-300 ease-in-out p-3 rounded"
        >
          <FontAwesomeIcon icon={faCogs} className="mr-2" />
          Services
        </Link>

        <Link
          to="/contact"
          className="flex items-center mb-6 font-jost text-gray-800 hover:text-red-500 hover:bg-gray-300 transition duration-300 ease-in-out p-3 rounded"
        >
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
          Contact
        </Link>

        <Link
          to="/logout"
          className="flex items-center font-jost text-gray-800 hover:text-red-500 hover:bg-gray-300 transition duration-300 ease-in-out p-3 rounded"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
