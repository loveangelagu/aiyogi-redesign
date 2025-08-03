import React, { useState } from 'react';
import logo from '../../../assets/logos/logo.svg';

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-trasparent absolute w-full fixed top-0 left-0 z-50">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} alt="Logo" className="h-10 w-auto" /> {/* Adjust height as needed */}
        </div>

        <button onClick={toggleMenu} data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded={isOpen}>
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

        <div
          className={`${
            isOpen ? 'opacity-100 translate-y-2 scale-100' : 'opacity-0 pointer-events-none scale-95 -translate-y-2'
          } transition-all duration-300 ease-out origin-top-right absolute right-4 top-full bg-black rounded-lg shadow-lg z-40 w-52 md:relative md:top-0 md:right-0 md:w-auto md:bg-transparent md:shadow-none md:opacity-100 md:pointer-events-auto md:translate-y-0 md:scale-100`}
          id="navbar-default"
        >
          <ul className="flex flex-col md:flex-row md:space-x-10 space-y-3 md:space-y-0 p-4 md:p-0">
            <li>
              <a
                href="#"
                className="text-gray-100 hover:text-gray-300 font-light"
                aria-current="page"
              >
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-gray-300 font-light">
                Videos
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-gray-300 font-light">
                Subscribe
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-gray-300 font-light">
                Work With Us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-gray-300 font-light">
                Public Relations
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-gray-300 font-light">
                Blogs
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-gray-300 font-light">
                Mantak Chia
              </a>
            </li>
          </ul>
        </div>

        <button className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 text-black px-10 py-3 rounded-full font-semibold text-base hover:from-yellow-300 hover:to-yellow-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl hidden md:block">
          Try AiYogi
        </button>
      </div>
    </nav>
  );
};

export default Navbar;