import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const links = [
  { to: "/admin/dashboard", label: "📊 Dashboard" },
  { to: "/admin/pizzas", label: "🍕 Pizzas" },
  { to: "/admin/inventory", label: "📦 Inventory" },
  { to: "/admin/orders", label: "🧾 Orders" },
  { to: "/admin/users", label: "👤 Users" },
];

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-dark text-white flex flex-col fixed h-full">
        <div className="p-6 text-xl font-extrabold border-b border-gray-800">
          🍕 PizzaHub Admin
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-400 mb-2">{admin?.name} ({admin?.role})</p>
          <button
            onClick={handleLogout}
            className="w-full bg-primary/90 hover:bg-primary text-white py-2 rounded-lg text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
