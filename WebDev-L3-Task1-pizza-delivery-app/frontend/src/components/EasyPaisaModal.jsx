import React, { useState } from "react";

// Simulated EasyPaisa payment modal. Mimics the mobile-wallet UX
// (enter account number → app confirmation → success) without calling
// any real Easypaisa endpoint. See backend/controllers/easyPaisaController.js
// for why: real integration requires a registered business merchant account.
const STAGES = {
  ENTER_NUMBER: "ENTER_NUMBER",
  PROCESSING: "PROCESSING",
  CONFIRM_ON_PHONE: "CONFIRM_ON_PHONE",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

const EasyPaisaModal = ({ amount, onClose, onSuccess, onFailure }) => {
  const [stage, setStage] = useState(STAGES.ENTER_NUMBER);
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");

  const validateNumber = (num) => /^03\d{9}$/.test(num);

  const handleSendRequest = (e) => {
    e.preventDefault();
    if (!validateNumber(mobileNumber)) {
      setError("Enter a valid number in the format 03XXXXXXXXX");
      return;
    }
    setError("");
    setStage(STAGES.PROCESSING);

    // Simulate network delay while "sending request" to the wallet
    setTimeout(() => {
      setStage(STAGES.CONFIRM_ON_PHONE);
    }, 1800);
  };

  const handleConfirmPin = (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError("Enter the 4-digit PIN sent to your EasyPaisa app");
      return;
    }
    setError("");
    setStage(STAGES.PROCESSING);

    setTimeout(() => {
      setStage(STAGES.SUCCESS);
      setTimeout(() => onSuccess(mobileNumber), 1200);
    }, 1500);
  };

  const handleCancel = () => {
    setStage(STAGES.FAILED);
    setTimeout(() => onFailure(), 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden fade-in-up">
        {/* Header mimicking wallet app branding */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            📱 easypaisa
          </div>
          {stage === STAGES.ENTER_NUMBER && (
            <button onClick={onClose} className="text-white/80 hover:text-white text-xl">
              ✕
            </button>
          )}
        </div>

        <div className="p-6">
          {stage === STAGES.ENTER_NUMBER && (
            <form onSubmit={handleSendRequest}>
              <p className="text-sm text-gray-500 mb-1">Amount to pay</p>
              <p className="text-2xl font-extrabold text-green-600 mb-4">Rs. {amount}</p>

              <label className="block text-sm font-medium mb-1">EasyPaisa Mobile Account Number</label>
              <input
                type="text"
                placeholder="03XXXXXXXXX"
                maxLength={11}
                className="w-full border rounded-lg px-4 py-2 mb-1 focus:ring-2 focus:ring-green-500 outline-none"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
              />
              {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold mt-4 transition">
                Send Payment Request
              </button>
              <p className="text-[11px] text-gray-400 text-center mt-3">
                Simulated payment for demo purposes — no real transaction occurs.
              </p>
            </form>
          )}

          {stage === STAGES.PROCESSING && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-medium">Processing your request...</p>
              <p className="text-xs text-gray-400 mt-1">Please wait a moment</p>
            </div>
          )}

          {stage === STAGES.CONFIRM_ON_PHONE && (
            <form onSubmit={handleConfirmPin}>
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📲</div>
                <p className="font-semibold">Confirmation sent to {mobileNumber}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 4-digit PIN to approve this payment
                </p>
              </div>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                className="w-full border rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] mb-1 focus:ring-2 focus:ring-green-500 outline-none"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              />
              {error && <p className="text-red-500 text-xs mb-2 text-center">{error}</p>}

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold mt-4 transition">
                Confirm Payment
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full text-gray-500 text-sm mt-3 hover:text-red-500"
              >
                Cancel Transaction
              </button>
            </form>
          )}

          {stage === STAGES.SUCCESS && (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-bold text-green-600 text-lg">Payment Successful</p>
              <p className="text-xs text-gray-400 mt-1">Redirecting...</p>
            </div>
          )}

          {stage === STAGES.FAILED && (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">❌</div>
              <p className="font-bold text-red-500 text-lg">Transaction Cancelled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EasyPaisaModal;
