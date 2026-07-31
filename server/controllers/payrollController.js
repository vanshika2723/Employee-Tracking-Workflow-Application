
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import ActivityTracking from "../models/ActivityTracking.js";
import Payroll from "../models/Payroll.js";
import AttendancePolicy from "../models/AttendancePolicy.js";


// =====================================================
// HELPER
// =====================================================

const formatMinutes = (minutes = 0) => {
  const totalMinutes = Number(minutes);

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return `${hours}h ${mins}m`;
};


// =====================================================
// GENERATE PAYROLL
// =====================================================

export const generatePayroll = async (req, res) => {

  try {

    const {
      employeeId,
      month,
      year
    } = req.body;


    if (!employeeId || !month || !year) {

      return res.status(400).json({
        error: "Employee, month and year are required"
      });

    }


    const employee =
      await Employee.findById(employeeId);


    if (!employee) {

      return res.status(404).json({
        error: "Employee not found"
      });

    }


    // Prevent duplicate payroll

    const already =
      await Payroll.findOne({
        employeeId,
        month,
        year
      });


    if (already) {

      return res.status(400).json({
        error: "Payroll already generated"
      });

    }


    // =================================================
    // DATE RANGE
    // =================================================

    const startDate =
      new Date(year, month - 1, 1);

    const endDate =
      new Date(
        year,
        month,
        0,
        23,
        59,
        59,
        999
      );


    // =================================================
    // ATTENDANCE
    // =================================================

    const attendance =
      await Attendance.find({
        employeeId,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      });


    let presentDays = 0;
    let halfDays = 0;
    let absentDays = 0;
    let lateLoginCount = 0;
    let earlyLogoutCount = 0;
    let overtimeHours = 0;


    attendance.forEach((item) => {

      if (
        item.status === "PRESENT" ||
        item.status === "LATE"
      ) {
        presentDays++;
      }


      if (item.status === "ABSENT") {
        absentDays++;
      }


      if (
        item.dayType === "Half Day" ||
        item.dayType === "Short Day"
      ) {
        halfDays++;
      }


      if (item.status === "LATE") {
        lateLoginCount++;
      }


      if (
        Number(item.earlyLogoutMinutes || 0) > 0
      ) {
        earlyLogoutCount++;
      }


      overtimeHours +=
        Number(item.overtimeHours || 0);

    });


    // =================================================
    // ACTIVITY
    // =================================================

    const activities =
      await ActivityTracking.find({
        employeeId,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      });


    let idleMinutes = 0;


    activities.forEach((item) => {

      if (
        Number(item.idleDeductionMinutes || 0) > 0
      ) {

        idleMinutes +=
          Number(item.idleDeductionMinutes || 0);

      } else {

        idleMinutes +=
          Number(item.idleTime || 0);

      }

    });


    // =================================================
    // POLICY
    // =================================================

    const policy =
      await AttendancePolicy.findOne();


    const allowedIdle =
      Number(policy?.allowedIdleTime ?? 60);


    const idleDeductionMinutes =
      Math.max(
        idleMinutes - allowedIdle,
        0
      );


    // =================================================
    // SALARY
    // =================================================

    const basicSalary =
      Number(employee.basicSalary || 0);

    const allowances =
      Number(employee.allowances || 0);

    const deductions =
      Number(employee.deductions || 0);


    const workingMinutes =
      26 * 9 * 60;


    const minuteRate =
      basicSalary / workingMinutes;


    const idleDeduction =
      Number(
        (
          idleDeductionMinutes *
          minuteRate
        ).toFixed(2)
      );


    // =================================================
    // OVERTIME
    // =================================================

    const overtimeAfter =
      Number(policy?.overtimeAfter ?? 9);


    const hourlyRate =
      basicSalary /
      26 /
      overtimeAfter;


    const overtimePay =
      Number(
        (
          overtimeHours *
          hourlyRate
        ).toFixed(2)
      );


    // =================================================
    // LOSS OF PAY
    // =================================================

    const dailySalary =
      basicSalary / 30;


    const absentDeduction =
      absentDays *
      dailySalary;


    const halfDayDeduction =
      halfDays *
      (dailySalary / 2);


    const lossOfPay =
      Number(
        (
          absentDeduction +
          halfDayDeduction
        ).toFixed(2)
      );


    // =================================================
    // NET SALARY
    // =================================================

    const grossSalary =
      basicSalary + allowances;


    const netSalary =
      Number(
        (
          grossSalary +
          overtimePay -
          deductions -
          idleDeduction -
          lossOfPay
        ).toFixed(2)
      );


    // =================================================
    // CREATE PAYROLL
    // =================================================

    const payroll =
      await Payroll.create({

        employeeId,

        month,

        year,

        presentDays,

        halfDays,

        lateLoginCount,

        earlyLogoutCount,

        overtimeHours,

        basicSalary,

        allowances,

        overtimePay,

        idleDeduction,

        lossOfPay,

        fixedDeduction: deductions,

        netSalary

      });


    return res.json({

      success: true,

      message:
        "Payroll Generated Successfully",

      payroll

    });


  } catch (error) {

    console.error(
      "Payroll Error:",
      error
    );


    return res.status(500).json({

      error:
        "Payroll generation failed",

      details:
        error.message

    });

  }

};


