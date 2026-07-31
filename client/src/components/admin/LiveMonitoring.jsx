import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  CircleCheck,
  Clock3,
  Circle,
  Keyboard,
  MousePointer2,
  LockKeyhole,
  RefreshCw,
} from "lucide-react";
import api from "../../api/axios";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

const formatTimer = (minutes = 0) => {
  const totalSeconds = Math.max(0, Math.floor(minutes * 60));

  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};

const getInitial = (employee) => {
  return (
    employee?.name?.charAt(0) ||
    employee?.firstName?.charAt(0) ||
    "U"
  ).toUpperCase();
};

const getEmployeeName = (employee) => {
  if (employee?.name) return employee.name;

  return `${employee?.firstName || ""} ${
    employee?.lastName || ""
  }`.trim() || "Unknown Employee";
};

const getStatus = (employee) => {
  if (employee?.status) {
    return employee.status.toUpperCase();
  }

  if (employee?.isIdle) return "IDLE";

  if (employee?.isOnline) return "ACTIVE";

  return "OFFLINE";
};

const getLastActivity = (employee) => {
  if (!employee?.lastActivity) {
    return "No activity";
  }

  const last = new Date(employee.lastActivity);

  if (Number.isNaN(last.getTime())) {
    return employee.lastActivity;
  }

  const diff = Math.floor((Date.now() - last.getTime()) / 1000);

  if (diff < 60) {
    return "Just now";
  }

  const minutes = Math.floor(diff / 60);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ${minutes % 60}m ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
};

