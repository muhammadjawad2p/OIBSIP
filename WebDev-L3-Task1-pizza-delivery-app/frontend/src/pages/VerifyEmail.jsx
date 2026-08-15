import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authService } from "../services/authService";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await authService.verifyEmail(token);
        setStatus("success");
        setMessage(data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="glass shadow-glass rounded-2xl p-10 text-center max-w-md fade-in-up">
        {status === "loading" && (
          <>
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Verifying your email...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold">
              Go to Login
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
            <p className="text-gray-500">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
