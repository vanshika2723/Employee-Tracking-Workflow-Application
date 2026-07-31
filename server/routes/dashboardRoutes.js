import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getDashboard,getLiveEmployees ,getAttendanceReports,getDepartmentPerformance,getWorkflowStats} from "../controllers/dashboardController.js";

const dashboardRouter=Router();
dashboardRouter.get("/",protect,getDashboard)
dashboardRouter.get("/live-employees", protect,getLiveEmployees);
dashboardRouter.get(
    "/attendance-reports",
    protect,
    getAttendanceReports
);

dashboardRouter.get(
    "/department-performance",
    protect,
    getDepartmentPerformance
);

dashboardRouter.get(
    "/workflow-stats",
    protect,
    getWorkflowStats
);
export default dashboardRouter