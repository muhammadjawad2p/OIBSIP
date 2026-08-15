import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <div className="text-7xl mb-4">🍕</div>
    <h1 className="text-3xl font-extrabold mb-2">404 - Page Not Found</h1>
    <p className="text-gray-500 mb-6">Looks like this slice went missing.</p>
    <Link to="/" className="bg-primary text-white px-6 py-3 rounded-full font-bold">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
