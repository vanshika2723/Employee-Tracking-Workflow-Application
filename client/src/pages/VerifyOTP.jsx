import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const verify = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      toast.success("OTP verified");

      navigate("/reset-password", {
        state: { email, otp },
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={verify} className="w-full max-w-md space-y-5">
        <h1 className="text-3xl font-semibold">Verify OTP</h1>

        <p>Enter OTP sent to your email</p>

        <input
          className="w-full border p-3 rounded"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="w-full bg-indigo-600 text-white p-3 rounded">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
