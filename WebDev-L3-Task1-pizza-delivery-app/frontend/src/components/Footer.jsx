import React from "react";

const Footer = () => (
  <footer className="bg-dark text-white mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-xl font-bold mb-2">🍕 PizzaHub</h3>
        <p className="text-gray-400 text-sm">
          Fresh, hot pizzas delivered to your door. Build your own or pick a classic favorite.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Quick Links</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>Menu</li>
          <li>Build Your Own</li>
          <li>Track Order</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Contact</h4>
        <p className="text-gray-400 text-sm">support@pizzahub.example</p>
        <p className="text-gray-400 text-sm">+92 300 0000000</p>
      </div>
    </div>
    <div className="text-center text-gray-500 text-xs py-4 border-t border-gray-800">
      &copy; {new Date().getFullYear()} PizzaHub. Built for internship demo purposes.
    </div>
  </footer>
);

export default Footer;
