import IdleSession from "../models/IdleSession.js";
import Attendance from "../models/Attendance.js"
;
import Employee from "../models/Employee.js";
import IdleConfig from "../models/IdleConfig.js";

export const startIdle = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      userId: req.session.userId,
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({
        error: "Attendance not found",
      });
    }

    const existing = await IdleSession.findOne({
      attendanceId: attendance._id,
      endTime: null,
    });

    if (existing) {
      return res.json({
        success: true,
        message: "Already idle",
      });
    }

    const idle = await IdleSession.create({
      employeeId: employee._id,
      attendanceId: attendance._id,
      startTime: new Date(),
    });

    res.json({
      success: true,
      data: idle,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to start idle",
    });
  }
};

export const endIdle = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      userId: req.session.userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const idle = await IdleSession.findOne({
      employeeId: employee._id,
      endTime: null,
    });

    if (!idle) {
      return res.status(404).json({
        error: "No active idle session",
      });
    }

    idle.endTime = new Date();

    const minutes = Math.floor(
      (idle.endTime - idle.startTime) / 60000
    );

    idle.durationMinutes = minutes;

    await idle.save();

    const attendance = await Attendance.findById(
      idle.attendanceId
    );

    attendance.idleMinutes += minutes;

    await attendance.save();

    res.json({
      success: true,
      idleMinutes: attendance.idleMinutes,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to end idle",
    });
  }
};

export const saveIdleConfig = async (req,res)=>{
  try {

    const {
      idleThreshold,
      pauseProductiveTimer,
      autoGenerateReport,
      notifyEmployee
    } = req.body;


    let config = await IdleConfig.findOne();


    if(config){

      config.idleThreshold = idleThreshold;
      config.pauseProductiveTimer = pauseProductiveTimer;
      config.autoGenerateReport = autoGenerateReport;
      config.notifyEmployee = notifyEmployee;
      config.updatedBy = req.session.userId;

      await config.save();

    }else{

      config = await IdleConfig.create({

        idleThreshold,
        pauseProductiveTimer,
        autoGenerateReport,
        notifyEmployee,
        updatedBy:req.session.userId

      });

    }


    res.json({
      success:true,
      data:config
    });


  } catch(error){

    console.log(error);

    res.status(500).json({
      error:"Failed to save idle configuration"
    });

  }
};

export const getIdleConfig = async(req,res)=>{

try{

const config = await IdleConfig.findOne();


res.json({
 success:true,
 data:config
});


}catch(error){

res.status(500).json({
 error:"Failed to get configuration"
});

}

};