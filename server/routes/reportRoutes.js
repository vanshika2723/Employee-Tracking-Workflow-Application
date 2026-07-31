import express from "express";
import { protect } from "../middleware/auth.js";

// import {
// exportEmployeeReport,
// exportAttendanceReport,
// exportProductivityReport,
// exportSummaryPDF,
// exportPayrollReport,
// getIdleTimeReport,
// getLoginLogoutReport,
// getTeamProductivity,
// exportIdleReport,
// getIdleReport,
// getAttendanceReport,
// getPerformanceReport,
// getProductivityReport,
// getDepartmentAnalytics,
// getWorkflowEfficiency,
// getMonthlyPerformanceSummary,
//   exportCSVReport,
// } from "../controllers/reportController.js";
import {
exportEmployeeReport,
exportAttendanceReport,
exportProductivityReport,
exportSummaryPDF,
exportPayrollReport,
getIdleTimeReport,
getLoginLogoutReport,
getTeamProductivity,
exportIdleReport,
getIdleReport,
getAttendanceReport,
getPerformanceReport,
getProductivityReport,
getDepartmentAnalytics,
getWorkflowEfficiency,
getMonthlyPerformanceSummary,
exportReport,
exportCSVReport,
exportTeamProductivityReport,
exportDepartmentReport,
exportWorkflowReport
} from "../controllers/reportController.js";


const reportRouter = express.Router();



reportRouter.get(
    "/employees",
    protect,
    exportEmployeeReport
);

reportRouter.get(
"/monthly-performance",
protect,
getMonthlyPerformanceSummary
);
reportRouter.get(
 "/performance",
 protect,
 getPerformanceReport
);
reportRouter.get(
 "/team-productivity",
 protect,
 getTeamProductivity
);
reportRouter.get(
"/department",
protect,
getDepartmentAnalytics
);
reportRouter.get(
"/workflow",
protect,
getWorkflowEfficiency
);
// Login Logout
reportRouter.get(
    "/login-logout",
    protect,
    getLoginLogoutReport
);


// Attendance
reportRouter.get(
    "/attendance",
    protect,
    exportAttendanceReport
);


// Productivity
reportRouter.get(
 "/productivity",
 protect,
 getProductivityReport
);


// Idle Table Report (Frontend ke liye)
reportRouter.get(
    "/idle",
    protect,
    getIdleReport
);


// Idle Detailed Report
reportRouter.get(
    "/idle-details",
    protect,
    getIdleTimeReport
);


// Export Idle Excel
reportRouter.get(
    "/export-idle",
    protect,
    exportIdleReport
);


// PDF Summary
reportRouter.get(
    "/summary-pdf",
    protect,
    exportSummaryPDF
);

reportRouter.get(
    "/attendance-data",
    protect,
    getAttendanceReport
);
// Payroll
reportRouter.get(
    "/payroll",
    protect,
    exportPayrollReport
);

reportRouter.get(
  "/export/:type/:reportType",
  protect,
  exportReport
);


export default reportRouter;