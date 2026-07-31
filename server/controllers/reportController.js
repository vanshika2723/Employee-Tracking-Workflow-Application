import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import ActivityTracking from "../models/ActivityTracking.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import TaskTracking from "../models/TaskTracking.js";
import Payroll from "../models/Payroll.js";
import IdleSession from "../models/IdleSession.js";


export const exportEmployeeReport = async(req,res)=>{

    try{

        const employees = await Employee.find({
            isDeleted:false
        });


        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet("Employees");


        sheet.columns=[
            {
                header:"Name",
                key:"name"
            },
            {
                header:"Department",
                key:"department"
            },
            {
                header:"Position",
                key:"position"
            },
            {
                header:"Status",
                key:"status"
            }
        ];


        employees.forEach(emp=>{

            sheet.addRow({

                name:
                `${emp.firstName} ${emp.lastName}`,

                department:emp.department,

                position:emp.position,

                status:emp.employmentStatus

            });

        });



        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.setHeader(
            "Content-Disposition",
            "attachment; filename=employees.xlsx"
        );


        await workbook.xlsx.write(res);

        res.end();


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

}

export const exportAttendanceReport = async(req,res)=>{

    try{

        const attendance = await Attendance.find()
        .populate(
            "employeeId",
            "firstName lastName department"
        );


        const workbook = new ExcelJS.Workbook();


        const sheet = workbook.addWorksheet("Attendance");


        sheet.columns=[

            {
                header:"Employee",
                key:"name",
                width:25
            },

            {
                header:"Department",
                key:"department",
                width:20
            },

            {
                header:"Date",
                key:"date",
                width:15
            },

            {
                header:"Check In",
                key:"checkIn",
                width:15
            },

            {
                header:"Check Out",
                key:"checkOut",
                width:15
            },

            {
                header:"Status",
                key:"status",
                width:15
            },

            {
                header:"Working Hours",
                key:"workingHours",
                width:15
            }

        ];



        attendance.forEach(item=>{


            sheet.addRow({

                name:
                item.employeeId
                ?
                `${item.employeeId.firstName} ${item.employeeId.lastName}`
                :
                "Unknown",


                department:
                item.employeeId?.department || "N/A",


                date:
                item.date
                ?
                new Date(item.date).toLocaleDateString()
                :
                "-",


                checkIn:
                item.checkIn
                ?
                new Date(item.checkIn).toLocaleTimeString()
                :
                "-",


                checkOut:
                item.checkOut
                ?
                new Date(item.checkOut).toLocaleTimeString()
                :
                "-",


                status:item.status || "-",


                workingHours:item.workingHours || 0

            });


        });



        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.setHeader(
            "Content-Disposition",
            'attachment; filename="attendance.xlsx"'
        );


        await workbook.xlsx.write(res);


        res.end();


    }
    catch(error){

        console.log("Attendance export error:",error);


        res.status(500).json({
            error:error.message
        });

    }

};

export const exportProductivityReport = async(req,res)=>{

    try{

        const productivity = await ActivityTracking.find()
        .populate(
            "employeeId",
            "firstName lastName department"
        );


        const workbook = new ExcelJS.Workbook();


        const sheet = workbook.addWorksheet(
            "Productivity"
        );


        sheet.columns=[

            {
                header:"Employee",
                key:"name",
                width:25
            },

            {
                header:"Department",
                key:"department",
                width:20
            },

            {
                header:"Date",
                key:"date",
                width:15
            },

            {
                header:"Active Time",
                key:"activeTime",
                width:15
            },

            {
                header:"Idle Time",
                key:"idleTime",
                width:15
            },

            {
                header:"Working Hours",
                key:"workingHours",
                width:15
            },

            {
                header:"Productivity %",
                key:"productivity",
                width:15
            }

        ];



        productivity.forEach(item=>{


            sheet.addRow({

                name:
                item.employeeId
                ?
                `${item.employeeId.firstName} ${item.employeeId.lastName}`
                :
                "Unknown",


                department:
                item.employeeId?.department || "N/A",


                date:
                new Date(item.date)
                .toLocaleDateString(),


                activeTime:
                item.activeTime || 0,


                idleTime:
                item.idleTime || 0,


                workingHours:
                item.workingHours || 0,


                productivity:
                item.productivity || 0

            });


        });



        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.setHeader(
            "Content-Disposition",
            'attachment; filename="productivity.xlsx"'
        );


        await workbook.xlsx.write(res);

        res.end();


    }
    catch(error){

        console.log(
            "Productivity export error:",
            error
        );


        res.status(500).json({
            error:error.message
        });

    }

};

export const exportSummaryPDF = async(req,res)=>{

    try{

        const totalEmployees =
        await Employee.countDocuments({
            isDeleted:false
        });


        const totalAttendance =
        await Attendance.countDocuments();


        const totalTasks =
        await TaskTracking.countDocuments();



        const avgProductivity =
        await ActivityTracking.aggregate([

            {
                $group:{
                    _id:null,
                    avg:{
                        $avg:"$productivity"
                    }
                }
            }

        ]);



        const doc = new PDFDocument();



        res.setHeader(
            "Content-Type",
            "application/pdf"
        );


        res.setHeader(
            "Content-Disposition",
            'attachment; filename="dashboard-summary.pdf"'
        );



        doc.pipe(res);



        doc.fontSize(20)
        .text(
            "Admin Dashboard Summary Report",
            {
                align:"center"
            }
        );



        doc.moveDown();



        doc.fontSize(14)
        .text(
            `Total Employees : ${totalEmployees}`
        );


        doc.text(
            `Total Attendance Records : ${totalAttendance}`
        );


        doc.text(
            `Total Tasks : ${totalTasks}`
        );


        doc.text(
            `Average Productivity : ${
                Math.round(
                avgProductivity[0]?.avg || 0
                )
            }%`
        );



        doc.moveDown();


        doc.text(
            "Generated by Employee Workflow Tracking System"
        );


        doc.end();


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

}
export const exportPayrollReport = async(req,res)=>{

    try{

        const payroll =
        await Payroll.find()
        .populate(
            "employeeId",
            "firstName lastName department"
        );


        const workbook =
        new ExcelJS.Workbook();


        const sheet =
        workbook.addWorksheet("Payroll");


        sheet.columns=[

            {
                header:"Employee",
                key:"name",
                width:25
            },

            {
                header:"Department",
                key:"department",
                width:20
            },

            {
                header:"Month",
                key:"month",
                width:15
            },

            {
                header:"Present Days",
                key:"presentDays",
                width:15
            },

            {
                header:"Half Days",
                key:"halfDays",
                width:15
            },

            {
                header:"Late Login",
                key:"lateLoginCount",
                width:15
            },

            {
                header:"Early Logout",
                key:"earlyLogoutCount",
                width:15
            },

            {
                header:"Overtime Hours",
                key:"overtimeHours",
                width:15
            },

            {
                header:"Idle Deduction",
                key:"idleDeduction",
                width:15
            },

            {
                header:"Loss Of Pay",
                key:"lossOfPay",
                width:15
            },

            {
                header:"Net Salary",
                key:"netSalary",
                width:15
            }

        ];



        payroll.forEach(item=>{


            sheet.addRow({

                name:
                `${item.employeeId?.firstName || ""}
                ${item.employeeId?.lastName || ""}`,


                department:
                item.employeeId?.department || "N/A",


                month:
                `${item.month}`,


                presentDays:
                item.presentDays || 0,


                halfDays:
                item.halfDays || 0,


                lateLoginCount:
                item.lateLoginCount || 0,


                earlyLogoutCount:
                item.earlyLogoutCount || 0,


                overtimeHours:
                item.overtimeHours || 0,


                idleDeduction:
                item.idleDeduction || 0,


                lossOfPay:
                item.lossOfPay || 0,


                netSalary:
                item.netSalary || 0

            });


        });



        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.setHeader(
            "Content-Disposition",
            'attachment; filename="payroll-report.xlsx"'
        );


        await workbook.xlsx.write(res);


        res.end();


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error:error.message
        });

    }

};

