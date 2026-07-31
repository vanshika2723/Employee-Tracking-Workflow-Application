import { Router } from "express";
import {
  createShift,
  getShifts,
  assignShift
} from "../controllers/shiftController.js";

import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";


const shiftRouter = Router();


// Create new shift
shiftRouter.post(
  "/",
  protect,
  adminOnly,
  createShift
);


// Get all shifts
shiftRouter.get(
  "/",
  protect,
  getShifts
);


// Assign employee to shift
shiftRouter.post(
  "/assign",
  protect,
  adminOnly,
  assignShift
);


export default shiftRouter;