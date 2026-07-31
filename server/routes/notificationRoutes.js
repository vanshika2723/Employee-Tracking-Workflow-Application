import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";
import {
    getNotifications,
    markNotificationRead,
    sendAnnouncement,
    sendTestNotification
} from "../controllers/notificationController.js";


const notificationRouter = Router();



notificationRouter.get(
    "/",
    protect,
    getNotifications
);


notificationRouter.post(
    "/test",
    protect,
    sendTestNotification
);


notificationRouter.put(
    "/:id/read",
    protect,
    markNotificationRead
);

notificationRouter.post(
    "/announcement",
    protect,
    adminOnly,
    sendAnnouncement
);


export default notificationRouter;