
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../../api/axios";

import {
  CalendarDays,
  ChevronDown,
  Bell,
  Settings2,
  Users,
  Clock3,
  LogOut,
  CircleDollarSign,
  TrendingUp,
  Minus,
  Search,
  Save,
  RefreshCw,
} from "lucide-react";

const PayrollManagement = () => {

  // =====================================================
  // MAIN TAB
  // =====================================================

  const [activeTab, setActiveTab] = useState("attendance");


  // =====================================================
  // PAYROLL STATES
  // =====================================================

  const [employeeFilter, setEmployeeFilter] =
    useState("All Employees");

  const [search, setSearch] = useState("");

  const [month, setMonth] = useState("7");

  const [year, setYear] = useState("2026");

  const [payrollData, setPayrollData] = useState([]);

  const [summary, setSummary] = useState({
    presentDays: 0,
    halfDays: 0,
    lateLogins: 0,
    earlyLogouts: 0,
    overtimeHours: 0,
    idleMinutes: 0,
    totalLossOfPay: 0,
  });

  const [loading, setLoading] = useState(true);


  // =====================================================
  // POLICY STATES
  // =====================================================

const [policy, setPolicy] = useState({
  minimumWorkingHours: 8,
  halfDayHours: 4,
  overtimeAfter: 9,

  allowedIdleTime: 60,
  idleDeductionRate: 2,
  idleAdjustmentTrigger: 240,

  breakPolicy: "FIXED",
  breakDuration: 45,
  maxBreakCount: 3,
  breakOverrunPenaltyRate: 1,
  breakOverrunPenaltyInterval: 15,

  gracePeriod: 15,
  logoutGracePeriod: 10,
  lateLoginLimitPerMonth: 3,
});

  const [policyLoading, setPolicyLoading] = useState(false);

  const [policySaving, setPolicySaving] = useState(false);


  // =====================================================
  // FORMAT HOURS
  // =====================================================

  const formatHours = (hours = 0) => {

    const totalMinutes =
      Math.round(Number(hours) * 60);

    const h =
      Math.floor(totalMinutes / 60);

    const m =
      totalMinutes % 60;

    return `${h}h ${m}m`;
  };


  // =====================================================
  // FILTER EMPLOYEES
  // =====================================================

  const filteredEmployees = useMemo(() => {

    return payrollData.filter((employee) => {

      const matchesSearch =
        employee.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesEmployee =
        employeeFilter === "All Employees" ||
        employee.name === employeeFilter;

      return matchesSearch && matchesEmployee;

    });

  }, [
    search,
    employeeFilter,
    payrollData,
  ]);


  // =====================================================
  // TOTAL LOSS OF PAY
  // =====================================================

  const totalLossOfPay =
    payrollData.reduce(
      (sum, employee) =>
        sum + Number(employee.lossOfPay || 0),
      0
    );


  // =====================================================
  // FETCH PAYROLL REPORT
  // =====================================================

  const fetchPayrollReport = async () => {

    try {

      setLoading(true);

      const res = await api.get(
        `/payroll/attendance-payroll-report?month=${month}&year=${year}`
      );

      setPayrollData(
        Array.isArray(res.data?.employees)
          ? res.data.employees
          : []
      );

      setSummary(
        res.data?.summary || {
          presentDays: 0,
          halfDays: 0,
          lateLogins: 0,
          earlyLogouts: 0,
          overtimeHours: 0,
          idleMinutes: 0,
          totalLossOfPay: 0,
        }
      );

    } catch (error) {

      console.error(
        "Payroll report error:",
        error
      );

      setPayrollData([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FETCH POLICY
  // =====================================================

 const fetchPolicy = async () => {
  try {
    setPolicyLoading(true);

    const res = await api.get("/policy");

    const data = res.data?.data || res.data?.policy || res.data;

    if (data) {
      setPolicy({
        minimumWorkingHours: data.minimumWorkingHours ?? 8,
        halfDayHours: data.halfDayHours ?? 4,
        overtimeAfter: data.overtimeAfter ?? 9,

        allowedIdleTime: data.allowedIdleTime ?? 60,
        idleDeductionRate: data.idleDeductionRate ?? 2,
        idleAdjustmentTrigger:
          data.idleAdjustmentTrigger ?? 240,

        breakPolicy: data.breakPolicy ?? "FIXED",
        breakDuration: data.breakDuration ?? 45,
        maxBreakCount: data.maxBreakCount ?? 3,
        breakOverrunPenaltyRate:
          data.breakOverrunPenaltyRate ?? 1,
        breakOverrunPenaltyInterval:
          data.breakOverrunPenaltyInterval ?? 15,

        gracePeriod: data.gracePeriod ?? 15,
        logoutGracePeriod:
          data.logoutGracePeriod ?? 10,
        lateLoginLimitPerMonth:
          data.lateLoginLimitPerMonth ?? 3,
      });
    }
  } catch (error) {
    console.error("Policy fetch error:", error);
  } finally {
    setPolicyLoading(false);
  }
};

const defaultPolicy = {
  minimumWorkingHours: 8,
  halfDayHours: 4,
  overtimeAfter: 9,

  allowedIdleTime: 60,
  idleDeductionRate: 2,
  idleAdjustmentTrigger: 240,

  breakPolicy: "FIXED",
  breakDuration: 45,
  maxBreakCount: 3,
  breakOverrunPenaltyRate: 1,
  breakOverrunPenaltyInterval: 15,

  gracePeriod: 15,
  logoutGracePeriod: 10,
  lateLoginLimitPerMonth: 3,
};

const resetPolicy = () => {
  setPolicy(defaultPolicy);
};
  // =====================================================
  // SAVE POLICY
  // ============
  // 
  // =========================================

  const savePolicy = async () => {

    try {

      setPolicySaving(true);

      await api.put(
        "/policy",
        policy
      );

      alert(
        "Attendance policy updated successfully"
      );

    } catch (error) {

      console.error(
        "Policy save error:",
        error
      );

      alert(
        error.response?.data?.error ||
        "Failed to update policy"
      );

    } finally {

      setPolicySaving(false);

    }

  };


  // =====================================================
  // POLICY INPUT
  // =====================================================

  const handlePolicyChange = (
    field,
    value
  ) => {

    setPolicy((prev) => ({
      ...prev,
      [field]: value,
    }));

  };


  // =====================================================
  // EFFECT
  // =====================================================

  useEffect(() => {

    if (activeTab === "attendance") {

      fetchPayrollReport();

    }

  }, [
    month,
    year,
    activeTab,
  ]);


  useEffect(() => {

    if (activeTab === "policies") {

      fetchPolicy();

    }

  }, [activeTab]);


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="min-h-full bg-gray-50 p-5 md:p-7">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col lg:flex-row
  lg:items-center lg:justify-between gap-4 mb-6">

  {/* LEFT SIDE */}
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
      Attendance & Payroll
    </h1>

    <p className="text-sm text-slate-500 mt-1">
      Manage employee attendance, payroll and configurable workplace policies
    </p>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex items-center gap-3">

    {activeTab === "attendance" && (

      <div className="relative">

        <CalendarDays
          size={16}
          className="absolute left-3 top-1/2
          -translate-y-1/2 text-slate-400 pointer-events-none"
        />

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="
            appearance-none
            pl-9 pr-9
            py-2.5
            bg-white
            border border-slate-200
            rounded-xl
            text-sm font-medium
            text-slate-700
            shadow-sm
            outline-none
            cursor-pointer
            transition
            hover:border-slate-300
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        >
          <option value="7">
            July 2026
          </option>

          <option value="6">
            June 2026
          </option>

          <option value="5">
            May 2026
          </option>

          <option value="4">
            April 2026
          </option>
        </select>

        <ChevronDown
          size={15}
          className="absolute right-3 top-1/2
          -translate-y-1/2 text-slate-400
          pointer-events-none"
        />

      </div>

    )}

  </div>

</div>


      {/* ================================================= */}
      {/* TWO TABS */}
      {/* ================================================= */}

    <div
  className="
    bg-white
    border border-slate-200
    rounded-2xl
    p-1.5
    shadow-sm
    mb-7
    flex flex-col sm:flex-row
    gap-1
  "
>
  {/* Attendance & Payroll */}
  <button
    onClick={() => setActiveTab("attendance")}
    className={`
      flex-1
      flex items-center justify-center gap-2
      px-5 py-3
      rounded-xl
      text-sm font-semibold
      transition-all duration-200
      ${
        activeTab === "attendance"
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }
    `}
  >
    <CalendarDays size={18} />

    <span>Attendance & Payroll</span>
  </button>

  {/* Configurable Policies */}
  <button
    onClick={() => setActiveTab("policies")}
    className={`
      flex-1
      flex items-center justify-center gap-2
      px-5 py-3
      rounded-xl
      text-sm font-semibold
      transition-all duration-200
      ${
        activeTab === "policies"
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }
    `}
  >
    <Settings2 size={18} />

    <span>Configurable Policies</span>
  </button>
</div>

      {/* ================================================= */}
      {/* ATTENDANCE & PAYROLL TAB */}
      {/* ================================================= */}

      {activeTab === "attendance" && (

        <>

          {/* ================================================= */}
          {/* SUMMARY CARDS */}
          {/* ================================================= */}

         <div
  className="
    grid grid-cols-2
    md:grid-cols-3
    xl:grid-cols-6
    gap-4
    mb-7
  "
>
  {/* Present */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">

    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
      <Users size={18} />
    </div>

    <p className="text-2xl font-bold text-slate-900">
      {summary.presentDays}
    </p>

    <p className="text-xs text-slate-500 mt-1">
      Present Days
    </p>
  </div>


  {/* Half Days */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">

    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
      <Clock3 size={18} />
    </div>

    <p className="text-2xl font-bold text-slate-900">
      {summary.halfDays}
    </p>

    <p className="text-xs text-slate-500 mt-1">
      Half Days
    </p>
  </div>


  {/* Late */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">

    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
      <Clock3 size={18} />
    </div>

    <p className="text-2xl font-bold text-slate-900">
      {summary.lateLogins}
    </p>

    <p className="text-xs text-slate-500 mt-1">
      Late Logins
    </p>
  </div>


  {/* Early Logout */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">

    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
      <LogOut size={18} />
    </div>

    <p className="text-2xl font-bold text-slate-900">
      {summary.earlyLogouts}
    </p>

    <p className="text-xs text-slate-500 mt-1">
      Early Logouts
    </p>
  </div>


  {/* Overtime */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">

    <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
      <TrendingUp size={18} />
    </div>

    <p className="text-2xl font-bold text-slate-900">
      {formatHours(summary.overtimeHours)}
    </p>

    <p className="text-xs text-slate-500 mt-1">
      Overtime Hours
    </p>
  </div>


  {/* Idle */}
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">

    <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-3">
      <Minus size={18} />
    </div>

    <p className="text-2xl font-bold text-slate-900">
      {formatHours(summary.idleMinutes / 60)}
    </p>

    <p className="text-xs text-slate-500 mt-1">
      Idle Deductions
    </p>
  </div>

</div>

          {/* ================================================= */}
          {/* PAYROLL TABLE */}
          {/* ================================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-5 border-b border-slate-200">

              <div className="flex flex-col
              lg:flex-row lg:items-center
              lg:justify-between gap-4">

                <div>

               <h2 className="text-base font-bold text-slate-900">

                    Employee-wise Payroll Impact

                  </h2>

                 <p className="text-xs text-slate-500 mt-1">

                    Auto-calculated from attendance,
                    idle and activity logs

                  </p>

                </div>


                <div className="flex flex-col
                sm:flex-row gap-3">


                  {/* Search */}

                  <div className="relative">

                    <Search
                      size={16}
                      className="absolute left-3
                      top-1/2 -translate-y-1/2
                     text-slate-400"
                    />

                    <input
                      type="text"
                      placeholder="Search employee..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      className="w-full sm:w-56
  pl-9 pr-3 py-2.5
  rounded-xl
  border border-slate-200
  bg-white
  text-sm text-slate-700
  outline-none
  shadow-sm
  transition
  placeholder:text-slate-400
  focus:border-indigo-400
  focus:ring-2
  focus:ring-indigo-100"
                    />

                  </div>


                  {/* Employee Filter */}

                  <select
                    value={employeeFilter}
                    onChange={(e) =>
                      setEmployeeFilter(e.target.value)
                    }
                  className="px-3 py-2.5
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
  focus:ring-indigo-100"
                  >

                    <option>
                      All Employees
                    </option>

                    {payrollData.map(
                      (employee) => (

                        <option
                          key={employee.name}
                          value={employee.name}
                        >
                          {employee.name}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>

            </div>


            {/* Loading */}

            {loading ? (

              <div className="p-12 text-center">

                <RefreshCw
                  size={28}
                  className="mx-auto
                  text-indigo-500 animate-spin"
                />

                <p className="text-sm
                text-gray-500 mt-3">

                  Loading payroll data...

                </p>

              </div>

            ) : (

              <>

                {/* TABLE */}

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[1200px]">

                    <thead className="bg-slate-50 border-y border-slate-200">

                      <tr>

                        <th className="text-left px-5 py-4
                        text-xs font-semibold
                        text-slate-500">
                          Employee
                        </th>

                        <th className="px-4 py-4
                        text-xs font-semibold
                        text-slate-500">
                          Present
                        </th>

                        <th className="px-4 py-4
                        text-xs font-semibold
                        text-slate-500">
                          Half Day
                        </th>

                        <th className="px-4 py-4
                        text-xs font-semibold
                        text-slate-500">
                          Late Login
                        </th>

                        <th className="px-4 py-4
                        text-xs font-semibold
                        text-slate-500">
                          Early Logout
                        </th>

                        <th className="px-4 py-4
                        text-xs font-semibold
                        text-slate-500">
                          Overtime
                        </th>

                        <th className="px-4 py-4
                        text-xs font-semibold
                        text-slate-500">
                          Idle Ded.
                        </th>

                        <th className="px-4 py-4
                        text-xs font-semibold
                        text-slate-500">
                          Productivity Ded.
                        </th>

                        <th className="px-4 py-4
                        text-xs font-semibold
                        text-slate-500">
                          Attendance Adj.
                        </th>

                        <th className="px-5 py-4
                        text-xs font-semibold
                        text-slate-500 text-right">
                          Loss of Pay
                        </th>

                      </tr>

                    </thead>


                <tbody className="divide-y divide-slate-100">

                      {filteredEmployees.map(
                        (employee) => (

                          <tr
                            key={employee.name}
                           className="hover:bg-slate-50 transition"
                          >

                            <td className="px-5 py-4">

                              <div className="flex
                              items-center gap-3">

                               <div className="w-9 h-9
  rounded-full
  bg-indigo-50
  text-indigo-600
  flex items-center
  justify-center
  font-bold text-sm">

                                  {employee.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}

                                </div>

                              <span className="font-semibold
  text-slate-800 whitespace-nowrap">

                                  {employee.name}

                                </span>

                              </div>

                            </td>


                            <td className="text-center
                            px-4 py-4 font-semibold
                            text-gray-700">

                              {employee.present}

                            </td>


                            <td className="text-center
                            px-4 py-4 font-semibold
                            text-gray-700">

                              {employee.halfDay}

                            </td>


                            <td className="text-center
                            px-4 py-4">

                              <span
                                className={
                                  employee.lateLogin > 3
                                    ? "text-red-600 font-semibold"
                                    : "text-gray-700 font-medium"
                                }
                              >

                                {employee.lateLogin}

                              </span>

                            </td>


                            <td className="text-center
                            px-4 py-4">

                              <span className="text-gray-700
                              font-medium">

                                {employee.earlyLogout}

                              </span>

                            </td>


                          <td className="text-center px-4 py-4">
  <span className="text-green-600 font-semibold">
    {formatHours(employee.overtime)}
  </span>
</td>


                            <td className="text-center
                            px-4 py-4">

                              <span
                                className={
                                  employee.idleDeduction !==
                                  "0h 00m"
                                    ? "text-yellow-600 font-medium"
                                    : "text-gray-500"
                                }
                              >

                                {employee.idleDeduction}

                              </span>

                            </td>


                            <td className="text-center
                            px-4 py-4">

                              {employee.productivityDeduction ===
                              "None" ? (

                                <span className="text-gray-400">
                                  None
                                </span>

                              ) : (

                                <span className="px-2 py-1
                                rounded-lg bg-red-50
                                text-red-600 text-xs
                                font-semibold">

                                  {employee.productivityDeduction}

                                </span>

                              )}

                            </td>


                            <td className="text-center
                            px-4 py-4">

                              {employee.attendanceAdjustment ===
                              "—" ? (

                                <span className="text-gray-400">
                                  —
                                </span>

                              ) : (

                                <span className="px-2 py-1
                                rounded-lg bg-orange-50
                                text-orange-600 text-xs
                                font-semibold">

                                  {employee.attendanceAdjustment}

                                </span>

                              )}

                            </td>


                            <td className="text-right
                            px-5 py-4">

                              <div className="flex
                              items-center justify-end gap-1">

                                <CircleDollarSign
                                  size={15}
                                  className={
                                    employee.lossOfPay > 0
                                      ? "text-red-500"
                                      : "text-green-500"
                                  }
                                />

                                <span
                                  className={
                                    employee.lossOfPay > 0
                                      ? "font-bold text-red-600"
                                      : "font-semibold text-green-600"
                                  }
                                >

                                  {employee.lossOfPay === 0
                                    ? "£0"
                                    : `£${Number(
                                        employee.lossOfPay
                                      ).toLocaleString(
                                        "en-GB"
                                      )}`}

                                </span>

                              </div>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>


                {/* Empty */}

                {filteredEmployees.length === 0 && (

                  <div className="p-12 text-center">

                    <Users
                      size={40}
                      className="mx-auto
                      text-gray-300"
                    />

                    <h3 className="font-semibold
                    text-gray-700 mt-3">

                      No employees found

                    </h3>

                    <p className="text-sm
                    text-gray-500 mt-1">

                      Try changing your search
                      or employee filter.

                    </p>

                  </div>

                )}

              </>

            )}

          </div>


          {/* ================================================= */}
          {/* LOSS OF PAY LOGIC */}
          {/* ================================================= */}

         <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
  <div className="flex gap-3 items-start">

    {/* Icon */}
    <div className="w-9 h-9 shrink-0 rounded-xl bg-amber-100 flex items-center justify-center text-lg">
      💡
    </div>

    {/* Content */}
    <div className="flex-1">

      <h3 className="text-sm font-bold text-amber-800">
        Loss of Pay Logic
      </h3>

      <p className="text-sm text-amber-900/80 mt-1 leading-6">
        If Idle Time exceeds the allowed idle limit, a
        Productivity Deduction is applied. If the deduction
        crosses the configured policy threshold, an Attendance
        Adjustment such as a half-day or full-day cut is triggered.
      </p>

      {/* Formula */}
      <div className="mt-3 px-4 py-3 bg-white/60 border border-amber-200 rounded-xl">
        <p className="text-xs font-semibold text-amber-900 mb-1">
          Final Loss of Pay
        </p>

        <p className="text-sm font-semibold text-amber-900">
          (Per-day salary × Attendance Adjustment)
          <span className="mx-2 text-amber-500">+</span>
          (Productivity Deduction × Per-day salary)
        </p>
      </div>

    </div>
  </div>
</div>


          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}
<div className="mt-5 flex flex-col
  md:flex-row md:items-center
  md:justify-between gap-3">

  {/* Employee Count */}
  <p className="text-xs text-slate-500">
    Showing{" "}
    <span className="font-semibold text-slate-700">
      {filteredEmployees.length}
    </span>{" "}
    of{" "}
    <span className="font-semibold text-slate-700">
      {payrollData.length}
    </span>{" "}
    employees
  </p>

  {/* Total Loss of Pay */}
  <div className="
    bg-white
    border border-slate-200
    rounded-xl
    px-4 py-2.5
    shadow-sm
    flex items-center
    gap-2
  ">
    <span className="text-xs text-slate-500">
      Total Loss of Pay
    </span>

    <span
      className={`font-bold text-sm ${
        totalLossOfPay > 0
          ? "text-red-600"
          : "text-green-600"
      }`}
    >
      £{totalLossOfPay.toLocaleString("en-GB")}
    </span>
  </div>

</div>

        </>

      )}


      {/* ================================================= */}
      {/* CONFIGURABLE POLICIES TAB */}
      {/* ================================================= */}

     {activeTab === "policies" && (
  <div className="space-y-6">

    {/* ================================================= */}
    {/* POLICY HEADER */}
    {/* ================================================= */}

   <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">

  <div className="flex items-start gap-4">

    {/* Icon */}
    <div className="
      w-10 h-10
      rounded-xl
      bg-indigo-50
      text-indigo-600
      flex items-center
      justify-center
      shrink-0
    ">
      <Settings2 size={20} />
    </div>

    {/* Content */}
    <div>
      <h2 className="text-base md:text-lg font-bold text-slate-900">
        Configurable Attendance & Payroll Policies
      </h2>

      <p className="text-xs md:text-sm text-slate-500 mt-1">
        These rules drive all attendance and payroll calculations above
      </p>
    </div>

  </div>

</div>


    {/* ================================================= */}
    {/* LOADING */}
    {/* ================================================= */}

   {policyLoading ? (

  <div className="
    bg-white
    border border-slate-200
    rounded-2xl
    p-14
    text-center
    shadow-sm
  ">

    <RefreshCw
      size={30}
      className="mx-auto text-indigo-500 animate-spin"
    />

    <p className="text-sm text-slate-500 mt-3">
      Loading policies...
    </p>

  </div>

) : (

  <div className="space-y-6">


        {/* ================================================= */}
        {/* WORKING HOURS */}
        {/* ================================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

  {/* Header */}
  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">

    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
      <span className="text-lg">⏱️</span>
      Working Hours
    </h3>

    <p className="text-xs text-slate-500 mt-1">
      Configure minimum working hours, half day and overtime rules
    </p>

  </div>


  {/* Fields */}
  <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">

    {/* Minimum Working Hours */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Minimum Working Hours
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          step="0.5"
          value={policy.minimumWorkingHours}
          onChange={(e) =>
            handlePolicyChange(
              "minimumWorkingHours",
              Number(e.target.value)
            )
          }
          className="
            w-full
            px-4 py-3 pr-16
            rounded-xl
            border border-slate-200
            bg-white
            text-sm text-slate-700
            outline-none
            shadow-sm
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <span className="
          absolute right-4 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        ">
          Hours
        </span>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        Full day requires
      </p>

    </div>


    {/* Half Day */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Half Day Hours
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          step="0.5"
          value={policy.halfDayHours}
          onChange={(e) =>
            handlePolicyChange(
              "halfDayHours",
              Number(e.target.value)
            )
          }
          className="
            w-full
            px-4 py-3 pr-16
            rounded-xl
            border border-slate-200
            bg-white
            text-sm text-slate-700
            outline-none
            shadow-sm
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <span className="
          absolute right-4 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        ">
          Hours
        </span>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        Below this = Absent
      </p>

    </div>


    {/* Overtime */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Overtime Starts After
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          step="0.5"
          value={policy.overtimeAfter}
          onChange={(e) =>
            handlePolicyChange(
              "overtimeAfter",
              Number(e.target.value)
            )
          }
          className="
            w-full
            px-4 py-3 pr-16
            rounded-xl
            border border-slate-200
            bg-white
            text-sm text-slate-700
            outline-none
            shadow-sm
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <span className="
          absolute right-4 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        ">
          Hours
        </span>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        Hours beyond this count as OT
      </p>

    </div>

  </div>

</div>


        {/* ================================================= */}
        {/* IDLE POLICY */}
        {/* ================================================= */}

       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

  {/* Header */}
  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">

    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
      <span className="text-lg">💤</span>
      Allowed Idle Time
    </h3>

    <p className="text-xs text-slate-500 mt-1">
      Configure idle allowance and productivity deductions
    </p>

  </div>


  {/* Fields */}
  <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">

    {/* Allowed Idle */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Daily Idle Allowance
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          value={policy.allowedIdleTime}
          onChange={(e) =>
            handlePolicyChange(
              "allowedIdleTime",
              Number(e.target.value)
            )
          }
          className="
            w-full
            px-4 py-3 pr-20
            rounded-xl
            border border-slate-200
            bg-white
            text-sm text-slate-700
            outline-none
            shadow-sm
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <span className="
          absolute right-4 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        ">
          Minutes
        </span>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        No deduction within this limit
      </p>

    </div>


    {/* Deduction Rate */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Deduction Rate
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          step="0.1"
          value={policy.idleDeductionRate}
          onChange={(e) =>
            handlePolicyChange(
              "idleDeductionRate",
              Number(e.target.value)
            )
          }
          className="
            w-full
            px-4 py-3 pr-10
            rounded-xl
            border border-slate-200
            bg-white
            text-sm text-slate-700
            outline-none
            shadow-sm
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <span className="
          absolute right-4 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        ">
          %
        </span>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        Pay cut per extra idle hour
      </p>

    </div>


    {/* Adjustment Trigger */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Attendance Adjustment Trigger
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          value={policy.idleAdjustmentTrigger}
          onChange={(e) =>
            handlePolicyChange(
              "idleAdjustmentTrigger",
              Number(e.target.value)
            )
          }
          className="
            w-full
            px-4 py-3 pr-20
            rounded-xl
            border border-slate-200
            bg-white
            text-sm text-slate-700
            outline-none
            shadow-sm
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <span className="
          absolute right-4 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        ">
          Minutes
        </span>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        Idle beyond this cuts a day
      </p>

    </div>

  </div>

</div>

        {/* ================================================= */}
        {/* BREAK POLICY */}
        {/* ================================================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

  {/* Header */}
  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">

    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
      <span className="text-lg">☕</span>
      Break Policies
    </h3>

    <p className="text-xs text-slate-500 mt-1">
      Configure employee break duration and overrun penalties
    </p>

  </div>


  {/* Fields */}
  <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

    {/* Break Policy */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Break Policy
      </label>

      <select
        value={policy.breakPolicy}
        onChange={(e) =>
          handlePolicyChange(
            "breakPolicy",
            e.target.value
          )
        }
        className="
          w-full
          px-4 py-3
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
        <option value="FIXED">
          Fixed
        </option>

        <option value="FLEXIBLE">
          Flexible
        </option>
      </select>

      <p className="text-xs text-slate-400 mt-2">
        How breaks are handled
      </p>

    </div>


    {/* Break Duration */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Paid Break Duration
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          value={policy.breakDuration}
          onChange={(e) =>
            handlePolicyChange(
              "breakDuration",
              Number(e.target.value)
            )
          }
          className="
            w-full
            px-4 py-3 pr-20
            rounded-xl
            border border-slate-200
            bg-white
            text-sm text-slate-700
            outline-none
            shadow-sm
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <span className="
          absolute right-4 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        ">
          Minutes
        </span>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        Per day, doesn't count as idle
      </p>

    </div>


    {/* Max Break Count */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Max Break Count
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          value={policy.maxBreakCount}
          onChange={(e) =>
            handlePolicyChange(
              "maxBreakCount",
              Number(e.target.value)
            )
          }
          className="
            w-full
            px-4 py-3 pr-16
            rounded-xl
            border border-slate-200
            bg-white
            text-sm text-slate-700
            outline-none
            shadow-sm
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <span className="
          absolute right-4 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        ">
          / Day
        </span>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        Number of breaks allowed
      </p>

    </div>


    {/* Overrun Penalty */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Overrun Penalty
      </label>

      <div className="flex gap-2">

        {/* Penalty Rate */}
        <div className="relative flex-1">

          <input
            type="number"
            min="0"
            step="0.1"
            value={policy.breakOverrunPenaltyRate}
            onChange={(e) =>
              handlePolicyChange(
                "breakOverrunPenaltyRate",
                Number(e.target.value)
              )
            }
            className="
              w-full
              px-4 py-3 pr-9
              rounded-xl
              border border-slate-200
              bg-white
              text-sm text-slate-700
              outline-none
              shadow-sm
              transition
              focus:border-indigo-400
              focus:ring-2
              focus:ring-indigo-100
            "
          />

          <span className="
            absolute right-3 top-1/2
            -translate-y-1/2
            text-xs font-medium
            text-slate-400
          ">
            %
          </span>

        </div>


        {/* Penalty Interval */}
        <div className="relative flex-1">

          <input
            type="number"
            min="1"
            value={policy.breakOverrunPenaltyInterval}
            onChange={(e) =>
              handlePolicyChange(
                "breakOverrunPenaltyInterval",
                Number(e.target.value)
              )
            }
            className="
              w-full
              px-3 py-3 pr-12
              rounded-xl
              border border-slate-200
              bg-white
              text-sm text-slate-700
              outline-none
              shadow-sm
              transition
              focus:border-indigo-400
              focus:ring-2
              focus:ring-indigo-100
            "
          />

          <span className="
            absolute right-3 top-1/2
            -translate-y-1/2
            text-xs font-medium
            text-slate-400
          ">
            min
          </span>

        </div>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        Applies after allowance exceeded
      </p>

    </div>

  </div>

</div>

        {/* ================================================= */}
        {/* GRACE TIMINGS */}
        {/* ================================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

  {/* Header */}
  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">

    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
      <span className="text-lg">⏰</span>
      Grace Timings
    </h3>

    <p className="text-xs text-slate-500 mt-1">
      Configure login, logout and monthly late-login rules
    </p>

  </div>


  {/* Fields */}
  <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">

    {/* Login Grace */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Login Grace Period
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          value={policy.gracePeriod}
          onChange={(e) =>
            handlePolicyChange(
              "gracePeriod",
              Number(e.target.value)
            )
          }
          className="
            w-full
            px-4 py-3 pr-20
            rounded-xl
            border border-slate-200
            bg-white
            text-sm text-slate-700
            outline-none
            shadow-sm
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <span className="
          absolute right-4 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        ">
          Minutes
        </span>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        Late login not counted within this
      </p>

    </div>


    {/* Logout Grace */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Logout Grace Period
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          value={policy.logoutGracePeriod}
          onChange={(e) =>
            handlePolicyChange(
              "logoutGracePeriod",
              Number(e.target.value)
            )
          }
          className="
            w-full
            px-4 py-3 pr-20
            rounded-xl
            border border-slate-200
            bg-white
            text-sm text-slate-700
            outline-none
            shadow-sm
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <span className="
          absolute right-4 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        ">
          Minutes
        </span>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        Early logout not counted within this
      </p>

    </div>


    {/* Late Login Limit */}
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Late Login Limit / Month
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          value={policy.lateLoginLimitPerMonth}
          onChange={(e) =>
            handlePolicyChange(
              "lateLoginLimitPerMonth",
              Number(e.target.value)
            )
          }
          className="
            w-full
            px-4 py-3 pr-16
            rounded-xl
            border border-slate-200
            bg-white
            text-sm text-slate-700
            outline-none
            shadow-sm
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <span className="
          absolute right-4 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        ">
          Times
        </span>

      </div>

      <p className="text-xs text-slate-400 mt-2">
        Beyond this → half day cut
      </p>

    </div>

  </div>

</div>


        {/* ================================================= */}
        {/* POLICY SUMMARY */}
        {/* ================================================= */}

<div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 shadow-sm">

  <div className="flex gap-3 items-start">

    {/* Icon */}
    <div className="
      w-9 h-9
      rounded-xl
      bg-indigo-100
      text-indigo-600
      flex items-center
      justify-center
      shrink-0
    ">
      <Settings2 size={19} />
    </div>

    {/* Content */}
    <div className="flex-1">

      <h3 className="font-bold text-indigo-900 text-sm md:text-base">
        Policy Calculation Rules
      </h3>

      <div className="
        grid grid-cols-1
        md:grid-cols-2
        gap-x-10 gap-y-3
        mt-4
      ">

        <p className="text-sm text-indigo-800">
          • Full day:{" "}
          <span className="font-semibold text-indigo-900">
            {policy.minimumWorkingHours}h
          </span>{" "}
          or more
        </p>

        <p className="text-sm text-indigo-800">
          • Half day:{" "}
          <span className="font-semibold text-indigo-900">
            {policy.halfDayHours}h
          </span>{" "}
          to less than full day
        </p>

        <p className="text-sm text-indigo-800">
          • Overtime: after{" "}
          <span className="font-semibold text-indigo-900">
            {policy.overtimeAfter}h
          </span>
        </p>

        <p className="text-sm text-indigo-800">
          • Idle allowance:{" "}
          <span className="font-semibold text-indigo-900">
            {policy.allowedIdleTime} min/day
          </span>
        </p>

        <p className="text-sm text-indigo-800">
          • Idle deduction:{" "}
          <span className="font-semibold text-indigo-900">
            {policy.idleDeductionRate}%
          </span>{" "}
          per extra hour
        </p>

        <p className="text-sm text-indigo-800">
          • Idle adjustment:{" "}
          <span className="font-semibold text-indigo-900">
            {policy.idleAdjustmentTrigger} min
          </span>
        </p>

        <p className="text-sm text-indigo-800">
          • Paid break:{" "}
          <span className="font-semibold text-indigo-900">
            {policy.breakDuration} min/day
          </span>
        </p>

        <p className="text-sm text-indigo-800">
          • Login grace:{" "}
          <span className="font-semibold text-indigo-900">
            {policy.gracePeriod} min
          </span>
        </p>

        <p className="text-sm text-indigo-800">
          • Logout grace:{" "}
          <span className="font-semibold text-indigo-900">
            {policy.logoutGracePeriod} min
          </span>
        </p>

        <p className="text-sm text-indigo-800">
          • Late login limit:{" "}
          <span className="font-semibold text-indigo-900">
            {policy.lateLoginLimitPerMonth}/month
          </span>
        </p>

      </div>

    </div>

  </div>

</div>

        {/* ================================================= */}
        {/* ACTION BUTTONS */}
        {/* ================================================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

    {/* Info */}
    <div>

      <p className="font-semibold text-slate-900">
        Save Policy Changes
      </p>

      <p className="text-xs text-slate-500 mt-1">
        Changes will affect attendance and payroll calculations.
      </p>

    </div>


    {/* Actions */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

      {/* Reset */}
      <button
        type="button"
        onClick={resetPolicy}
        disabled={policySaving}
        className="
          flex items-center justify-center gap-2
          px-5 py-2.5
          rounded-xl
          border border-slate-200
          bg-white
          text-slate-700
          text-sm font-semibold
          shadow-sm
          transition
          hover:bg-slate-50
          hover:border-slate-300
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        <RefreshCw size={16} />

        Reset to Default
      </button>


      {/* Save */}
      <button
        type="button"
        onClick={savePolicy}
        disabled={policySaving}
        className="
          flex items-center justify-center gap-2
          px-6 py-2.5
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

        {policySaving ? (

          <RefreshCw
            size={16}
            className="animate-spin"
          />

        ) : (

          <Save size={16} />

        )}

        {policySaving
          ? "Saving..."
          : "Save Policy"}

      </button>

    </div>

  </div>

</div>

      </div>

    )}

  </div>
)}

    </div>

  );

};

export default PayrollManagement;

