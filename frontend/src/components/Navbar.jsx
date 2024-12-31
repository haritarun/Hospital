import React, { useState } from "react";
import logo from '../assets/img/logo.png';  

const Navbar = ({ toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the mobile menu
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-green-200 dark:bg-green-500">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Hospital</span>
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* User Avatar */}
          <button
            type="button"
            className="flex text-sm bg-green-800 rounded-full md:me-0 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-600"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
          >
            <span className="sr-only">Open user menu</span>
            <img className="w-8 h-8 rounded-full" src={logo} alt="user photo" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-green-500 rounded-lg md:hidden hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-200 dark:text-green-400 dark:hover:bg-green-700 dark:focus:ring-green-600"
            aria-controls="navbar-user"
            aria-expanded={isMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
