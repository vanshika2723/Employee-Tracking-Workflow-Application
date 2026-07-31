import React, { useEffect, useState } from "react";
import {
  Clock,
  Coffee,
  Lock,
  Monitor,
  Timer,
  Activity,
  LogIn,
  LogOut,
} from "lucide-react";
import TaskTracker from "../components/tracking/TaskTracker";
import api from "../api/axios";
import socket from "../socket/socket";

const WorkflowTracking = () => {
  const [activity, setActivity] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentTask,setCurrentTask] = useState(null);
  const [seconds,setSeconds] = useState(0);
const [breakRunning,setBreakRunning] = useState(false);
  
const [taskName,setTaskName] = useState("");
  const [idleThreshold, setIdleThreshold] = useState(5);
  const formatTime = (seconds = 0) => {
    const h = Math.floor(seconds / 3600);

    const m = Math.floor((seconds % 3600) / 60);

    const s = seconds % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  const fetchCurrentTask = async()=>{

try{

const res = await api.get("/task/current");

setCurrentTask(res.data);

}
catch(err){

console.log(err);

}

};
useEffect(()=>{

let timer;

if(tracking && !breakRunning){

timer=setInterval(()=>{

setActivity(prev=>({

...prev,

activeTime:(prev?.activeTime || 0)+1,

workingHours:(prev?.workingHours || 0)+1

}));

},1000);


}


return ()=>clearInterval(timer);


},[tracking,breakRunning]);

useEffect(()=>{

fetchCurrentTask();

},[]);
const startTask = async()=>{

if(!taskName) return;


try{

await api.post("/task/start",{

taskName

});


setTaskName("");

fetchCurrentTask();


}
catch(err){

console.log(err);

}

};

  const loadActivity = async () => {
    try {
      const res = await api.get("/activity/today");

      setActivity(res.data);

      if (res.data.loginTime && !res.data.logoutTime) {
        setTracking(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateIdleThreshold = async (value) => {
    setIdleThreshold(value);

    try {
      await api.put("/policy", {
        allowedIdleTime: Number(value),
      });
    } catch (err) {
      console.log("Update Policy Error:", err);
    }
  };
  useEffect(()=>{

let timer;


if(breakRunning){

timer=setInterval(()=>{


setActivity(prev=>({

...prev,

breakTime:(prev?.breakTime ||0)+1


}))


},1000)

}


return ()=>clearInterval(timer);


},[breakRunning])

  useEffect(() => {
    loadActivity();
  }, []);
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await api.get("/policy");

        setIdleThreshold(res.data.data.allowedIdleTime);
      } catch (err) {
        console.log("Policy Error:", err);
      }
    };

    fetchPolicy();
  }, []);

  useEffect(() => {
    socket.on("employeeActivityUpdate", (data) => {
      setActivity((prev) => ({
        ...prev,

        activeTime: data.activeTime,

        idleTime: data.idleTime,
      }));

      setLogs((prev) => [
        `${new Date().toLocaleTimeString()} Activity Updated`,

        ...prev,
      ]);
    });

    return () => {
      socket.off("employeeActivityUpdate");
    };
  }, []);

  const startTracking = async () => {
    await api.post("/activity/start");

    setLogs((prev) => ["Tracking Started", ...prev]);

    setTracking(true);

    loadActivity();
  };

 const stopTracking = async () => {

try{

await api.post("/activity/logout");

setTracking(false);

setLogs((prev)=>[
"Tracking Stopped",
...prev
]);

loadActivity();

}
catch(err){

console.log(err);

}

};
  const cards = [
    {
      title: "Active time",
      value: formatTime(activity?.activeTime),
      icon: Timer,
    },

    {
      title: "Idle time",
      value: formatTime(activity?.idleTime),
      icon: Clock,
    },

    {
      title: "Break time",
      value: formatTime(activity?.breakTime),
      icon: Coffee,
    },

    {
      title: "Working hours",
      value: formatTime(activity?.workingHours),
      icon: Activity,
    },

    {
      title: "System lock duration",
      value: formatTime(activity?.systemLockDuration),
      icon: Lock,
    },

    {
      title: "Screen inactivity",
      value: formatTime(activity?.screenInactiveTime),
      icon: Monitor,
    },
 {
  title: "Current Task",
  value: currentTask
    ? `${currentTask.taskName} (${new Date(
        currentTask.startTime
      ).toLocaleTimeString()})`
    : "No task running",
  icon: Activity,
},

    {
      title: "Daily Productivity",
      value: `${activity?.productivity || 0}%`,
      icon: Activity,
    },
  ];

  return (
    <div className="p-6 space-y-6">
     <div className="bg-white rounded-3xl shadow-sm border p-8">
  <div className="flex justify-between items-center mb-8">
    <div>
     

      <h1 className="text-4xl font-bold text-slate-900">
        Workflow Tracking
      </h1>
    </div>

    <div
      className={`flex items-center gap-2 px-5 py-3 rounded-full border
      ${
        tracking
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      <span
        className={`w-3 h-3 rounded-full ${
          tracking ? "bg-green-500" : "bg-gray-400"
        }`}
      ></span>

      <span className="font-semibold">
        {tracking ? "Tracking" : "Not tracking"}
      </span>
    </div>
  </div>

  <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

    {/* Productivity Circle */}

    <div className="flex items-center gap-8">

      <div className="relative w-36 h-36">

        <svg className="rotate-[-90deg]" width="144" height="144">

          <circle
            cx="72"
            cy="72"
            r="60"
            stroke="#E5E7EB"
            strokeWidth="10"
            fill="none"
          />

          <circle
            cx="72"
            cy="72"
            r="60"
            stroke="#0F766E"
            strokeWidth="10"
            fill="none"
            strokeDasharray={377}
            strokeDashoffset={
              377 - (377 * (activity?.productivity || 0)) / 100
            }
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col justify-center items-center">

          <h2 className="text-3xl font-bold">
            {activity?.productivity || 0}%
          </h2>

          <p className="text-xs text-slate-500 uppercase">
            Productive
          </p>

        </div>

      </div>

      <div>

        <h2 className="text-3xl font-bold">

          {tracking ? "Tracking Active" : "Not clocked in"}

        </h2>

        <p className="text-slate-500 mt-2">

          Login :

          {activity?.loginTime
            ? new Date(activity.loginTime).toLocaleTimeString()
            : " — "}

          &nbsp;&nbsp;•&nbsp;&nbsp;

          Threshold : {idleThreshold}s

        </p>

      </div>

    </div>

    {/* Buttons */}

    <div className="flex gap-4">

      <button
        onClick={startTracking}
        disabled={tracking}
        className="bg-teal-700 hover:bg-teal-800 disabled:bg-gray-200 disabled:text-gray-400 text-white px-8 py-3 rounded-xl font-semibold"
      >
        Clock in
      </button>

      <button
        disabled={!tracking}
        onClick={() => setBreakRunning(!breakRunning)}
        className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 px-8 py-3 rounded-xl font-semibold"
      >
        {breakRunning ? "End break" : "Start break"}
      </button>

      <button
        disabled={!tracking}
        onClick={stopTracking}
        className="bg-red-50 text-red-400 hover:bg-red-100 disabled:opacity-50 px-8 py-3 rounded-xl font-semibold"
      >
        Clock out
      </button>

    </div>

  </div>
</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={index} className="card p-5">
              <Icon className="text-indigo-600 mb-3" />

              <p className="text-sm text-slate-500">{item.title}</p>

              <h2 className="text-2xl font-bold">{item.value}</h2>
            </div>
          );
        })}
      </div>

      <TaskTracker 
 setCurrentTask={setCurrentTask}
/>

      <div className="card p-6 mt-6">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="text-indigo-600" size={22} />

          <h2 className="text-lg font-semibold">Idle detection settings</h2>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          Recommended 3–5 min in production; demo uses seconds. Lock/inactivity
          uses tab visibility as a stand-in for OS-level signals.
        </p>

        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Idle threshold</span>

            <span className="font-bold text-indigo-600">{idleThreshold}s</span>
          </div>

          <p className="text-sm text-slate-500 mb-3">
            No activity for this long marks idle
          </p>

          <input
            type="range"
            min="1"
            max="30"
            value={idleThreshold}
          onChange={(e)=>
 updateIdleThreshold(e.target.value)
}
            className="
      w-full
      h-2
      rounded-lg
      cursor-pointer
      accent-indigo-600
      "
          />

          <div
            className="
      flex
      justify-between
      text-xs
      text-slate-400
      mt-2
    "
          >
            <span>1s</span>

            <span>30s</span>
          </div>
        </div>
      </div>
      <div className="card p-6">
        <h2 className="font-bold mb-4">Activity Log</h2>

        {logs.length === 0 ? (
          <p>No activity yet</p>
        ) : (
          logs.map((log, i) => <p key={i}>{log}</p>)
        )}
      </div>
    </div>
  );
};

export default WorkflowTracking;
