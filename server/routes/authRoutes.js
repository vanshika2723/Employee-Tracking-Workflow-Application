// import { Router } from "express";
// // import { changePassword, login, session } from "../controllers/authController.js";
// import { 
// login,
// session,
// changePassword,
// sendOTP,
// verifyOTP,
// resetPassword
// } from "../controllers/authController.js";
// import { protect } from "../middleware/auth.js";

// const authRouter=Router();
// authRouter.post("/login",login)
// authRouter.get("/session", protect, session)
// authRouter.post("/change-password",protect,changePassword)
// authRouter.post("/send-otp",sendOTP);
// authRouter.post("/verify-otp",verifyOTP)

// authRouter.post("/reset-password",resetPassword)
// export default authRouter

import { 
    changePassword,
    login,
    session,
    sendOTP,
    verifyOTP,
    resetPassword,
    forgotPassword,
    activateAccount,
    createPassword,
    verifyActivateOTP,
} from "../controllers/authController.js";

import { Router } from "express";
import { protect } from "../middleware/auth.js";


const authRouter = Router();


authRouter.post("/login", login);

authRouter.get("/session", protect, session);

authRouter.post("/change-password", protect, changePassword);


// Forgot password routes
authRouter.post("/send-otp", sendOTP);

authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.post(
"/forgot-password",
forgotPassword
);
authRouter.post(
"/activate-account",
activateAccount
);


authRouter.post(
"/verify-activate-otp",
verifyActivateOTP
);


authRouter.post(
"/create-password",
createPassword
);


export default authRouter;