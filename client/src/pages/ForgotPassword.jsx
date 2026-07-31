import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import {useNavigate} from "react-router-dom";

const ForgotPassword = () => {
const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await api.post(
      "/auth/forgot-password",
      {
        email
      }
    );

    toast.success(res.data.message);

  } catch (error) {

    toast.error(
      error.response?.data?.error || "Failed to send reset link"
    );

  } finally {
    setLoading(false);
  }
};

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">

      <div className="w-full max-w-md">

        <Link
          to="/login"
          className="flex items-center gap-2 text-slate-500 mb-8"
        >
          <ArrowLeftIcon size={16}/>
          Back to sign in
        </Link>


        <h1 className="text-3xl font-semibold text-zinc-800">
          Reset your password
        </h1>

        <p className="text-slate-500 mt-2 mb-8">
          Enter your registered email — we'll send a reset link
        </p>


        <form onSubmit={handleSubmit}>


          <label className="block text-sm font-medium mb-2">
            Official email
          </label>


          <input
            type="email"
            required
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full border rounded-lg p-3"
          />


          <button
            disabled={loading}
            className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg flex justify-center"
          >

          {
            loading &&
            <Loader2Icon className="animate-spin mr-2"/>
          }

          Send reset link

          </button>


        </form>

      </div>

    </div>
  );
};


export default ForgotPassword;