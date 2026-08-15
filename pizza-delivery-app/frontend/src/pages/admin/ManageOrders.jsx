import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminOrderService } from "../../services";
import { useSocket } from "../../context/SocketContext";

const STATUSES = [
  "Order Received",
  "Preparing",
  "In Kitchen",
  "Ready",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

const statusColor = {
  "Order Received": "bg-blue-100 text-blue-700",
  Preparing: "bg-yellow-100 text-yellow-700",
  "In Kitchen": "bg-orange-100 text-orange-700",
  Ready: "bg-purple-100 text-purple-700",
  "Out For Delivery": "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const ManageOrders = () => {
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await adminOrderService.getAll(filter);
      setOrders(data.orders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("joinAdminRoom");
    const onNewOrder = () => {
      toast("New order received!", { icon: "🔔" });
      fetchOrders();
    };
    const onOrderUpdated = () => fetchOrders();
    socket.on("newOrder", onNewOrder);
    socket.on("orderUpdated", onOrderUpdated);
    return () => {
      socket.off("newOrder", onNewOrder);
      socket.off("orderUpdated", onOrderUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleStatusChange = async (id, status) => {
    try {
      await adminOrderService.updateStatus(id, status);
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Manage Orders</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold ${!filter ? "bg-primary text-white" : "bg-gray-100"}`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${filter === s ? "bg-primary text-white" : "bg-gray-100"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">No orders found</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="p-4 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4">{order.user?.name}<br /><span className="text-xs text-gray-400">{order.user?.email}</span></td>
                  <td className="p-4">{order.items.length}</td>
                  <td className="p-4 font-semibold">Rs. {order.grandTotal}</td>
                  <td className="p-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
