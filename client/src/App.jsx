import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import LoginLanding from "./pages/LoginLanding";
import LoginForm from "./components/LoginForm";
import socket from "./socket/socket";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payslip from "./pages/Payslips";
import Settings from "./pages/Settings";
import PrintPayslip from "./pages/PrintPayslip";
import WorkflowTracker from "./components/admin/WorkflowTracker";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import LiveMonitoring from "./components/admin/LiveMonitoring";
import ResetPassword from "./pages/ResetPassword";
import AttendancePayrollSummary from "./components/admin/AttendanceManagement";
import Productivity from "./pages/employee/Productivity";
import ActivateAccount from "./pages/ActivateAccount";
import VerifyActivateOTP from "./pages/VerifyActivateOTP";
import CreatePassword from "./pages/CreatePassword";
import LiveEmployeeTable from "./components/admin/LiveEmployeeTable";
import Reports from "./pages/Reports";
import AdminProductivity from "./components/admin/AdminProductivity";
import IdleMonitoring from "./pages/IdleMonitoring";
import MyActivity from "./pages/employee/MyActivity";
import PayrollManagement from "./components/admin/PayrollManagement";
const App = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.log("SOCKET ERROR:", error.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);
  return (
    <>
      <Toaster />

      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginLanding />} />

        <Route
          path="/login/admin"
          element={
            <LoginForm
              role="admin"
              title="Admin Portal"
              subtitle="Sign in to manage the organization"
            />
          }
        />

        <Route
          path="/login/employee"
          element={
            <LoginForm
              role="employee"
              title="Employee Portal"
              subtitle="Sign in to access your account"
            />
          }
        />

        {/* Forgot Password Flow */}

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* First Time Login Flow */}

        <Route path="/activate-account" element={<ActivateAccount />} />

        <Route path="/verify-activate-otp" element={<VerifyActivateOTP />} />

        <Route path="/create-password" element={<CreatePassword />} />

        {/* Protected Pages */}

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/employees" element={<Employees />} />

          <Route path="/attendance" element={<Attendance />} />

          <Route path="/leave" element={<Leave />} />

          <Route path="/payslips" element={<Payslip />} />
          
          <Route
  path="/my-activity"
  element={<MyActivity />}
/>

          <Route path="/settings" element={<Settings />} />
          <Route path="/employee/productivity" element={<Productivity />} />
          <Route
 path="/workflow-tracking"
 element={<WorkflowTracker />}

/>
<Route
  path="/payroll-management"
  element={<PayrollManagement />}
/>
          <Route path="/reports" element={<Reports />} />
          <Route
  path="/idle-monitoring"
  element={<IdleMonitoring />}
/>
<Route
  path="/live-monitoring"
  element={<LiveMonitoring />}
/>
          <Route 
  path="/attendance-payroll" 
  element={<AttendancePayrollSummary />} 
/>
<Route
 path="/admin/productivity"
 element={<AdminProductivity />}
/>
         

<Route
  path="/live-monitoring"
  element={<LiveEmployeeTable />}
/>
        </Route>

        {/* Print */}

        <Route path="/print/payslips/:id" element={<PrintPayslip />} />

        {/* Default */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
