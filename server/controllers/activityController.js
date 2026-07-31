import ActivityTracking from "../models/ActivityTracking.js";
import Employee from "../models/Employee.js";
import { getIO, sendEmployeeLog } from "../socket.js";
import { createNotification } from "../services/notificationService.js";
import Notification from "../models/Notification.js";
import AttendancePolicy from "../models/AttendancePolicy.js";
import User from "../models/User.js";

// Start Employee Tracking

export const endBreak = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const employee = await Employee.findOne({
      userId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    const activity = await ActivityTracking.findOne({
      employeeId: employee._id,
    }).sort({
      createdAt: -1,
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: "Tracking not found",
      });
    }

    if (!activity.isOnBreak) {
      return res.status(400).json({
        success: false,
        error: "No active break",
        activity,
      });
    }

    const breakEndTime = new Date();

    const breakSeconds = Math.max(
      0,
      Math.floor(
        (breakEndTime - new Date(activity.breakStartTime)) / 1000
      )
    );

    activity.breakEndTime = breakEndTime;
    activity.breakTime = (activity.breakTime || 0) + breakSeconds;
    activity.isOnBreak = false;
    activity.breakStartTime = null;

    await activity.save();

    sendEmployeeLog(employee._id.toString(), {
      type: "BREAK_END",
      message: "Break Ended",
      time: breakEndTime,
    });

    const io = getIO();

    io.emit("employeeActivityUpdate", {
      employeeId: employee._id.toString(),
      activeTime: activity.activeTime || 0,
      idleTime: activity.idleTime || 0,
      breakTime: activity.breakTime || 0,
      isOnBreak: false,
      productivity: activity.productivity || 0,
      keyboardActivity: activity.keyboardActivity || 0,
      mouseActivity: activity.mouseActivity || 0,
      screenLocked: activity.screenLocked || false,
      browserActivity: activity.browserActivity || "",
      currentTab: activity.currentTab || "",
      idleStatus: activity.idleStatus || "ACTIVE",
    });

    return res.json({
      success: true,
      message: "Break ended",
      activity,
    });
  } catch (error) {
    console.error("End Break Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Start Employee Tracking

export const startTracking = async (req, res) => {
  try {
    const userId = req.session.userId;

    const employee = await Employee.findOne({
      userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const start = new Date();

    start.setHours(0, 0, 0, 0);

    const end = new Date();

    end.setHours(23, 59, 59, 999);

    // Check today's tracking

    let activity = await ActivityTracking.findOne({
      employeeId: employee._id,

      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({
      createdAt: -1,
    });

    // If tracking already exists

    if (activity) {
      activity.logoutTime = null;

      activity.lastActivity = new Date();

      await activity.save();

      // Real time activity log

      sendEmployeeLog(
        employee._id.toString(),

        {
          type: "CLOCK_IN",

          message: "Tracking Resumed",

          time: new Date(),
        },
      );

      return res.json({
        success: true,

        message: "Tracking resumed",

        activity,
      });
    }

    // Create new tracking

    activity = activity = await ActivityTracking.create({
  employeeId: employee._id,

  date: new Date(),

  loginTime: new Date(),

  logoutTime: null,

  activeTime: 0,

  idleTime: 0,

  breakTime: 0,

  productiveTime: 0,

  taskDuration: 0,

  productivity: 0,

  isOnBreak: false,

  breakStartTime: null,

  breakEndTime: null,

  idleStatus: "ACTIVE",

  lastActivity: new Date(),

  keyboardActivity: 0,

  mouseActivity: 0,

  screenInactiveTime: 0,

  systemLockDuration: 0,

  screenLocked: false,

  browserActivity: "",

  currentTab: "",
});

    // Real time activity log

    sendEmployeeLog(
      employee._id.toString(),

      {
        type: "CLOCK_IN",

        message: "Clock In Started",

        time: new Date(),
      },
    );

    return res.json({
      success: true,

      message: "Tracking started",

      activity,
    });
  } catch (error) {
    console.log("Start Tracking Error:", error);

    return res.status(500).json({
      error: "Failed to start tracking",
    });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    // ---------------------------------------
    // FIND EMPLOYEE
    // ---------------------------------------

    const employee = await Employee.findOne({
      userId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    // ---------------------------------------
    // FIND TODAY'S ACTIVITY
    // ---------------------------------------

    const activity = await ActivityTracking.findOne({
      employeeId: employee._id,
    }).sort({
      createdAt: -1,
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: "Tracking not started",
      });
    }

    // ---------------------------------------
    // TIME VALUES FROM FRONTEND
    // ---------------------------------------

    const activeSeconds = Number(
      req.body.activeTime || 0
    );

    const idleSeconds = Number(
      req.body.idleTime || 0
    );

    const productiveSeconds = Number(
      req.body.productiveTime || 0
    );

    const screenInactiveSeconds = Number(
      req.body.screenInactiveTime || 0
    );

    const systemLockSeconds = Number(
      req.body.systemLockDuration || 0
    );

    const keyboardCount = Number(
      req.body.keyboardActivity || 0
    );

    const mouseCount = Number(
      req.body.mouseActivity || 0
    );

    // ---------------------------------------
    // UPDATE ACTIVE / IDLE TIME
    // ---------------------------------------

    activity.activeTime =
      (activity.activeTime || 0) +
      activeSeconds;

    activity.idleTime =
      (activity.idleTime || 0) +
      idleSeconds;

    // ---------------------------------------
    // IMPORTANT:
    // BREAK TIME IS NOT UPDATED HERE
    //
    // Manual break is handled by:
    // startBreak()
    // endBreak()
    //
    // Therefore DO NOT do:
    //
    // activity.breakTime += req.body.breakTime
    // ---------------------------------------

    // ---------------------------------------
    // ATTENDANCE POLICY
    // ---------------------------------------

    const policy =
      await AttendancePolicy.findOne();

    const idleThreshold =
      (policy?.allowedIdleTime || 60) * 60;

    // ---------------------------------------
    // IDLE STATUS
    // ---------------------------------------

    if (
      activity.idleTime >= idleThreshold
    ) {
      activity.idleStatus = "IDLE";

      if (!activity.idleStartTime) {
        activity.idleStartTime = new Date();

        sendEmployeeLog(
          employee._id.toString(),
          {
            type: "IDLE_START",
            message: "Idle Detected",
            time: new Date(),
          }
        );
      }
    } else {
      if (
        activity.idleStatus === "IDLE"
      ) {
        activity.idleEndTime = new Date();

        sendEmployeeLog(
          employee._id.toString(),
          {
            type: "IDLE_END",
            message: "Employee Active Again",
            time: new Date(),
          }
        );

        activity.idleStartTime = null;
      }

      if (activity.isApprovedIdle) {
        activity.idleStatus =
          "APPROVED_IDLE";
      } else {
        activity.idleStatus =
          "ACTIVE";
      }
    }

    // ---------------------------------------
    // IDLE NOTIFICATION
    // ---------------------------------------

    if (activity.idleTime > 300) {
      const todayStart = new Date();

      todayStart.setHours(
        0,
        0,
        0,
        0
      );

      const existingNotification =
        await Notification.findOne({
          
          employeeId: employee._id,

          type: "IDLE_TIME",

          title: "Idle Time Alert",

          createdAt: {
            $gte: todayStart,
          },
        });

     if (!existingNotification) {

  // Employee notification
  await createNotification({

    userId: userId,

    employeeId: employee._id,

    title: "Idle Time Alert",

    message:
      "You have been inactive for more than allowed time.",

    type: "IDLE_TIME",

    channel: "IN_APP",

  });


  // Admin notification
  const admin = await User.findOne({
    role: "ADMIN"
  });


  if (admin) {

    await createNotification({

      userId: admin._id,

      employeeId: employee._id,

      title: "Employee Idle Alert",

      message:
        `${employee.firstName} is inactive for more than allowed time.`,

      type: "IDLE_TIME",

      channel: "IN_APP",

    });

  }

}
    }

    // ---------------------------------------
    // OTHER TRACKING DATA
    // ---------------------------------------

    activity.screenInactiveTime =
      (activity.screenInactiveTime || 0) +
      screenInactiveSeconds;

    activity.systemLockDuration =
      (activity.systemLockDuration || 0) +
      systemLockSeconds;

    activity.productiveTime =
      (activity.productiveTime || 0) +
      productiveSeconds;

    activity.keyboardActivity =
      (activity.keyboardActivity || 0) +
      keyboardCount;

    activity.mouseActivity =
      (activity.mouseActivity || 0) +
      mouseCount;

    // ---------------------------------------
    // SCREEN
    // ---------------------------------------

    if (
      req.body.screenLocked !== undefined
    ) {
      activity.screenLocked =
        req.body.screenLocked;
    }

    // ---------------------------------------
    // BROWSER
    // ---------------------------------------

    if (req.body.browserActivity) {
      activity.browserActivity =
        req.body.browserActivity;
    }

    // ---------------------------------------
    // CURRENT TAB
    // ---------------------------------------

    if (req.body.currentTab) {
      activity.currentTab =
        req.body.currentTab;
    }

    // ---------------------------------------
    // LAST ACTIVITY
    // ---------------------------------------

    activity.lastActivity =
      req.body.lastActivity ||
      new Date();

    // ---------------------------------------
    // PRODUCTIVITY
    // ---------------------------------------
    //
    // IMPORTANT:
    // breakTime comes only from backend
    // startBreak/endBreak.
    // ---------------------------------------

    const totalTime =
      (activity.activeTime || 0) +
      (activity.idleTime || 0) +
      (activity.breakTime || 0);

    if (totalTime > 0) {
      activity.productivity =
        Math.round(
          (
            (activity.activeTime || 0) /
            totalTime
          ) * 100
        );
    } else {
      activity.productivity = 0;
    }

    // ---------------------------------------
    // LOW PRODUCTIVITY ALERT
    // ---------------------------------------

    if (
      activity.productivity < 50
    ) {
      const todayStart = new Date();

      todayStart.setHours(
        0,
        0,
        0,
        0
      );

      const existingNotification =
        await Notification.findOne({
          employeeId: employee._id,

          type: "PRODUCTIVITY_ALERT",

          createdAt: {
            $gte: todayStart,
          },
        });

      if (!existingNotification) {
       await createNotification({

  userId,

  employeeId: employee._id,

  title:
    "Low Productivity Alert",

  message:
    "Productivity dropped below 50% today",

  type: "PRODUCTIVITY_ALERT",

  channel: "IN_APP",

});



const admin = await User.findOne({
  role:"ADMIN"
});


if(admin){

 await createNotification({

  userId: admin._id,

  employeeId: employee._id,

  title:
    "Employee Low Productivity Alert",

  message:
    `${employee.firstName} productivity dropped below 50%`,

  type:"PRODUCTIVITY_ALERT",

  channel:"IN_APP"

 });

}
      }
    }

    // ---------------------------------------
    // SAVE
    // ---------------------------------------

    await activity.save();

    // ---------------------------------------
    // SOCKET UPDATE
    // ---------------------------------------

    const io = getIO();

    io.emit(
      "employeeActivityUpdate",
      {
        employeeId:
          employee._id.toString(),

        activeTime:
          activity.activeTime || 0,

        idleTime:
          activity.idleTime || 0,

        breakTime:
          activity.breakTime || 0,

        isOnBreak:
          activity.isOnBreak || false,

        lastActivity:
          activity.lastActivity,

        status:
          activity.idleStatus,

        idleStatus:
          activity.idleStatus,

        productivity:
          activity.productivity || 0,

        keyboardActivity:
          activity.keyboardActivity || 0,

        mouseActivity:
          activity.mouseActivity || 0,

        screenLocked:
          activity.screenLocked || false,

        browserActivity:
          activity.browserActivity || "",

        currentTab:
          activity.currentTab || "",
      }
    );

    // ---------------------------------------
    // TIMER UPDATE
    // ---------------------------------------

    io.emit(
      "employeeTimerUpdate",
      {
        employeeId:
          employee._id.toString(),

        activeTime:
          activity.activeTime || 0,

        idleTime:
          activity.idleTime || 0,

        breakTime:
          activity.breakTime || 0,

        isOnBreak:
          activity.isOnBreak || false,

        status:
          activity.idleStatus,
      }
    );

    // ---------------------------------------
    // RESPONSE
    // ---------------------------------------

    return res.json({
      success: true,

      message:
        "Activity updated",

      activity,
    });
  } catch (error) {
    console.error(
      "Update Activity Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to update activity",
    });
  }
};

export const stopTracking = async (req, res) => {
  try {
    const userId = req.session.userId;

    const employee = await Employee.findOne({
      userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const activity = await ActivityTracking.findOne({
      employeeId: employee._id,
    }).sort({
      createdAt: -1,
    });

    const policy = await AttendancePolicy.findOne();

    const allowedIdleTime = policy?.allowedIdleTime || 60;

    if (!activity) {
      return res.status(404).json({
        error: "Tracking not found",
      });
    }

    if(activity.logoutTime === null){

await createNotification({

    userId:userId,

    employeeId:employee._id,

    title:"Logout Reminder",

    message:"Don't forget to log out",

    type:"LOGOUT_REMINDER",

    channel:"IN_APP"

});
}
   
    

    // Logout Time

    activity.logoutTime = new Date();

    // Login Duration

    const loginDurationMinutes = Math.floor(
      (activity.logoutTime - activity.loginTime) / 60000,
    );

    activity.workingHours = loginDurationMinutes;

    // Productive Time

    const productiveMinutes =
      loginDurationMinutes - activity.idleTime - activity.breakTime;

    activity.productiveTime = Math.max(productiveMinutes, 0);

    // Productivity

    if (loginDurationMinutes > 0) {
      activity.productivity = Math.round(
        (activity.productiveTime / loginDurationMinutes) * 100,
      );
    } else {
      activity.productivity = 0;
    }

    // Idle Deduction

    let idleDeductionMinutes = 0;

   const idleMinutes = activity.isApprovedIdle
  ? 0
  : Math.floor((activity.idleTime || 0) / 60);


if (idleMinutes > allowedIdleTime) {

  idleDeductionMinutes =
    idleMinutes - allowedIdleTime;

}

    activity.idleDeductionMinutes = idleDeductionMinutes;

    // Break Calculation

    const allowedBreakTime = policy?.breakLimit || 60;

    let extraBreakMinutes = 0;

    const totalBreakTime = activity.breakTime || 0;

    if (totalBreakTime > allowedBreakTime) {
      extraBreakMinutes = totalBreakTime - allowedBreakTime;
    }

    activity.extraBreakMinutes = extraBreakMinutes;

    // Task Duration

    activity.taskDuration = activity.activeTime;

    await activity.save();

    // Activity Log Event

    sendEmployeeLog(
      employee._id.toString(),

      {
        type: "CLOCK_OUT",

        message: "Clock Out Completed",

        time: new Date(),

        productivity: activity.productivity,
      },
    );

    return res.json({
      success: true,

      message: "Tracking stopped",

      activity,
    });
  } catch (error) {
    console.log("Logout Tracking Error:", error);

    return res.status(500).json({
      error: "Failed to stop tracking",
    });
  }
};

export const startBreak = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    const activity = await ActivityTracking.findOne({
      employeeId: employee._id,
    }).sort({ createdAt: -1 });

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: "Tracking not started",
      });
    }

    // Already on break
    if (activity.isOnBreak === true) {
      return res.status(400).json({
        success: false,
        error: "Already on break",
        activity,
      });
    }

    activity.isOnBreak = true;
    activity.breakStartTime = new Date();

    await activity.save();

    sendEmployeeLog(employee._id.toString(), {
      type: "BREAK_START",
      message: "Break Started",
      time: new Date(),
    });

    // Send realtime update
    const io = getIO();

    io.emit("employeeActivityUpdate", {
      employeeId: employee._id.toString(),
      activeTime: activity.activeTime || 0,
      idleTime: activity.idleTime || 0,
      breakTime: activity.breakTime || 0,
      isOnBreak: true,
      productivity: activity.productivity || 0,
      keyboardActivity: activity.keyboardActivity || 0,
      mouseActivity: activity.mouseActivity || 0,
      screenLocked: activity.screenLocked || false,
      browserActivity: activity.browserActivity || "",
      currentTab: activity.currentTab || "",
      idleStatus: activity.idleStatus || "ACTIVE",
    });

    return res.json({
      success: true,
      message: "Break started",
      activity,
    });
  } catch (error) {
    console.error("Start Break Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getTodayActivity = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    // ==============================
    // FIND EMPLOYEE
    // ==============================

    const employee = await Employee.findOne({
      userId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    // ==============================
    // TODAY START / END
    // ==============================

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // ==============================
    // FIND TODAY'S ACTIVITY
    // IMPORTANT:
    // loginTime se search kar rahe hain
    // ==============================

    const activity = await ActivityTracking.findOne({
      employeeId: employee._id,

      loginTime: {
        $gte: start,
        $lte: end,
      },
    }).sort({
      createdAt: -1,
    });

    // ==============================
    // NO ACTIVITY
    // ==============================

    if (!activity) {
      console.log(
        "NO TODAY ACTIVITY FOUND FOR:",
        employee._id
      );

      return res.json({
        success: true,

        loginTime: null,
        logoutTime: null,

        activeTime: 0,
        idleTime: 0,
        breakTime: 0,
        productiveTime: 0,
        taskDuration: 0,

        productivity: 0,

        isOnBreak: false,

        idleStatus: "ACTIVE",

        keyboardActivity: 0,
        mouseActivity: 0,

        screenLocked: false,

        browserActivity: "",
        currentTab: "",
      });
    }

    // ==============================
    // DEBUG
    // ==============================

    console.log("TODAY ACTIVITY FOUND:");
    console.log({
      id: activity._id,

      loginTime: activity.loginTime,

      date: activity.date,

      activeTime: activity.activeTime,

      idleTime: activity.idleTime,

      breakTime: activity.breakTime,

      productiveTime: activity.productiveTime,

      productivity: activity.productivity,
    });

    // ==============================
    // RESPONSE
    // ==============================

    return res.json({
      success: true,

      loginTime:
        activity.loginTime || null,

      logoutTime:
        activity.logoutTime || null,

      activeTime:
        Number(activity.activeTime || 0),

      idleTime:
        Number(activity.idleTime || 0),

      breakTime:
        Number(activity.breakTime || 0),

      productiveTime:
        Number(activity.productiveTime || 0),

      taskDuration:
        Number(activity.taskDuration || 0),

      productivity:
        Number(activity.productivity || 0),

      isOnBreak:
        Boolean(activity.isOnBreak),

      breakStartTime:
        activity.breakStartTime || null,

      breakEndTime:
        activity.breakEndTime || null,

      idleStatus:
        activity.idleStatus || "ACTIVE",

      lastActivity:
        activity.lastActivity || null,

      keyboardActivity:
        Number(activity.keyboardActivity || 0),

      mouseActivity:
        Number(activity.mouseActivity || 0),

      screenLocked:
        Boolean(activity.screenLocked),

      browserActivity:
        activity.browserActivity || "",

      currentTab:
        activity.currentTab || "",
    });

  } catch (error) {
    console.error(
      "Get Today Activity Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Failed to get today's activity",
    });
  }
};

export const getWeeklyProductivity = async (req, res) => {
  try {
    const userId = req.session.userId;

    const employee = await Employee.findOne({
      userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const today = new Date();

    const startDate = new Date();

    startDate.setDate(today.getDate() - 6);

    startDate.setHours(0, 0, 0, 0);

    const activities = await ActivityTracking.find({
      employeeId: employee._id,

      date: {
        $gte: startDate,
        $lte: today,
      },
    }).sort({
      date: 1,
    });

    const weeklyData = activities.map((item) => ({
      day: new Date(item.date).toLocaleDateString("en-US", {
        weekday: "short",
      }),

      productivity: item.productivity || 0,
    }));

    res.json(weeklyData);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch weekly productivity",
    });
  }
};
export const getDailyReport = async (req, res) => {
  try {
    const userId = req.session.userId;

    const employee = await Employee.findOne({
      userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const activity = await ActivityTracking.findOne({
      employeeId: employee._id,

      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({
      createdAt: -1,
    });

    if (!activity) {
      return res.json({
        loginTime: null,
        logoutTime: null,
        activeTime: 0,
        idleTime: 0,
        breakTime: 0,
        productivity: 0,
      });
    }

    return res.json({
      loginTime: activity.loginTime,

      logoutTime: activity.logoutTime,

      activeTime: activity.activeTime,

      idleTime: activity.idleTime,

      breakTime: activity.breakTime,

      productivity: activity.productivity,
      idleStatus: activity.idleStatus,

      idleDeductionMinutes: activity.idleDeductionMinutes,

      isApprovedIdle: activity.isApprovedIdle,

      adminAdjustmentMinutes: activity.adminAdjustmentMinutes,
    });
  } catch (error) {
    console.log("Daily Report Error:", error);

    return res.status(500).json({
      error: "Failed to get daily report",
    });
  }
};
export const approveIdleSession = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await ActivityTracking.findById(id);

    if (!activity) {
      return res.status(404).json({
        error: "Activity not found",
      });
    }

    activity.isApprovedIdle = true;

    activity.idleStatus = "APPROVED_IDLE";

    activity.idleReason = req.body.reason || "Approved by admin";

    await activity.save();

    res.json({
      success: true,

      message: "Idle session approved",

      activity,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
export const addIdleAdjustment = async (req, res) => {
  try {
    const { id } = req.params;

    const { minutes } = req.body;

    const activity = await ActivityTracking.findById(id);

    activity.adminAdjustmentMinutes = minutes;

    await activity.save();

    res.json({
      success: true,

      message: "Adjustment added",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
export const getLastFiveDaysReport = async (req,res)=>{
try{

const userId=req.session.userId;


const employee=await Employee.findOne({
 userId
});


if(!employee){
 return res.status(404).json({
  error:"Employee not found"
 });
}


// last 5 working days

const startDate=new Date();

startDate.setDate(startDate.getDate()-7);

startDate.setHours(0,0,0,0);



const reports=await ActivityTracking.find({

 employeeId:employee._id,

 date:{
  $gte:startDate
 }

})
.sort({
 date:-1
})
.limit(5);



const formatted=reports.map(item=>({

date:new Date(item.date)
.toLocaleDateString("en-GB",{
 day:"2-digit",
 month:"short"
}),


loginTime:item.loginTime,

logoutTime:item.logoutTime,


activeTime:item.activeTime || 0,


idleTime:item.idleTime || 0,


productivity:item.productivity || 0,


status:
item.logoutTime
?
"Present"
:
"Working"



}));



res.json(formatted);



}catch(error){

console.log(error);

res.status(500).json({
 error:"Failed to get daily reports"
});


}

};