// =====================================================
// EMPLOYEE PAYROLL HISTORY
// =====================================================

export const getMyPayroll = async (req, res) => {

  try {

    const employee =
      await Employee.findOne({
        userId: req.session.userId
      });


    if (!employee) {

      return res.status(404).json({
        error: "Employee not found"
      });

    }


    const payroll =
      await Payroll.find({
        employeeId: employee._id
      })
      .sort({
        createdAt: -1
      });


    return res.json({

      success: true,

      payroll

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch payroll"
    });

  }

};


// =====================================================
// GET ALL PAYROLL
// =====================================================

export const getAllPayroll = async (req, res) => {

  try {

    const payroll =
      await Payroll.find()
        .populate("employeeId")
        .sort({
          createdAt: -1
        });


    return res.json({

      success: true,

      payroll

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch payroll"
    });

  }

};


// =====================================================
// PAYROLL SUMMARY
// =====================================================

export const getPayrollSummary = async (req, res) => {

  try {

    const payroll =
      await Payroll.find();


    let totalSalary = 0;
    let totalOvertime = 0;
    let totalDeduction = 0;


    payroll.forEach((item) => {

      totalSalary +=
        Number(item.netSalary || 0);


      totalOvertime +=
        Number(item.overtimePay || 0);


      totalDeduction +=

        Number(item.idleDeduction || 0) +

        Number(item.lossOfPay || 0) +

        Number(item.fixedDeduction || 0);

    });


    return res.json({

      success: true,

      summary: {

        totalEmployees:
          payroll.length,

        totalSalary:
          Number(totalSalary.toFixed(2)),

        totalOvertime:
          Number(totalOvertime.toFixed(2)),

        totalDeduction:
          Number(totalDeduction.toFixed(2))

      }

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Summary failed"
    });

  }

};


// =====================================================
// ATTENDANCE + PAYROLL REPORT
// =====================================================


