import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { clockInOut, getAttendance,getTodayAttendanceStatus,getAttendanceReport } from "../controllers/attendanceController.js";

const attendanceRouter=Router();
attendanceRouter.post('/',protect,clockInOut)
attendanceRouter.get('/',protect,getAttendance)
attendanceRouter.get(
"/status",
protect,
getTodayAttendanceStatus
);
attendanceRouter.get(
"/report/:employeeId",
protect,
getAttendanceReport
);

export default attendanceRouter;