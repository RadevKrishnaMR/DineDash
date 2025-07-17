import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
// import { useAuth } from "../../context/useAuth";

const Navbar: React.FC = () => {
  // const {logout} = useAuth()
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const handleLogout = () => {
    // logout(); // Clears token, user data from context/localStorage
    navigate("/login"); // or navigate("/") if you want to send to home
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-white"
      } border-b border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img src="https://png.pngtree.com/png-clipart/20250104/original/pngtree-cartoon-chef-vector-material-png-image_5469225.png" alt="Logo" className="h-17 w-auto mr-3" />
              <span className="text-2xl font-bold text-gray-800">DineDash</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-2 text-lg font-semibold transition-colors duration-300 ${
                    location.pathname === link.path
                      ? "text-indigo-600"
                      : "text-gray-700 hover:text-indigo-500"
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <span className="absolute inset-x-1 -bottom-1 h-1 bg-indigo-600 rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Profile dropdown */}
          <div className="hidden md:block relative ml-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center text-sm rounded-full focus:outline-none transition-transform hover:scale-105"
            >
              <img
                src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                alt="Profile"
                className="h-12 w-12 rounded-full border-2 border-white shadow-lg"
              />
            </button>

            <div
              className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 transition-all duration-300 origin-top-right ${
                dropdownOpen
                  ? "transform opacity-100 scale-100"
                  : "transform opacity-0 scale-95 hidden"
              }`}
            >
              <a
                href="#"
                className="block px-4 py-3 text-base text-gray-700 hover:bg-indigo-50 transition-colors"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="block px-4 py-3 text-base text-gray-700 hover:bg-indigo-50 transition-colors"
              >
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="block px-4 py-3 text-base text-gray-700 hover:bg-indigo-50 transition-colors w-full text-left"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Mobile menu buttons (burger and profile) */}
          <div className="flex items-center md:hidden space-x-4">
            {/* Profile button for mobile */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-1 rounded-full focus:outline-none transition-transform hover:scale-105"
            >
              <img
                src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-white shadow-lg"
              />
            </button>

            {/* Mobile menu button (burger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-500 focus:outline-none transition-colors"
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {mobileMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-3 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-lg font-semibold transition-colors ${
                location.pathname === link.path
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Profile Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          dropdownOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <img
                src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                alt="Profile"
                className="h-12 w-12 rounded-full border-2 border-white shadow-lg"
              />
            </div>
            <div className="ml-3 space-y-1">
              <div className="text-lg font-semibold text-gray-800">User Name</div>
              <div className="text-base font-medium text-gray-500">user@example.com</div>
            </div>
          </div>
          <div className="mt-3 px-2 space-y-2">
            <a
              href="#"
              className="block px-4 py-3 rounded-lg text-lg font-semibold text-gray-700 hover:bg-indigo-50 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block px-4 py-3 rounded-lg text-lg font-semibold text-gray-700 hover:bg-indigo-50 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              Settings
            </a>
            <button
              onClick={handleLogout}
              className="block px-4 py-3 rounded-lg text-lg font-semibold text-gray-700 hover:bg-indigo-50 transition-colors w-full text-left"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;