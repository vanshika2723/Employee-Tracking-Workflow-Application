

import React, { useState } from "react";
import LoginLeftSide from "./LoginLeftSide";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, EyeOffIcon, EyeIcon, Loader2Icon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginForm = ({ role, title, subtitle }) => {
  const isAdmin = role?.toUpperCase() === "ADMIN";

  const [identity, setIdentity] = useState("");
  const [loginType, setLoginType] = useState("employeeId");

  const [rememberMe, setRememberMe] = useState(false);

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(identity, password, role);

      if (user?.firstLogin) {
        navigate("/activate-account");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-10"
          >
            <ArrowLeftIcon size={16} />
            Back to portals
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-800">
              {title}
            </h1>

            <p className="text-slate-500 mt-2">{subtitle}</p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMPLOYEE ONLY TOGGLE */}

            {!isAdmin && (
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLoginType("employeeId")}
                  className={`w-1/2 py-2 rounded-md text-sm ${
                    loginType === "employeeId"
                      ? "bg-white shadow text-indigo-600"
                      : "text-slate-500"
                  }`}
                >
                  Employee ID
                </button>

                <button
                  type="button"
                  onClick={() => setLoginType("email")}
                  className={`w-1/2 py-2 rounded-md text-sm ${
                    loginType === "email"
                      ? "bg-white shadow text-indigo-600"
                      : "text-slate-500"
                  }`}
                >
                  Email
                </button>
              </div>
            )}

            {/* EMAIL / ID FIELD */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {isAdmin
                  ? "Admin Email"
                  : loginType === "employeeId"
                    ? "Employee ID"
                    : "Official Email"}
              </label>

              <input
                type={
                  isAdmin ? "email" : loginType === "email" ? "email" : "text"
                }
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                required
                placeholder={
                  isAdmin
                    ? "Enter admin email"
                    : loginType === "employeeId"
                      ? "e.g. EMP-1042"
                      : "Enter official email"
                }
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border rounded-lg pr-12 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOffIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* OPTIONS */}

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-slate-600 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4"
                />

                <span>Keep me signed in</span>
              </label>

              <Link
                to={isAdmin ? "/forgot-password" : "/forgot-password"}
                className="text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-600 text-white flex justify-center items-center"
            >
              {loading && (
                <Loader2Icon className="animate-spin mr-2" size={18} />
              )}
              Sign in
            </button>
          </form>

          {/* EMPLOYEE ONLY ACTIVATE ACCOUNT */}

          {!isAdmin && (
            <p className="text-center text-sm text-slate-500 mt-6">
              First time here?
              <Link
                to="/verify-activate-otp"
                className="text-indigo-600 ml-1 font-medium"
              >
                Activate your account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
