import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,

} from "recharts";
import { BarChart3 } from "lucide-react";
import api from "../../api/axios";

const WeeklySummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/activity/productivity/weekly")
      .then((res) => {
        console.log("WEEKLY PRODUCTIVITY:", res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log("Weekly Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="h-6 w-52 bg-slate-300 dark:bg-slate-700 rounded mb-5"></div>

        <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
    );
  }


  // Empty State
  if (data.length === 0) {
    return (
      <div className="card p-6 mb-8 text-center">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Weekly Productivity
            </h2>

            <p className="text-sm text-slate-500">
              Last 7 Days Performance
            </p>
          </div>


          <select className="px-3 py-2 rounded-xl border dark:bg-slate-800 text-sm">
            <option>This Week</option>
            <option>Last Week</option>
          </select>

        </div>


        <p className="text-slate-500 dark:text-slate-400 mt-4">
          No activity available this week.
        </p>

      </div>
    );
  }


  return (
   <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-8">

  {/* HEADER */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

    <div>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <BarChart3
            size={20}
            className="text-indigo-600"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Weekly Productivity
          </h2>

          <p className="text-sm text-slate-500 mt-0.5">
            Last 7 days performance
          </p>
        </div>
      </div>
    </div>

    {/* DROPDOWN */}
    <select
      className="
        h-10 px-4 rounded-xl
        border border-slate-200
        dark:border-slate-700
        bg-white dark:bg-slate-800
        text-sm font-medium
        text-slate-700 dark:text-slate-200
        outline-none
        focus:ring-2 focus:ring-indigo-500/20
        focus:border-indigo-500
      "
    >
      <option>This Week</option>
      <option>Last Week</option>
    </select>

  </div>


  {/* SUMMARY */}
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">

    {/* Average */}
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4">

      <p className="text-xs font-medium text-slate-500">
        Average Productivity
      </p>

      <p className="text-2xl font-bold text-indigo-600 mt-1">
        {data?.length
          ? (
              data.reduce(
                (sum, item) =>
                  sum + (item.productivity || 0),
                0
              ) / data.length
            ).toFixed(1)
          : 0
        }%
      </p>

    </div>


    {/* Best Day */}
    <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">

      <p className="text-xs font-medium text-slate-500">
        Best Day
      </p>

      <p className="text-lg font-bold text-green-600 mt-1">

        {data?.length
          ? data.reduce(
              (best, item) =>
                (item.productivity || 0) >
                (best.productivity || 0)
                  ? item
                  : best,
              data[0]
            )?.day
          : "--"
        }

      </p>

    </div>


    {/* Target */}
    <div className="hidden md:block bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">

      <p className="text-xs font-medium text-slate-500">
        Target
      </p>

      <p className="text-2xl font-bold text-purple-600 mt-1">
        90%
      </p>

    </div>

  </div>


  {/* CHART */}
  <div className="h-72">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart
        data={data}
        barCategoryGap="25%"
        margin={{
          top: 10,
          right: 10,
          left: -15,
          bottom: 5
        }}
      >

        <CartesianGrid
          strokeDasharray="4 4"
          vertical={false}
          stroke="#e2e8f0"
        />

        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#64748b",
            fontSize: 12
          }}
        />

        <YAxis
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#64748b",
            fontSize: 12
          }}
          tickFormatter={(value) => `${value}%`}
        />

        <Tooltip
          cursor={{
            fill: "#6366f1",
            opacity: 0.06
          }}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.08)"
          }}
          formatter={(value) => [
            `${value}%`,
            "Productivity"
          ]}
        />

        <Bar
          dataKey="productivity"
          fill="#6366F1"
          radius={[8, 8, 2, 2]}
          animationDuration={1000}
          maxBarSize={42}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>


  {/* FOOTER */}
  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">

    <div className="flex items-center gap-2">

      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />

      <span className="text-xs text-slate-500">
        Daily productivity
      </span>

    </div>

    <p className="text-xs text-slate-400">
      Goal: <span className="font-semibold text-slate-600">90%</span>
    </p>

  </div>

</div>
  );
};


export default WeeklySummary;