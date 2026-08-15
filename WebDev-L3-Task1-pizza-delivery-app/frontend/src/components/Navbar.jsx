import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 glass shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-primary">
            🍕 <span>PizzaHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/" className="hover:text-primary transition">Menu</Link>
            <Link to="/builder" className="hover:text-primary transition">Build Your Own</Link>
            {user && <Link to="/orders" className="hover:text-primary transition">My Orders</Link>}
            <Link to="/cart" className="relative hover:text-primary transition">
              🛒 Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Hi, {user.name?.split(" ")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 rounded-full text-sm font-semibold hover:text-primary transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden text-2xl" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 fade-in-up">
            <Link to="/" onClick={() => setMenuOpen(false)}>Menu</Link>
            <Link to="/builder" onClick={() => setMenuOpen(false)}>Build Your Own</Link>
            {user && <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>}
            <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({totalItems})</Link>
            {user ? (
              <button onClick={handleLogout} className="text-left text-primary font-semibold">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
