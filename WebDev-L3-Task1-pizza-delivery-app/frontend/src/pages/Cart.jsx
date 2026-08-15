import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, increaseQty, decreaseQty, removeItem, subtotal, couponCode, setCouponCode } =
    useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some delicious pizzas to get started</p>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-full font-bold">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.cartId}
              className="glass rounded-xl shadow-card p-4 flex items-center gap-4 fade-in-up"
            >
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-3xl overflow-hidden shrink-0">
                {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : "🍕"}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                {item.customization && (
                  <p className="text-xs text-gray-500 mt-1">
                    {item.customization.base}, {item.customization.sauce}, {item.customization.cheese}
                    {item.customization.vegetables?.length > 0 &&
                      `, ${item.customization.vegetables.join(", ")}`}
                  </p>
                )}
                <p className="text-primary font-bold mt-1">Rs. {item.unitPrice}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQty(item.cartId)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.cartId)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.cartId)}
                className="text-red-500 hover:text-red-700 text-xl ml-2"
                title="Remove"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl shadow-card p-6 h-fit">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Coupon Code (optional)</label>
            <input
              type="text"
              placeholder="e.g. PIZZA10"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Tax and delivery charges are calculated at checkout.
          </p>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-bold transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
