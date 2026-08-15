import React from "react";
import { Link, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const { state } = useLocation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="glass shadow-glass rounded-2xl p-10 text-center max-w-md fade-in-up">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-extrabold mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-6">
          Your order has been placed and is being prepared. Track it live from your order history.
        </p>
        <div className="flex gap-3 justify-center">
          {state?.orderId && (
            <Link
              to={`/orders/${state.orderId}`}
              className="bg-primary text-white px-6 py-3 rounded-full font-bold"
            >
              Track Order
            </Link>
          )}
          <Link to="/" className="border-2 border-primary text-primary px-6 py-3 rounded-full font-bold">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
