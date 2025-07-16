import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-50
        bg-white/30 backdrop-blur-md
        shadow-lg
        flex items-center justify-between
        px-6 py-3
      "
    >
      {/* Logo */}
      <div className="flex items-center">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto mr-2" />
        <span className="text-xl font-bold text-gray-800">MyApp</span>
      </div>

      {/* Nav links */}
      <div className="flex space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`text-gray-700 hover:text-blue-600 transition-colors ${
              location.pathname === link.path ? "text-blue-600 font-semibold" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Profile dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="focus:outline-none"
        >
          <img
            src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
            alt="Profile"
            className="h-10 w-10 rounded-full border-2 border-white shadow-md"
          />
        </button>
        {dropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50"
          >
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
