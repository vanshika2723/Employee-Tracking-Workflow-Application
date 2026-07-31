import { DEPARTMENTS } from "../constants/departments.js";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import Payslip from "../models/Payslip.js";
import ActivityTracking from "../models/ActivityTracking.js";
import TaskTracking from "../models/TaskTracking.js";

//Get dashboard for employee and admin
export const getDashboard = async (req, res) => {
  try {
    // console.log("DASHBOARD API HIT");
    const session = req.session;
    const filter = req.query.filter || "today";
    if (session.role === "ADMIN") {
      let startDate;
      let endDate = new Date();

      const now = new Date();

      if (filter === "today") {
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (filter === "week") {
        startDate = new Date();

        startDate.setDate(startDate.getDate() - 7);
      } else if (filter === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      // const [totalEmployees,todayAttendance,pendingLeaves]=await Promise.all([Employee.countDocuments({isDeleted:{$ne : true}}),
      //     Attendance.countDocuments({
      //         date:{
      //             $gte:new Date(new Date().setHours(0,0,0,0)),
      //              $lt:new Date(new Date().setHours(24,0,0,0)),

      //         }
      //     }),
      //     LeaveApplication.countDocuments({status:"PENDING"})
      // ])
      const [
        totalEmployees,
        todayAttendance,
        pendingLeaves,
        activeEmployees,
        idleEmployees,
        overtimeEmployees,
      ] = await Promise.all([
        Employee.countDocuments({
          isDeleted: { $ne: true },
        }),

        Attendance.countDocuments({
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        }),

        LeaveApplication.countDocuments({
          status: "PENDING",
        }),

        ActivityTracking.countDocuments({
          lastActivity: {
            $gte: new Date(Date.now() - 5 * 60 * 1000),
          },
        }),

        ActivityTracking.countDocuments({
          idleTime: {
            $gt: 0,
          },
          
        }),
        Attendance.countDocuments({
          overtimeHours: {
            $gt: 0,
          },

          date: {
            $gte: startDate,
            $lte: endDate,
          },
        }),
      ]);
      // console.log("OVERTIME EMPLOYEES:", overtimeEmployees);

      return res.json({
        role: "ADMIN",

        totalEmployees,

        totalDepartments: DEPARTMENTS.length,

        todayAttendance,

        pendingLeaves,

        activeEmployees,

        idleEmployees,
        overtimeEmployees,
      });
    } else {
      const employee = await Employee.findOne({
        userId: session.userId,
      }).lean();
      if (!employee)
        return res.status(404).json({ error: "Employee not found" });

      const today = new Date();
      const [currentMonthAttendance, pendingLeaves, latestPayslip] =
        await Promise.all([
          Attendance.countDocuments({
            employeeId: employee._id,
            date: {
              $gte: new Date(today.getFullYear(), today.getMonth(), 1),
              $lt: new Date(today.getFullYear(), today.getMonth(), +1, 1),
            },
          }),
          LeaveApplication.countDocuments({
            employeeId: employee._id,
            status: "PENDING",
          }),
          Payslip.findOne({ employeeId: employee._id })
            .sort({ createdAt: -1 })
            .lean(),
        ]);
      return res.json({
        role: "EMPLOYEE",
        employee: { ...employee, id: employee._id.toString() },
        currentMonthAttendance,
        pendingLeaves,
        latestPayslip: latestPayslip
          ? { ...latestPayslip, id: latestPayslip._id.toString() }
          : null,
      });
    }
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ error: "Failed" });
  }
};
export const getLiveEmployees = async (req, res) => {
  try {
    const employees = await ActivityTracking.find()
      .populate("employeeId", "firstName lastName email position department")
      .sort({
        updatedAt: -1,
      })
      .limit(20);

    const data = employees.map((item) => {
      let status = "OFFLINE";

      if (item.lastActivity) {
        const diff = Date.now() - new Date(item.lastActivity).getTime();

        if (diff <= 5 * 60 * 1000) {
          status = "ONLINE";
        } else if (item.idleTime > 0) {
          status = "IDLE";
        }
      }
return {
  id: item._id,

  name: item.employeeId
    ? `${item.employeeId.firstName} ${item.employeeId.lastName}`
    : "Unknown",

  initials: item.employeeId
    ? `${item.employeeId.firstName[0]}${item.employeeId.lastName[0]}`
    : "NA",

  email: item.employeeId?.email || "",

  department: item.employeeId?.department || "N/A",

  position: item.employeeId?.position || "N/A",


  // Login Time
  loginTime: item.loginTime
    ? new Date(item.loginTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—",


  // Active Time
  activeTime: item.activeTime || 0,


  // Idle Time
  idleTime: item.idleTime || 0,


  // Overtime
  overtime: item.overtimeHours
    ? `${Math.floor(item.overtimeHours / 60)}h ${item.overtimeHours % 60}m`
    : "—",


  // Productivity %
  productivity: item.productivity || 0,


  lastActivity: item.lastActivity,

  status,

  statusText:
    status === "IDLE"
      ? `Idle ${Math.floor((item.idleTime || 0) / 60)}m`
      : status === "ONLINE"
      ? "Active"
      : "Offline",
};
    });

    res.json(data);
  } catch (error) {
    console.error("Live employee error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const getAttendanceReports = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const lateEmployees = await Attendance.find({
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },

      status: "LATE",
    }).populate("employeeId", "firstName lastName department position");

    const missingLogout = await Attendance.find({
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },

      checkIn: {
        $ne: null,
      },

      checkOut: null,
    }).populate("employeeId", "firstName lastName department position");

    res.json({
      lateEmployees,

      missingLogout,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getDepartmentPerformance = async (req, res) => {
  try {
    const filter = req.query.filter || "today";
    const performance = await ActivityTracking.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },

      {
        $unwind: "$employee",
      },

      {
        $group: {
          _id: "$employee.department",

          averageProductivity: {
            $avg: "$productivity",
          },

          totalEmployees: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          averageProductivity: -1,
        },
      },
    ]);

    res.json(performance);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getWorkflowStats = async (req, res) => {
  try {
    const [totalTasks, completedTasks, runningTasks] = await Promise.all([
      TaskTracking.countDocuments(),

      TaskTracking.countDocuments({
        status: "COMPLETED",
      }),

      TaskTracking.countDocuments({
        status: "RUNNING",
      }),
    ]);

    const employeePerformance = await TaskTracking.aggregate([
      {
        $group: {
          _id: "$employeeId",

          totalTasks: {
            $sum: 1,
          },

          completedTasks: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "COMPLETED"],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $sort: {
          completedTasks: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    res.json({
      totalTasks,

      completedTasks,

      runningTasks,

      employeePerformance,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
