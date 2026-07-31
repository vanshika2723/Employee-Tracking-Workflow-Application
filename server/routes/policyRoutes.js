import { Router } from "express";
import {
    createPolicy,
    getPolicy,
    updatePolicy
} from "../controllers/policyController.js";

import { protect } from "../middleware/auth.js";


const policyRouter = Router();


policyRouter.post(
    "/",
    protect,
    createPolicy
);


policyRouter.get(
    "/",
    protect,
    getPolicy
);


policyRouter.put(
    "/",
    protect,
    updatePolicy
);


export default policyRouter;