import React, { useState } from "react";
import logo from '../assets/img/logo.png';  
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-green-200 dark:bg-green-500">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Hospital</span>
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
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

          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-green-500 rounded-lg md:hidden hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-200 dark:text-green-400 dark:hover:bg-green-700 dark:focus:ring-green-600"
            aria-controls="navbar-user"
            aria-expanded={isMenuOpen ? "true" : "false"}
            onClick={toggleMenu}
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
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? "block" : "hidden"}`}
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-green-400 rounded-lg bg-green-500 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-green-400 dark:bg-green-400 md:dark:bg-green-400 dark:border-green-700">
  <li>
    <a
      href="#"
      className="block py-2 px-3 text-white bg-orange-700 rounded md:bg-transparent md:text-orange-700 md:p-0 md:dark:text-oran23ge-500"
      aria-current="page"
    >
      Home
    </a>
  </li>
  <li>
    <a
      href="#"
      className="block py-2 px-3 text-green-900 rounded hover:bg-green-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-green-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-green-700"
    >
      About
    </a>
  </li>
  <li>
    <a
      href="#"
      className="block py-2 px-3 text-green-900 rounded hover:bg-green-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-green-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-green-700"
    >
      Services
    </a>
  </li>
  <li>
    <a
      href="#"
      className="block py-2 px-3 text-green-900 rounded hover:bg-green-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-green-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-green-700"
    >
      Pricing
    </a>
  </li>
  <li>
    <a
      href="#"
      className="block py-2 px-3 text-green-900 rounded hover:bg-green-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-green-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-green-700"
    >
      Contact
    </a>
  </li>
</ul>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
