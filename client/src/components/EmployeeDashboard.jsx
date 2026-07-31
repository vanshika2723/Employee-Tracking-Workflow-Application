import {
  ArrowRightIcon,
  CalendarIcon,
  DollarSignIcon,
  FileTextIcon,
  KeyboardIcon,
  MousePointerClickIcon,
  MonitorIcon,
  GlobeIcon,
} from "lucide-react";
import {
  TrendingUpIcon,
  CalendarDaysIcon,
  UsersIcon,
  BarChart3Icon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react";

import React from "react";
import { Link } from "react-router-dom";
import useActivityTracker from "../hooks/useActivityTracker";
import { useEffect, useState } from "react";
import api from "../api/axios";
import WeeklySummary from "../components/dashboard/WeeklySummary";
import TaskTracker from "../components/tracking/TaskTracker";
import Notifications from "../components/dashboard/Notifications";
import DailyReport from "../components/dashboard/DailyReport";
import socket from "../socket/socket";
import MyPayroll from "../components/employee/MyPayroll";
import ThemeToggle from "../components/ThemeToggle";
import ProductivityTrend from "./dashboard/ProductivityTrend";
import TimeDistribution from "../components/dashboard/TimeDistribution";
import NotificationBell from "./notifications/NotificationBell";

const EmployeeDashboard = ({ data }) => {
  const emp = data.employee;
const [notificationCount, setNotificationCount] = useState(0);
  const [activity, setActivity] = useState(null);

const [liveActivity, setLiveActivity] = useState({
  activeTime: 0,
  idleTime: 0,
  breakTime: 0,
});


  const [productivity, setProductivity] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [idleThresholdMinutes, setIdleThresholdMinutes] = useState(5);
  // const [isOnBreak, setIsOnBreak] = useState(false);
  const isOnBreak = Boolean(activity?.isOnBreak);

  useActivityTracker(attendance?.status === "ONLINE");


const formatTime = (seconds = 0) => {
  const totalSeconds = Math.max(0, Math.floor(Number(seconds) || 0));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};


  const formatTaskTime = (duration = 0, startTime, status) => {
  if (status === "PAUSED" || !startTime) {
    return formatClockDuration(duration);
  }

  const liveSeconds =
    duration +
    Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);

  return formatClockDuration(liveSeconds);
};

const handleBreak = async () => {
  try {
    console.log("Break button clicked");
    if (isOnBreak) {
      // END BREAK
      const res = await api.post("/activity/break/end");

      console.log("BREAK ENDED:", res.data);

      setActivity((prev) => ({
        ...prev,
        ...res.data.activity,
        isOnBreak: false,
      }));
    } else {
      // START BREAK
      const res = await api.post("/activity/break/start");

      console.log("BREAK STARTED:", res.data);

      setActivity((prev) => ({
        ...prev,
        ...res.data.activity,
        isOnBreak: true,
      }));
    }
  }catch (err) {
  console.log("BREAK ERROR:", err.response?.data || err);

  const errorMessage = err.response?.data?.error;

  if (errorMessage === "Already on break") {
    // Backend says break is already active.
    // Sync frontend with backend state.
    setActivity((prev) => ({
      ...prev,
      ...(err.response?.data?.activity || {}),
      isOnBreak: true,
    }));

    return;
  }

  if (errorMessage === "No active break") {
    setActivity((prev) => ({
      ...prev,
      ...(err.response?.data?.activity || {}),
      isOnBreak: false,
    }));

    return;
  }

  alert(errorMessage || "Break action failed");
}
};

const formatClockDuration = (seconds = 0) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return `${hrs}:${mins}:${secs}`;
};
  useEffect(() => {
    const fetchDashboard = () => {
      api
        .get("/productivity/dashboard")
        .then((res) => {
          setDashboardStats(res.data);
        })
        .catch(console.error);
    };

    fetchDashboard();

    const interval = setInterval(fetchDashboard, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    api
      .get("/productivity/today")
      .then((res) => {
        console.log("PRODUCTIVITY DATA:", res.data);

        setProductivity(res.data);
      })
      .catch((err) => {
        console.log("PRODUCTIVITY ERROR:", err);
      });
  }, []);

useEffect(() => {
  const fetchActivity = () => {
    api
      .get("/activity/today")
      .then((res) => {
        console.log("TODAY ACTIVITY:", res.data);

        setActivity(res.data);
      })
      .catch((err) => {
        console.log("ACTIVITY ERROR:", err);
      });
  };

  fetchActivity();

  const interval = setInterval(fetchActivity, 30000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if (!activity) return;

  setLiveActivity({
    activeTime: Number(activity.activeTime) || 0,
    idleTime: Number(activity.idleTime) || 0,
    breakTime: Number(activity.breakTime) || 0,
  });
}, [activity]);

useEffect(() => {
  if (!attendance?.loginTime || !activity) return;

  const interval = setInterval(() => {
    setLiveActivity((prev) => {
      // Break par ho to active/idle timer ko increase mat karo
      if (activity.isOnBreak) {
        return {
          ...prev,
          breakTime: prev.breakTime + 1,
        };
      }

      // Idle state mein idle timer chalega
      if (activity.idleStatus === "IDLE") {
        return {
          ...prev,
          idleTime: prev.idleTime + 1,
        };
      }

      // Normal active state mein active timer chalega
      return {
        ...prev,
        activeTime: prev.activeTime + 1,
      };
    });
  }, 1000);

  return () => clearInterval(interval);
}, [
  activity?.isOnBreak,
  activity?.idleStatus,
  attendance?.loginTime,
]);


  useEffect(() => {
    api
      .get("/attendance/status")

      .then((res) => {
        console.log("ATTENDANCE STATUS:", res.data);

        setAttendance(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
  const fetchNotificationCount = async () => {
    try {
      const res = await api.get("/notifications");

      const notifications = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      const unreadCount = notifications.filter(
        (notification) => !notification.isRead
      ).length;

      setNotificationCount(unreadCount);
    } catch (err) {
      console.log("NOTIFICATION COUNT ERROR:", err);
    }
  };

  fetchNotificationCount();

  const interval = setInterval(fetchNotificationCount, 30000);

  return () => clearInterval(interval);
}, []);
useEffect(() => {
  if (!emp?._id) return;

  socket.emit("joinEmployeeRoom", emp._id);

  const handleActivityUpdate = (data) => {
    console.log("SOCKET ACTIVITY UPDATE:", data);

    setActivity((prev) => ({
      ...prev,
      activeTime: data.activeTime ?? prev?.activeTime ?? 0,
      idleTime: data.idleTime ?? prev?.idleTime ?? 0,
      breakTime: data.breakTime ?? prev?.breakTime ?? 0,
      isOnBreak: data.isOnBreak ?? prev?.isOnBreak ?? false,
      productivity: data.productivity ?? prev?.productivity ?? 0,
      keyboardActivity:
        data.keyboardActivity ?? prev?.keyboardActivity ?? 0,
      mouseActivity:
        data.mouseActivity ?? prev?.mouseActivity ?? 0,
      screenLocked:
        data.screenLocked ?? prev?.screenLocked ?? false,
      browserActivity:
        data.browserActivity ?? prev?.browserActivity ?? "",
      idleStatus:
        data.idleStatus ?? prev?.idleStatus ?? "ACTIVE",
      currentTab:
        data.currentTab ?? prev?.currentTab ?? "",
    }));
  };

  socket.on("employeeActivityUpdate", handleActivityUpdate);

  return () => {
    socket.off("employeeActivityUpdate", handleActivityUpdate);
  };
}, [emp?._id]);
useEffect(() => {
  const fetchIdlePolicy = async () => {
    try {
      const res = await api.get("/policy");

      setIdleThresholdMinutes(
        Number(res.data?.allowedIdleTime) || 5
      );

    } catch (error) {
      console.error(
        "Idle policy fetch error:",
        error.response?.data || error.message
      );
    }
  };

  fetchIdlePolicy();
}, []);
  
const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(true);



useEffect(() => {

  const fetchTasks = async () => {

    try {

      const res = await api.get("/tasks/my-tasks");

      console.log("TASK API RESPONSE:", res.data);

      setTasks(res.data);

    } catch(error){

      console.log("TASK ERROR:", error.response?.data || error.message);

    }

  };


  fetchTasks();

},[]);
  const cards = [
 {
  title: "Current Status",
  icon: MonitorIcon,
  emoji: "📶",

  value:
    isOnBreak
      ? "On Break"
      : attendance?.status?.toUpperCase() === "ONLINE" ||
        attendance?.status?.toUpperCase() === "PRESENT"
      ? "Online"
      : "Offline",

  sub:
    isOnBreak
      ? "☕ Break in progress"
      : attendance?.status?.toUpperCase() === "ONLINE" ||
        attendance?.status?.toUpperCase() === "PRESENT"
      ? "🟢 Tracking is active"
      : "🔴 Tracking stopped",
},

  {
    title: "Login Time",
    icon: CalendarDaysIcon,
    emoji: "🕐",
    value: attendance?.loginTime
      ? new Date(attendance.loginTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--",

    sub: "Today",
  },

  {
    title: "Logout Time",
    icon: ClockIcon,
    emoji: "🚪",
    value: attendance?.logoutTime
      ? new Date(attendance.logoutTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",

    sub: attendance?.logoutTime ? "Completed" : "Still working",
  },

  {
    title: "Live Working Time",
    icon: KeyboardIcon,
    emoji: "⏳",
    value: formatTime(activity?.activeTime),

    sub: "🟣 Tracking in progress",
  },

  {
    title: "Productivity",
    icon: TrendingUpIcon,
    emoji: "📈",
    value: `${activity?.productivity || 0}%`,

    sub:
      (activity?.productivity || 0) >= 80
        ? "Excellent ↗"
        : (activity?.productivity || 0) >= 60
        ? "Good"
        : "Need Improvement",
  },

  {
    title: "Today's Attendance",
    icon: CalendarIcon,
    emoji: "🗓️",
    value:
      attendance?.status?.toUpperCase() === "ABSENT"
        ? "Absent"
        : "Present",

    sub:
      attendance?.loginTime
        ? "Working Day ✓"
        : "Attendance not marked",
  },
];
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            👋 Welcome Back, {emp?.firstName}
          </h1>

          <p className="text-slate-500 mt-1">
            {emp?.position} • {emp?.department}
          </p>
        </div>

       
<div className="flex items-center gap-5">

  {/* DATE */}
  <div className="flex items-center gap-2">
    <span className="text-xl">📅</span>

    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
      {new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}
    </span>
  </div>

  {/* TIME */}
  <div className="flex items-center gap-2">
    <span className="text-xl">🕐</span>

    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
      {new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}
    </span>
  </div>

 
<NotificationBell />

  {/* PROFILE */}
  <div className="flex items-center gap-3">

    <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
      {`${emp?.firstName?.[0] || ""}${emp?.lastName?.[0] || ""}`.toUpperCase()}
    </div>

    <div>
      <p className="text-sm font-bold text-slate-800 dark:text-white">
        {emp?.firstName} {emp?.lastName}
      </p>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {emp?.position || "Employee"}
      </p>
    </div>

  </div>

</div>


      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-8">
       {cards.map((card, index) => (
  <div
    key={index}
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition"
  >
    <p className="text-sm font-medium text-slate-500 mb-4">
      {card.title}
    </p>

    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
        <span className="text-3xl">{card.emoji}</span>
      </div>

      <div>
       <div>
  <h3 className="text-2xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-white">
    {card.value}
  </h3>

  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
    {card.sub}
  </p>
</div>
      </div>
    </div>
  </div>
))}
      </div>

     

<div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">

  {/* ================= LEFT SIDE ================= */}
  <div className="xl:col-span-8">

   <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-lg p-6 pb-10 min-h-[950px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Today's Overview
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your work activity summary for today
          </p>
        </div>

        <button
          onClick={handleBreak}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition ${
            isOnBreak
              ? "bg-red-500 hover:bg-red-600"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isOnBreak ? "▶ End Break" : "☕ Take a Break"}
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Active */}
        <div className="rounded-2xl bg-emerald-50 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              ⏱️
            </div>

            <div>
              <p className="text-sm text-slate-500">Active Time</p>
              <h3 className="text-2xl font-bold">
                {formatTime(liveActivity.activeTime)}
              </h3>
            </div>
          </div>
        </div>

        {/* Idle */}
        <div className="rounded-2xl bg-orange-50 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              💤
            </div>

            <div>
              <p className="text-sm text-slate-500">Idle Time</p>
              <h3 className="text-2xl font-bold">
                {formatTime(liveActivity.idleTime)}
              </h3>
            </div>
          </div>
        </div>

        {/* Break */}
        <div className="rounded-2xl bg-violet-50 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              ☕
            </div>

            <div>
              <p className="text-sm text-slate-500">Break Time</p>
              <h3 className="text-2xl font-bold">
                {formatTime(liveActivity.breakTime)}
              </h3>
            </div>
          </div>
        </div>

        {/* Work */}
        <div className="rounded-2xl bg-indigo-50 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              💼
            </div>

            <div>
              <p className="text-sm text-slate-500">Work Hours</p>
              <h3 className="text-2xl font-bold">
          {      formatTime(
  liveActivity.activeTime +
  liveActivity.idleTime +
  liveActivity.breakTime
)}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* Productivity Chart */}
      <div className="mt-8">
        <ProductivityTrend />
      </div>

    </div>

  </div>

  {/* ================= RIGHT SIDE ================= */}
  <div className="xl:col-span-4">

    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-lg p-6 h-full">

     

    {/* Header */}
    <div className="flex items-center justify-between mb-4">

      <h2 className="text-base font-bold text-slate-800 dark:text-white">
        Current Activity
      </h2>

      <span
className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
  isOnBreak
    ? "bg-yellow-100 text-yellow-600"
    : "bg-green-50 text-green-600"
}`}
>
{
  isOnBreak
    ? "☕ On Break"
    : "🟢 Active"
}
</span>

    </div>


    {/* Keyboard */}
    <div className="flex items-center justify-between py-2">

      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <span className="text-sm">⌨️</span>
        </div>

        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Keyboard Activity
        </span>

      </div>
<span
className={`text-xs font-semibold ${
  isOnBreak
  ? "text-yellow-500"
  : "text-green-500"
}`}
>
{
isOnBreak
? "⏸ Paused"
: "● Active"
}
</span>
    </div>


    {/* Mouse */}
    <div className="flex items-center justify-between py-2">

      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <span className="text-sm">🖱️</span>
        </div>

        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Mouse Activity
        </span>

      </div>
<span
className={`text-xs font-semibold ${
  isOnBreak
  ? "text-yellow-500"
  : "text-green-500"
}`}
>
{
isOnBreak
? "⏸ Paused"
: "● Active"
}
</span>

    </div>


    {/* Screen */}
    <div className="flex items-center justify-between py-2">

      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
          <span className="text-sm">🖥️</span>
        </div>

        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Screen Status
        </span>

      </div>

     <span
className={`text-xs font-semibold ${
  isOnBreak
  ? "text-yellow-500"
  : "text-green-500"
}`}
>
{
isOnBreak
? "⏸ Paused"
: "● Active"
}
</span>

    </div>


    {/* Current Task */}
    <div className="flex items-center justify-between py-2">

      <div className="flex items-center gap-3 min-w-0">

        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
          <span className="text-sm">📝</span>
        </div>

        <div className="min-w-0">

          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Current Task
            <span className="text-slate-400 font-normal">
              {" "}— {currentTask?.taskName || "No active task"}
            </span>
          </p>

        </div>

      </div>

      {currentTask && (
        <span className="text-[11px] font-semibold text-indigo-500 ml-2">
          {formatTaskTime(
            currentTask.duration,
            currentTask.startTime,
            currentTask.status
          )}
        </span>
      )}

    </div>


    {/* Switch Task */}
    <div className="flex items-center justify-between py-2">

      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
          <span className="text-sm">🔁</span>
        </div>

        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Switch Task
        </span>

      </div>

     <button
  onClick={() => {
    document
      .getElementById("task-tracker")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

    setTimeout(() => {
      document
        .querySelector("#task-tracker input")
        ?.focus();
    }, 500);
  }}
  className="text-[11px] font-medium text-indigo-500 hover:text-indigo-700"
>
  Change current task
</button>

    </div>


    {/* Application */}
    <div className="flex items-center justify-between py-2">

      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
          <span className="text-sm">🧩</span>
        </div>

        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Application
        </span>

      </div>

      <div className="flex gap-1">

        <span className="w-6 h-6 rounded-md bg-red-400 text-white text-[10px] font-bold flex items-center justify-center">
          F
        </span>

        <span className="w-6 h-6 rounded-md bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
          G
        </span>

        <span className="w-6 h-6 rounded-md bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
          X
        </span>

        <span className="w-7 h-6 rounded-md bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center">
          +3
        </span>

      </div>

    </div>


    {/* ================= IDLE SESSION ================= */}

    <div className="mt-3 pt-2">

      <div className="flex items-center justify-between">

        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
          Idle Session Log
        </h3>

        <span className="text-[10px] text-slate-400">
          Threshold: 4 min (demo)
        </span>

      </div>

      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
        {activity?.idleTime > 0
          ? `Idle time today: ${formatTime(activity.idleTime)}`
          : "No idle sessions yet today. Stop moving your mouse for 4 min to see this in action."}
      </p>

    </div>


    {/* ================= NOTIFICATIONS ================= */}

  
    <Notifications />


  

  </div>

    </div>


  

</div>

{/* My Tasks */}
<div className="rounded-2xl bg-white dark:bg-slate-900 shadow-lg p-6">


<h2 className="text-xl font-bold text-slate-800 dark:text-white">
 My Tasks
</h2>

<p className="text-sm text-slate-500 mt-1">
 Workflows assigned to you by your admin/manager
</p>



<div className="mt-5 space-y-4">


{
loading ?

(
<p className="text-sm text-slate-400">
Loading tasks...
</p>
)

:

tasks.map((task)=>(
<div
key={task._id}
className="border rounded-xl p-4 dark:border-slate-700"
>


<div className="flex justify-between">


<div>

<h3 className="font-semibold text-slate-800 dark:text-white">
{task.title}
</h3>


<p className="text-sm text-slate-500 mt-1">

Assigned by {task.assignedBy?.name}

 · Due {task.dueDate}

</p>


</div>



<span
className={`text-xs px-3 py-1 rounded-full

${
task.status==="Done"
?
"bg-green-100 text-green-600"
:
task.status==="In Progress"
?
"bg-blue-100 text-blue-600"
:
"bg-yellow-100 text-yellow-600"
}

`}
>

{task.status}

</span>


</div>


<div className="mt-2">

<span className="text-xs text-slate-500">
Priority:
</span>

<span className="ml-2 text-xs font-semibold">
{task.priority}
</span>

</div>


</div>

))

}


</div>


</div>
<br/>
      {/* Idle Time Monitoring */}

 <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">

  {/* =====================================================
      LEFT SIDE - IDLE MONITORING
  ===================================================== */}

  <div className="xl:col-span-7">

    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 p-6 h-full">

      {/* Header */}

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">

          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ClockIcon size={20} />
          </div>

          Idle Time Monitoring

        </h2>


        {/* Live indicator */}

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">

          <span
            className={`w-2 h-2 rounded-full ${
              activity?.idleStatus === "IDLE"
                ? "bg-red-500 animate-pulse"
                : "bg-green-500"
            }`}
          />

          <span className="text-xs font-semibold text-slate-600">

            {activity?.idleStatus === "IDLE"
              ? "Idle Detected"
              : "Monitoring"}

          </span>

        </div>

      </div>


      {/* =================================================
          MONITORING CARDS
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


        {/* =================================================
            CURRENT STATUS
        ================================================= */}

        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">

          <p className="text-sm text-slate-500">
            Current Status
          </p>


          <h3 className="text-2xl font-bold mt-2">

            {activity?.idleStatus === "IDLE" ? (

              <span className="text-red-500 flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />

                Idle

              </span>

            ) : (

              <span className="text-green-600 flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-green-500" />

                Active

              </span>

            )}

          </h3>


          <p className="text-sm text-slate-500 mt-2">

            {activity?.idleStatus === "IDLE"
              ? "Productive timer paused"
              : "Tracking employee activity"}

          </p>

        </div>


        {/* =================================================
            IDLE DURATION
        ================================================= */}

        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">

          <p className="text-sm text-slate-500">
            Today's Idle Duration
          </p>


          <h3 className="text-3xl font-bold text-red-500 mt-2">

            {formatTime(activity?.idleTime || 0)}

          </h3>


          <div className="flex items-center justify-between mt-2">

            <p className="text-xs text-slate-500">
              Allowed threshold
            </p>

            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">

              {idleThresholdMinutes} min

            </span>

          </div>

        </div>


        {/* =================================================
            MONITORING RULES
        ================================================= */}

        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">

          <p className="text-sm text-slate-500 mb-3">
            Monitoring Rules
          </p>


          <div className="space-y-2.5 text-sm">


            {/* Mouse */}

            <div className="flex items-center gap-2">

              <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[11px]">
                ✓
              </span>

              <span className="text-slate-700">
                Mouse Tracking
              </span>

            </div>


            {/* Keyboard */}

            <div className="flex items-center gap-2">

              <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[11px]">
                ✓
              </span>

              <span className="text-slate-700">
                Keyboard Tracking
              </span>

            </div>


            {/* Timer */}

            <div className="flex items-center gap-2">

              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                  activity?.idleStatus === "IDLE"
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
              >

                {activity?.idleStatus === "IDLE"
                  ? "Ⅱ"
                  : "▶"}

              </span>


              <span className="text-slate-700">

                {activity?.idleStatus === "IDLE"
                  ? "Productive Timer Paused"
                  : "Productive Timer Running"}

              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          IDLE PROGRESS
      ================================================= */}

      <div className="mt-6">

        <div className="flex items-center justify-between mb-2">

          <div>

            <p className="text-sm font-semibold text-slate-700">
              Idle Threshold Usage
            </p>

            <p className="text-xs text-slate-400 mt-0.5">
              Based on today's current idle duration
            </p>

          </div>


          <span className="text-sm font-bold text-slate-700">

            {Math.min(
              Math.round(
                ((activity?.idleTime || 0) /
                  (idleThresholdMinutes * 60)) *
                  100
              ),
              100
            )}%

          </span>

        </div>


        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

          <div
            className={`h-full rounded-full transition-all duration-500 ${
              activity?.idleStatus === "IDLE"
                ? "bg-red-500"
                : "bg-indigo-500"
            }`}
            style={{
              width: `${Math.min(
                ((activity?.idleTime || 0) /
                  (idleThresholdMinutes * 60)) *
                  100,
                100
              )}%`,
            }}
          />

        </div>

      </div>

    </div>

  </div>


  {/* =====================================================
      RIGHT SIDE - TASK TRACKER
  ===================================================== */}

  <div className="xl:col-span-5">

    <div
      id="task-tracker"
      className="h-full"
    >

      <TaskTracker
        setCurrentTask={setCurrentTask}
      />

    </div>

  </div>














</div>
     <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

  {/* Weekly Summary */}
  <div className="
    rounded-3xl
    bg-white
    dark:bg-slate-900
    shadow-lg
    border
    border-slate-200
    dark:border-slate-800
    p-6
    hover:shadow-xl
    transition
  ">
    <WeeklySummary />
  </div>


  {/* Time Distribution */}
  <div className="
    rounded-3xl
    bg-white
    dark:bg-slate-900
    shadow-lg
    border
    border-slate-200
    dark:border-slate-800
    p-6
    hover:shadow-xl
    transition
  ">
    <TimeDistribution activity={activity} />
  </div>

</div>
    <div className="w-full col-span-full mb-4 max-h-[350px] overflow-hidden">
  <DailyReport />
</div>
      {/* <div className="mb-8">
  <MyPayroll />
</div> */}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/attendance"
          className="btn-primary text-center inline-flex items-center justify-center gap-2"
        >
          Mark Attendance <ArrowRightIcon className="w-4 h-4" />
        </Link>

        <Link to="/leave" className="btn-secondary text-center ">
          Apply for Leave
        </Link>
      </div>
      <br/>

      <div className="card p-5 mb-8">
        <div className="flex justify-between mb-2">
          <span className="font-medium">
            Daily Goal: Maintain 80% Productivity
          </span>

          <span className="font-bold text-indigo-600">
            {activity?.productivity || 0}%
          </span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-indigo-600 h-3 rounded-full"
            style={{
              width: `${activity?.productivity || 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default EmployeeDashboard;
