import React from "react";

const STEPS = [
  "Order Received",
  "Preparing",
  "In Kitchen",
  "Ready",
  "Out For Delivery",
  "Delivered",
];

const OrderStatusTracker = ({ status }) => {
  if (status === "Cancelled") {
    return (
      <div className="bg-red-50 text-red-600 font-semibold px-4 py-3 rounded-lg text-center">
        ❌ This order was cancelled
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center overflow-x-auto py-4">
      {STEPS.map((step, idx) => {
        const isDone = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center min-w-[90px]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
                } ${isCurrent ? "ring-4 ring-primary/30 animate-pulse" : ""}`}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span
                className={`text-[11px] mt-2 text-center ${
                  isDone ? "text-gray-800 font-semibold" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-1 mx-1 rounded ${idx < currentIndex ? "bg-primary" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;
