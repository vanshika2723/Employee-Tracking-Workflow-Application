import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";
import { generatePayroll, getMyPayroll,getAllPayroll,getPayrollSummary,getAttendancePayrollReport } from "../controllers/payrollController.js";

const payrollRouter = Router();


payrollRouter.post(
    "/generate",
    protect,
    adminOnly,
    generatePayroll
);
payrollRouter.get(
  "/attendance-payroll-report",
  protect,
  adminOnly,
  getAttendancePayrollReport
);


payrollRouter.get(
    "/my",
    protect,
    getMyPayroll
);

// Admin Payroll

payrollRouter.get(
    "/all",
    protect,
    getAllPayroll
);


payrollRouter.get(
    "/summary",
    protect,
    getPayrollSummary
);


export default payrollRouter;