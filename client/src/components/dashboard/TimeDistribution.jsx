import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,


} from "recharts";
import { ClockIcon } from "lucide-react";

const TimeDistribution = ({ activity }) => {


  const formatHours = (seconds = 0) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };


  const data = [
    {
      name: "Active",
      value: activity?.activeTime || 0,
    },
    {
      name: "Idle",
      value: activity?.idleTime || 0,
    },
    {
      name: "Break",
      value: activity?.breakTime || 0,
    },
  ];


  const COLORS = [
    "#22c55e",
    "#ef4444",
    "#eab308",
  ];


  const totalTime =
    (activity?.activeTime || 0) +
    (activity?.idleTime || 0) +
    (activity?.breakTime || 0);



  return (

   <div
  className="
    rounded-3xl
    bg-white
    dark:bg-slate-900
    shadow-sm
    border
    border-slate-200
    dark:border-slate-800
    p-6
    hover:shadow-lg
    transition-all
    duration-300
  "
>

  {/* HEADER */}
  <div className="flex items-start justify-between mb-5">

    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Time Distribution
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Today's working hours
      </p>
    </div>

    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
      <ClockIcon
        size={18}
        className="text-indigo-600"
      />
    </div>

  </div>


  {/* CHART */}
  <div className="h-72">

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <PieChart>

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          innerRadius={68}
          outerRadius={98}
          paddingAngle={4}
          cornerRadius={6}
          animationDuration={1000}
          stroke="none"
        >

          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}

        </Pie>


        {/* CENTER TOTAL */}
        <text
          x="50%"
          y="42%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-900 dark:fill-white"
        >
          <tspan
            x="50%"
            dy="-4"
            className="text-2xl font-bold"
          >
            {formatHours(totalTime)}
          </tspan>

          <tspan
            x="50%"
            dy="24"
            className="text-xs fill-slate-500"
          >
            Total Time
          </tspan>
        </text>


        <Tooltip
          formatter={(value) => [
            formatHours(value),
            "Duration"
          ]}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 8px 20px rgba(0,0,0,0.08)"
          }}
        />


        <Legend
          verticalAlign="bottom"
          height={40}
          iconType="circle"
          wrapperStyle={{
            fontSize: "12px"
          }}
        />

      </PieChart>

    </ResponsiveContainer>

  </div>


  {/* SUMMARY */}
  <div className="grid grid-cols-2 gap-3 mt-2">

    <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 p-3">

      <p className="text-xs text-slate-500">
        Productive
      </p>

      <p className="text-lg font-bold text-green-600 mt-1">
        {formatHours(
          data.find(
            (item) =>
              item.name?.toLowerCase() === "productive"
          )?.value || 0
        )}
      </p>

    </div>


    <div className="rounded-2xl bg-orange-50 dark:bg-orange-900/20 p-3">

      <p className="text-xs text-slate-500">
        Idle / Break
      </p>

      <p className="text-lg font-bold text-orange-600 mt-1">
        {formatHours(
          data
            .filter(
              (item) =>
                item.name?.toLowerCase() !== "productive"
            )
            .reduce(
              (sum, item) =>
                sum + (item.value || 0),
              0
            )
        )}
      </p>

    </div>

  </div>

</div>

  );

};


export default TimeDistribution;