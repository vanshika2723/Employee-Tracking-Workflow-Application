import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await api.post(`/auth/reset-password/${token}`, {
        newPassword: password,
      });

      toast.success("Password reset successful");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleReset} className="w-full max-w-md">
        <h1 className="text-3xl font-semibold">Create new password</h1>

        <input
          type="password"
          placeholder="New password"
          className="border p-3 w-full mt-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="border p-3 w-full mt-3"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="bg-indigo-600 text-white w-full mt-5 p-3 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
}