export const getLoginLogoutReport = async(req,res)=>{

    try{

        const attendance = await Attendance.find()
        .populate(
            "employeeId",
            "firstName lastName department"
        )
        .sort({createdAt:-1});


        const report = attendance.map(item=>{

            let duration = "0h 0m";

            if(item.checkIn && item.checkOut){

                const diff =
                new Date(item.checkOut)
                -
                new Date(item.checkIn);


                const hours =
                Math.floor(diff/(1000*60*60));


                const minutes =
                Math.floor(
                    (diff%(1000*60*60))
                    /(1000*60)
                );


                duration =
                `${hours}h ${minutes}m`;

            }


            return {

                employee:
                item.employeeId
                ?
                `${item.employeeId.firstName} ${item.employeeId.lastName}`
                :
                "Unknown",

                department:
                item.employeeId?.department || "N/A",

                login:
                item.checkIn
                ?
                new Date(item.checkIn)
                .toLocaleTimeString("en-US",
                {
                    hour:"2-digit",
                    minute:"2-digit"
                })
                :
                "-",


                logout:
                item.checkOut
                ?
                new Date(item.checkOut)
                .toLocaleTimeString("en-US",
                {
                    hour:"2-digit",
                    minute:"2-digit"
                })
                :
                "-",


                duration

            }

        });


        res.json(report);


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

}

export const getIdleTimeReport = async(req,res)=>{

    try{

        const idleReport = await IdleSession.find()
        .populate(
            "employeeId",
            "firstName lastName department"
        );


        const report = idleReport.map(item=>({

            employee:
            item.employeeId
            ?
            `${item.employeeId.firstName} ${item.employeeId.lastName}`
            :
            "Unknown",


            department:
            item.employeeId?.department || "N/A",


            startTime:
            item.startTime
            ?
            new Date(item.startTime)
            .toLocaleTimeString()
            :
            "-",


            endTime:
            item.endTime
            ?
            new Date(item.endTime)
            .toLocaleTimeString()
            :
            "-",


            idleMinutes:
            item.durationMinutes || 0

        }));


        res.json(report);


    }
    catch(error){

        console.log("Idle Report Error:",error);

        res.status(500).json({
            error:error.message
        });

    }

};

export const exportIdleReport = async(req,res)=>{

try{

const idle = await IdleSession.find()
.populate(
    "employeeId",
    "firstName lastName department"
);


const workbook = new ExcelJS.Workbook();

const sheet = workbook.addWorksheet("Idle Report");


sheet.columns = [

{
    header:"Employee",
    key:"employee",
    width:25
},

{
    header:"Department",
    key:"department",
    width:20
},

{
    header:"Idle Start",
    key:"startTime",
    width:20
},

{
    header:"Idle End",
    key:"endTime",
    width:20
},

{
    header:"Idle Minutes",
    key:"idleMinutes",
    width:15
}

];


idle.forEach(item=>{


sheet.addRow({

employee:
item.employeeId
?
`${item.employeeId.firstName} ${item.employeeId.lastName}`
:
"Unknown",


department:
item.employeeId?.department || "N/A",


startTime:
item.startTime
?
new Date(item.startTime).toLocaleTimeString()
:
"-",


endTime:
item.endTime
?
new Date(item.endTime).toLocaleTimeString()
:
"-",


idleMinutes:
item.durationMinutes || 0


});


});


res.setHeader(
"Content-Type",
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);


res.setHeader(
"Content-Disposition",
'attachment; filename="idle-report.xlsx"'
);


await workbook.xlsx.write(res);

res.end();


}
catch(error){

console.log("Idle Export Error:",error);

res.status(500).json({
error:error.message
});

}

};

export const getIdleReport = async(req,res)=>{

try{

const activity = await ActivityTracking.find({
    idleTime:{
        $gt:0
    }
})
.populate(
    "employeeId",
    "firstName lastName department"
);


const report = activity.map(item=>({

employee:
item.employeeId
?
`${item.employeeId.firstName} ${item.employeeId.lastName}`
:
"Unknown",


department:
item.employeeId?.department || "N/A",


date:
item.date
?
new Date(item.date).toLocaleDateString()
:
"-",


idleStart:
item.idleStartTime
?
new Date(item.idleStartTime).toLocaleTimeString()
:
"-",


idleEnd:
item.idleEndTime
?
new Date(item.idleEndTime).toLocaleTimeString()
:
"-",


idleTime:
`${Math.floor((item.idleTime || 0)/60)} min`,


reason:
item.idleReason || "-",


status:
item.idleStatus || "ACTIVE"


}));


res.json(report);


}
catch(error){

console.log(error);

res.status(500).json({
error:error.message
});

}

};
export const getAttendanceReport = async(req,res)=>{

    try{

        const attendance = await Attendance.find()
        .populate(
            "employeeId",
            "firstName lastName department"
        )
        .sort({
            createdAt:-1
        });


        const report = attendance.map(item=>({

            employee:
            item.employeeId
            ?
            `${item.employeeId.firstName} ${item.employeeId.lastName}`
            :
            "Unknown",


            department:
            item.employeeId?.department || "N/A",


            date:
            item.date
            ?
            new Date(item.date).toLocaleDateString()
            :
            "-",


            checkIn:
            item.checkIn
            ?
            new Date(item.checkIn).toLocaleTimeString()
            :
            "-",


            checkOut:
            item.checkOut
            ?
            new Date(item.checkOut).toLocaleTimeString()
            :
            "-",


            status:item.status,


            workingHours:item.workingHours || 0

        }));


        res.json(report);


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

export const getPerformanceReport = async(req,res)=>{

  try{

    const employees = await Employee.find({
      isDeleted:false
    });


    const report = [];


    for(const emp of employees){


      const attendance =
      await Attendance.find({
        employeeId: emp._id
      });


      const activity =
      await ActivityTracking.find({
        employeeId: emp._id
      });



      let workingHours = 0;
      let idleTime = 0;
      let activeTime = 0;



      attendance.forEach(item=>{

        workingHours += item.workingHours || 0;

        idleTime += item.idleMinutes || 0;

      });



      activity.forEach(item=>{

        activeTime += item.activeTime || 0;

      });



      const attendancePercentage =
      attendance.length
      ?
      Math.round(
        (attendance.filter(
          a=>a.status==="PRESENT"
        ).length / attendance.length) * 100
      )
      :
      0;



      report.push({

        employee:
        `${emp.firstName} ${emp.lastName}`,


        department:
        emp.department,


        workingHours,


        activeTime,


        idleTime,


        attendance:
        `${attendancePercentage}%`,


        productivity:
        workingHours
        ?
        Math.round(
          (activeTime / workingHours) * 100
        )
        :
        0

      });


    }



    res.json(report);



  }
  catch(error){

    console.log(error);

    res.status(500).json({
      error:error.message
    });

  }

};
export const getProductivityReport = async(req,res)=>{

try{

const productivity = await ActivityTracking.find()
.populate(
"employeeId",
"firstName lastName department"
)
.sort({
createdAt:-1
});


console.log("ACTIVITY DATA:", productivity);


const report = productivity.map(item=>({

name:
item.employeeId
?
`${item.employeeId.firstName} ${item.employeeId.lastName}`
:
"Unknown",

department:
item.employeeId?.department || "N/A",

activeTime:item.activeTime || 0,

idleTime:item.idleTime || 0,

workingHours:item.workingHours || 0,

productivity:item.productivity || 0

}));

console.log("PRODUCTIVITY REPORT:", report);


res.json(report);


}
catch(error){

console.log(error);

res.status(500).json({
error:error.message
});

}

};
export const getTeamProductivity = async (req,res)=>{

try{

const activities = await ActivityTracking.find()
.populate(
    "employeeId",
    "department"
);


const departmentMap = {};


activities.forEach(item=>{

const dept = item.employeeId?.department || "N/A";


if(!departmentMap[dept]){

departmentMap[dept]={

department:dept,

employees:0,

activeTime:0,

idleTime:0

};

}


departmentMap[dept].employees++;

departmentMap[dept].activeTime += item.activeTime || 0;

departmentMap[dept].idleTime += item.idleTime || 0;


});



const report = Object.values(departmentMap).map(item=>{


const total =
item.activeTime + item.idleTime;


return {

department:item.department,

employees:item.employees,

activeTime:item.activeTime,

idleTime:item.idleTime,

productivity:
total > 0
?
Math.round((item.activeTime/total)*100)
:
0

};


});


res.json(report);


}
catch(error){

console.log(error);

res.status(500).json({
error:error.message
});

}

};

export const getDepartmentAnalytics = async(req,res)=>{

try{

const employees = await Employee.find({
    isDeleted:false
});


const departmentData = {};


for(const emp of employees){


const dept = emp.department || "N/A";


if(!departmentData[dept]){

departmentData[dept]={

department:dept,

totalEmployees:0,

activeTime:0,

idleTime:0,

workingHours:0,

present:0,

totalAttendance:0

};

}


// employee count

departmentData[dept].totalEmployees++;



// Activity data

const activities = await ActivityTracking.find({
    employeeId:emp._id
});


activities.forEach(item=>{

departmentData[dept].activeTime += item.activeTime || 0;

departmentData[dept].idleTime += item.idleTime || 0;

departmentData[dept].workingHours += item.workingHours || 0;


});




// Attendance data

const attendance = await Attendance.find({
    employeeId:emp._id
});


attendance.forEach(item=>{

departmentData[dept].totalAttendance++;

if(item.status==="PRESENT"){
    departmentData[dept].present++;
}

});


}



const report = Object.values(departmentData).map(item=>{


const totalTime =
item.activeTime + item.idleTime;


return {

department:item.department,

employees:item.totalEmployees,

activeTime:item.activeTime,

idleTime:item.idleTime,

workingHours:item.workingHours,


productivity:
totalTime
?
Math.round(
(item.activeTime / totalTime)*100
)
:
0,


attendance:
item.totalAttendance
?
Math.round(
(item.present/item.totalAttendance)*100
)
:
0


};


});


res.json(report);


}
catch(error){

console.log(error);

res.status(500).json({
error:error.message
});

}

};
export const getWorkflowEfficiency = async(req,res)=>{

try{

const employees = await Employee.find({
    isDeleted:false
});


const report = [];


for(const emp of employees){


const tasks = await TaskTracking.find({
    employeeId: emp._id
});



let totalTasks = tasks.length;

let completedTasks = 0;

let pendingTasks = 0;

let totalDuration = 0;



tasks.forEach(task=>{


if(task.status==="COMPLETED"){
    completedTasks++;
}
else{
    pendingTasks++;
}


totalDuration += task.duration || 0;


});



const completionRate =
totalTasks
?
Math.round(
(completedTasks / totalTasks) * 100
)
:
0;



report.push({

employee:
`${emp.firstName} ${emp.lastName}`,


department:
emp.department || "N/A",


totalTasks,


completedTasks,


pendingTasks,


completionRate:`${completionRate}%`,


averageTime:
totalTasks
?
Math.round(totalDuration / totalTasks)
:
0


});


}



res.json(report);


}
catch(error){

console.log("Workflow Report Error:",error);


res.status(500).json({
error:error.message
});


}

};
export const getMonthlyPerformanceSummary = async(req,res)=>{

try{


const startDate = new Date();

startDate.setDate(1);
startDate.setHours(0,0,0,0);


const endDate = new Date();



const employees = await Employee.find({
    isDeleted:false
});


const report = [];


for(const emp of employees){


const attendance = await Attendance.find({

employeeId:emp._id,

date:{
    $gte:startDate,
    $lte:endDate
}

});



const activities = await ActivityTracking.find({

employeeId:emp._id,

date:{
    $gte:startDate,
    $lte:endDate
}

});



let workingHours = 0;

let activeTime = 0;

let idleTime = 0;



attendance.forEach(item=>{

workingHours += item.workingHours || 0;

});



activities.forEach(item=>{

activeTime += item.activeTime || 0;

idleTime += item.idleTime || 0;

});



const attendancePercentage =
attendance.length
?
Math.round(
(
attendance.filter(
a=>a.status==="PRESENT"
).length
/
attendance.length
)
*100
)
:
0;



const productivity =
(activeTime + idleTime)
?
Math.round(
(activeTime/(activeTime+idleTime))*100
)
:
0;



report.push({

employee:
`${emp.firstName} ${emp.lastName}`,

department:
emp.department || "N/A",


month:
startDate.toLocaleString(
"en-US",
{
month:"long",
year:"numeric"
}
),


workingHours,


attendance:
`${attendancePercentage}%`,


productivity:`${productivity}%`,


activeTime,


idleTime


});


}



res.json(report);



}
catch(error){

console.log(
"Monthly Performance Error:",
error
);


res.status(500).json({
error:error.message
});


}

};
export const exportMonthlyPerformanceReport = async(req,res)=>{

try{


const startDate = new Date();

startDate.setDate(1);

startDate.setHours(0,0,0,0);



const employees = await Employee.find({
isDeleted:false
});


const workbook = new ExcelJS.Workbook();

const sheet = workbook.addWorksheet("Monthly Performance");



sheet.columns=[

{
header:"Employee",
key:"employee",
width:25
},

{
header:"Department",
key:"department",
width:20
},

{
header:"Month",
key:"month",
width:20
},

{
header:"Working Hours",
key:"workingHours",
width:15
},

{
header:"Attendance %",
key:"attendance",
width:15
},

{
header:"Productivity %",
key:"productivity",
width:15
},

{
header:"Active Time",
key:"activeTime",
width:15
},

{
header:"Idle Time",
key:"idleTime",
width:15
}

];



for(const emp of employees){


const attendance =
await Attendance.find({

employeeId:emp._id,

date:{
$gte:startDate
}

});


const activities =
await ActivityTracking.find({

employeeId:emp._id,

date:{
$gte:startDate
}

});



let workingHours=0;
let activeTime=0;
let idleTime=0;



attendance.forEach(item=>{

workingHours += item.workingHours || 0;

});


activities.forEach(item=>{

activeTime += item.activeTime || 0;

idleTime += item.idleTime || 0;

});



const attendancePercent =
attendance.length
?
Math.round(
(
attendance.filter(
a=>a.status==="PRESENT"
).length /
attendance.length
)*100
)
:
0;



const productivity =
(activeTime+idleTime)
?
Math.round(
(activeTime/(activeTime+idleTime))*100
)
:
0;



sheet.addRow({

employee:
`${emp.firstName} ${emp.lastName}`,

department:
emp.department || "N/A",

month:
startDate.toLocaleString(
"en-US",
{
month:"long",
year:"numeric"
}
),

workingHours,

attendance:
`${attendancePercent}%`,

productivity:
`${productivity}%`,

activeTime,

idleTime

});


}



res.setHeader(
"Content-Type",
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);


res.setHeader(
"Content-Disposition",
'attachment; filename="monthly-performance.xlsx"'
);


await workbook.xlsx.write(res);

res.end();


}
catch(error){

console.log(error);

res.status(500).json({
error:error.message
});

}

};

export const exportReport = async (req, res) => {
  try {

    const { type, reportType } = req.params;

    // =========================
    // LOGIN REPORT
    // =========================
    if (reportType === "login") {

      if (type === "excel") return exportAttendanceReport(req, res);

      if (type === "csv") return exportCSVReport(req, res);

      if (type === "pdf") return exportSummaryPDF(req, res);
    }

    // =========================
    // ATTENDANCE
    // =========================
    if (reportType === "attendance") {

      if (type === "excel") return exportAttendanceReport(req, res);

      if (type === "csv") return exportCSVReport(req, res);

      if (type === "pdf") return exportSummaryPDF(req, res);
    }

    // =========================
    // PRODUCTIVITY
    // =========================
    if (reportType === "productivity") {

      if (type === "excel") return exportProductivityReport(req, res);

      if (type === "csv") return exportCSVReport(req, res);

      if (type === "pdf") return exportSummaryPDF(req, res);
    }

    // =========================
// IDLE REPORT
// =========================
if (reportType === "idle") {

  if (type === "excel") {
    return exportIdleReport(req, res);
  }

  if (type === "csv") {
    return exportCSVReport(req, res);
  }

  if (type === "pdf") {
    return exportSummaryPDF(req, res);
  }

}

// =========================
// PERFORMANCE REPORT
// =========================
if (reportType === "performance") {

  if (type === "excel") {
    return exportPerformanceReport(req, res);
  }

  if (type === "csv") {
    return exportCSVReport(req, res);
  }

  if (type === "pdf") {
    return exportSummaryPDF(req, res);
  }

}
// =========================
// MONTHLY PERFORMANCE REPORT
// =========================
if (reportType === "monthly") {

  if (type === "excel") {
    return exportMonthlyPerformanceReport(req, res);
  }

  if (type === "csv") {
    return exportCSVReport(req, res);
  }

  if (type === "pdf") {
    return exportSummaryPDF(req, res);
  }

}
// =========================
// TEAM PRODUCTIVITY
// =========================
if (reportType === "team") {

  if (type === "excel") {
    return exportTeamProductivityReport(req,res);
  }

  if (type === "csv") {
    return exportCSVReport(req,res);
  }

  if (type === "pdf") {
    return exportSummaryPDF(req,res);
  }

}


// =========================
// DEPARTMENT ANALYTICS
// =========================
if (reportType === "department") {

  if (type === "excel") {
    return exportDepartmentReport(req,res);
  }

  if (type === "csv") {
    return exportCSVReport(req,res);
  }

  if (type === "pdf") {
    return exportSummaryPDF(req,res);
  }

}


// =========================
// WORKFLOW ANALYTICS
// =========================
if (reportType === "workflow") {

  if (type === "excel") {
    return exportWorkflowReport(req,res);
  }

  if (type === "csv") {
    return exportCSVReport(req,res);
  }

  if (type === "pdf") {
    return exportSummaryPDF(req,res);
  }

}
    // =========================
    // PAYROLL
    // =========================
    if (reportType === "payroll") {

      if (type === "excel") return exportPayrollReport(req, res);

      if (type === "csv") return exportCSVReport(req, res);

      if (type === "pdf") return exportSummaryPDF(req, res);
    }

    // =========================
    // EMPLOYEE
    // =========================
    if (reportType === "employees") {

      if (type === "excel") return exportEmployeeReport(req, res);

      if (type === "csv") return exportCSVReport(req, res);

      if (type === "pdf") return exportSummaryPDF(req, res);
    }

    // Baaki reports ke liye abhi PDF Summary bhej do
    if (type === "pdf") {
      return exportSummaryPDF(req, res);
    }

    return res.status(400).json({
      error: "Invalid report type"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }
};

export const exportCSVReport = async (req, res) => {
  try {

    const attendance = await Attendance.find()
      .populate(
        "employeeId",
        "firstName lastName department"
      );

    let csv =
      "Employee,Department,Date,Check In,Check Out,Status,Working Hours\n";

    attendance.forEach(item => {

      csv += `"${item.employeeId ? `${item.employeeId.firstName} ${item.employeeId.lastName}` : "Unknown"}",`;

      csv += `"${item.employeeId?.department || "N/A"}",`;

      csv += `"${item.date ? new Date(item.date).toLocaleDateString() : "-"}",`;

      csv += `"${item.checkIn ? new Date(item.checkIn).toLocaleTimeString() : "-"}",`;

      csv += `"${item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : "-"}",`;

      csv += `"${item.status || "-"}",`;

      csv += `"${item.workingHours || 0}"\n`;

    });

    res.setHeader("Content-Type", "text/csv");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="attendance-report.csv"'
    );

    res.send(csv);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }
};
export const exportPerformanceReport = async(req,res)=>{

try{

const employees = await Employee.find({
    isDeleted:false
});


const workbook = new ExcelJS.Workbook();

const sheet = workbook.addWorksheet("Performance");


sheet.columns=[

{
 header:"Employee",
 key:"employee",
 width:25
},

{
 header:"Department",
 key:"department",
 width:20
},

{
 header:"Working Hours",
 key:"workingHours",
 width:15
},

{
 header:"Active Time",
 key:"activeTime",
 width:15
},

{
 header:"Idle Time",
 key:"idleTime",
 width:15
},

{
 header:"Attendance %",
 key:"attendance",
 width:15
},

{
 header:"Productivity %",
 key:"productivity",
 width:15
}

];


for(const emp of employees){


const attendance =
await Attendance.find({
 employeeId:emp._id
});


const activity =
await ActivityTracking.find({
 employeeId:emp._id
});


let workingHours=0;
let activeTime=0;
let idleTime=0;


attendance.forEach(item=>{
 workingHours += item.workingHours || 0;
});


activity.forEach(item=>{
 activeTime += item.activeTime || 0;
 idleTime += item.idleTime || 0;
});


const attendancePercent =
attendance.length
?
Math.round(
(
attendance.filter(
a=>a.status==="PRESENT"
).length /
attendance.length
)*100
)
:
0;


const productivity =
( activeTime + idleTime )
?
Math.round(
(activeTime/(activeTime+idleTime))*100
)
:
0;



sheet.addRow({

employee:
`${emp.firstName} ${emp.lastName}`,

department:
emp.department || "N/A",

workingHours,

activeTime,

idleTime,

attendance:
`${attendancePercent}%`,

productivity:
`${productivity}%`

});


}



res.setHeader(
"Content-Type",
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);


res.setHeader(
"Content-Disposition",
'attachment; filename="performance-report.xlsx"'
);


await workbook.xlsx.write(res);

res.end();


}
catch(error){

console.log(error);

res.status(500).json({
error:error.message
});

}

};
export const exportTeamProductivityReport = async(req,res)=>{

try{

const activities = await ActivityTracking.find()
.populate(
"employeeId",
"department"
);


const dept={};


activities.forEach(item=>{

const department = item.employeeId?.department || "N/A";


if(!dept[department]){

dept[department]={
department,
employees:0,
activeTime:0,
idleTime:0
};

}


dept[department].employees++;

dept[department].activeTime += item.activeTime || 0;

dept[department].idleTime += item.idleTime || 0;


});


const workbook = new ExcelJS.Workbook();

const sheet = workbook.addWorksheet("Team Productivity");


sheet.columns=[

{
header:"Department",
key:"department",
width:20
},

{
header:"Employees",
key:"employees",
width:15
},

{
header:"Active Time",
key:"activeTime",
width:15
},

{
header:"Idle Time",
key:"idleTime",
width:15
},

{
header:"Productivity %",
key:"productivity",
width:15
}

];



Object.values(dept).forEach(item=>{


const total =
item.activeTime + item.idleTime;


sheet.addRow({

department:item.department,

employees:item.employees,

activeTime:item.activeTime,

idleTime:item.idleTime,

productivity:
total
?
Math.round(
(item.activeTime/total)*100
)
:
0


});


});



res.setHeader(
"Content-Type",
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);


res.setHeader(
"Content-Disposition",
'attachment; filename="team-productivity.xlsx"'
);


await workbook.xlsx.write(res);

res.end();


}
catch(error){

console.log(error);

res.status(500).json({
error:error.message
});

}

};
export const exportDepartmentReport = async(req,res)=>{

try{


const employees = await Employee.find({
isDeleted:false
});


const department={};


for(const emp of employees){


const deptName = emp.department || "N/A";


if(!department[deptName]){

department[deptName]={

department:deptName,

employees:0,

activeTime:0,

idleTime:0,

workingHours:0

};

}



department[deptName].employees++;


const activity =
await ActivityTracking.find({
employeeId:emp._id
});


activity.forEach(item=>{

department[deptName].activeTime += item.activeTime || 0;

department[deptName].idleTime += item.idleTime || 0;

department[deptName].workingHours += item.workingHours || 0;


});


}



const workbook = new ExcelJS.Workbook();

const sheet = workbook.addWorksheet("Department Analytics");



sheet.columns=[

{
header:"Department",
key:"department",
width:20
},

{
header:"Employees",
key:"employees",
width:15
},

{
header:"Active Time",
key:"activeTime",
width:15
},

{
header:"Idle Time",
key:"idleTime",
width:15
},

{
header:"Working Hours",
key:"workingHours",
width:15
},

{
header:"Productivity %",
key:"productivity",
width:15
}

];



Object.values(department).forEach(item=>{


const total =
item.activeTime + item.idleTime;


sheet.addRow({

department:item.department,

employees:item.employees,

activeTime:item.activeTime,

idleTime:item.idleTime,

workingHours:item.workingHours,

productivity:
total
?
Math.round(
(item.activeTime/total)*100
)
:
0


});


});



res.setHeader(
"Content-Type",
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);


res.setHeader(
"Content-Disposition",
'attachment; filename="department-analytics.xlsx"'
);


await workbook.xlsx.write(res);

res.end();


}
catch(error){

console.log(error);

res.status(500).json({
error:error.message
});

}

};
export const exportWorkflowReport = async(req,res)=>{

try{


const employees = await Employee.find({
isDeleted:false
});


const workbook = new ExcelJS.Workbook();

const sheet =
workbook.addWorksheet("Workflow Analytics");



sheet.columns=[

{
header:"Employee",
key:"employee",
width:25
},

{
header:"Department",
key:"department",
width:20
},

{
header:"Total Tasks",
key:"totalTasks",
width:15
},

{
header:"Completed",
key:"completed",
width:15
},

{
header:"Pending",
key:"pending",
width:15
},

{
header:"Completion %",
key:"completion",
width:15
},

{
header:"Average Time",
key:"averageTime",
width:15
}

];



for(const emp of employees){


const tasks =
await TaskTracking.find({
employeeId:emp._id
});


let completed=0;

let pending=0;

let duration=0;



tasks.forEach(task=>{


if(task.status==="COMPLETED"){
completed++;
}
else{
pending++;
}


duration += task.duration || 0;


});



const rate =
tasks.length
?
Math.round(
(completed/tasks.length)*100
)
:
0;



sheet.addRow({

employee:
`${emp.firstName} ${emp.lastName}`,

department:
emp.department || "N/A",

totalTasks:
tasks.length,

completed,

pending,

completion:
`${rate}%`,

averageTime:
tasks.length
?
Math.round(duration/tasks.length)
:
0


});


}



res.setHeader(
"Content-Type",
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);


res.setHeader(
"Content-Disposition",
'attachment; filename="workflow-analytics.xlsx"'
);


await workbook.xlsx.write(res);

res.end();


}
catch(error){

console.log(error);

res.status(500).json({
error:error.message
});

}

};