import React, { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  Activity,
  Keyboard,
  MousePointer2,
  LockKeyhole,
  Monitor,
  Globe,
  Clock3,
  CircleCheck,
  Coffee,
  BarChart3,
  Target,
  TrendingUp
} from "lucide-react";

const formatTime = (seconds = 0) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};

const formatMinutes = (minutes = 0) => {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }

  return `${mins}m`;
};

const MyActivity = () => {
  const [activity, setActivity] = useState(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  // ================= FETCH ACTIVITY =================

  const fetchActivity = async () => {
    try {
      const res = await api.get("/activity/today");

      const data = res.data?.data || res.data;

      setActivity(data);

      if (data?.loginTime) {
        const login = new Date(data.loginTime);
        const now = new Date();

        const seconds = Math.max(
          0,
          Math.floor((now - login) / 1000)
        );

        setSessionSeconds(seconds);
      }
    } catch (error) {
      console.error("My Activity Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchActivity();

    const interval = setInterval(() => {
      fetchActivity();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ================= LIVE TIMER =================

  useEffect(() => {
    if (!activity?.loginTime || activity?.logoutTime) return;

    const timer = setInterval(() => {
      const login = new Date(activity.loginTime);
      const now = new Date();

      const seconds = Math.max(
        0,
        Math.floor((now - login) / 1000)
      );

      setSessionSeconds(seconds);
    }, 1000);

    return () => clearInterval(timer);
  }, [activity?.loginTime, activity?.logoutTime]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-3xl border p-10 text-center">
          <p className="text-gray-500">
            Loading your activity...
          </p>
        </div>
      </div>
    );
  }

  const isActive =
    activity?.status === "ACTIVE" ||
    activity?.isActive !== false;

  const keyboardActive =
    activity?.keyboardActivity !== false;

  const mouseActive =
    activity?.mouseActivity !== false;

  const screenLocked =
    activity?.screenLocked === true;

  const productiveTime =
    activity?.productiveTime || 0;

  const idleTime =
    activity?.idleTime || 0;

  const breakTime =
    activity?.breakTime || 0;

  const productivity =
    activity?.productivity || 0;

  return (
    // <div className="p-6 md:p-8">

    //   {/* ================= HEADER ================= */}

    //   <div className="mb-8">

    //     <h1 className="text-3xl font-bold text-gray-900">
    //       My Activity
    //     </h1>

    //     <p className="text-gray-500 mt-1">
    //       Monitor your live work activity and session status
    //     </p>

    //   </div>


    //   {/* ================= LIVE STATUS ================= */}

    //   <div className="bg-white rounded-3xl shadow-sm border p-6 mb-6">

    //     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

    //       <div className="flex items-center gap-4">

    //         <div
    //           className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
    //             isActive
    //               ? "bg-green-100 text-green-600"
    //               : "bg-gray-100 text-gray-500"
    //           }`}
    //         >
    //           <Activity size={28} />
    //         </div>

    //         <div>

    //           <div className="flex items-center gap-2">

    //             <span
    //               className={`w-3 h-3 rounded-full ${
    //                 isActive
    //                   ? "bg-green-500"
    //                   : "bg-gray-400"
    //               }`}
    //             />

    //             <h2 className="text-xl font-bold">
    //               {isActive ? "Active" : "Offline"}
    //             </h2>

    //           </div>

    //           <p className="text-gray-500 text-sm mt-1">
    //             {isActive
    //               ? `You're online and being tracked since ${
    //                   activity?.loginTime
    //                     ? new Date(
    //                         activity.loginTime
    //                       ).toLocaleTimeString([], {
    //                         hour: "2-digit",
    //                         minute: "2-digit"
    //                       })
    //                     : "--"
    //                 }`
    //               : "Your session is currently inactive"}
    //           </p>

    //         </div>

    //       </div>


    //       {/* Session Timer */}

    //       <div className="text-left md:text-right">

    //         <p className="text-4xl font-bold text-indigo-600 tracking-wide">
    //           {formatTime(sessionSeconds)}
    //         </p>

    //         <p className="text-sm text-gray-500">
    //           Live Session Timer
    //         </p>

    //       </div>

    //     </div>

    //   </div>


    //   {/* ================= ACTIVITY GRID ================= */}

    //   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">


    //     {/* Keyboard */}

    //     <div className="bg-white rounded-3xl shadow-sm border p-6">

    //       <div className="flex items-center gap-4">

    //         <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
    //           <Keyboard size={24} />
    //         </div>

    //         <div>

    //           <h3 className="font-bold text-lg">
    //             Keyboard Activity
    //           </h3>

    //           <p className="text-green-600 text-sm font-medium mt-1">
    //             ● {keyboardActive ? "Active" : "Inactive"} —{" "}
    //             {keyboardActive
    //               ? "typing detected"
    //               : "no typing detected"}
    //           </p>

    //         </div>

    //       </div>

    //       <p className="text-gray-500 text-sm mt-5">
    //         Last keystroke:{" "}
    //         <span className="font-medium text-gray-700">
    //           {keyboardActive ? "just now" : "not detected"}
    //         </span>
    //       </p>

    //     </div>


    //     {/* Mouse */}

    //     <div className="bg-white rounded-3xl shadow-sm border p-6">

    //       <div className="flex items-center gap-4">

    //         <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
    //           <MousePointer2 size={24} />
    //         </div>

    //         <div>

    //           <h3 className="font-bold text-lg">
    //             Mouse Activity
    //           </h3>

    //           <p className="text-green-600 text-sm font-medium mt-1">
    //             ● {mouseActive ? "Active" : "Inactive"} —{" "}
    //             {mouseActive
    //               ? "movement detected"
    //               : "no movement detected"}
    //           </p>

    //         </div>

    //       </div>

    //       <p className="text-gray-500 text-sm mt-5">
    //         Last move:{" "}
    //         <span className="font-medium text-gray-700">
    //           {mouseActive ? "just now" : "not detected"}
    //         </span>
    //       </p>

    //     </div>


    //     {/* Screen Lock */}

    //     <div className="bg-white rounded-3xl shadow-sm border p-6">

    //       <div className="flex items-center gap-4">

    //         <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
    //           <LockKeyhole size={24} />
    //         </div>

    //         <div>

    //           <h3 className="font-bold text-lg">
    //             Screen Lock Status
    //           </h3>

    //           <p
    //             className={`text-sm font-medium mt-1 ${
    //               screenLocked
    //                 ? "text-red-600"
    //                 : "text-green-600"
    //             }`}
    //           >
    //             ● {screenLocked ? "Locked" : "Unlocked"}
    //           </p>

    //         </div>

    //       </div>

    //       <p className="text-gray-500 text-sm mt-5">
    //         {screenLocked
    //           ? "Screen is currently locked"
    //           : "Screen has been unlocked all session"}
    //       </p>

    //     </div>


    //     {/* Application Usage */}

    //     <div className="bg-white rounded-3xl shadow-sm border p-6">

    //       <div className="flex items-center gap-4">

    //         <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
    //           <Monitor size={24} />
    //         </div>

    //         <div>

    //           <h3 className="font-bold text-lg">
    //             Application Usage
    //           </h3>

    //           <p className="text-gray-700 font-semibold mt-1">
    //             {activity?.applicationUsage ||
    //               "VS Code — 2h 10m"}
    //           </p>

    //         </div>

    //       </div>

    //       <p className="text-gray-500 text-sm mt-5">
    //         Top app today
    //       </p>

    //       <p className="text-xs text-gray-400 mt-2">
    //         Optional feature — can be enabled by admin
    //       </p>

    //     </div>


    //     {/* Browser Activity */}

    //     <div className="bg-white rounded-3xl shadow-sm border p-6">

    //       <div className="flex items-center gap-4">

    //         <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
    //           <Globe size={24} />
    //         </div>

    //         <div>

    //           <h3 className="font-bold text-lg">
    //             Browser Activity
    //           </h3>

    //           <p className="text-gray-700 font-semibold mt-1">
    //             {activity?.browserActivity ||
    //               "Chrome — 1h 05m"}
    //           </p>

    //         </div>

    //       </div>

    //       <p className="text-gray-500 text-sm mt-5">
    //         github.com, docs.google.com
    //       </p>

    //       <p className="text-xs text-gray-400 mt-2">
    //         Optional feature — can be enabled by admin
    //       </p>

    //     </div>


    //     {/* Idle Detection */}

    //     <div className="bg-white rounded-3xl shadow-sm border p-6">

    //       <div className="flex items-center gap-4">

    //         <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
    //           <Clock3 size={24} />
    //         </div>

    //         <div>

    //           <h3 className="font-bold text-lg">
    //             Idle Detection
    //           </h3>

    //           <p className="text-gray-600 text-sm mt-1">
    //             Idle after 5 min inactivity
    //           </p>

    //         </div>

    //       </div>

    //       <div className="mt-5 flex justify-between items-center">

    //         <span className="text-gray-500 text-sm">
    //           Total idle today
    //         </span>

    //         <span className="font-bold text-orange-600">
    //           {formatMinutes(idleTime)}
    //         </span>

    //       </div>

    //     </div>

    //   </div>


    //   {/* ================= TODAY SUMMARY ================= */}

    //   <div className="bg-white rounded-3xl shadow-sm border p-6 mt-6">

    //     <h2 className="text-xl font-bold mb-6">
    //       Today's Activity Summary
    //     </h2>

    //     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    //       <div className="bg-indigo-50 rounded-2xl p-5">

    //         <p className="text-gray-500 text-sm">
    //           Active Time
    //         </p>

    //         <p className="text-2xl font-bold text-indigo-600 mt-2">
    //           {formatMinutes(activity?.activeTime || 0)}
    //         </p>

    //       </div>


    //       <div className="bg-green-50 rounded-2xl p-5">

    //         <p className="text-gray-500 text-sm">
    //           Productive Time
    //         </p>

    //         <p className="text-2xl font-bold text-green-600 mt-2">
    //           {formatMinutes(productiveTime)}
    //         </p>

    //       </div>


    //       <div className="bg-orange-50 rounded-2xl p-5">

    //         <p className="text-gray-500 text-sm">
    //           Break Time
    //         </p>

    //         <p className="text-2xl font-bold text-orange-600 mt-2">
    //           {formatMinutes(breakTime)}
    //         </p>

    //       </div>


    //       <div className="bg-purple-50 rounded-2xl p-5">

    //         <p className="text-gray-500 text-sm">
    //           Productivity
    //         </p>

    //         <p className="text-2xl font-bold text-purple-600 mt-2">
    //           {productivity}%
    //         </p>

    //       </div>

    //     </div>

    //   </div>

    // </div>

    
<div className="min-h-screen bg-[#f6f7fb] p-4 md:p-6">

  {/* =========================================================
      HEADER
  ========================================================= */}

  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">

    <div>

      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center">
          <Activity size={22} className="text-indigo-600" />
        </div>

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            My Activity
          </h1>

          <p className="text-sm text-slate-500 mt-0.5">
            Monitor your live work activity and session status
          </p>

        </div>

      </div>

    </div>


    {/* LIVE BADGE */}

    <div
      className={`
        self-start md:self-auto
        inline-flex items-center gap-2
        px-3 py-2 rounded-xl
        border text-xs font-semibold
        ${
          isActive
            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
            : "bg-slate-50 border-slate-200 text-slate-500"
        }
      `}
    >

      <span
        className={`
          w-2 h-2 rounded-full
          ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}
        `}
      />

      {isActive ? "Live Tracking" : "Offline"}

    </div>

  </div>


  {/* =========================================================
      LIVE SESSION
  ========================================================= */}

  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">

    <div className="p-5 md:p-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* STATUS */}

        <div className="flex items-center gap-4">

          <div
            className={`
              w-14 h-14 rounded-2xl
              flex items-center justify-center
              ${
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }
            `}
          >
            <Activity size={26} />
          </div>


          <div>

            <div className="flex items-center gap-2">

              <span
                className={`
                  w-2.5 h-2.5 rounded-full
                  ${
                    isActive
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-slate-400"
                  }
                `}
              />

              <h2 className="text-lg font-bold text-slate-800">
                {isActive ? "You're Active" : "You're Offline"}
              </h2>

            </div>


            <p className="text-sm text-slate-500 mt-1">

              {isActive
                ? `Session started at ${
                    activity?.loginTime
                      ? new Date(
                          activity.loginTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--"
                  }`
                : "Your session is currently inactive"}

            </p>

          </div>

        </div>


        {/* TIMER */}

        <div className="flex items-center gap-4 lg:text-right">

          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center">
            <Clock3 size={19} className="text-indigo-600" />
          </div>

          <div>

            <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Live Session
            </p>

            <p className="text-3xl md:text-4xl font-bold tracking-tight text-indigo-600 mt-0.5">
              {formatTime(sessionSeconds)}
            </p>

          </div>

        </div>

      </div>

    </div>


    {/* SESSION FOOTER */}

    <div className="border-t border-slate-100 bg-slate-50/70 px-5 md:px-6 py-3">

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">

        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Real-time tracking
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          Activity monitoring enabled
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Session timer running
        </div>

      </div>

    </div>

  </div>


  {/* =========================================================
      ACTIVITY MONITORING
  ========================================================= */}

  <div className="flex items-center justify-between mb-4">

    <div>

      <h2 className="text-lg font-bold text-slate-800">
        Activity Monitoring
      </h2>

      <p className="text-xs text-slate-400 mt-1">
        Real-time activity detected during your session
      </p>

    </div>

  </div>


  {/* =========================================================
      ACTIVITY GRID
  ========================================================= */}

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">


    {/* KEYBOARD */}

    <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Keyboard size={21} />
          </div>

          <div>

            <h3 className="text-sm font-bold text-slate-800">
              Keyboard Activity
            </h3>

            <div
              className={`
                flex items-center gap-1.5
                text-xs font-medium mt-1
                ${
                  keyboardActive
                    ? "text-emerald-600"
                    : "text-slate-400"
                }
              `}
            >

              <span
                className={`
                  w-1.5 h-1.5 rounded-full
                  ${
                    keyboardActive
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-slate-300"
                  }
                `}
              />

              {keyboardActive ? "Active" : "Inactive"}

            </div>

          </div>

        </div>

        <Keyboard
          size={16}
          className="text-slate-300 group-hover:text-indigo-400 transition"
        />

      </div>


      <div className="mt-5 pt-4 border-t border-slate-100">

        <p className="text-xs text-slate-400">
          Last keystroke
        </p>

        <p className="text-sm font-semibold text-slate-700 mt-1">
          {keyboardActive
            ? "Just now"
            : "Not detected"}
        </p>

      </div>

    </div>


    {/* MOUSE */}

    <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MousePointer2 size={21} />
          </div>

          <div>

            <h3 className="text-sm font-bold text-slate-800">
              Mouse Activity
            </h3>

            <div
              className={`
                flex items-center gap-1.5
                text-xs font-medium mt-1
                ${
                  mouseActive
                    ? "text-emerald-600"
                    : "text-slate-400"
                }
              `}
            >

              <span
                className={`
                  w-1.5 h-1.5 rounded-full
                  ${
                    mouseActive
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-slate-300"
                  }
                `}
              />

              {mouseActive ? "Active" : "Inactive"}

            </div>

          </div>

        </div>

        <MousePointer2
          size={16}
          className="text-slate-300 group-hover:text-blue-400 transition"
        />

      </div>


      <div className="mt-5 pt-4 border-t border-slate-100">

        <p className="text-xs text-slate-400">
          Last movement
        </p>

        <p className="text-sm font-semibold text-slate-700 mt-1">
          {mouseActive
            ? "Just now"
            : "Not detected"}
        </p>

      </div>

    </div>


    {/* SCREEN LOCK */}

    <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div
            className={`
              w-11 h-11 rounded-xl flex items-center justify-center
              ${
                screenLocked
                  ? "bg-red-50 text-red-600"
                  : "bg-violet-50 text-violet-600"
              }
            `}
          >
            <LockKeyhole size={21} />
          </div>

          <div>

            <h3 className="text-sm font-bold text-slate-800">
              Screen Lock
            </h3>

            <div
              className={`
                flex items-center gap-1.5 text-xs font-medium mt-1
                ${
                  screenLocked
                    ? "text-red-600"
                    : "text-emerald-600"
                }
              `}
            >

              <span
                className={`
                  w-1.5 h-1.5 rounded-full
                  ${
                    screenLocked
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  }
                `}
              />

              {screenLocked
                ? "Locked"
                : "Unlocked"}

            </div>

          </div>

        </div>

        <LockKeyhole
          size={16}
          className="text-slate-300"
        />

      </div>


      <div className="mt-5 pt-4 border-t border-slate-100">

        <p className="text-xs text-slate-400">
          Current status
        </p>

        <p className="text-sm font-semibold text-slate-700 mt-1">
          {screenLocked
            ? "Screen is currently locked"
            : "Screen is unlocked"}

        </p>

      </div>

    </div>


    {/* APPLICATION */}

    <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Monitor size={21} />
          </div>

          <div>

            <h3 className="text-sm font-bold text-slate-800">
              Application Usage
            </h3>

            <p className="text-xs font-semibold text-slate-600 mt-1">
              {activity?.applicationUsage ||
                "VS Code — 2h 10m"}
            </p>

          </div>

        </div>

        <Monitor
          size={16}
          className="text-slate-300"
        />

      </div>


      <div className="mt-5 pt-4 border-t border-slate-100">

        <p className="text-xs text-slate-400">
          Top application today
        </p>

        <div className="flex items-center gap-2 mt-2">

          <span className="px-2 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-semibold">
            Application
          </span>

          <span className="text-[10px] text-slate-400">
            Optional feature
          </span>

        </div>

      </div>

    </div>


    {/* BROWSER */}

    <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Globe size={21} />
          </div>

          <div>

            <h3 className="text-sm font-bold text-slate-800">
              Browser Activity
            </h3>

            <p className="text-xs font-semibold text-slate-600 mt-1">
              {activity?.browserActivity ||
                "Chrome — 1h 05m"}
            </p>

          </div>

        </div>

        <Globe
          size={16}
          className="text-slate-300"
        />

      </div>


      <div className="mt-5 pt-4 border-t border-slate-100">

        <p className="text-xs text-slate-400">
          Frequently visited
        </p>

        <p className="text-xs font-medium text-slate-600 mt-2 truncate">
          github.com, docs.google.com
        </p>

        <p className="text-[10px] text-slate-400 mt-1">
          Optional feature
        </p>

      </div>

    </div>


    {/* IDLE */}

    <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock3 size={21} />
          </div>

          <div>

            <h3 className="text-sm font-bold text-slate-800">
              Idle Detection
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Idle after 5 min inactivity
            </p>

          </div>

        </div>

        <Clock3
          size={16}
          className="text-slate-300"
        />

      </div>


      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">

        <span className="text-xs text-slate-400">
          Total idle today
        </span>

        <span className="text-sm font-bold text-orange-600">
          {formatMinutes(idleTime)}
        </span>

      </div>

    </div>

  </div>


  {/* =========================================================
      TODAY SUMMARY
  ========================================================= */}

  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6 mt-6">

    <div className="flex items-center justify-between mb-5">

      <div>

        <h2 className="text-lg font-bold text-slate-800">
          Today's Activity Summary
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Overview of your work session
        </p>

      </div>

      <div className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-50 items-center justify-center">
        <BarChart3 size={18} className="text-slate-500" />
      </div>

    </div>


    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


      {/* ACTIVE */}

      <div className="relative overflow-hidden bg-indigo-50 border border-indigo-100 rounded-2xl p-5">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-xs font-medium text-slate-500">
              Active Time
            </p>

            <p className="text-2xl font-bold text-indigo-600 mt-2">
              {formatMinutes(
                activity?.activeTime || 0
              )}
            </p>

          </div>

          <Activity
            size={18}
            className="text-indigo-500"
          />

        </div>

        <div className="h-1 bg-indigo-100 rounded-full mt-4 overflow-hidden">

          <div className="h-full w-3/4 bg-indigo-500 rounded-full" />

        </div>

      </div>


      {/* PRODUCTIVE */}

      <div className="relative overflow-hidden bg-emerald-50 border border-emerald-100 rounded-2xl p-5">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-xs font-medium text-slate-500">
              Productive Time
            </p>

            <p className="text-2xl font-bold text-emerald-600 mt-2">
              {formatMinutes(productiveTime)}
            </p>

          </div>

          <Target
            size={18}
            className="text-emerald-500"
          />

        </div>

        <div className="h-1 bg-emerald-100 rounded-full mt-4 overflow-hidden">

          <div className="h-full w-4/5 bg-emerald-500 rounded-full" />

        </div>

      </div>


      {/* BREAK */}

      <div className="relative overflow-hidden bg-orange-50 border border-orange-100 rounded-2xl p-5">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-xs font-medium text-slate-500">
              Break Time
            </p>

            <p className="text-2xl font-bold text-orange-600 mt-2">
              {formatMinutes(breakTime)}
            </p>

          </div>

          <Coffee
            size={18}
            className="text-orange-500"
          />

        </div>

        <div className="h-1 bg-orange-100 rounded-full mt-4 overflow-hidden">

          <div className="h-full w-1/3 bg-orange-500 rounded-full" />

        </div>

      </div>


      {/* PRODUCTIVITY */}

      <div className="relative overflow-hidden bg-violet-50 border border-violet-100 rounded-2xl p-5">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-xs font-medium text-slate-500">
              Productivity
            </p>

            <p className="text-2xl font-bold text-violet-600 mt-2">
              {productivity}%
            </p>

          </div>

          <TrendingUp
            size={18}
            className="text-violet-500"
          />

        </div>

        <div className="h-1 bg-violet-100 rounded-full mt-4 overflow-hidden">

          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                productivity || 0,
                100
              )}%`,
            }}
          />

        </div>

      </div>

    </div>

  </div>

</div>


  );
};

export default MyActivity;