import React from "react";
import { Link } from "react-router-dom";

const PaymentFailed = () => (
  <div className="min-h-[70vh] flex items-center justify-center px-4">
    <div className="glass shadow-glass rounded-2xl p-10 text-center max-w-md fade-in-up">
      <div className="text-6xl mb-4">😔</div>
      <h2 className="text-2xl font-extrabold mb-2">Payment Failed</h2>
      <p className="text-gray-500 mb-6">
        Something went wrong while processing your payment. Your cart items are still saved — please try again.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/checkout" className="bg-primary text-white px-6 py-3 rounded-full font-bold">
          Try Again
        </Link>
        <Link to="/cart" className="border-2 border-primary text-primary px-6 py-3 rounded-full font-bold">
          Back to Cart
        </Link>
      </div>
    </div>
  </div>
);

export default PaymentFailed;
