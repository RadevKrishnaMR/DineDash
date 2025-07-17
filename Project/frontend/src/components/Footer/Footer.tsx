// import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm text-gray-700 py-8 px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      <aside className="col-span-2 md:col-span-2 flex flex-col items-start space-y-3">
        <div className="flex items-center space-x-3">
          <img
            src="https://cdn-icons-png.flaticon.com/128/1531/1531385.png"
            alt="DineDash Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl font-bold text-gray-800">DineDash</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Delivering delicious moments since 2023
          <br />
          © {new Date().getFullYear()} DineDash Pvt Ltd.
        </p>
      </aside>

      <nav className="flex flex-col space-y-2">
        <h6 className="text-base font-semibold text-gray-800 mb-1">Services</h6>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Booking</a>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Take away</a>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Custom Order</a>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Home Delivery</a>
      </nav>

      <nav className="flex flex-col space-y-2">
        <h6 className="text-base font-semibold text-gray-800 mb-1">Company</h6>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">About us</a>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Contact</a>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Careers</a>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Press</a>
      </nav>

      <nav className="flex flex-col space-y-2">
        <h6 className="text-base font-semibold text-gray-800 mb-1">Legal</h6>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Terms</a>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Privacy</a>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Cookies</a>
        <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Licenses</a>
      </nav>
    </footer>
  );
};

export default Footer;