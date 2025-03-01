import { useState } from 'react';
import ThemeToggle from '../ThemeToggle';

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="z-10 py-4 bg-white shadow-sm dark:bg-gray-800 transition-colors duration-200">
      <div className="flex items-center justify-between h-full px-6 mx-auto">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          onClick={() => setSidebarOpen(true)}
        >
          <svg
            className="w-6 h-6 text-gray-500 dark:text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Search */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-blue-500">
            <div className="absolute inset-y-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              className="w-full pl-10 pr-3 py-2 rounded-md text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:placeholder-gray-400 dark:focus:bg-gray-700 dark:bg-gray-700 dark:text-gray-200"
              type="text"
              placeholder="Search"
              aria-label="Search"
            />
          </div>
        </div>

        <ul className="flex items-center flex-shrink-0 space-x-4">
          {/* Theme toggler */}
          <li className="flex">
            <ThemeToggle />
          </li>

          {/* Notifications */}
          <li className="relative">
            <button className="p-2 bg-white text-gray-500 align-middle rounded-full hover:text-blue-500 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </li>

          {/* Profile */}
          <li className="relative">
            <button
              className="p-1 flex items-center text-sm font-medium text-gray-700 rounded-full hover:text-blue-500 dark:text-gray-200"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                A
              </div>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg dark:bg-gray-800 z-50"
                onClick={() => setDropdownOpen(false)}
              >
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Sign out
                </a>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}