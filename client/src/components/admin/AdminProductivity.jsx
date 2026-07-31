import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import socket from "../../socket/socket";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const AdminProductivity = () => {
  const [filter, setFilter] = useState("month");

  const [data, setData] = useState({
    records: [],
    avgProductivity: 0,
    totalActiveHours: 0,
    totalIdleHours: 0,
    bestDay: {},
    ranking: [],
  });

  const [departments, setDepartments] = useState([]);

  const fetchProductivity = async () => {
  try {
    const res = await api.get(`/productivity/admin?filter=${filter}`);

    console.log("Response:", res.data);

    setData({
      records: res.data.records || [],
      avgProductivity: res.data.avgProductivity || 0,
      totalActiveHours: res.data.totalActiveHours || 0,
      totalIdleHours: res.data.totalIdleHours || 0,
      bestDay: res.data.bestDay || {},
      ranking: res.data.ranking || [],
    });
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
  }
};

  useEffect(() => {
    fetchProductivity();
  }, [filter]);

  useEffect(() => {
    socket.on("employeeActivityUpdate", () => {
      fetchProductivity();
    });

    return () => {
      socket.off("employeeActivityUpdate");
    };
  }, [filter]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get(
          "/productivity/departments"
        );

        setDepartments(
          Array.isArray(res.data)
            ? res.data
            : []
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchDepartments();
  }, []);

  const chartData = (data.records || []).map((item) => ({
    day:
      filter === "today"
        ? new Date(item.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : filter === "week"
        ? new Date(item.date).toLocaleDateString("en-IN", {
            weekday: "short",
          })
        : item.week ||
          new Date(item.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),

    productivity: item.productivity || 0,
  }));

  const formatHours = (minutes = 0) =>
    Math.round(minutes / 60);

return (
  <div className="min-h-screen bg-slate-100 p-5 md:p-6">

    {/* ================= HEADER ================= */}

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Productivity Analytics
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Team-wide productivity across time ranges
        </p>
      </div>

      {/* FILTER */}

      <div className="inline-flex self-start sm:self-auto bg-white border border-slate-200 rounded-xl p-1 shadow-sm">

        {["today", "week", "month"].map((item) => (

          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`
              px-4 py-2 rounded-lg
              text-sm font-semibold
              transition
              ${
                filter === item
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }
            `}
          >
            {item === "today"
              ? "Daily"
              : item === "week"
              ? "Weekly"
              : "Monthly"}
          </button>

        ))}

      </div>

    </div>


    {/* ================= SUMMARY ================= */}

    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

      {/* AVG PRODUCTIVITY */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
            📈
          </div>

          <div>
            <p className="text-2xl font-bold text-slate-900">
              {data.avgProductivity}%
            </p>

            <p className="text-xs text-slate-500 mt-0.5">
              Avg Productivity
            </p>
          </div>

        </div>

      </div>


      {/* ACTIVE HOURS */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-lg">
            ⚡
          </div>

          <div>
            <p className="text-2xl font-bold text-slate-900">
              {formatHours(data.totalActiveHours)}h
            </p>

            <p className="text-xs text-slate-500 mt-0.5">
              Total Active Hours
            </p>
          </div>

        </div>

      </div>


      {/* IDLE HOURS */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
            💤
          </div>

          <div>
            <p className="text-2xl font-bold text-slate-900">
              {formatHours(data.totalIdleHours)}h
            </p>

            <p className="text-xs text-slate-500 mt-0.5">
              Total Idle Hours
            </p>
          </div>

        </div>

      </div>


      {/* BEST DAY */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
            🏆
          </div>

          <div className="min-w-0">

            <p className="text-lg font-bold text-slate-900 truncate">
              {data.bestDay?.day || "-"}
            </p>

            <p className="text-xs text-slate-500 mt-0.5">
              Best Day · {data.bestDay?.productivity || 0}%
            </p>

          </div>

        </div>

      </div>

    </div>


    {/* ================= PRODUCTIVITY CHART ================= */}

    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      <div className="px-5 py-4 border-b border-slate-100">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Productivity Trend
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Team productivity across the selected period
            </p>

          </div>

          <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
            {filter === "today"
              ? "Daily"
              : filter === "week"
              ? "Weekly"
              : "Monthly"}
          </div>

        </div>

      </div>


      <div className="p-5">

        <div className="h-72">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: -15,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value) => [
                  `${value}%`,
                  "Productivity",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />

              <Bar
                dataKey="productivity"
                radius={[6, 6, 0, 0]}
                barSize={28}
              >

                {chartData.map((item, index) => (

                  <Cell
                    key={index}
                    fill={
                      index ===
                      Math.floor(chartData.length / 2)
                        ? "#2F54EB"
                        : "#818CF8"
                    }
                  />

                ))}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>


    {/* ================= BOTTOM SECTION ================= */}

    <div className="grid lg:grid-cols-2 gap-5 mt-5">


      {/* ================= DEPARTMENT ================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100">

          <h2 className="text-lg font-bold text-slate-900">
            Department Performance
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Productivity by department
          </p>

        </div>

        <div className="p-5">

          <div className="h-64">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={departments}
                margin={{
                  top: 5,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    "Productivity",
                  ]}
                />

                <Bar
                  dataKey="productivity"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                >

                  {departments.map((item, index) => {

                    const colors = [
                      "#4F6EF7",
                      "#6366F1",
                      "#F59E0B",
                      "#22C55E",
                      "#8B5CF6",
                      "#EF4444",
                      "#14B8A6",
                    ];

                    return (
                      <Cell
                        key={index}
                        fill={
                          colors[
                            index % colors.length
                          ]
                        }
                      />
                    );

                  })}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* ================= TEAM RANKING ================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100">

          <h2 className="text-lg font-bold text-slate-900">
            Team Productivity Ranking
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Highest performing employees
          </p>

        </div>


        <div className="p-5">

          {data.ranking.length > 0 ? (

            <div className="space-y-2.5">

              {data.ranking.map((emp, index) => (

                <div
                  key={emp._id}
                  className="
                    flex items-center justify-between
                    px-3 py-3
                    rounded-xl
                    border border-slate-100
                    hover:bg-slate-50
                    transition
                  "
                >

                  <div className="flex items-center gap-3 min-w-0">

                    <div
                      className={`
                        w-8 h-8
                        rounded-lg
                        flex items-center justify-center
                        text-xs font-bold
                        shrink-0
                        ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-700"
                            : index === 1
                            ? "bg-slate-100 text-slate-700"
                            : index === 2
                            ? "bg-orange-100 text-orange-700"
                            : "bg-indigo-50 text-indigo-600"
                        }
                      `}
                    >
                      {index + 1}
                    </div>


                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {emp.firstName} {emp.lastName}
                      </p>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {emp.department || "No Department"}
                      </p>

                    </div>

                  </div>


                  <div className="text-sm font-bold text-green-600 shrink-0">
                    {emp.productivity}%
                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="py-12 text-center">

              <div className="w-11 h-11 mx-auto rounded-xl bg-slate-50 flex items-center justify-center text-xl">
                📊
              </div>

              <p className="text-sm font-semibold text-slate-600 mt-3">
                No Ranking Data
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Productivity ranking will appear here.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  </div>
);

};

export default AdminProductivity;