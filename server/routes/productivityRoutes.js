import express from "express";
import {
  getTodayProductivity,
  getDashboardProductivity,
  getProductivityTrend,
  getAdminProductivity,
  getTeamProductivity,
  getDepartmentProductivity,
  getEmployeeComparison,
  getWeeklyPerformance,
  getMonthlyPerformance
} from "../controllers/productivityController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/today", protect, getTodayProductivity);

router.get("/dashboard", protect, getDashboardProductivity);

router.get("/trend", protect, getProductivityTrend);
router.get("/admin", protect, getAdminProductivity);
router.get("/team", protect, getTeamProductivity);

router.get("/departments", protect, getDepartmentProductivity);

router.get(
"/weekly-performance",
protect,
getWeeklyPerformance
);
router.get(
"/employee-comparison",
getEmployeeComparison
);
router.get(
"/monthly-performance",
protect,
getMonthlyPerformance
);
export default router;
