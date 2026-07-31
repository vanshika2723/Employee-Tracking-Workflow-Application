import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import ActivityTracking from "../models/ActivityTracking.js";
import AttendancePolicy from "../models/AttendancePolicy.js";


export const getAdminAttendanceSummary = async (req, res) => {
  try {
    const employees = await Employee.find({
      isDeleted: false,
    });

    const report = [];

    let totalPresent = 0;
    let totalHalfDays = 0;
    let totalLate = 0;
    let totalEarlyLogout = 0;
    let totalOvertime = 0;

    for (const employee of employees) {
      const attendance = await Attendance.find({
        employeeId: employee._id,
      });

      const activity = await ActivityTracking.find({
        employeeId: employee._id,
      });

      let presentDays = 0;
      let halfDays = 0;
      let lateCount = 0;
      let earlyLogoutCount = 0;
      let overtimeHours = 0;

      let idleDeduction = 0;
      let idleTimeToday = 0;
      let productivityTotal = 0;

      // Attendance Calculation

      attendance.forEach((item) => {
        // Present

        if (item.status === "PRESENT" || item.status === "LATE") {
          presentDays++;
        }

        // Half Day

        if (item.dayType === "Half Day" || item.dayType === "Short Day") {
          halfDays++;
        }

        // Late Login

        if (item.status === "LATE") {
          lateCount++;
        }

        // Early Logout

        if (item.earlyLogoutMinutes > 0) {
          earlyLogoutCount++;
        }

        // Overtime

        overtimeHours += item.overtimeHours || 0;
      });

      // Activity Calculation
      activity.forEach((item) => {
        idleDeduction += item.idleDeductionMinutes || 0;

        // idleTime stored in seconds
        idleTimeToday += Math.floor((item.idleTime || 0) / 60);

        productivityTotal += item.productivity || 0;
      });

      const avgProductivity =
        activity.length > 0
          ? Math.round(productivityTotal / activity.length)
          : 0;

      const policy = await AttendancePolicy.findOne();

      const allowedIdle = policy?.allowedIdleTime || 60;

      const excessIdle = Math.max(
        0,
        Math.floor(idleTimeToday / 60) - allowedIdle,
      );

      const dailyWage = (employee.basicSalary || 0) / 30;

      const perMinuteWage = dailyWage / (9 * 60);

      const idleLoss = Number((excessIdle * perMinuteWage).toFixed(2));

      let status = "Clear";

      if (excessIdle > 0) {
        status = "Review";
      }

      if (excessIdle > 60) {
        status = "Action needed";
      }

      totalPresent += presentDays;
      totalHalfDays += halfDays;
      totalLate += lateCount;
      totalEarlyLogout += earlyLogoutCount;
      totalOvertime += overtimeHours;

      report.push({
        employeeId: employee._id,

        name: employee.firstName + " " + employee.lastName,

        presentDays,

        halfDays,

        lateCount,

        earlyLogoutCount,

        overtimeHours: Number(overtimeHours.toFixed(2)),

        idleDeduction,

        productivity: avgProductivity,

        dailyWage: Number(dailyWage.toFixed(2)),

        idleTimeToday: Math.floor(idleTimeToday / 60),

        allowedIdle,

        excessIdle,

        lossOfPay: idleLoss,

        status,
      });
    }

    res.json({
      success: true,

      data: report,

      summary: {
        presentDays: totalPresent,
        halfDays: totalHalfDays,
        lateCount: totalLate,
        earlyLogoutCount: totalEarlyLogout,
        overtimeHours: Number(totalOvertime.toFixed(2)),
      },
    });
  } catch (error) {
    console.log("Admin Attendance Summary Error:", error);

    res.status(500).json({
      error: "Failed to fetch admin report",
    });
  }
};

export const getDailyAttendanceReport = async (req,res)=>{

try{

const today = new Date();

today.setHours(0,0,0,0);


const employees = await Employee.find({
    isDeleted:false
});


const report=[];


for(const employee of employees){


const attendance = await Attendance.findOne({

employeeId:employee._id,

date:{
    $gte:today,
    $lt:new Date(today.getTime()+24*60*60*1000)
}

});



const activity = await ActivityTracking.findOne({

employeeId:employee._id,

date:{
    $gte:today,
    $lt:new Date(today.getTime()+24*60*60*1000)
}

});



let status="Absent";

let login=null;
let logout=null;
let workingHours="-";
let lateBy="-";



if(attendance){


if(attendance.status==="PRESENT")
status="Present";


if(attendance.status==="LATE")
status="Late";


if(attendance.status==="ABSENT")
status="Absent";



if(attendance.checkIn){

login = new Date(attendance.checkIn)
.toLocaleTimeString("en-IN",{
hour:"2-digit",
minute:"2-digit"
});

}



if(attendance.checkOut){

logout = new Date(attendance.checkOut)
.toLocaleTimeString("en-IN",{
hour:"2-digit",
minute:"2-digit"
});

}



if(attendance.workingHours){

const hours=Math.floor(
attendance.workingHours
);

const minutes=Math.floor(
(attendance.workingHours-hours)*60
);


workingHours=`${hours}h ${minutes}m`;

}



if(attendance.status==="LATE"){

const shiftStart=9;

const checkHour=new Date(
attendance.checkIn
).getHours();


const diff=checkHour-shiftStart;


if(diff>0){

lateBy=`${diff*60}m`;

}

}


}



report.push({

employeeId:employee._id,

name:
employee.firstName+" "+employee.lastName,

department:
employee.department || "N/A",

status,

login,

logout,

workingHours,

lateBy

});


}



res.json({

success:true,

data:report

});


}catch(error){

console.log(error);


res.status(500).json({

error:"Daily attendance failed"

});


}

};

export const getMissingAttendanceReport = async (req,res)=>{
  try {
    console.log("Missing Attendance API HIT");

    const today = new Date();
    today.setHours(0,0,0,0);


    const employees = await Employee.find({
      isDeleted:false
    });


    const report=[];


    for(const employee of employees){


      const attendance = await Attendance.findOne({

        employeeId: employee._id,

        date:{
          $gte:today,
          $lt:new Date(today.getTime()+24*60*60*1000)
        }

      });



      // Missing Login
      if(!attendance || !attendance.checkIn){

        report.push({

          name:
          employee.firstName+" "+employee.lastName,

          date:
          today.toLocaleDateString("en-GB"),

          issue:"Missing Login"

        });

        continue;
      }



      // Missing Logout
      if(attendance.checkIn && !attendance.checkOut){

        report.push({

          name:
          employee.firstName+" "+employee.lastName,

          date:
          today.toLocaleDateString("en-GB"),

          issue:"Missing Logout"

        });

      }


    }



    res.json({

      success:true,

      data:report

    });



  }catch(error){

    console.log(error);

    res.status(500).json({
      error:"Missing attendance report failed"
    });

  }
};

export const getShiftReport = async(req,res)=>{

    try{

        res.json({
            success:true,
            message:"Shift report working",
            data:[]
        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error:"Failed to fetch shift report"
        });

    }

};