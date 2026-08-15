import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../services";

const statusColor = {
  "Order Received": "bg-blue-100 text-blue-700",
  Preparing: "bg-yellow-100 text-yellow-700",
  "In Kitchen": "bg-orange-100 text-orange-700",
  Ready: "bg-purple-100 text-purple-700",
  "Out For Delivery": "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderService.getMyOrders();
        setOrders(data.orders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-8">My Orders</h1>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 skeleton rounded-xl" />
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">You haven't placed any orders yet.</p>
          <Link to="/" className="bg-primary text-white px-6 py-3 rounded-full font-bold">
            Order Now
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="glass rounded-xl shadow-card p-5 flex justify-between items-center hover:shadow-glass transition fade-in-up"
          >
            <div>
              <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
              <p className="text-sm text-gray-500">
                {order.items.length} item(s) · {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">Rs. {order.grandTotal}</p>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor[order.status]}`}>
                {order.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
