import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const CreatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/create-password", {
        email,
        password,
      });

      toast.success("Account activated successfully");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Password creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <p className="text-sm text-indigo-600 mb-2">
          First-time login · Step 2 of 3
        </p>

        <h1 className="text-3xl font-semibold">Create password</h1>

        <p className="text-slate-500 mt-2 mb-8">
          Set your password to activate your account
        </p>

        <form onSubmit={submitPassword}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <button
            disabled={loading}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg flex justify-center"
          >
            {loading && <Loader2Icon className="animate-spin mr-2" />}
            Create Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
