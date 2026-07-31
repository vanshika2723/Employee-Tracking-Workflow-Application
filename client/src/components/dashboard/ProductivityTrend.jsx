import React, { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const ProductivityTrend = () => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/productivity/trend?range=${range}`
        );

        setData(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, [range]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Productivity Overview
        </h2>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-white"
        >
          <option value="week">This Week</option>
          <option value="lastWeek">Last Week</option>
          <option value="month">This Month</option>
        </select>

      </div>

      {loading ? (

        <div className="h-[320px] flex items-center justify-center text-slate-500">
          Loading chart...
        </div>

      ) : (

        <ResponsiveContainer width="100%" height={320}>

          <AreaChart data={data}>

            <defs>
              <linearGradient
                id="productivityGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#4F6BFF"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="#4F6BFF"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#E5E7EB"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value) => [`${value}%`, "Productivity"]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
            />

            <Area
              type="monotone"
              dataKey="productivity"
              stroke="#4F6BFF"
              strokeWidth={3}
              fill="url(#productivityGradient)"
              dot={{
                r: 4,
                fill: "#4F6BFF",
              }}
              activeDot={{
                r: 6,
                fill: "#4F6BFF",
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      )}

    </div>
  );
};

export default ProductivityTrend;