const LiveMonitoring = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // FETCH LIVE EMPLOYEES
  // =====================================================

  const fetchEmployees = async () => {
    try {
      setRefreshing(true);

      const res = await api.get("/dashboard/live-employees");

      const data = res.data?.data || res.data || [];

      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Live monitoring fetch error:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchEmployees();

    const interval = setInterval(() => {
      fetchEmployees();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // SOCKET REAL TIME UPDATE
  // =====================================================

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Live Monitoring Socket Connected");
    });

    socket.on("employeeActivityUpdate", (updatedEmployee) => {
      if (!updatedEmployee) return;

      setEmployees((prev) => {
        const id =
          updatedEmployee.employeeId ||
          updatedEmployee._id ||
          updatedEmployee.id;

        const exists = prev.some(
          (employee) =>
            employee.employeeId === id ||
            employee._id === id ||
            employee.id === id
        );

        if (!exists) {
          return [...prev, updatedEmployee];
        }

        return prev.map((employee) => {
          const employeeId =
            employee.employeeId ||
            employee._id ||
            employee.id;

          return employeeId === id
            ? {
                ...employee,
                ...updatedEmployee,
              }
            : employee;
        });
      });
    });

    socket.on("employeeTimerUpdate", (updatedEmployee) => {
      if (!updatedEmployee) return;

      setEmployees((prev) =>
        prev.map((employee) => {
          const employeeId =
            employee.employeeId ||
            employee._id ||
            employee.id;

          const updateId =
            updatedEmployee.employeeId ||
            updatedEmployee._id ||
            updatedEmployee.id;

          if (employeeId !== updateId) {
            return employee;
          }

          return {
            ...employee,
            ...updatedEmployee,
          };
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // =====================================================
  // DEPARTMENTS
  // =====================================================

  const departments = useMemo(() => {
    const list = employees
      .map(
        (employee) =>
          employee.department ||
          employee.departmentName
      )
      .filter(Boolean);

    return [...new Set(list)];
  }, [employees]);

  // =====================================================
  // COUNTS
  // =====================================================

  const onlineCount = employees.filter(
    (employee) => getStatus(employee) === "ACTIVE"
  ).length;

  const idleCount = employees.filter(
    (employee) => getStatus(employee) === "IDLE"
  ).length;

  const offlineCount = employees.filter(
    (employee) => getStatus(employee) === "OFFLINE"
  ).length;

  // =====================================================
  // FILTER EMPLOYEES
  // =====================================================

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const name = getEmployeeName(employee).toLowerCase();

      const position = (
        employee.position ||
        employee.designation ||
        ""
      ).toLowerCase();

      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        position.includes(search.toLowerCase());

      const employeeDepartment =
        employee.department ||
        employee.departmentName ||
        "";

      const matchesDepartment =
        department === "ALL" ||
        employeeDepartment === department;

      const matchesStatus =
        statusFilter === "ALL" ||
        getStatus(employee) === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    employees,
    search,
    department,
    statusFilter,
  ]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="p-6 md:p-8">

        <div className="bg-white rounded-3xl border p-10 text-center">

          <RefreshCw
            className="animate-spin mx-auto text-indigo-500"
            size={28}
          />

          <p className="text-gray-500 mt-3">
            Loading live employees...
          </p>

        </div>

      </div>
    );
  }

  return (
  <div className="p-5 md:p-6">

    {/* ================= HEADER ================= */}

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

  {/* Heading */}
  <div>

    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
      Live Monitoring
    </h1>

    <p className="text-sm text-slate-500 mt-1">
      Monitor employee activity in real time
    </p>

  </div>


  {/* Refresh Button */}
  <button
    onClick={fetchEmployees}
    disabled={refreshing}
    className="
      flex items-center justify-center gap-2
      px-4 py-2.5
      rounded-xl
      bg-indigo-600
      text-white
      text-sm font-semibold
      shadow-sm
      transition
      hover:bg-indigo-700
      hover:shadow
      disabled:opacity-60
      disabled:cursor-not-allowed
    "
  >

    <RefreshCw
      size={16}
      className={refreshing ? "animate-spin" : ""}
    />

    {refreshing ? "Refreshing..." : "Refresh"}

  </button>

</div>


    {/* ================= SUMMARY ================= */}

  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">

  {/* ONLINE */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

    <div className="flex items-center gap-3">

      <div className="
        w-10 h-10 rounded-xl
        bg-green-50
        flex items-center justify-center
        text-lg
      ">
        🟢
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-900">
          {onlineCount}
        </p>

        <p className="text-xs text-slate-500 mt-0.5">
          Online now
        </p>
      </div>

    </div>

  </div>


  {/* IDLE */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

    <div className="flex items-center gap-3">

      <div className="
        w-10 h-10 rounded-xl
        bg-amber-50
        flex items-center justify-center
        text-lg
      ">
        🟡
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-900">
          {idleCount}
        </p>

        <p className="text-xs text-slate-500 mt-0.5">
          Idle
        </p>
      </div>

    </div>

  </div>


  {/* OFFLINE */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

    <div className="flex items-center gap-3">

      <div className="
        w-10 h-10 rounded-xl
        bg-slate-100
        flex items-center justify-center
        text-lg
      ">
        ⚪
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-900">
          {offlineCount}
        </p>

        <p className="text-xs text-slate-500 mt-0.5">
          Offline
        </p>
      </div>

    </div>

  </div>


  {/* TOTAL */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

    <div className="flex items-center gap-3">

      <div className="
        w-10 h-10 rounded-xl
        bg-indigo-50
        text-indigo-600
        flex items-center justify-center
      ">
        <Users size={20} />
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-900">
          {employees.length}
        </p>

        <p className="text-xs text-slate-500 mt-0.5">
          Total employees
        </p>
      </div>

    </div>

  </div>

</div>


    {/* ================= FILTER ================= */}

    <div className="
  bg-white
  border border-slate-200
  rounded-2xl
  p-3.5
  shadow-sm
  mb-5
">

  <div className="flex flex-col md:flex-row gap-3">

    {/* SEARCH */}

    <div className="relative flex-1">

      <Search
        size={17}
        className="
          absolute left-3 top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      <input
        type="text"
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          pl-9 pr-4 py-2.5
          rounded-xl
          border border-slate-200
          bg-white
          text-sm text-slate-700
          placeholder:text-slate-400
          outline-none
          shadow-sm
          transition
          focus:border-indigo-400
          focus:ring-2
          focus:ring-indigo-100
        "
      />

    </div>


    {/* DEPARTMENT */}

    <select
      value={department}
      onChange={(e) => setDepartment(e.target.value)}
      className="
        px-4 py-2.5
        rounded-xl
        border border-slate-200
        bg-white
        text-sm text-slate-700
        outline-none
        shadow-sm
        cursor-pointer
        transition
        focus:border-indigo-400
        focus:ring-2
        focus:ring-indigo-100
      "
    >

      <option value="ALL">
        All Departments
      </option>

      {departments.map((dept) => (
        <option key={dept} value={dept}>
          {dept}
        </option>
      ))}

    </select>


    {/* STATUS */}

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="
        px-4 py-2.5
        rounded-xl
        border border-slate-200
        bg-white
        text-sm text-slate-700
        outline-none
        shadow-sm
        cursor-pointer
        transition
        focus:border-indigo-400
        focus:ring-2
        focus:ring-indigo-100
      "
    >

      <option value="ALL">
        All Status
      </option>

      <option value="ACTIVE">
        Active
      </option>

      <option value="IDLE">
        Idle
      </option>

      <option value="OFFLINE">
        Offline
      </option>

    </select>

  </div>

</div>


    {/* ================= EMPLOYEES ================= */}

    {filteredEmployees.length === 0 ? (

  <div className="
    bg-white
    border border-slate-200
    rounded-2xl
    p-12
    text-center
    shadow-sm
  ">

    <div className="
      w-12 h-12
      mx-auto
      rounded-xl
      bg-slate-50
      flex items-center
      justify-center
    ">

      <Users
        size={24}
        className="text-slate-300"
      />

    </div>

    <h3 className="
      font-semibold
      text-slate-700
      mt-4
    ">
      No employees found
    </h3>

    <p className="
      text-sm
      text-slate-500
      mt-1
    ">
      Try changing your search or filters.
    </p>

  </div>



    ) : (

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

  {filteredEmployees.map((employee) => {

    const status = getStatus(employee);

    const keyboard =
      employee.keyboardActivity ||
      (
        status === "ACTIVE"
          ? "Active"
          : status === "IDLE"
          ? "Idle"
          : "—"
      );

    const mouse =
      employee.mouseActivity ||
      (
        status === "ACTIVE"
          ? "Active"
          : status === "IDLE"
          ? "Idle"
          : "—"
      );

    const screenLock =
      employee.screenLock ||
      employee.screenLockStatus ||
      (
        status === "OFFLINE"
          ? "Locked"
          : "Unlocked"
      );

    return (

     <div
  key={
    employee._id ||
    employee.employeeId ||
    employee.id
  }
  className="
    bg-white
    border border-slate-200
    rounded-xl
    shadow-sm
    p-4
    hover:shadow-md
    transition
  "
>
  {/* ================= EMPLOYEE HEADER ================= */}

  <div className="flex items-center justify-between gap-3">

    <div className="flex items-center gap-2.5 min-w-0">

      <div className="
        w-9 h-9
        rounded-full
        bg-indigo-50
        border border-indigo-100
        text-indigo-600
        flex items-center justify-center
        text-sm font-bold
        shrink-0
      ">
        {getInitial(employee)}
      </div>

      <div className="min-w-0">

        <h3 className="
          text-sm
          font-semibold
          text-slate-900
          truncate
        ">
          {getEmployeeName(employee)}
        </h3>

        <p className="
          text-[11px]
          text-slate-500
          truncate
        ">
          {employee.position ||
            employee.designation ||
            "Employee"}
        </p>

      </div>

    </div>


    {/* STATUS */}

    <span
      className={`px-2 py-0.5 rounded-full
        text-[10px] font-semibold shrink-0 ${
        status === "ACTIVE"
          ? "bg-green-50 text-green-700"
          : status === "IDLE"
          ? "bg-amber-50 text-amber-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {status === "ACTIVE"
        ? "Active"
        : status === "IDLE"
        ? "Idle"
        : "Offline"}
    </span>

  </div>


  {/* ================= SESSION + ACTIVITY ================= */}

  <div className="
    mt-3
    grid grid-cols-2
    gap-2
  ">

    {/* SESSION */}

    <div className="
      bg-slate-50
      border border-slate-100
      rounded-lg
      px-3 py-2
    ">

      <div className="flex items-center gap-1.5">

        <Clock3
          size={14}
          className="text-indigo-500"
        />

        <span className="text-[10px] text-slate-500">
          Session
        </span>

      </div>

      <p className="
        text-base
        font-bold
        text-indigo-600
        mt-0.5
      ">
        {status === "OFFLINE"
          ? "00:00:00"
          : formatTimer(
              employee.sessionMinutes ||
              employee.workingMinutes ||
              employee.workingHours * 60 ||
              0
            )}
      </p>

    </div>


    {/* LAST ACTIVITY */}

    <div className="
      bg-slate-50
      border border-slate-100
      rounded-lg
      px-3 py-2
    ">

      <p className="text-[10px] text-slate-500">
        Last Activity
      </p>

      <p className="
        text-xs
        font-semibold
        text-slate-700
        mt-1
        truncate
      ">
        {getLastActivity(employee)}
      </p>

    </div>

  </div>


  {/* ================= ACTIVITY ================= */}

  <div className="
    grid grid-cols-3
    gap-2
    mt-2
  ">

    {/* KEYBOARD */}

    <div className="
      border border-slate-200
      rounded-lg
      px-2.5 py-2
    ">

      <div className="flex items-center gap-1">

        <Keyboard
          size={13}
          className="text-indigo-500"
        />

        <span className="text-[10px] text-slate-500">
          Keyboard
        </span>

      </div>

      <p
        className={`text-[11px] font-semibold mt-1 ${
          keyboard === "Active"
            ? "text-green-600"
            : keyboard === "Idle"
            ? "text-amber-600"
            : "text-slate-400"
        }`}
      >
        {keyboard}
      </p>

    </div>


    {/* MOUSE */}

    <div className="
      border border-slate-200
      rounded-lg
      px-2.5 py-2
    ">

      <div className="flex items-center gap-1">

        <MousePointer2
          size={13}
          className="text-blue-500"
        />

        <span className="text-[10px] text-slate-500">
          Mouse
        </span>

      </div>

      <p
        className={`text-[11px] font-semibold mt-1 ${
          mouse === "Active"
            ? "text-green-600"
            : mouse === "Idle"
            ? "text-amber-600"
            : "text-slate-400"
        }`}
      >
        {mouse}
      </p>

    </div>


    {/* SCREEN */}

    <div className="
      border border-slate-200
      rounded-lg
      px-2.5 py-2
    ">

      <div className="flex items-center gap-1">

        <LockKeyhole
          size={13}
          className="text-purple-500"
        />

        <span className="text-[10px] text-slate-500">
          Screen
        </span>

      </div>

      <p
        className={`text-[11px] font-semibold mt-1 ${
          screenLock === "Unlocked"
            ? "text-green-600"
            : screenLock === "Locked"
            ? "text-red-600"
            : "text-slate-400"
        }`}
      >
        {screenLock}
      </p>

    </div>

  </div>

</div>

    );

  })}

</div>

    )}

  </div>
);
};

export default LiveMonitoring;