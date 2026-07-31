import { Router } from "express";

import {
  startTracking,
  updateActivity,
  stopTracking,
  getTodayActivity,
  getWeeklyProductivity,
  getDailyReport,
  approveIdleSession,addIdleAdjustment,
  startBreak,
 endBreak,
 getLastFiveDaysReport
} from "../controllers/activityController.js";

import { protect } from "../middleware/auth.js";

const activityRouter = Router();

activityRouter.post("/start", protect, startTracking);

activityRouter.post("/update", protect, updateActivity);
activityRouter.get(
"/daily-reports",
protect,
getLastFiveDaysReport
);
activityRouter.post("/logout", protect, stopTracking);

activityRouter.get("/today", protect, getTodayActivity);
activityRouter.get("/productivity/weekly", protect, getWeeklyProductivity);
activityRouter.get("/daily-report", protect, getDailyReport);
activityRouter.put(
"/approve-idle/:id",
protect,
approveIdleSession
);


activityRouter.put(
"/idle-adjustment/:id",
protect,
addIdleAdjustment
);
activityRouter.post(
"/break/start",
protect,
startBreak
);


activityRouter.post(
"/break/end",
protect,
endBreak
);
export default activityRouter;
