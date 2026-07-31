import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const VerifyActivateOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "vanshikakhandelwal102@gmail.com";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    // next input focus
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/verify-activate-otp", {
        email,
        otp: finalOtp,
      });

      toast.success("Email verified");

      navigate("/create-password", {
        state: {
          email,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      await api.post("/auth/activate-account", {
        email,
      });

      toast.success("OTP sent again");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to resend OTP");
    }
  };

  return (
    <div
      className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-white
    p-6
    "
    >
      <div
        className="
      w-full
      max-w-md
      "
      >
        <p className="text-sm text-indigo-600 mb-3">
          First-time login · Step 1 of 3
        </p>

        <h1
          className="
        text-3xl
        font-semibold
        text-zinc-800
        "
        >
          Verify your email
        </h1>

        <p
          className="
        text-slate-500
        mt-3
        "
        >
          We sent a 6-digit code to
          <br />
          <span
            className="
          font-medium
          text-slate-700
          "
          >
            {email}
          </span>
        </p>

        <form onSubmit={verifyOTP}>
          <div
            className="
          flex
          gap-3
          justify-center
          mt-8
          "
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="
              w-12
              h-12
              border
              rounded-lg
              text-center
              text-xl
              font-semibold
              outline-none
              focus:ring-2
              focus:ring-indigo-500
              "
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
          w-full
          mt-8
          py-3
          bg-indigo-600
          text-white
          rounded-lg
          "
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>
        </form>

        <p
          className="
        text-center
        mt-6
        text-sm
        text-slate-500
        "
        >
          Didn't get it?
          <button
            onClick={resendOTP}
            className="
          text-indigo-600
          ml-1
          "
          >
            Resend code
          </button>
        </p>

        <Link
          to="/login"
          className="
        flex
        justify-center
        items-center
        gap-2
        mt-8
        text-slate-500
        text-sm
        "
        >
          <ArrowLeftIcon size={16} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default VerifyActivateOTP;
