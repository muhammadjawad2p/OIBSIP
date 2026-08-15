import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Registered! Check your email to verify your account.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="glass shadow-glass rounded-2xl p-8 w-full max-w-md fade-in-up"
      >
        <h2 className="text-2xl font-extrabold text-center mb-1">Create Account 🍕</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Join us and start ordering</p>

        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          required
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-primary outline-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          required
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-primary outline-none"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-primary outline-none"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          required
          minLength={6}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-primary outline-none"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
