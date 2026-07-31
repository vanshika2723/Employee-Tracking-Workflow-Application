import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import employeesRouter from "./routes/employeeRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import leaveRouter from "./routes/leaveRoutes.js";
import payslipRouter from "./routes/payslipsRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import activityRouter from "./routes/activityRoutes.js";
import taskRouter from "./routes/taskRouter.js";
import productivityRoutes from "./routes/productivityRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import shiftRouter from "./routes/shiftRoutes.js";
import { initSocket } from "./socket.js";
import http from "http";
import notificationRouter from "./routes/notificationRoutes.js";
import policyRouter from "./routes/policyRoutes.js";
import payrollRouter from "./routes/payrollRoutes.js";
import adminReportRouter from "./routes/adminReportRoutes.js";
import idleRouter from "./routes/idleRoutes.js";
import workflowRouter from "./routes/workflowRoutes.js";



const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

//Middleware

app.use(cors());
app.use(express.json());
app.use(multer().none());

// console.log(
//   "FUNCTION IDS:",
//   functions.map(fn => fn.opts.id)
// );

//Routes

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/payslips", payslipRouter);
app.use("/api/reports", reportRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/task", taskRouter);
app.use("/api/shifts", shiftRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/productivity", productivityRoutes);
app.use("/api/admin", adminRoutes);
app.use(
"/api/admin-report",
adminReportRouter
);
app.use("/api/idle", idleRouter);

app.use(
    "/api/payroll",
    payrollRouter
);
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);
app.use("/api/activity", activityRouter);
app.use(
    "/api/policy",
    policyRouter
);



app.use(
"/api/workflow",
workflowRouter
);

await connectDB();

// app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))


initSocket(server);


server.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
