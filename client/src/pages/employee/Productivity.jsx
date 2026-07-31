import React, { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Clock3,
  Activity,
  Coffee,
  TimerReset,
  Target,
  Info,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Trophy,
  CalendarDays,
  ChevronDown,
  CircleCheck,
  AlertTriangle,
  Users,
  Building2,
} from "lucide-react";

const formatMinutes = (minutes = 0) => {
  const hours = Math.floor(minutes / 60);

  const mins = minutes % 60;

  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
};

const Productivity = () => {
  const [productivity, setProductivity] = useState(null);
  const [trend, setTrend] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [weekly,setWeekly]=useState([]);
  const [team,setTeam]=useState([]);
const [monthly,setMonthly]=useState([]);
  const [dashboard, setDashboard] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    team: 0,
    yesterdayChange: 0,
  });
const loginMinutes =
productivity?.loginDuration || 0;


const idleMinutes =
productivity?.idleTime || 0;


const breakMinutes =
productivity?.breakTime || 0;


const productiveMinutes =
Math.max(
loginMinutes - idleMinutes - breakMinutes,
0
);

const productivityPercentage =
productivity?.productivity || 0;



useEffect(()=>{

api.get("/productivity/team")
.then(res=>{

console.log("TEAM:",res.data);

setTeam(res.data);

})
.catch(console.log);


},[]);
useEffect(()=>{

const loadPerformance = async()=>{

try{

const weeklyRes = await api.get(
"/productivity/weekly-performance"
);

console.log("WEEKLY DATA:", weeklyRes.data);

setWeekly(weeklyRes.data);



const monthlyRes = await api.get(
"/productivity/monthly-performance"
);

console.log("MONTHLY DATA:", monthlyRes.data);

setMonthly(monthlyRes.data);


}
catch(error){

console.log(
"Performance Error:",
error
);

}

};


loadPerformance();


},[]);


  useEffect(() => {
    api
      .get("/productivity/today")
      .then((res) => {
        console.log("PRODUCTIVITY DATA:", res.data);

        setProductivity(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .get("/productivity/dashboard")
      .then(({ data }) => {
        console.log("DASHBOARD DATA:", data);

        setDashboard(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .get("/productivity/trend")
      .then(({ data }) => {
        console.log("TREND DATA:", data);

        setTrend(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  

  useEffect(() => {

    api.get("/productivity/departments")
    .then(({data}) => {

        console.log("DEPARTMENTS:", data);

        setDepartmentData(data);

    })
    .catch(console.log);

}, []);





[
{
icon:"⏱️",
title:"Login Duration",
value:formatMinutes(productivity?.loginDuration || 0),
desc:"Total login time",
color:"bg-blue-100"
},
{
icon:"▶️",
title:"Active Time",
value:formatMinutes(productivity?.activeTime || 0),
desc:"Productive active time",
color:"bg-green-100"
},
{
icon:"ⓘ",
title:"Idle Time",
value:formatMinutes(productivity?.idleTime || 0),
desc:"Total idle time",
color:"bg-orange-100"
},
{
icon:"☕",
title:"Break Time",
value:formatMinutes(productivity?.breakTime || 0),
desc:"Total break time",
color:"bg-yellow-100"
},
{
icon:"🎯",
title:"Productive Hours",
value:formatMinutes(productivity?.productiveTime || 0),
desc:"Total productive time",
color:"bg-emerald-100"
}
]


return (
//   <div className="min-h-screen bg-[#f5f7fb] p-6">

//     {/* Header */}

//     <div className="flex justify-between items-center mb-8">

//       <div>
//         <h1 className="text-3xl font-bold text-slate-800">
//           Productivity
//         </h1>

//         <p className="text-gray-500 mt-1">
//           Track your productive hours and performance analytics
//         </p>
//       </div>

//       <button className="bg-white border rounded-xl px-5 py-3 shadow-sm">
//         Today
//       </button>

//     </div>



// {/* Summary Cards */}

// <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

// {[
// {
// title:"Login Duration",
// value:formatMinutes(loginMinutes),
// desc:"Total login time",
// icon:"⏱️",
// bg:"bg-blue-50",
// text:"text-blue-600"
// },
// {
// title:"Active Time",
// value:formatMinutes(productivity?.activeTime||0),
// desc:"Productive active time",
// icon:"▶",
// bg:"bg-green-50",
// text:"text-green-600"
// },
// {
// title:"Idle Time",
// value:formatMinutes(idleMinutes),
// desc:"Total idle time",
// icon:"☕",
// bg:"bg-orange-50",
// text:"text-orange-600"
// },
// {
// title:"Break Time",
// value:formatMinutes(breakMinutes),
// desc:"Total break time",
// icon:"🛌",
// bg:"bg-pink-50",
// text:"text-pink-600"
// },
// {
// title:"Productive Hours",
// value:formatMinutes(productiveMinutes),
// desc:"Total productive time",
// icon:"🎯",
// bg:"bg-purple-50",
// text:"text-purple-600"
// }
// ].map((card)=>(
// <div
// key={card.title}
// className="bg-white rounded-3xl shadow-sm border p-6"
// >

// <div className="flex justify-between">

// <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${card.bg} ${card.text}`}>
// {card.icon}
// </div>

// <span className="text-gray-400">
// ⓘ
// </span>

// </div>

// <h3 className="font-semibold mt-5">
// {card.title}
// </h3>

// <h1 className="text-4xl font-bold mt-2">
// {card.value}
// </h1>

// <p className="text-gray-500 mt-2">
// {card.desc}
// </p>

// </div>
// ))}

// </div>



// {/* Productivity Calculation */}

// {/* ========================================= */}
// {/* PRODUCTIVITY CALCULATION */}
// {/* ========================================= */}

// <div className="bg-white rounded-xl shadow-sm p-4 mt-6">

//   <h2 className="text-sm font-semibold text-slate-900 mb-3">
//     Productivity Calculation
//   </h2>

//   <div className="flex items-center gap-4">

//     {/* ================= LEFT FORMULA ================= */}

//     <div className="flex-1">

//       <div className="flex items-center gap-3 flex-wrap">

//         {/* LOGIN */}

//         <div className="w-[100px] h-[58px] bg-slate-50 rounded-lg flex flex-col items-center justify-center">

//           <h3 className="text-base font-bold text-slate-900">
//             {formatMinutes(loginMinutes)}
//           </h3>

//           <p className="text-[9px] text-slate-500">
//             Login Duration
//           </p>

//         </div>


//         {/* MINUS */}

//         <span className="text-slate-400 text-sm">
//           −
//         </span>


//         {/* IDLE */}

//         <div className="w-[100px] h-[58px] bg-slate-50 rounded-lg flex flex-col items-center justify-center">

//           <h3 className="text-base font-bold text-slate-900">
//             {formatMinutes(idleMinutes)}
//           </h3>

//           <p className="text-[9px] text-slate-500">
//             Idle Time
//           </p>

//         </div>


//         {/* MINUS */}

//         <span className="text-slate-400 text-sm">
//           −
//         </span>


//         {/* BREAK */}

//         <div className="w-[100px] h-[58px] bg-slate-50 rounded-lg flex flex-col items-center justify-center">

//           <h3 className="text-base font-bold text-slate-900">
//             {formatMinutes(breakMinutes)}
//           </h3>

//           <p className="text-[9px] text-slate-500">
//             Break Time
//           </p>

//         </div>


//         {/* EQUAL */}

//         <span className="text-slate-400 text-sm">
//           =
//         </span>


//         {/* PRODUCTIVE */}

//         <div className="w-[110px] h-[58px] bg-violet-50 rounded-lg flex flex-col items-center justify-center">

//           <h3 className="text-base font-bold text-violet-600">
//             {formatMinutes(productiveMinutes)}
//           </h3>

//           <p className="text-[9px] text-slate-500">
//             Productive Hours
//           </p>

//         </div>

//       </div>

//     </div>


//     {/* ================= DIVIDER ================= */}

//     <div className="h-16 w-px bg-slate-200" />


//     {/* ================= PERCENTAGE ================= */}

//     <div className="w-[125px] text-center">

//       <p className="text-[10px] text-slate-400">
//         Productivity Percentage
//       </p>

//       <h2 className="text-2xl font-bold text-violet-600 mt-1">
//         {productivityPercentage}%
//       </h2>

//       <p className="text-[9px] text-slate-500">
//         ({formatMinutes(productiveMinutes)} /{" "}
//         {formatMinutes(loginMinutes)}) × 100
//       </p>

//     </div>


//     {/* ================= CIRCULAR PROGRESS ================= */}

//     <div className="relative w-[82px] h-[82px] flex-shrink-0">

//       <svg
//         width="82"
//         height="82"
//         viewBox="0 0 82 82"
//         className="-rotate-90"
//       >

//         {/* Background */}

//         <circle
//           cx="41"
//           cy="41"
//           r="34"
//           fill="none"
//           stroke="#eef0f5"
//           strokeWidth="8"
//         />

//         {/* Progress */}

//         <circle
//           cx="41"
//           cy="41"
//           r="34"
//           fill="none"
//           stroke="#6557e8"
//           strokeWidth="8"
//           strokeLinecap="round"
//           strokeDasharray="213.6"
//           strokeDashoffset={
//             213.6 -
//             (213.6 * Math.min(
//               productivityPercentage,
//               100
//             )) / 100
//           }
//         />

//       </svg>


//       {/* Center Text */}

//       <div className="absolute inset-0 flex flex-col items-center justify-center">

//         <span className="text-sm font-bold text-violet-600">
//           {productivityPercentage}%
//         </span>

//         <span className="text-[8px] text-slate-500">
//           Productivity
//         </span>

//       </div>

//     </div>

//   </div>


//   {/* ================= BOTTOM PROGRESS ================= */}

//   <div className="mt-3">

//     <div className="relative">

//       {/* Goal */}

//       <div
//         className="absolute -top-5 right-0 text-[9px] 
//                    text-violet-600 bg-white 
//                    border border-slate-200 
//                    rounded px-1.5 py-0.5"
//       >
//         Goal: 90%
//       </div>


//       {/* Background */}

//       <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">

//         <div
//           className="h-full bg-violet-500 rounded-full transition-all duration-500"
//           style={{
//             width: `${Math.min(
//               productivityPercentage,
//               100
//             )}%`,
//           }}
//         />

//       </div>

//     </div>


//     {/* Status */}

//     <p className="text-[10px] text-slate-600 mt-2">

//       Your productivity is{" "}

//       <span className="font-semibold text-slate-700">
//         {productivityPercentage >= 90
//           ? "Excellent"
//           : productivityPercentage >= 75
//           ? "Good"
//           : productivityPercentage >= 50
//           ? "Average"
//           : "Low"}
//       </span>

//       <span className="ml-1">
//         {productivityPercentage >= 75 ? "✅" : "⚠️"}
//       </span>

//     </p>

//   </div>

// </div>
// {/* ================= DAILY + WEEKLY + MONTHLY ================= */}

// <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

//   {/* ================= DAILY PERFORMANCE ================= */}

//   <div className="bg-white rounded-3xl shadow-sm border p-6">

//     <div className="mb-6">
//       <h2 className="text-xl font-bold">
//         Daily Productivity Trend
//       </h2>

//       <p className="text-gray-500 text-sm">
//         Last 7 Days
//       </p>
//     </div>

//     <div className="h-80">

//       <ResponsiveContainer width="100%" height="100%">

//         <LineChart data={trend}>

//           <CartesianGrid strokeDasharray="3 3" />

//           <XAxis dataKey="day" />

//           <YAxis domain={[0, 100]} />

//           <Tooltip />

//           <Line
//             type="monotone"
//             dataKey="productivity"
//             stroke="#6D5EF5"
//             strokeWidth={4}
//             dot={{ r: 5 }}
//           />

//         </LineChart>

//       </ResponsiveContainer>

//     </div>

//   </div>


//   {/* ================= WEEKLY PERFORMANCE ================= */}

//   <div className="bg-white rounded-3xl shadow-sm border p-6">

//     <div className="mb-6">

//       <h2 className="text-xl font-bold">
//         Weekly Performance
//       </h2>

//       <p className="text-gray-500 text-sm">
//         This Week
//       </p>

//     </div>

//     <div className="space-y-5">

//       {weekly.map((item, index) => (

//         <div key={index}>

//           <div className="flex justify-between mb-2">

//             <span className="font-medium">
//               {item.day}
//             </span>

//             <span className="font-bold text-indigo-600">
//               {item.productivity ?? 0}%
//             </span>

//           </div>

//           <div className="h-3 rounded-full bg-gray-200">

//             <div
//               className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
//               style={{
//                 width: `${item.productivity ?? 0}%`
//               }}
//             />

//           </div>

//         </div>

//       ))}

//     </div>

//   </div>


//   {/* ================= MONTHLY PERFORMANCE ================= */}

//   <div className="bg-white rounded-3xl shadow-sm border p-6">

//     <div className="mb-6">

//       <h2 className="text-xl font-bold">
//         Monthly Performance Overview
//       </h2>

//       <p className="text-gray-500 text-sm">
//         This Month
//       </p>

//     </div>


//     {/* Average Productivity */}

//     <div className="text-center mb-5">

//       <h1 className="text-5xl font-bold text-indigo-600">

//         {monthly.length
//           ? (
//               monthly.reduce(
//                 (sum, i) => sum + (i.productivity || 0),
//                 0
//               ) / monthly.length
//             ).toFixed(1)
//           : 0
//         }%

//       </h1>

//       <p className="text-gray-500">
//         Average Productivity
//       </p>

//     </div>


//     {/* Monthly Chart */}

//     <div className="h-56">

//       <ResponsiveContainer width="100%" height="100%">

//         <BarChart data={monthly}>

//           <CartesianGrid strokeDasharray="3 3" />

//           <XAxis dataKey="week" />

//           <YAxis domain={[0, 100]} />

//           <Tooltip />

//           <Bar
//             dataKey="productivity"
//             fill="#6D5EF5"
//             radius={[10, 10, 0, 0]}
//             barSize={35}
//           />

//         </BarChart>

//       </ResponsiveContainer>

//     </div>

//   </div>

// </div>
// {/* ================= TEAM + DEPARTMENT ================= */}

// <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

//   {/* ================= TEAM PRODUCTIVITY ================= */}

//   <div className="bg-white rounded-3xl shadow-sm border p-6">

//     <h2 className="text-xl font-bold mb-6">
//       Team-wise Productivity
//     </h2>

//     <div className="space-y-5">

//       {team.map((emp, index) => (

//         <div
//           key={index}
//           className="flex items-center gap-4"
//         >

//           <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 flex-shrink-0">
//             {(emp.name || emp.firstName || "U").charAt(0)}
//           </div>

//           <div className="flex-1 min-w-0">

//             <div className="flex justify-between items-center gap-2">

//               <h3 className="font-semibold truncate">
//                 {emp.name ||
//                   `${emp.firstName || ""} ${emp.lastName || ""}`}
//               </h3>

//               <span className="font-bold text-indigo-600 whitespace-nowrap">
//                 {emp.productivity ?? 0}%
//               </span>

//             </div>

//             <div className="h-2 rounded-full bg-gray-200 mt-2 overflow-hidden">

//               <div
//                 className="h-full rounded-full bg-indigo-600 transition-all"
//                 style={{
//                   width: `${Math.min(
//                     emp.productivity ?? 0,
//                     100
//                   )}%`
//                 }}
//               />

//             </div>

//             <p className="text-sm text-gray-500 mt-2">
//               {formatMinutes(emp.productiveTime || 0)}
//             </p>

//           </div>

//         </div>

//       ))}

//     </div>

//   </div>


//   {/* ================= DEPARTMENT PRODUCTIVITY ================= */}

//   <div className="bg-white rounded-3xl shadow-sm border p-6">

//     <h2 className="text-xl font-bold mb-6">
//       Department-wise Productivity
//     </h2>

//     <div className="space-y-5">

//       {departmentData.map((dept, index) => (

//         <div key={index}>

//           <div className="flex justify-between items-center mb-2">

//             <span className="font-semibold">
//               {dept.department}
//             </span>

//             <span className="font-bold text-indigo-600">
//               {dept.productivity ?? 0}%
//             </span>

//           </div>

//           <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

//             <div
//               className="h-full bg-indigo-600 rounded-full transition-all"
//               style={{
//                 width: `${Math.min(
//                   dept.productivity ?? 0,
//                   100
//                 )}%`
//               }}
//             />

//           </div>

//           <p
//             className={`mt-2 text-sm font-medium ${
//               dept.positive
//                 ? "text-green-600"
//                 : "text-red-600"
//             }`}
//           >
//             {dept.positive ? "▲" : "▼"} {dept.trend}
//           </p>

//         </div>

//       ))}

//     </div>

//   </div>


//   {/* ================= INSIGHTS ================= */}

//   <div className="bg-white rounded-3xl shadow-sm border p-6">

//     <h2 className="text-xl font-bold mb-6">
//       Insights
//     </h2>

//     <div className="space-y-4">

//       {/* Great */}

//       <div className="bg-green-50 rounded-2xl p-4">

//         <h3 className="font-bold text-green-700">
//           ✅ Great!
//         </h3>

//         <p className="text-gray-600 text-sm mt-1">
//           Your productivity is above average.
//         </p>

//       </div>


//       {/* Best Day */}

//       <div className="bg-blue-50 rounded-2xl p-4">

//         <h3 className="font-bold text-blue-700">
//           📈 Best Day
//         </h3>

//         <p className="text-gray-600 text-sm mt-1">
//           You performed best this week.
//         </p>

//       </div>


//       {/* Suggestion */}

//       <div className="bg-yellow-50 rounded-2xl p-4">

//         <h3 className="font-bold text-yellow-700">
//           💡 Suggestion
//         </h3>

//         <p className="text-gray-600 text-sm mt-1">
//           Reduce idle time to increase productivity.
//         </p>

//       </div>


//       {/* Goal */}

//      {/* Goal */}

// <div className="bg-purple-50 rounded-2xl p-4">

//   <h3 className="font-bold text-purple-700">
//     🎯 Goal
//   </h3>

//   <p className="text-gray-600 text-sm mt-1">
//     Target productivity: 90%
//   </p>

// </div>


// {/* Goal Progress */}

// <div className="mt-5">

//   <h3 className="font-semibold text-gray-700 text-center">
//     Goal Progress
//   </h3>

//   <div className="relative h-48 mt-2">

//     <ResponsiveContainer width="100%" height="100%">

//       <PieChart>

//         <Pie
//           data={[
//             {
//               name: "Completed",
//               value: 96
//             },
//             {
//               name: "Remaining",
//               value: 4
//             }
//           ]}
//           cx="50%"
//           cy="50%"
//           innerRadius={58}
//           outerRadius={78}
//           startAngle={90}
//           endAngle={-270}
//           dataKey="value"
//           stroke="none"
//         >

//           <Cell fill="#8B5CF6" />
//           <Cell fill="#EDE9FE" />

//         </Pie>

//       </PieChart>

//     </ResponsiveContainer>

//     {/* Center Percentage */}

//     <div className="absolute inset-0 flex flex-col items-center justify-center">

//       <span className="text-4xl font-bold text-purple-600">
//         96%
//       </span>

//       <span className="text-xs text-gray-500">
//         Goal Progress
//       </span>

//     </div>

//   </div>

// </div>
//     </div>

//   </div>

// </div>

// </div>

<div className="min-h-screen bg-[#f6f7fb] p-4 md:p-6">

  {/* =========================================================
      HEADER
  ========================================================= */}

  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">

    <div>
      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center">
          <Target size={22} className="text-violet-600" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Productivity
          </h1>

          <p className="text-sm text-slate-500 mt-0.5">
            Track your productive hours and performance analytics
          </p>
        </div>

      </div>
    </div>


    <button
      className="
        flex items-center justify-center gap-2
        bg-white border border-slate-200
        rounded-xl px-4 py-2.5
        text-sm font-semibold text-slate-700
        shadow-sm hover:shadow-md
        transition-all
      "
    >
      <CalendarDays size={17} className="text-violet-600" />
      Today
      <ChevronDown size={15} className="text-slate-400" />
    </button>

  </div>


  {/* =========================================================
      SUMMARY CARDS
  ========================================================= */}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

    {[
      {
        title: "Login Duration",
        value: formatMinutes(loginMinutes),
        desc: "Total login time",
        icon: Clock3,
        bg: "bg-blue-50",
        text: "text-blue-600",
      },
      {
        title: "Active Time",
        value: formatMinutes(productivity?.activeTime || 0),
        desc: "Productive active time",
        icon: Activity,
        bg: "bg-emerald-50",
        text: "text-emerald-600",
      },
      {
        title: "Idle Time",
        value: formatMinutes(idleMinutes),
        desc: "Total idle time",
        icon: Coffee,
        bg: "bg-orange-50",
        text: "text-orange-600",
      },
      {
        title: "Break Time",
        value: formatMinutes(breakMinutes),
        desc: "Total break time",
        icon: TimerReset,
        bg: "bg-pink-50",
        text: "text-pink-600",
      },
      {
        title: "Productive Hours",
        value: formatMinutes(productiveMinutes),
        desc: "Total productive time",
        icon: Target,
        bg: "bg-violet-50",
        text: "text-violet-600",
      },
    ].map((card) => {

      const Icon = card.icon;

      return (
        <div
          key={card.title}
          className="
            group bg-white
            rounded-2xl
            border border-slate-200
            p-5
            shadow-sm
            hover:shadow-md
            hover:-translate-y-0.5
            transition-all duration-200
          "
        >

          <div className="flex items-start justify-between">

            <div
              className={`
                w-11 h-11 rounded-xl
                flex items-center justify-center
                ${card.bg}
              `}
            >
              <Icon size={21} className={card.text} />
            </div>

            <Info
              size={15}
              className="text-slate-300 group-hover:text-slate-400"
            />

          </div>

          <p className="text-sm font-medium text-slate-500 mt-4">
            {card.title}
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-1">
            {card.value}
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            {card.desc}
          </p>

        </div>
      );
    })}

  </div>


  {/* =========================================================
      PRODUCTIVITY CALCULATION
  ========================================================= */}

  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mt-6 p-5">

    <div className="flex flex-col lg:flex-row lg:items-center gap-6">

      {/* LEFT */}

      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-2 mb-4">

          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <Activity size={16} className="text-violet-600" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Productivity Calculation
            </h2>

            <p className="text-[11px] text-slate-400">
              Login − idle − break = productive time
            </p>
          </div>

        </div>


        <div className="flex items-center gap-2 flex-wrap">

          {/* LOGIN */}

          <div className="min-w-[110px] px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-center">

            <p className="text-sm font-bold text-slate-800">
              {formatMinutes(loginMinutes)}
            </p>

            <p className="text-[10px] text-slate-400 mt-0.5">
              Login Duration
            </p>

          </div>


          <span className="text-slate-300 font-bold">
            −
          </span>


          {/* IDLE */}

          <div className="min-w-[110px] px-3 py-3 rounded-xl bg-orange-50 border border-orange-100 text-center">

            <p className="text-sm font-bold text-orange-600">
              {formatMinutes(idleMinutes)}
            </p>

            <p className="text-[10px] text-slate-400 mt-0.5">
              Idle Time
            </p>

          </div>


          <span className="text-slate-300 font-bold">
            −
          </span>


          {/* BREAK */}

          <div className="min-w-[110px] px-3 py-3 rounded-xl bg-pink-50 border border-pink-100 text-center">

            <p className="text-sm font-bold text-pink-600">
              {formatMinutes(breakMinutes)}
            </p>

            <p className="text-[10px] text-slate-400 mt-0.5">
              Break Time
            </p>

          </div>


          <span className="text-slate-300 font-bold">
            =
          </span>


          {/* PRODUCTIVE */}

          <div className="min-w-[120px] px-3 py-3 rounded-xl bg-violet-50 border border-violet-100 text-center">

            <p className="text-sm font-bold text-violet-600">
              {formatMinutes(productiveMinutes)}
            </p>

            <p className="text-[10px] text-slate-400 mt-0.5">
              Productive Hours
            </p>

          </div>

        </div>

      </div>


      {/* DIVIDER */}

      <div className="hidden lg:block h-20 w-px bg-slate-200" />


      {/* PERCENTAGE */}

      <div className="lg:w-[190px]">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs text-slate-400">
              Productivity Score
            </p>

            <h2 className="text-3xl font-bold text-violet-600 mt-1">
              {productivityPercentage}%
            </h2>
          </div>

          <div className="relative w-[76px] h-[76px]">

            <svg
              width="76"
              height="76"
              viewBox="0 0 76 76"
              className="-rotate-90"
            >

              <circle
                cx="38"
                cy="38"
                r="30"
                fill="none"
                stroke="#edeef3"
                strokeWidth="7"
              />

              <circle
                cx="38"
                cy="38"
                r="30"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="188.5"
                strokeDashoffset={
                  188.5 -
                  (188.5 *
                    Math.min(productivityPercentage, 100)) /
                    100
                }
              />

            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <Target size={18} className="text-violet-600" />
            </div>

          </div>

        </div>

      </div>

    </div>


    {/* PROGRESS */}

    <div className="mt-5">

      <div className="flex items-center justify-between mb-2">

        <span className="text-[11px] font-medium text-slate-500">
          Daily productivity goal
        </span>

        <span className="text-[11px] font-semibold text-violet-600">
          Goal: 90%
        </span>

      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(productivityPercentage, 100)}%`,
          }}
        />

      </div>

      <div className="flex items-center gap-1.5 mt-2">

        {productivityPercentage >= 75 ? (
          <CircleCheck size={14} className="text-emerald-500" />
        ) : (
          <AlertTriangle size={14} className="text-amber-500" />
        )}

        <p className="text-[11px] text-slate-500">

          Your productivity is{" "}

          <span className="font-semibold text-slate-700">

            {productivityPercentage >= 90
              ? "Excellent"
              : productivityPercentage >= 75
              ? "Good"
              : productivityPercentage >= 50
              ? "Average"
              : "Low"}

          </span>

        </p>

      </div>

    </div>

  </div>


  {/* =========================================================
      DAILY / WEEKLY / MONTHLY
  ========================================================= */}

  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">


    {/* DAILY */}

    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

      <div className="flex items-start justify-between mb-5">

        <div>
          <h2 className="text-base font-bold text-slate-800">
            Daily Productivity
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Last 7 days
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
          <TrendingUp size={17} className="text-violet-600" />
        </div>

      </div>

      <div className="h-64">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={trend}>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eef0f4"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="productivity"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>


    {/* WEEKLY */}

    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

      <div className="flex items-start justify-between mb-5">

        <div>
          <h2 className="text-base font-bold text-slate-800">
            Weekly Performance
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            This week
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <Activity size={17} className="text-blue-600" />
        </div>

      </div>

      <div className="space-y-5">

        {weekly.map((item, index) => (

          <div key={index}>

            <div className="flex justify-between items-center mb-1.5">

              <span className="text-xs font-semibold text-slate-600">
                {item.day}
              </span>

              <span className="text-xs font-bold text-violet-600">
                {item.productivity ?? 0}%
              </span>

            </div>

            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    item.productivity ?? 0,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>


    {/* MONTHLY */}

    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

      <div className="flex items-start justify-between mb-4">

        <div>
          <h2 className="text-base font-bold text-slate-800">
            Monthly Overview
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            This month
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
          <CalendarDays size={17} className="text-indigo-600" />
        </div>

      </div>


      <div className="text-center mb-3">

        <h1 className="text-4xl font-bold text-violet-600">

          {monthly.length
            ? (
                monthly.reduce(
                  (sum, i) =>
                    sum + (i.productivity || 0),
                  0
                ) / monthly.length
              ).toFixed(1)
            : 0
          }%

        </h1>

        <p className="text-xs text-slate-400 mt-1">
          Average Productivity
        </p>

      </div>


      <div className="h-52">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={monthly}>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eef0f4"
            />

            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />

            <Tooltip />

            <Bar
              dataKey="productivity"
              fill="#7c3aed"
              radius={[7, 7, 0, 0]}
              barSize={30}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>


  {/* =========================================================
      TEAM / DEPARTMENT / INSIGHTS
  ========================================================= */}

  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">


    {/* TEAM */}

    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

      <div className="flex items-center justify-between mb-5">

        <div>
          <h2 className="text-base font-bold text-slate-800">
            Team Productivity
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Employee performance
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Users size={17} className="text-indigo-600" />
        </div>

      </div>


      <div className="space-y-5">

        {team.map((emp, index) => (

          <div
            key={index}
            className="flex items-center gap-3"
          >

            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 flex-shrink-0">

              {(emp.name ||
                emp.firstName ||
                "U"
              ).charAt(0).toUpperCase()}

            </div>


            <div className="flex-1 min-w-0">

              <div className="flex items-center justify-between gap-2">

                <h3 className="text-sm font-semibold text-slate-700 truncate">

                  {emp.name ||
                    `${emp.firstName || ""} ${
                      emp.lastName || ""
                    }`}

                </h3>

                <span className="text-xs font-bold text-indigo-600">
                  {emp.productivity ?? 0}%
                </span>

              </div>


              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">

                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      emp.productivity ?? 0,
                      100
                    )}%`,
                  }}
                />

              </div>


              <p className="text-[11px] text-slate-400 mt-1.5">
                {formatMinutes(
                  emp.productiveTime || 0
                )} productive
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>


    {/* DEPARTMENT */}

    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

      <div className="flex items-center justify-between mb-5">

        <div>
          <h2 className="text-base font-bold text-slate-800">
            Department Productivity
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Department performance
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Building2 size={17} className="text-emerald-600" />
        </div>

      </div>


      <div className="space-y-5">

        {departmentData.map((dept, index) => (

          <div key={index}>

            <div className="flex items-center justify-between">

              <span className="text-sm font-semibold text-slate-700">
                {dept.department}
              </span>

              <span className="text-xs font-bold text-indigo-600">
                {dept.productivity ?? 0}%
              </span>

            </div>


            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">

              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    dept.productivity ?? 0,
                    100
                  )}%`,
                }}
              />

            </div>


            <div
              className={`
                flex items-center gap-1
                mt-2 text-[11px] font-medium
                ${
                  dept.positive
                    ? "text-emerald-600"
                    : "text-red-500"
                }
              `}
            >

              {dept.positive ? (
                <TrendingUp size={13} />
              ) : (
                <TrendingDown size={13} />
              )}

              {dept.trend}

            </div>

          </div>

        ))}

      </div>

    </div>


    {/* INSIGHTS */}

    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

      <div className="flex items-center justify-between mb-5">

        <div>
          <h2 className="text-base font-bold text-slate-800">
            Productivity Insights
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Personalized performance summary
          </p>
        </div>

        <Lightbulb size={19} className="text-amber-500" />

      </div>


      <div className="space-y-3">

        {/* GREAT */}

        <div className="flex gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">

          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <Trophy size={16} className="text-emerald-600" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-emerald-700">
              Great Performance
            </h3>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Your productivity is above average.
            </p>
          </div>

        </div>


        {/* BEST DAY */}

        <div className="flex gap-3 p-3.5 rounded-xl bg-blue-50 border border-blue-100">

          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <TrendingUp size={16} className="text-blue-600" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-blue-700">
              Best Day
            </h3>

            <p className="text-[11px] text-slate-500 mt-0.5">
              You performed best this week.
            </p>
          </div>

        </div>


        {/* SUGGESTION */}

        <div className="flex gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-100">

          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <Lightbulb size={16} className="text-amber-600" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-amber-700">
              Improvement Tip
            </h3>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Reduce idle time to increase productivity.
            </p>
          </div>

        </div>


        {/* GOAL */}

        <div className="flex gap-3 p-3.5 rounded-xl bg-violet-50 border border-violet-100">

          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <Target size={16} className="text-violet-600" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-violet-700">
              Daily Goal
            </h3>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Target productivity: 90%
            </p>
          </div>

        </div>

      </div>


      {/* GOAL PROGRESS */}

      <div className="mt-5 pt-5 border-t border-slate-100">

        <div className="flex items-center justify-between mb-3">

          <div>
            <h3 className="text-sm font-bold text-slate-700">
              Goal Progress
            </h3>

            <p className="text-[10px] text-slate-400 mt-0.5">
              Target: 90%
            </p>
          </div>

          <span className="text-sm font-bold text-violet-600">
            {productivityPercentage}%
          </span>

        </div>


        <div className="h-2.5 bg-violet-100 rounded-full overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                productivityPercentage,
                100
              )}%`,
            }}
          />

        </div>


        <div className="flex items-center justify-between mt-2">

          <span className="text-[10px] text-slate-400">
            Current
          </span>

          <span className="text-[10px] font-semibold text-violet-600">
            90% goal
          </span>

        </div>

      </div>

    </div>

  </div>

</div>


);
};

export default Productivity;
