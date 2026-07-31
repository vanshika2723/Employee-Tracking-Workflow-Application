import {
  Building2Icon,
  CalendarIcon,
  FileTextIcon,
  UserIcon,
  UsersIcon,
  ActivityIcon,
  CoffeeIcon,
  ClockIcon,TimerIcon
} from "lucide-react";
import React,{useState,useEffect} from "react";
import LiveEmployeeTable from "./admin/LiveEmployeeTable";
import AttendanceReport from "./admin/AttendanceReport";
import DepartmentPerformance from "./admin/DepartmentPerformance";
import ProductivityAnalytics from "./admin/ProductivityAnalytics";
import WorkflowTracker from "../components/admin/WorkflowTracker";
import ReportExport from "./admin/ReportExport";
import ShiftManagement from "./admin/ShiftManagement";
import TeamPerformance from "./admin/TeamPerformance";
import Notifications from "./dashboard/Notifications";
import PayrollManagement from "./admin/PayrollManagement";
import AttendancePolicyManagement from "./admin/AttendancePolicyManagement";
import AttendancePayrollSummary from "./admin/AttendanceManagement";
import TopPerformers from "./admin/TopPerformers";
import NotificationBell from "./notifications/NotificationBell";

const AdminDashboard = ({ data, onRefresh, filter, setFilter, refresh }) => {
const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {

  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);

}, []);
 const stats = [
  {
    icon: UsersIcon,
    value: data.totalEmployees || 0,
    label: "Total Employees",
    description: `Across ${data.totalDepartments || 0} departments`,
  },
  {
    icon: ActivityIcon,
    value: data.activeEmployees || 0,
    label: "Active Now",
    description: `${data.onlinePercentage || 75}% online`,
  },
  {
    icon: CoffeeIcon,
    value: data.idleEmployees || 0,
    label: "Idle / On Break",
    description: "Needs attention",
  },
  {
    icon: ClockIcon,
    value: data.lateLogins || 0,
    label: "Late Logins Today",
    description: `Since ${data.lateLoginTime || "09:30 AM"}`,
  },
  {
    icon: TimerIcon,
    value: data.overtimeHours || "0h 0m",
    label: "Overtime Hours (Today)",
    description: `${data.overtimeEmployees || 6} employees`,
  },
];
 return (
  <div className="animate-fade-in">

    {/* ================= HEADER ================= */}
    <div className="page-header">

      <div className="flex justify-between items-center w-full">

        {/* LEFT SIDE */}
        <div>
          <h1 className="page-title">
            Welcome back, Admin 👋
          </h1>

          <p className="page-subtitle">
            Here's how your team is performing today.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">

          {/* DATE */}
          <div className="flex items-center gap-2">
            <span className="text-xl">
              📅
            </span>

            <span className="text-sm font-medium text-slate-600">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* TIME */}
          <div className="flex items-center gap-2">
            <span className="text-xl">
              🕐
            </span>

            <span className="text-sm font-bold text-slate-700">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </span>
          </div>

          {/* NOTIFICATION */}
          <NotificationBell />

          {/* ADMIN PROFILE */}
          <div className="flex items-center gap-3 border-l pl-5">

            <div
              className="
                w-11 h-11
                rounded-full
                bg-indigo-600
                text-white
                flex
                items-center
                justify-center
                font-bold
                shadow
              "
            >
              {`${data?.admin?.firstName?.[0] || ""}${
                data?.admin?.lastName?.[0] || ""
              }`.toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {data?.admin?.firstName} {data?.admin?.lastName}
              </p>

              <p className="text-xs text-slate-500">
                {data?.admin?.role || "Administrator"}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>


    {/* ================= SUMMARY ================= */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-8">

      {stats.map((s) => {
        const Icon = s.icon;

        return (
          <div
            key={s.label}
            className="
              card card-hover
              p-4
              relative
              overflow-hidden
              group
              flex
              items-center
              justify-between
            "
          >

            <div>

              <div
                className="
                  absolute
                  left-0
                  top-0
                  bottom-0
                  w-1
                  rounded-r-full
                  bg-slate-500/70
                  group-hover:bg-indigo-500/70
                "
              />

              <p className="text-sm font-medium text-slate-700">
                {s.label}
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {s.value}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {s.description}
              </p>

            </div>

            <Icon
              className="
                size-8
                p-2
                rounded-lg
                bg-slate-100
                text-slate-600
                group-hover:bg-indigo-50
                group-hover:text-indigo-600
                transition-colors
                duration-200
              "
            />

          </div>
        );
      })}

    </div>


    {/* ================= MAIN CONTENT ================= */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT SIDE - LIVE EMPLOYEES */}
      <div className="lg:col-span-2">
        <LiveEmployeeTable refresh={refresh} />
      </div>


      {/* RIGHT SIDE */}
      <div className="lg:col-span-1 space-y-6">

        <Notifications />

        <TopPerformers />

      </div>

    </div>

  </div>
);
};
export default AdminDashboard;
