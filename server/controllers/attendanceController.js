//Clock in/out for employee
import AttendancePolicy from "../models/AttendancePolicy.js";
import { inngest } from "../inngest/index.js";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Shift from "../models/Shift.js";
import { createNotification } from "../services/notificationService.js";

export const clockInOut=async(req,res)=>{
    try{
        const session=req.session;
        const employee=await Employee.findOne({userId:session.userId})
        if(!employee) return res.status(404).json({error:"Employee not found"});
        if(employee.isDeleted) return res.status(403).json({error:"Your account is deactivated. You cannot clock in/out.",});

        const today=new Date();
        today.setHours(0,0,0,0);
        const existing=await Attendance.findOne({
            employeeId:employee._id,
            date:today,
        })

        const now=new Date()
        // Find employee assigned shift
const shift = await Shift.findOne({
    employees: employee._id
});
const policy = await AttendancePolicy.findOne();

const minimumWorkingHours =
    policy?.minimumWorkingHours || 9;

const overtimeAfter =
    policy?.overtimeAfter || 9;

const gracePeriod =
    policy?.gracePeriod || 15;
let isLate = false;


if(shift){

    const [shiftHour, shiftMinute] = shift.startTime.split(":");


    const shiftStart = new Date(today);


    shiftStart.setHours(
        Number(shiftHour),
        Number(shiftMinute),
        0,
        0
    );


    const allowedTime = new Date(
        shiftStart.getTime() +
        // shift.gracePeriod * 60 * 1000
        gracePeriod * 60 * 1000
    );


  if(now > allowedTime){

    isLate = true;


    await createNotification({

        employeeId: employee._id,

        title:"Late Login Alert",

        message:`${employee.firstName} ${employee.lastName} logged in late at ${now.toLocaleTimeString()}`,

        type:"LATE_LOGIN"

    });

}

}

        if(!existing){
            // const isLate=now.getHours() >= 9 && now.getMinutes() > 0 ; 
            const attendance = await Attendance.create({
                employeeId:employee._id,
                date:today,
                checkIn:now,
                status:isLate ? "LATE" : "PRESENT",
                 lateLoginCount: isLate ? 1 : 0
            })

            await inngest.send({
                name:"employee/check-out",
                data:{
                    employeeId:employee._id,
                    attendanceId:attendance._id,
                }
            })

            return res.json({success : true,type:"CHECK_IN",
                data:attendance
            })
            
        }
        else if(!existing.checkOut){
            const checkInTime=new Date(existing.checkIn).getTime()
            const diffMs= now.getTime() - checkInTime;
            const diffHours = diffMs / (1000 * 60 * 60)

            existing.checkOut=now;

            const workingHours=parseFloat(diffHours.toFixed(2))

            // Early Logout Calculation

let earlyLogoutMinutes = 0;


if(shift){

    const [endHour,endMinute] =
    shift.endTime.split(":");


    const shiftEnd = new Date(today);


    shiftEnd.setHours(
        Number(endHour),
        Number(endMinute),
        0,
        0
    );


    if(now < shiftEnd){

        earlyLogoutMinutes =
        Math.floor(
            (shiftEnd - now) / 60000
        );

    }

}


existing.earlyLogoutMinutes =
earlyLogoutMinutes;
            let dayType="Half Day";
            if(workingHours >= minimumWorkingHours) dayType = "Full Day";
            else if(workingHours >= 6) dayType = "Three Quarter Day";
             else if(workingHours >= 4) dayType = "Half Day";
              else dayType = "Short Day";

              

              existing.workingHours = workingHours;
existing.dayType = dayType;


// Overtime Calculation
if(workingHours > overtimeAfter){

    existing.overtimeHours =
    parseFloat(
        (workingHours - overtimeAfter).toFixed(2)
    );

}
else{

    existing.overtimeHours = 0;

}



await existing.save();
              return res.json({success : true, type:"CHECK_OUT",data:existing})

        }else{
               return res.json({success : true, type:"CHECK_OUT",data:existing})

        }


    }catch(error){
        console.error("Attendance Error: ",error)
           return res.status(500).json({error:"Operation Failed"})


    }
}

export const getAttendance = async (req,res)=>{
    try{

        const session=req.session;

        const employee=await Employee.findOne({
            userId:session.userId
        });

        if(!employee)
            return res.status(404).json({
                error:"Employee not found"
            });


        const limit=parseInt(req.query.limit || 30);


        const history = await Attendance.find({
            employeeId: employee._id,
        })
        .sort({
            date:-1
        })
        .limit(limit);



        // Attendance Warning Check

        const halfDays = history.filter(item =>
            item.dayType === "Half Day" ||
            item.dayType === "Short Day"
        ).length;



        if(halfDays >= 3){

            await createNotification({

                employeeId:employee._id,

                title:"Attendance Warning",

                message:`${employee.firstName} has ${halfDays} half days this week`,

                type:"ATTENDANCE_WARNING"

            });

        }



        return res.json({

            data:history,

            employee:{
                isDeleted:employee.isDeleted
            }

        });


    }
    catch(error){

        console.log(error);

        return res.status(500).json({
            error:"Failed to fetch attendance"
        });

    }
}

export const getTodayAttendanceStatus = async(req,res)=>{

    try{

        const session = req.session;


        const employee = await Employee.findOne({
            userId: session.userId
        });


        if(!employee){
            return res.status(404).json({
                error:"Employee not found"
            });
        }



        const today = new Date();

        today.setHours(0,0,0,0);



        const attendance = await Attendance.findOne({
            employeeId: employee._id,
            date: today
        });



        if(!attendance){

            return res.json({

                status:"ABSENT",

                loginTime:null,

                logoutTime:null

            });

        }




        let status="OFFLINE";


        if(attendance.checkIn && !attendance.checkOut){

            status="ONLINE";

        }


        if(attendance.checkIn && attendance.checkOut){

            status="LOGGED OUT";

        }




        return res.json({

            status,

            loginTime:attendance.checkIn,

            logoutTime:attendance.checkOut || null,

            workingHours:attendance.workingHours || 0

        });



    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error:"Failed to fetch status"
        });

    }

}

export const getAttendanceReport = async(req,res)=>{

    try{

        const { employeeId } = req.params;


        const attendance = await Attendance.find({
            employeeId
        });



        let presentDays = 0;
        let halfDays = 0;
        let lateCount = 0;
        let overtimeHours = 0;
        let earlyLogoutCount = 0;



        attendance.forEach(item=>{


            if(
                item.status === "PRESENT" ||
                item.status === "LATE"
            ){

                presentDays++;

            }


            if(
                item.dayType === "Half Day" ||
                item.dayType === "Short Day"
            ){

                halfDays++;

            }


            if(item.status === "LATE"){

                lateCount++;

            }
            if(item.earlyLogoutMinutes > 0){

    earlyLogoutCount++;

}


            overtimeHours +=
            item.overtimeHours || 0;


        });




        res.json({

            success:true,

            report:{

                totalDays: attendance.length,

                presentDays,

                halfDays,

                lateCount,

                overtimeHours,
                earlyLogoutCount,

            }

        });



    }catch(error){

        console.log(error);


        res.status(500).json({

            error:"Failed to generate report"

        });

    }

};