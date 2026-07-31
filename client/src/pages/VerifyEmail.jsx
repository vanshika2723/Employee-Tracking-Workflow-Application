import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "a.kapoor@company.com";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      toast.success("Email verified");

      navigate("/create-password", {
        state: { email },
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid code");
    }
  };

  const inputRefs = React.useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md">
        <p className="text-sm text-indigo-600 mb-5">
          First-time login · Step 1 of 3
        </p>

        <h1 className="text-3xl font-semibold text-zinc-800">
          Verify your email
        </h1>

        <p className="text-slate-500 mt-3 mb-8">
          We sent a 6-digit code to
          <br />
          <span className="font-medium text-slate-700">{email}</span>
        </p>

        <form onSubmit={handleVerify}>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="
w-12 h-12
border
rounded-lg
text-center
text-xl
font-semibold
"
              />
            ))}
          </div>

          <button className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg">
            Verify code
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-500">
          Didn't get it?
          <button className="text-indigo-600 ml-1">Resend code</button>
        </div>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 mt-8 text-slate-500 text-sm"
        >
          <ArrowLeftIcon size={16} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