export const getAttendancePayrollReport = async (req, res) => {
    console.log("CONTROLLER STARTED");
  try {

    const month = Number(req.query.month);
    const year = Number(req.query.year);


    if (!month || !year || month < 1 || month > 12) {
      return res.status(400).json({
        success:false,
        error:"Valid month and year are required"
      });
    }


    // DATE RANGE

    const startDate = new Date(
      year,
      month - 1,
      1
    );


    const endDate = new Date(
      year,
      month,
      0,
      23,
      59,
      59,
      999
    );


    console.log(
      "DATE RANGE",
      startDate,
      endDate
    );


    // FETCH DATA

    const [
      employees,
      attendance,
      activities,
      policy
    ] = await Promise.all([


      Employee.find({
        isDeleted:false,
        employmentStatus:"ACTIVE"
      }).lean(),


      Attendance.find({
        date:{
          $gte:startDate,
          $lte:endDate
        }
      }).lean(),


      ActivityTracking.find({
        date:{
          $gte:startDate,
          $lte:endDate
        }
      }).lean(),


      AttendancePolicy.findOne().lean()

    ]);



    console.log(
      "EMPLOYEES FOUND",
      employees.length
    );


    console.log(
      "ATTENDANCE FOUND",
      attendance.length
    );



    // POLICY

    const minimumWorkingHours =
      Number(policy?.minimumWorkingHours ?? 8);


    const halfDayHours =
      Number(policy?.halfDayHours ?? 4);


    const overtimeAfter =
      Number(policy?.overtimeAfter ?? 9);


    const allowedIdleTime =
      Number(policy?.allowedIdleTime ?? 60);


    const idleDeductionRate =
      Number(policy?.idleDeductionRate ?? 2);



    let totalPresentDays = 0;
    let totalHalfDays = 0;
    let totalLateLogins = 0;
    let totalEarlyLogouts = 0;
    let totalOvertimeHours = 0;
    let totalIdleMinutes = 0;
    let totalLossOfPay = 0;



    const employeeReports =
    employees.map((employee)=>{


      const employeeId =
        employee._id.toString();



      const employeeAttendance =
        attendance.filter(
          a =>
          a.employeeId &&
          a.employeeId.toString() === employeeId
        );



      const employeeActivities =
        activities.filter(
          a =>
          a.employeeId &&
          a.employeeId.toString() === employeeId
        );



      let present=0;
      let absent=0;
      let halfDay=0;
      let lateLogin=0;
      let earlyLogout=0;
      let overtime=0;

const daysInMonth = new Date(year, month, 0).getDate();

      employeeAttendance.forEach(item=>{


        const workingHours =
          Number(item.workingHours || 0);



        let dayType =
          item.dayType;



        if(!dayType){

          if(
            workingHours >= minimumWorkingHours
          )
          {
            dayType="Full Day";
          }

          else if(
            workingHours >= halfDayHours
          )
          {
            dayType="Half Day";
          }

          else if(
            workingHours > 0
          )
          {
            dayType="Short Day";
          }

          else
          {
            dayType="Absent";
          }

        }



        if(
          item.status==="PRESENT" ||
          item.status==="LATE"
        ){
          present++;
        }



        if(
          item.status==="ABSENT" ||
          dayType==="Absent"
        ){
          absent++;
        }



        if(
          dayType==="Half Day" ||
          dayType==="Three Quarter Day"
        ){
          halfDay++;
        }



        if(item.status==="LATE"){
          lateLogin++;
        }

const logoutGrace =
  Number(policy?.logoutGracePeriod ?? 10);

        if(
          Number(item.earlyLogoutMinutes || 0)
          > 10
        ){
          earlyLogout++;
        }



        let ot =
          Number(item.overtimeHours || 0);



        if(workingHours > overtimeAfter){

          ot =
          workingHours - overtimeAfter;

        }


        overtime += ot;


      });
absent = Math.max(
  daysInMonth - present - halfDay,
  0
);


      // IDLE

      let idleMinutes=0;


      employeeActivities.forEach(item=>{

        idleMinutes +=
          Number(item.idleTime || 0);

      });



      if(employeeActivities.length===0){

        employeeAttendance.forEach(item=>{

          idleMinutes +=
            Number(item.idleMinutes || 0);

        });

      }



      const activeDays =
        employeeAttendance.filter(
          x =>
          x.status==="PRESENT" ||
          x.status==="LATE"
        ).length;



      const allowedIdle =
        allowedIdleTime * activeDays;



      const extraIdle =
        Math.max(
          idleMinutes - allowedIdle,
          0
        );



      const productivityPercent =
        Number(
          (
            (extraIdle/60) *
            idleDeductionRate
          ).toFixed(2)
        );



      // SALARY


      const basicSalary =
        Number(employee.basicSalary || 0);


      const allowances =
        Number(employee.allowances || 0);


      const deductions =
        Number(employee.deductions || 0);



      const dailySalary =
        basicSalary / 30;



      const absentDeduction =
        absent * dailySalary;



      const halfDeduction =
        halfDay *
        (dailySalary/2);



      const productivityAmount =
        Number(
          (
            dailySalary *
            productivityPercent /
            100
          ).toFixed(2)
        );



      const lossOfPay =
        Number(
          (
            absentDeduction +
            halfDeduction +
            productivityAmount
          ).toFixed(2)
        );
console.log({
  employee: `${employee.firstName} ${employee.lastName}`,
  basicSalary,
  absent,
  halfDay,
  absentDeduction,
  halfDeduction,
  productivityAmount,
  lossOfPay,
});
let attendanceAdjustment = "—";

if (absent > 0) {
  attendanceAdjustment = `${absent} Day`;
} else if (halfDay > 0) {
  attendanceAdjustment = `${halfDay} Half Day`;
}

      let overtimePay=0;


      if(
        basicSalary>0 &&
        overtime>0
      ){

        const hourlyRate =
          basicSalary /
          26 /
          overtimeAfter;


        overtimePay =
          Number(
            (
              overtime *
              hourlyRate
            ).toFixed(2)
          );

      }



      const grossSalary =
        basicSalary +
        allowances;



      const netSalary =
        Number(
          (
            grossSalary +
            overtimePay -
            deductions -
            lossOfPay
          ).toFixed(2)
        );




      totalPresentDays += present;
      totalHalfDays += halfDay;
      totalLateLogins += lateLogin;
      totalEarlyLogouts += earlyLogout;
      totalOvertimeHours += overtime;
      totalIdleMinutes += extraIdle;
      totalLossOfPay += lossOfPay;



      return {


        employeeId:employee._id,


        name:
        `${employee.firstName} ${employee.lastName}`,


        present,

        absent,

        halfDay,

        lateLogin,

        earlyLogout,


        overtime:
        Number(overtime.toFixed(2)),


        idleMinutes:extraIdle,


        idleDeduction:
        formatMinutes(extraIdle),


        productivityDeduction:
        productivityPercent > 0
        ? `${productivityPercent}%`
        :"None",


        lossOfPay,


        overtimePay,


        basicSalary,


        allowances,


        fixedDeductions:deductions,


        grossSalary,


        netSalary,
        attendanceAdjustment,

      };
      


    });



    return res.status(200).json({

      success:true,

      month,

      year,


      summary:{


        presentDays:totalPresentDays,

        halfDays:totalHalfDays,

        lateLogins:totalLateLogins,

        earlyLogouts:totalEarlyLogouts,


        overtimeHours:
        Number(totalOvertimeHours.toFixed(2)),


        idleMinutes:totalIdleMinutes,


        totalLossOfPay:
        Number(totalLossOfPay.toFixed(2))

      },


      employees:employeeReports

    });



  }
  catch(error){

    console.error(
      "ATTENDANCE PAYROLL REPORT ERROR:",
      error
    );


    return res.status(500).json({

      success:false,

      error:
      "Failed to generate attendance payroll report",

      details:error.message

    });

  }

};
