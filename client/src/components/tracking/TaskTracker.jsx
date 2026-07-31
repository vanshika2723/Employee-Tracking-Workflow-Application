import { useEffect, useState } from "react";
import api from "../../api/axios";

const TaskTracker = ({ setCurrentTask }) => {
  const [taskName, setTaskName] = useState("");
  const [currentTask, setTask] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);

  // ===============================
  // LOAD CURRENT TASK
  // ===============================
  const loadCurrentTask = async () => {
    try {
      const res = await api.get("/task/current");

      const task = res.data || null;

      setTask(task);

      if (setCurrentTask) {
        setCurrentTask(task);
      }

      // Initial duration
      if (task) {
        setElapsed(task.duration || 0);
      } else {
        setElapsed(0);
      }
    } catch (err) {
      console.log(
        "CURRENT TASK ERROR:",
        err.response?.data || err.message
      );

      setTask(null);

      if (setCurrentTask) {
        setCurrentTask(null);
      }
    }
  };

  // ===============================
  // INITIAL LOAD
  // ===============================
  useEffect(() => {
    loadCurrentTask();
  }, []);

  // ===============================
  // TASK TIMER
  // ===============================
  useEffect(() => {
    if (!currentTask) {
      setElapsed(0);
      return;
    }

    // PAUSED TASK
    if (currentTask.status === "PAUSED") {
      setElapsed(currentTask.duration || 0);
      return;
    }

    // RUNNING TASK
    const updateTimer = () => {
      const duration = currentTask.duration || 0;

      const startTime = currentTask.startTime
        ? new Date(currentTask.startTime).getTime()
        : Date.now();

      const runningSeconds = Math.floor(
        (Date.now() - startTime) / 1000
      );

      setElapsed(duration + Math.max(runningSeconds, 0));
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentTask]);

  // ===============================
  // FORMAT TIME
  // ===============================
  const formatTime = (seconds = 0) => {
    const hrs = String(
      Math.floor(seconds / 3600)
    ).padStart(2, "0");

    const mins = String(
      Math.floor((seconds % 3600) / 60)
    ).padStart(2, "0");

    const secs = String(
      seconds % 60
    ).padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  };

  // ===============================
  // START TASK
  // ===============================
  const startTask = async () => {
    if (!taskName.trim()) {
      alert("Please enter task name");
      return;
    }

    try {
      setLoading(true);

      await api.post("/task/start", {
        taskName: taskName.trim(),
      });

      setTaskName("");

      await loadCurrentTask();
    } catch (err) {
      console.log(
        "START TASK ERROR:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.error ||
          "Unable to start task"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // PAUSE TASK
  // ===============================
  const pauseTask = async () => {
    try {
      setLoading(true);

      await api.post("/task/stop");

      await loadCurrentTask();
    } catch (err) {
      console.log(
        "PAUSE TASK ERROR:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.error ||
          "Unable to pause task"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RESUME TASK
  // ===============================
  const resumeTask = async () => {
    try {
      setLoading(true);

      await api.post("/task/resume");

      await loadCurrentTask();
    } catch (err) {
      console.log(
        "RESUME TASK ERROR:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.error ||
          "Unable to resume task"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
  
<div
  id="task-tracker"
  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 scroll-mt-24"
>
  {/* ================= HEADER ================= */}
  <div className="flex items-center justify-between mb-5">

    <div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">
        Task Duration Tracking
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Track the time spent on your current task
      </p>
    </div>

    {currentTask && (
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
          currentTask.status === "RUNNING"
            ? "bg-green-50 text-green-600"
            : "bg-orange-50 text-orange-600"
        }`}
      >
        ●{" "}
        {currentTask.status === "RUNNING"
          ? "Running"
          : "Paused"}
      </span>
    )}

  </div>


  {/* ================= START NEW TASK ================= */}
  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4">

    <p className="text-xs font-semibold text-slate-500 mb-2">
      Start New Task
    </p>

    <div className="flex gap-2">

      <input
        type="text"
        placeholder="e.g. Homepage redesign"
        value={taskName}
        onChange={(e) =>
          setTaskName(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            startTask();
          }
        }}
        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 h-11 text-sm flex-1 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={startTask}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 h-11 rounded-xl text-sm font-semibold transition disabled:opacity-50"
      >
        {loading ? "Starting..." : "Start Task"}
      </button>

    </div>

  </div>


  {/* ================= CURRENT TASK ================= */}
  {currentTask ? (

    <div className="mt-5 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl overflow-hidden">

      {/* Task Header */}
      <div className="bg-indigo-50 dark:bg-indigo-950/30 px-5 py-4">

        <div className="flex items-center justify-between gap-4">

          <div className="min-w-0">

            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              Current Task
            </p>

            <p className="text-lg font-bold text-slate-800 dark:text-white mt-1 truncate">
              {currentTask.taskName}
            </p>

          </div>

          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 shadow-sm">
            ⏱
          </div>

        </div>

      </div>


      {/* Timer */}
      <div className="p-5">

        <p className="text-xs font-medium text-slate-500">
          Task Duration
        </p>

        <h1 className="text-4xl font-bold tracking-wider text-indigo-600 mt-1">
          {formatTime(elapsed)}
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          {currentTask.status === "RUNNING"
            ? "Timer is currently running"
            : "Timer is currently paused"}
        </p>


        {/* ================= ACTIONS ================= */}
        <div className="flex gap-3 mt-5">

          {currentTask.status === "RUNNING" ? (

            <button
              onClick={pauseTask}
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 h-10 rounded-xl text-sm font-semibold transition disabled:opacity-50"
            >
              {loading
                ? "Pausing..."
                : "⏸ Pause Task"}
            </button>

          ) : (

            <button
              onClick={resumeTask}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 h-10 rounded-xl text-sm font-semibold transition disabled:opacity-50"
            >
              {loading
                ? "Resuming..."
                : "▶ Resume Task"}
            </button>

          )}


          {/* CHANGE TASK */}
          <button
            onClick={() => {
              document
                .querySelector(
                  "#task-tracker input"
                )
                ?.focus();
            }}
            className="flex-1 border border-indigo-200 dark:border-indigo-800 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 px-4 h-10 rounded-xl text-sm font-semibold transition"
          >
            Change Task
          </button>

        </div>

      </div>

    </div>

  ) : (

    /* ================= EMPTY STATE ================= */
    <div className="mt-5 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl py-8 text-center">

      <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 text-xl">
        ✓
      </div>

      <p className="font-semibold text-slate-700 dark:text-white mt-3">
        No Active Task
      </p>

      <p className="text-xs text-slate-500 mt-1">
        Start a task above to begin tracking time
      </p>

    </div>

  )}

</div>


  );
};

export default TaskTracker;