import express from "express";

import {
    createWorkflow,
    getWorkflows,
    updateWorkflowStatus,
    deleteWorkflow
} from "../controllers/workflowController.js";


const router = express.Router();


// Create Workflow
router.post(
    "/create",
    createWorkflow
);


// Get All Workflows
router.get(
    "/all",
    getWorkflows
);


// Update Status
router.put(
    "/:id/status",
    updateWorkflowStatus
);


// Delete Workflow
router.delete(
    "/:id",
    deleteWorkflow
);


export default router;