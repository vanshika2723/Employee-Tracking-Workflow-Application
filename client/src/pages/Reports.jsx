import { useEffect, useState } from "react";
import api from "../api/axios";
import ReportExport from "../components/admin/ReportExport";

const Reports = () => {
  const [reportType, setReportType] = useState("login");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);

      let url = "";

      switch (reportType) {
        case "login":
          url = "/reports/login-logout";
          break;
        case "monthly":
          url = "/reports/monthly-performance";

          break;

        case "productivity":
          url = "/reports/productivity";
          break;

        case "idle":
          url = "/reports/idle";
          break;

        case "attendance":
          url = "/reports/attendance-data";
          break;

        case "performance":
          url = "/reports/performance";
          break;

        case "team":
          url = "/reports/team-productivity";
          break;

        case "department":
          url = "/reports/department";
          break;

        case "workflow":
          url = "/reports/workflow";
          break;

        default:
          return;
      }

      console.log("REPORT API:", url);

      const res = await api.get(url);

      console.log("REPORT RESPONSE:", res.data);

      setData(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      console.log("Report Error:", error);

      setData([]);
    } finally {
      setLoading(false);
    }
  };
  const downloadReport = async (type) => {
    try {
      const res = await api.get(`/reports/export/${type}/${reportType}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      if (type === "csv") {
        link.download = `${reportType}.csv`;
      } else if (type === "excel") {
        link.download = `${reportType}.xlsx`;
      } else {
        link.download = `${reportType}.pdf`;
      }

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
  <div className="flex flex-wrap gap-4 items-center justify-between">

    <div>
      <h3 className="text-sm font-bold text-slate-900">
        Report Configuration
      </h3>

      <p className="text-xs text-slate-500 mt-1">
        Select a report type to view employee analytics
      </p>
    </div>

    <div className="flex items-center gap-3">

      <select
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
        className="px-4 py-2.5 rounded-lg border border-slate-200
        bg-white text-sm text-slate-700 outline-none
        focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400
        transition"
      >
        <option value="login">
          Daily Login/Logout Report
        </option>

        <option value="productivity">
          Productivity Report
        </option>

        <option value="idle">
          Idle Time Report
        </option>

        <option value="attendance">
          Attendance Report
        </option>

        <option value="performance">
          Performance Report
        </option>

        <option value="monthly">
          Monthly Performance Summary
        </option>

        <option value="team">
          Team Productivity Comparison
        </option>

        <option value="department">
          Department Analytics
        </option>

        <option value="workflow">
          Workflow Efficiency
        </option>
      </select>

      <button
        onClick={fetchReport}
        className="px-5 py-2.5 bg-indigo-600 text-white
        rounded-lg text-sm font-semibold
        hover:bg-indigo-700 active:scale-[0.98]
        transition shadow-sm"
      >
        Refresh
      </button>

    </div>
  </div>
</div>

      {/* Report Table */}

    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between">

  <div>
    <h2 className="text-base font-bold text-slate-900">
      {
        {
          login: "Daily Login/Logout Report",
          productivity: "Productivity Report",
          idle: "Idle Time Report",
          attendance: "Attendance Report",
          performance: "Performance Report",
          monthly: "Monthly Performance Summary",
          team: "Team Productivity Comparison",
          department: "Department Analytics",
          workflow: "Workflow Efficiency"
        }[reportType]
      }
    </h2>

    <p className="text-xs text-slate-500 mt-1">
      Monitor employee activity and performance
    </p>
  </div>

  <ReportExport reportType={reportType} />

</div>

        {loading ? (
          <p className="text-slate-500">Loading report...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
               <tr className="border-y border-slate-200 text-left">
                  {reportType === "login" && (
                    <>
                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Employee</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Department</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Login</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Logout</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Duration</th>
                    </>
                  )}

                  {reportType === "productivity" && (
                    <>
                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Employee</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Department</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Active Time</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Idle Time</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Productivity %</th>
                    </>
                  )}

                  {reportType === "idle" && (
                    <>
                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Employee</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Department</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Date</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Idle Start</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Idle End</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Idle Time</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Reason</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Status</th>
                    </>
                  )}
                  {reportType === "performance" && (
                    <>
                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Employee</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Department</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Working Hours</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Active Time</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Idle Time</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Attendance %</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Productivity %</th>
                    </>
                  )}
                  {reportType === "attendance" && (
                    <>
                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Employee</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Department</th>

                    <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Date</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Check In</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Check Out</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Status</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Working Hours</th>
                    </>
                  )}
                  {reportType === "team" && (
                    <>
                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Department</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Employees</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Active Time</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Idle Time</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Productivity %</th>
                    </>
                  )}
                  {reportType === "department" && (
                    <>
                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Department</th>
                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Employees</th>
                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Active Time</th>
                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Idle Time</th>
                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Working Hours</th>
                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Productivity %</th>
                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Attendance %</th>
                    </>
                  )}
                  {reportType === "monthly" && (
                    <>
                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Employee</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Department</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Month</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Working Hours</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Attendance %</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Productivity %</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Active Time</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Idle Time</th>
                    </>
                  )}

                  {reportType === "workflow" && (
                    <>
                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Employee</th>

                    <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Department</th>

<th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Total Tasks</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Completed</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Pending</th>

                     <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Completion %</th>

                      <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Avg Time</th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-5 text-center text-slate-500">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  Array.isArray(data) &&
                  data.map((item, index) => (
                   <tr
  key={index}
  className="border-b border-slate-100 hover:bg-slate-50 transition"
>
                      {reportType === "login" && (
                        <>
                          <td className="px-5 py-3">
  <div className="flex items-center gap-3">

    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600
      flex items-center justify-center text-[10px] font-bold">
      {item.employee?.charAt(0)}
    </div>

    <span className="text-sm font-medium text-slate-800">
      {item.employee}
    </span>

  </div>
</td>

                          <td className="px-5 py-3 text-xs text-slate-700">{item.department}</td>

                         <td className="px-5 py-3 text-xs text-slate-700">{item.login}</td>

                          <td className="px-5 py-3 text-xs text-slate-700">{item.logout}</td>

                          <td className="px-5 py-3 text-xs text-slate-700">{item.duration}</td>
                        </>
                      )}

                      {reportType === "productivity" && (
                        <>
                          <td className="px-5 py-3 text-xs text-slate-700">{item.name}</td>

                          <td className="px-5 py-3 text-xs text-slate-700">{item.department}</td>

                          <td className="px-5 py-3 text-xs text-slate-700">{item.activeTime}</td>

                       <td className="px-5 py-3">
  <span className="inline-flex items-center px-2.5 py-1 rounded-full
    bg-red-50 text-red-500 text-xs font-semibold">
    {item.idleTime}
  </span>
</td>

                      <td className="px-5 py-3">
  <span className="inline-flex items-center px-2.5 py-1 rounded-full
    bg-green-50 text-green-600 text-xs font-semibold">
    {item.productivity}%
  </span>
</td>
                        </>
                      )}

                      {reportType === "idle" && (
                        <>
                         <td className="px-5 py-3">
  <div className="flex items-center gap-3">

    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600
      flex items-center justify-center text-[10px] font-bold">
      {item.employee?.charAt(0)}
    </div>

    <span className="text-sm font-medium text-slate-800">
      {item.employee}
    </span>

  </div>
</td>

                          <td className="px-5 py-3 text-xs text-slate-700">{item.department}</td>

                          <td className="px-5 py-3 text-xs text-slate-700">{item.date}</td>

                          <td className="px-5 py-3 text-xs text-slate-700">{item.idleStart}</td>

                         <td className="px-5 py-3 text-xs text-slate-700">{item.idleEnd}</td>

                         <td className="px-5 py-3 text-xs text-slate-700">
                            {item.idleTime}
                          </td>

                          <td className="px-5 py-3 text-xs text-slate-700">{item.reason}</td>
<td className="px-5 py-3">
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1
      rounded-full text-[11px] font-semibold
      ${
        item.status === "Approved"
          ? "bg-green-50 text-green-600"
          : "bg-orange-50 text-orange-500"
      }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full
        ${
          item.status === "Approved"
            ? "bg-green-500"
            : "bg-orange-400"
        }`}
    />

    {item.status}
  </span>
</td>
                        </>
                      )}
                      {reportType === "performance" && (
                        <>
                        <td className="px-5 py-3">
  <div className="flex items-center gap-3">

    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600
      flex items-center justify-center text-[10px] font-bold">
      {item.employee?.charAt(0)}
    </div>

    <span className="text-sm font-medium text-slate-800">
      {item.employee}
    </span>

  </div>
</td>

                         <td className="px-5 py-3 text-xs text-slate-700">{item.department}</td>

                          <td className="px-5 py-3 text-xs text-slate-700">{item.workingHours}</td>

                         <td className="px-5 py-3 text-xs text-slate-700">{item.activeTime}</td>

                          <td className="px-5 py-3">
  <span className="inline-flex items-center px-2.5 py-1 rounded-full
    bg-red-50 text-red-500 text-xs font-semibold">
    {item.idleTime}
  </span>
</td>

                            <td className="px-5 py-3 text-xs text-slate-700">{item.attendance}</td>

                          <td className="px-5 py-3">
  <span className="inline-flex items-center px-2.5 py-1 rounded-full
    bg-green-50 text-green-600 text-xs font-semibold">
    {item.productivity}%
  </span>
</td>
                        </>
                      )}
                      {reportType === "attendance" && (
                        <>
                           <td className="px-5 py-3">
  <div className="flex items-center gap-3">

    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600
      flex items-center justify-center text-[10px] font-bold">
      {item.employee?.charAt(0)}
    </div>

    <span className="text-sm font-medium text-slate-800">
      {item.employee}
    </span>

  </div>
</td>

                            <td className="px-5 py-3 text-xs text-slate-700">{item.department}</td>

                            <td className="px-5 py-3 text-xs text-slate-700">{item.date}</td>

                         <td className="px-5 py-3 text-xs text-slate-700"></td>   <td className="p-3">{item.checkIn}</td>

                            <td className="px-5 py-3 text-xs text-slate-700">{item.checkOut}</td>

                       <td className="px-5 py-3">
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1
      rounded-full text-[11px] font-semibold
      ${
        item.status === "Approved"
          ? "bg-green-50 text-green-600"
          : "bg-orange-50 text-orange-500"
      }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full
        ${
          item.status === "Approved"
            ? "bg-green-500"
            : "bg-orange-400"
        }`}
    />

    {item.status}
  </span>
</td>

                            <td className="px-5 py-3 text-xs text-slate-700">{item.workingHours}</td>
                        </>
                      )}
                      {reportType === "team" && (
                        <>
                           <td className="px-5 py-3 text-xs text-slate-700">{item.department}</td>

                          <td className="px-5 py-3">
  <div className="flex items-center gap-3">

    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600
      flex items-center justify-center text-[10px] font-bold">
      {item.employee?.charAt(0)}
    </div>

    <span className="text-sm font-medium text-slate-800">
      {item.employee}
    </span>

  </div>
</td>

                            <td className="px-5 py-3 text-xs text-slate-700">{item.activeTime} min</td>

                       <td className="px-5 py-3">
  <span className="inline-flex items-center px-2.5 py-1 rounded-full
    bg-red-50 text-red-500 text-xs font-semibold">
    {item.idleTime}
  </span>
</td>

                         <td className="px-5 py-3">
  <span className="inline-flex items-center px-2.5 py-1 rounded-full
    bg-green-50 text-green-600 text-xs font-semibold">
    {item.productivity}%
  </span>
</td>
                        </>
                      )}
                      {reportType === "monthly" && (
                        <>
                           <td className="px-5 py-3">
  <div className="flex items-center gap-3">

    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600
      flex items-center justify-center text-[10px] font-bold">
      {item.employee?.charAt(0)}
    </div>

    <span className="text-sm font-medium text-slate-800">
      {item.employee}
    </span>

  </div>
</td>

                            <td className="px-5 py-3 text-xs text-slate-700">{item.department}</td>

                           <td className="px-5 py-3 text-xs text-slate-700">{item.month}</td>

                           <td className="px-5 py-3 text-xs text-slate-700">{item.workingHours}</td>

                            <td className="px-5 py-3 text-xs text-slate-700">{item.attendance}</td>

                       <td className="px-5 py-3">
  <span className="inline-flex items-center px-2.5 py-1 rounded-full
    bg-green-50 text-green-600 text-xs font-semibold">
    {item.productivity}%
  </span>
</td>

                           <td className="px-5 py-3 text-xs text-slate-700">{item.activeTime}</td>

                         <td className="px-5 py-3">
  <span className="inline-flex items-center px-2.5 py-1 rounded-full
    bg-red-50 text-red-500 text-xs font-semibold">
    {item.idleTime}
  </span>
</td>
                        </>
                      )}
                      {reportType === "department" && (
                        <>
                            <td className="px-5 py-3 text-xs text-slate-700">{item.department}</td>
                          <td className="px-5 py-3">
  <div className="flex items-center gap-3">

    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600
      flex items-center justify-center text-[10px] font-bold">
      {item.employee?.charAt(0)}
    </div>

    <span className="text-sm font-medium text-slate-800">
      {item.employee}
    </span>

  </div>
</td>
                           <td className="px-5 py-3 text-xs text-slate-700">{item.activeTime} min</td>
                            <td className="px-5 py-3">
  <span className="inline-flex items-center px-2.5 py-1 rounded-full
    bg-red-50 text-red-500 text-xs font-semibold">
    {item.idleTime}
  </span>
</td>
                            <td className="px-5 py-3 text-xs text-slate-700">{item.workingHours} min</td>
                          <td className="px-5 py-3">
  <span className="inline-flex items-center px-2.5 py-1 rounded-full
    bg-green-50 text-green-600 text-xs font-semibold">
    {item.productivity}%
  </span>
</td>
                            <td className="px-5 py-3 text-xs text-slate-700">{item.attendance}%</td>
                        </>
                      )}
                      {reportType === "workflow" && (
                        <>
                         <td className="px-5 py-3">
  <div className="flex items-center gap-3">

    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600
      flex items-center justify-center text-[10px] font-bold">
      {item.employee?.charAt(0)}
    </div>

    <span className="text-sm font-medium text-slate-800">
      {item.employee}
    </span>

  </div>
</td>

  <td className="px-5 py-3 text-xs text-slate-700">{item.department}</td>

                            <td className="px-5 py-3 text-xs text-slate-700">{item.totalTasks}</td>

                          <td className="p-3 text-green-600">
                            {item.completedTasks}
                          </td>

                          <td className="p-3 text-red-500">
                            {item.pendingTasks}
                          </td>

                          <td className="p-3 font-semibold">
                            {item.completionRate}
                          </td>

                            <td className="px-5 py-3 text-xs text-slate-700">{item.averageTime} min</td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
