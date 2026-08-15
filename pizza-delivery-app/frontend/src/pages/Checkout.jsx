import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderService, paymentService } from "../services";
import EasyPaisaModal from "../components/EasyPaisaModal";

const TAX_RATE = 0.05;
const DELIVERY_CHARGE = 40;
const FREE_DELIVERY_THRESHOLD = 500;
const COUPONS = { PIZZA10: { type: "percent", value: 10 }, FLAT50: { type: "flat", value: 50 } };

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const { items, subtotal, couponCode, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "", phone: user?.phone || "" });
  const [processing, setProcessing] = useState(false);
  const [gateway, setGateway] = useState("razorpay"); // "razorpay" | "easypaisa"
  const [showEasyPaisaModal, setShowEasyPaisaModal] = useState(false);

  const discount = (() => {
    const c = COUPONS[couponCode?.toUpperCase()];
    if (!c) return 0;
    return c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
  })();
  const taxable = Math.max(subtotal - discount, 0);
  const tax = Math.round(taxable * TAX_RATE);
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const grandTotal = taxable + tax + deliveryCharge;

  const buildOrderPayload = () => ({
    items: items.map((i) => ({
      pizza: i.pizzaId,
      name: i.name,
      size: i.size,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      customization: i.customization,
    })),
    deliveryAddress: address,
    couponCode: couponCode || null,
  });

  // ===== Razorpay flow =====
  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Check your connection.");
        setProcessing(false);
        return;
      }

      const { data: rpData } = await paymentService.createRazorpayOrder(grandTotal);

      const options = {
        key: rpData.key,
        amount: rpData.razorpayOrder.amount,
        currency: "INR",
        name: "PizzaHub",
        description: "Pizza order payment",
        order_id: rpData.razorpayOrder.id,
        handler: async (response) => {
          try {
            const { data: orderData } = await orderService.create(buildOrderPayload());

            await paymentService.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.order._id,
            });

            clearCart();
            navigate("/payment-success", { state: { orderId: orderData.order._id } });
          } catch (err) {
            console.error(err);
            navigate("/payment-failed");
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
        prefill: { name: user?.name, email: user?.email, contact: address.phone },
        theme: { color: "#ff4e50" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async () => {
        await paymentService.markFailed({ razorpay_order_id: rpData.razorpayOrder.id });
        navigate("/payment-failed");
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not start payment");
    } finally {
      setProcessing(false);
    }
  };

  // ===== EasyPaisa (simulated) flow =====
  const handleEasyPaisaSubmit = (e) => {
    e.preventDefault();
    setShowEasyPaisaModal(true);
  };

  const handleEasyPaisaSuccess = async (mobileNumber) => {
    setProcessing(true);
    try {
      const { data: epInit } = await paymentService.initiateEasyPaisa(grandTotal, mobileNumber);
      const { data: orderData } = await orderService.create(buildOrderPayload());

      await paymentService.confirmEasyPaisa({
        paymentId: epInit.paymentId,
        orderId: orderData.order._id,
        simulateSuccess: true,
      });

      setShowEasyPaisaModal(false);
      clearCart();
      navigate("/payment-success", { state: { orderId: orderData.order._id } });
    } catch (err) {
      console.error(err);
      setShowEasyPaisaModal(false);
      navigate("/payment-failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleEasyPaisaFailure = () => {
    setShowEasyPaisaModal(false);
    navigate("/payment-failed");
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form
          onSubmit={gateway === "razorpay" ? handleRazorpayPayment : handleEasyPaisaSubmit}
          className="glass rounded-xl shadow-card p-6 space-y-4"
        >
          <h3 className="font-bold text-lg">Delivery Address</h3>
          <input
            required
            placeholder="Street Address"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="City"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <input
              required
              placeholder="State"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="ZIP Code"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
            />
            <input
              required
              placeholder="Phone"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            />
          </div>

          <h3 className="font-bold text-lg pt-2">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGateway("razorpay")}
              className={`border rounded-lg px-4 py-3 text-sm font-semibold transition ${
                gateway === "razorpay" ? "border-primary bg-primary/5 ring-2 ring-primary" : "hover:border-primary"
              }`}
            >
              💳 Razorpay
            </button>
            <button
              type="button"
              onClick={() => setGateway("easypaisa")}
              className={`border rounded-lg px-4 py-3 text-sm font-semibold transition ${
                gateway === "easypaisa" ? "border-green-600 bg-green-50 ring-2 ring-green-600" : "hover:border-green-600"
              }`}
            >
              📱 EasyPaisa
            </button>
          </div>

          <button
            disabled={processing}
            className={`w-full py-3 rounded-full font-bold transition disabled:opacity-60 mt-2 text-white ${
              gateway === "easypaisa" ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {processing
              ? "Processing..."
              : gateway === "easypaisa"
              ? `Pay Rs. ${grandTotal} with EasyPaisa`
              : `Pay Rs. ${grandTotal} with Razorpay`}
          </button>

          <p className="text-xs text-gray-400 text-center">
            {gateway === "easypaisa"
              ? "Simulated EasyPaisa flow for demo purposes — no real transaction occurs."
              : "Test mode — use Razorpay's test card 4111 1111 1111 1111 with any future expiry & CVV."}
          </p>
        </form>

        <div className="glass rounded-xl shadow-card p-6 h-fit">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          {items.map((i) => (
            <div key={i.cartId} className="flex justify-between text-sm mb-2">
              <span>{i.name} × {i.quantity}</span>
              <span>Rs. {i.unitPrice * i.quantity}</span>
            </div>
          ))}
          <hr className="my-3" />
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal</span><span>Rs. {subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm mb-1 text-green-600">
              <span>Discount ({couponCode})</span><span>-Rs. {discount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm mb-1">
            <span>Tax (5%)</span><span>Rs. {tax}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span>Delivery</span><span>{deliveryCharge === 0 ? "Free" : `Rs. ${deliveryCharge}`}</span>
          </div>
          <hr className="mb-3" />
          <div className="flex justify-between font-bold text-lg text-primary">
            <span>Total</span><span>Rs. {grandTotal}</span>
          </div>
        </div>
      </div>

      {showEasyPaisaModal && (
        <EasyPaisaModal
          amount={grandTotal}
          onClose={() => setShowEasyPaisaModal(false)}
          onSuccess={handleEasyPaisaSuccess}
          onFailure={handleEasyPaisaFailure}
        />
      )}
    </div>
  );
};

export default Checkout;
