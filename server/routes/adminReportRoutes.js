import {Router} from "express";
import {protect} from "../middleware/auth.js";
import {
    getAdminAttendanceSummary,
    getDailyAttendanceReport,
    getMissingAttendanceReport,
    getShiftReport
} from "../controllers/adminReportController.js";


const adminReportRouter = Router();


adminReportRouter.get(
"/attendance-summary",
protect,
getAdminAttendanceSummary
);


adminReportRouter.get(
"/daily-attendance",
getDailyAttendanceReport
);


adminReportRouter.get(
"/missing-attendance",
getMissingAttendanceReport
);

adminReportRouter.get(
"/shifts",
protect,
getShiftReport
);
export default adminReportRouter;