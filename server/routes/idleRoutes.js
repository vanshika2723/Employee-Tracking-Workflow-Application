import express from "express";

import {
 startIdle,
 endIdle,
 saveIdleConfig,
 getIdleConfig
} from "../controllers/idleController.js";


import {
 getIdleReport,
 approveIdle,
 excludeIdle,
 createAdjustment
} from "../controllers/idleReportController.js";


import { protect } from "../middleware/auth.js";


const router = express.Router();



/*
 IDLE TRACKING
*/


router.post(
"/start",
protect,
startIdle
);


router.post(
"/end",
protect,
endIdle
);



/*
 IDLE CONFIG
*/


router.post(
"/config",
protect,
saveIdleConfig
);


router.get(
"/config",
protect,
getIdleConfig
);




/*
 IDLE REPORT
*/


router.get(
"/report",
protect,
getIdleReport
);



router.post(
"/adjust",
protect,
createAdjustment
);



router.put(
"/approve/:id",
protect,
approveIdle
);



router.put(
"/exclude/:id",
protect,
excludeIdle
);



export default router;