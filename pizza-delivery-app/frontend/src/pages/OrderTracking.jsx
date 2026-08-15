import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { orderService } from "../services";
import { useSocket } from "../context/SocketContext";
import OrderStatusTracker from "../components/OrderStatusTracker";

const OrderTracking = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderService.getById(id);
        setOrder(data.order);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    const handler = (updatedOrder) => {
      if (updatedOrder._id === id) {
        setOrder(updatedOrder);
        toast.success(`Order status updated: ${updatedOrder.status}`);
      }
    };
    socket.on("orderStatusUpdate", handler);
    return () => socket.off("orderStatusUpdate", handler);
  }, [socket, id]);

  const handleCancel = async () => {
    try {
      const { data } = await orderService.cancel(id);
      setOrder(data.order);
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel order");
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 h-96 skeleton rounded-2xl" />;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  const cancellable = !["Out For Delivery", "Delivered", "Cancelled"].includes(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        {cancellable && (
          <button
            onClick={handleCancel}
            className="text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-full text-sm font-semibold"
          >
            Cancel Order
          </button>
        )}
      </div>

      <div className="glass rounded-xl shadow-card p-6 mb-8">
        <OrderStatusTracker status={order.status} />
      </div>

      <div className="glass rounded-xl shadow-card p-6">
        <h3 className="font-bold mb-4">Items</h3>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm py-2 border-b last:border-0">
            <div>
              <p className="font-medium">{item.name} × {item.quantity}</p>
              {item.customization?.base && (
                <p className="text-xs text-gray-500">
                  {item.customization.base}, {item.customization.sauce}, {item.customization.cheese}
                </p>
              )}
            </div>
            <span>Rs. {item.subtotal}</span>
          </div>
        ))}

        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>Rs. {order.subtotal}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span><span>-Rs. {order.discount}</span>
            </div>
          )}
          <div className="flex justify-between"><span>Tax</span><span>Rs. {order.tax}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>Rs. {order.deliveryCharge}</span></div>
          <div className="flex justify-between font-bold text-primary text-base pt-2 border-t mt-2">
            <span>Total</span><span>Rs. {order.grandTotal}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-sm text-gray-500">
          <p className="font-semibold text-gray-700 mb-1">Delivery Address</p>
          <p>{order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zip}</p>
          <p>Phone: {order.deliveryAddress?.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
