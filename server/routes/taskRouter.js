import { Router } from "express";
import {
    startTask,
    stopTask,
    resumeTask,
    getCurrentTask,
    getMyTasks
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const taskRouter = Router();

taskRouter.post("/start", protect, startTask);

taskRouter.post("/stop", protect, stopTask);

taskRouter.post("/resume", protect, resumeTask);

taskRouter.get("/current", protect, getCurrentTask);
taskRouter.get("/my-tasks", getMyTasks);

export default taskRouter;