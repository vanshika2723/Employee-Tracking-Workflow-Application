import React, { useEffect, useState } from "react";
import api from "../api/axios";

const IdleMonitoring = () => {
  const [minutes, setMinutes] = useState(4);
  const [pauseTimer, setPauseTimer] = useState(true);
  const [autoReport, setAutoReport] = useState(false);
  const [notifyEmployee, setNotifyEmployee] = useState(true);
  const [exceptions, setExceptions] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [adjustment, setAdjustment] = useState({
    employee: "",
    date: "",
    duration: "",
    reason: "",
  });

  // GET CONFIG

  const getConfiguration = async () => {
    try {
      const res = await api.get("/idle/config");

      if (res.data.data) {
        setMinutes(res.data.data.idleMinutes);
        setPauseTimer(res.data.data.pauseTimer);
        setAutoReport(res.data.data.autoReport);
        setNotifyEmployee(res.data.data.notifyEmployee);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // GET REPORT

  const getReport = async () => {
    try {
      const res = await api.get("/idle/report");

      console.log("IDLE REPORT RESPONSE:", res.data);

      setSessions(res.data.data || []);

      setExceptions(res.data.exceptions || []);
    } catch (err) {
      console.log("REPORT ERROR:", err);
    }
  };

  useEffect(() => {
    getConfiguration();

    getReport();
  }, []);

  // SAVE CONFIG

  const saveConfiguration = async () => {
    try {
      setLoading(true);

      await api.post("/idle/config", {
        idleMinutes: Number(minutes),
        pauseTimer,
        autoReport,
        notifyEmployee,
      });

      alert("Idle Configuration Saved");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const applyAdjustment = async () => {
    try {
      await api.post("/idle/adjust", {
        employeeId: adjustment.employee,

        duration: adjustment.duration,

        reason: adjustment.reason,
      });

      alert("Adjustment Applied");

      getReport();
    } catch (err) {
      console.log(err);
    }
  };

  // APPROVE

const approveIdle = async (id) => {
  try {

    console.log("APPROVE CLICK ID:", id);

    const res = await api.put(`/idle/approve/${id}`);

    console.log("APPROVE RESPONSE:", res.data);

    await getReport();

  } catch (err) {

    console.log(
      "APPROVE ERROR:",
      err.response?.data || err.message
    );

  }
};

  // EXCLUDE

const excludeIdle=async(id,reason)=>{

try{

await api.put(
`/idle/exclude/${id}`,
{
reason,
approvedBy:"Admin"
}
);


getReport();


}
catch(err){

console.log(err);

}

};

  return (
  <div className="min-h-screen bg-slate-100 p-6">

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT CARD */}

      <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

   <h1 className="text-xl font-bold text-slate-900">
          Idle Threshold Configuration
        </h1>

        <p className="text-sm text-slate-500 mt-1 mb-5">
          System marks an employee idle after this many minutes of no keyboard/mouse activity
        </p>

        {/* Slider */}
<div className="border rounded-2xl bg-slate-50 p-5 mb-6">

          <div className="flex items-center gap-4">

           <span className="text-xl">
⌚
</span>

            <input
              type="range"
              min={1}
              max={15}
              value={minutes}
              onChange={(e)=>setMinutes(e.target.value)}
              className="w-full accent-indigo-600"
            />

           <span className="text-xl font-bold text-indigo-600 w-16 text-right">
              {minutes} min
            </span>

          </div>

        </div>

        {/* Pause */}
<div className="flex items-center justify-between py-5 border-b border-slate-200">

          <div>

            <h3 className="font-semibold">
              Pause productive timer on idle
            </h3>

            <p className="text-gray-500 text-sm">
              Active time stops counting once idle is detected
            </p>

          </div>

          <input
            type="checkbox"
            checked={pauseTimer}
            onChange={(e)=>setPauseTimer(e.target.checked)}
            className="h-5 w-5 accent-indigo-600"
          />

        </div>

        {/* Auto Report */}

       <div className="flex items-center justify-between py-5 border-b border-slate-200">

          <div>

            <h3 className="font-semibold">
              Auto-generate idle report
            </h3>

            <p className="text-gray-500 text-sm">
              Daily idle report emailed to admin
            </p>

          </div>

          <input
            type="checkbox"
            checked={autoReport}
            onChange={(e)=>setAutoReport(e.target.checked)}
            className="h-5 w-5 accent-indigo-600"
          />

        </div>

        {/* Notify */}

     <div className="flex items-center justify-between py-5 border-b border-slate-200">

          <div>

            <h3 className="font-semibold">
              Notify employee when marked idle
            </h3>

            <p className="text-gray-500 text-sm">
              Shows an on-screen alert
            </p>

          </div>

          <input
            type="checkbox"
            checked={notifyEmployee}
            onChange={(e)=>setNotifyEmployee(e.target.checked)}
            className="h-5 w-5 accent-indigo-600"
          />

        </div>

        <button
          onClick={saveConfiguration}
        className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-3 rounded-xl shadow-sm"
        >
          {loading ? "Saving..." : "Save Configuration"}
        </button>

      </div>

      {/* RIGHT CARD */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

       

  <h2 className="text-lg font-bold text-slate-900 mb-6">
    Manual Adjustment
  </h2>

  {/* Employee */}
  <div className="mb-4">
    <label className="block text-xs font-medium text-slate-500 mb-2">
      Employee
    </label>

    <select
      value={adjustment.employee}
      onChange={(e) =>
        setAdjustment({
          ...adjustment,
          employee: e.target.value,
        })
      }
      className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">Select Employee</option>

      {sessions.map((item) => (
        <option
          key={item.employeeId?._id}
          value={item.employeeId?._id}
        >
          {item.employeeId?.firstName} {item.employeeId?.lastName}
        </option>
      ))}
    </select>
  </div>

  {/* Date + Duration */}
  <div className="grid grid-cols-2 gap-4 mb-4">

    <div>
      <label className="block text-xs font-medium text-slate-500 mb-2">
        Date
      </label>

      <input
        type="date"
        value={adjustment.date}
        onChange={(e) =>
          setAdjustment({
            ...adjustment,
            date: e.target.value,
          })
        }
        className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label className="block text-xs font-medium text-slate-500 mb-2">
        Idle Duration to Adjust
      </label>

      <input
        placeholder="e.g. 12 min"
        value={adjustment.duration}
        onChange={(e) =>
          setAdjustment({
            ...adjustment,
            duration: e.target.value,
          })
        }
        className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

  </div>

  {/* Reason */}
  <div className="mb-6">
    <label className="block text-xs font-medium text-slate-500 mb-2">
      Reason for Adjustment
    </label>

    <input
      type="text"
      placeholder="e.g. System glitch, approved client call"
      value={adjustment.reason}
      onChange={(e) =>
        setAdjustment({
          ...adjustment,
          reason: e.target.value,
        })
      }
      className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Button */}
  <button
    onClick={applyAdjustment}
    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 h-11 rounded-xl transition"
  >
    Apply Adjustment
  </button>




</div>
      </div>

      {/* REPORT */}

     <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
  {/* Header */}
  <div className="px-5 py-4 flex items-center justify-between">
    <h2 className="text-base font-bold text-slate-900">
      Idle Sessions Report
    </h2>

    <select className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100">
      <option>Today — 28 July 2026</option>
      <option>Yesterday</option>
      <option>This Week</option>
    </select>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-y border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
          <th className="px-5 py-3 text-left font-semibold">
            Employee
          </th>

          <th className="px-5 py-3 text-left font-semibold">
            Idle Start
          </th>

          <th className="px-5 py-3 text-left font-semibold">
            Duration
          </th>

          <th className="px-5 py-3 text-left font-semibold">
            Reason
          </th>

          <th className="px-5 py-3 text-left font-semibold">
            Status
          </th>

          <th className="px-5 py-3 text-left font-semibold">
            Action
          </th>
        </tr>
      </thead>

      <tbody>
        {sessions.map((item) => (
          <tr
            key={item._id}
            className="border-b border-slate-100 hover:bg-slate-50 transition"
          >
            {/* Employee */}
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                  {item.employeeId?.firstName?.charAt(0)}
                  {item.employeeId?.lastName?.charAt(0)}
                </div>

                <span className="text-sm font-medium text-slate-800">
                  {item.employeeId?.firstName}{" "}
                  {item.employeeId?.lastName}
                </span>
              </div>
            </td>

            {/* Idle Start */}
            <td className="px-5 py-3 text-xs text-slate-700">
              {new Date(item.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </td>

            {/* Duration */}
            <td className="px-5 py-3 text-xs text-slate-700">
              {item.durationMinutes} min
            </td>

            {/* Reason */}
            <td className="px-5 py-3 text-xs text-slate-700">
              {item.reason || "—"}
            </td>

            {/* Status */}
            <td className="px-5 py-3">
              {item.excluded ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Excluded
                </span>
              ) : item.approved ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-500 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                  Pending
                </span>
              )}
            </td>

            {/* Action */}
            <td className="px-5 py-3">
              {item.approved || item.excluded ? (
                <span className="text-xs text-slate-400">
                  Reviewed
                </span>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => approveIdle(item._id)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    Approve
                  </button>

                  <span className="text-slate-300">•</span>

                  <button
                    onClick={() => {
                      const reason = prompt(
                        "Enter exclusion reason"
                      );

                      if (reason) {
                        excludeIdle(item._id, reason);
                      }
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    Exclude
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      {/* APPROVED EXCEPTIONS */}

     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 overflow-hidden">
  {/* Header */}
 <div className="px-5 py-4 flex items-center justify-between">
  <div>
    <h2 className="text-base font-bold text-slate-900">
      Approved Exceptions
    </h2>
  </div>

  <p className="text-xs text-slate-500">
    Idle sessions excluded from productivity deduction
  </p>
</div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-y border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
          <th className="px-5 py-3 text-left font-semibold">
            Employee
          </th>

          <th className="px-5 py-3 text-left font-semibold">
            Date
          </th>

          <th className="px-5 py-3 text-left font-semibold">
            Duration
          </th>

          <th className="px-5 py-3 text-left font-semibold">
            Reason
          </th>

          <th className="px-5 py-3 text-left font-semibold">
            Approved By
          </th>
        </tr>
      </thead>

      <tbody>
        {exceptions.map((item) => (
          <tr
            key={item._id}
            className="border-b border-slate-100 hover:bg-slate-50 transition"
          >
            {/* Employee */}
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                  {item.employeeId?.firstName?.charAt(0)}
                  {item.employeeId?.lastName?.charAt(0)}
                </div>

                <span className="text-sm font-medium text-slate-800">
                  {item.employeeId?.firstName}{" "}
                  {item.employeeId?.lastName}
                </span>
              </div>
            </td>

            {/* Date */}
            <td className="px-5 py-3 text-xs text-slate-700">
              {new Date(item.startTime).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}
            </td>

            {/* Duration */}
            <td className="px-5 py-3">
              <span className="text-xs font-medium text-slate-700">
                {item.durationMinutes} min
              </span>
            </td>

            {/* Reason */}
            <td className="px-5 py-3 text-xs text-slate-700">
              {item.reason || "—"}
            </td>

            {/* Approved By */}
            <td className="px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[10px] font-bold">
                  {item.approvedBy
                    ? item.approvedBy.charAt(0).toUpperCase()
                    : "A"}
                </div>

                <span className="text-xs font-medium text-slate-700">
                  {item.approvedBy || "Admin"}
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
};

export default IdleMonitoring;
