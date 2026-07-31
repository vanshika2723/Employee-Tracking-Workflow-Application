import React, { useState } from "react";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const ActivateAccount = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/activate-account", {
        email,
      });

      toast.success("Verification code sent");

      navigate("/verify-activate-otp", {
        state: { email },
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <Link
          to="/login"
          className="flex items-center gap-2 text-slate-500 mb-8"
        >
          <ArrowLeftIcon size={16} />
          Back to sign in
        </Link>

        <p className="text-sm text-indigo-600 mb-2">
          First-time login · Step 1 of 3
        </p>

        <h1 className="text-3xl font-semibold text-zinc-800">
          Verify your email
        </h1>

        <p className="text-slate-500 mt-2 mb-8">
          We'll send a 6-digit verification code.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-2">
            Official email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            disabled={loading}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg flex justify-center items-center"
          >
            {loading && <Loader2Icon className="animate-spin mr-2" size={18} />}
            Send verification code
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActivateAccount;
