import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import socket from "../../socket/socket";
import { formatDuration } from "date-fns";

const LiveEmployeeTable = ({ refresh }) => {
  const [department, setDepartment] = useState("All");
  const [employees, setEmployees] = useState([]);
  const formatDuration = (seconds = 0) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    return `${h}h ${m.toString().padStart(2, "0")}m`;
  };

  useEffect(() => {
    const fetchEmployees = () => {
      api
        .get("/dashboard/live-employees")
        .then((res) => {
          setEmployees(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchEmployees();

    const interval = setInterval(() => {
      fetchEmployees();
    }, 30000);

    // REAL TIME SOCKET UPDATE

    socket.on("employeeActivityUpdate", (data) => {
      console.log("LIVE ACTIVITY UPDATE:", data);

      setEmployees((prev) =>
        prev.map((emp) => {
          if (
            emp.employeeId?._id === data.employeeId ||
            emp.id === data.employeeId
          )
            return {
              ...emp,

              activeTime: data.activeTime,

              idleTime: data.idleTime,

              lastActivity: data.lastActivity,
              status: data.status,
            };

          return emp;
        }),
      );
    });

    socket.on("employeeTimerUpdate", (data) => {
      setEmployees((prev) =>
        prev.map((emp) => {
          if (
            emp.employeeId?._id === data.employeeId ||
            emp.id === data.employeeId
          ) {
            return {
              ...emp,

              activeTime: data.activeTime,

              idleTime: data.idleTime,

              status: data.status,
            };
          }

          return emp;
        }),
      );
    });

    return () => {
      clearInterval(interval);

      socket.off("employeeActivityUpdate");
      socket.off("employeeTimerUpdate");
    };
  }, [refresh]);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Live Employee Monitoring
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Real-time across departments
        </p>
      </div>
      <div className="text-sm text-green-600 font-semibold">
        {employees.filter((e) => e.status === "ONLINE").length} Active
      </div>
<div className="flex justify-between items-center mb-4">

  <select
    value={department}
    onChange={(e) => setDepartment(e.target.value)}
    className="border rounded-lg px-4 py-2 text-sm"
  >
    <option value="All">All Departments</option>

    {
      [...new Set(employees.map(emp => emp.department))]
        .filter(Boolean)
        .map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))
    }

  </select>

</div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-gray-500 text-sm">
              <th className="pb-4">Employee</th>
             
              <th className="pb-4">Status</th>
              <th className="pb-4">Login</th>
              <th className="pb-4">Active</th>
              <th className="pb-4">Idle</th>
              <th className="pb-4">Overtime</th>
              <th className="pb-4">Productivity</th>
            </tr>
          </thead>

          <tbody>
            {employees
.filter(emp =>
  department === "All" 
  || emp.department === department
)
.map((emp) => (
              <tr
                key={emp.id}
                className="border-b last:border-0 hover:bg-gray-50 transition"
              >
                {/* Employee */}
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      {emp.initials}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">{emp.name}</p>

                      <p className="text-xs text-gray-500">{emp.department}</p>
                    </div>
                  </div>
                </td>

              

                {/* Status */}
                <td className="py-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      emp.status === "ONLINE"
                        ? "bg-green-100 text-green-700"
                        : emp.status === "IDLE"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }
                  `}
                  >
                    <span className="h-2 w-2 rounded-full bg-current"></span>

                    {emp.status === "ONLINE"
                      ? "Active"
                      : emp.status === "IDLE"
                        ? `Idle ${Math.floor(emp.idleTime / 60)}m`
                        : "Offline"}
                  </span>
                </td>

                {/* Active Today */}
                {/* Login */}
                <td className="py-4 text-gray-700">{emp.loginTime || "—"}</td>

                {/* Active */}
                <td className="py-4 font-semibold">
                  {formatDuration(emp.activeTime)}
                </td>

                {/* Idle */}
                <td className="py-4 text-gray-700">
                  {emp.idleTime ? `${Math.floor(emp.idleTime / 60)}m` : "—"}
                </td>

                {/* Overtime */}
                <td className="py-4 text-gray-700">{emp.overtime || "—"}</td>

                {/* Productivity */}
                <td className="py-4">
                  <span className="font-semibold text-indigo-600">
                    {emp.productivity || 0}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveEmployeeTable;
