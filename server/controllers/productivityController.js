import ActivityTracking from "../models/ActivityTracking.js";
import Employee from "../models/Employee.js";
import Workflow from "../models/Workflow.js";
import Attendance from "../models/Attendance.js";

export const getTodayProductivity = async (req, res) => {
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
    today.setHours(0, 0, 0, 0);

    // Attendance
    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: today },
    });

    // Activity
    const activity = await ActivityTracking.findOne({
      employeeId: employee._id,
      date: { $gte: today },
    }).sort({
      createdAt: -1,
    });

    if (!attendance && !activity) {
      return res.json({
        loginDuration: 0,
        activeTime: 0,
        idleTime: 0,
        breakTime: 0,
        productiveTime: 0,
        productivity: 0,
      });
    }

    // Login Duration (Attendance -> Hours to Minutes)
    const loginDuration = Math.round(
      (attendance?.workingHours || 0) * 60
    );

    // Activity values are stored in seconds
    const activeTime = Math.round(
      (activity?.activeTime || 0) / 60
    );

    const idleTime = Math.round(
      (activity?.idleTime || 0) / 60
    );

    const breakTime = Math.round(
      (activity?.breakTime || 0) / 60
    );

    // Formula
    const productiveTime = Math.max(
      loginDuration -
        idleTime -
        breakTime,
      0
    );

    // Productivity %
    const productivity =
      loginDuration > 0
        ? Math.round(
            (productiveTime /
              loginDuration) *
              100
          )
        : 0;

    return res.json({
      loginDuration,
      activeTime,
      idleTime,
      breakTime,
      productiveTime,
      productivity,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Productivity error",
    });
  }
};

export const getDashboardProductivity = async (req, res) => {

    try {

        const userId = req.session.userId;

        const employee = await Employee.findOne({ userId });

        if (!employee) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        const today = new Date();

        // Today
        const startToday = new Date(today);
        startToday.setHours(0,0,0,0);

        // Last 7 days
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 6);
        weekStart.setHours(0,0,0,0);

        // First day of month
        const monthStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        // Today's record
        const todayRecord = await ActivityTracking.findOne({
            employeeId: employee._id,
            date: { $gte: startToday }
        });

        // Weekly records
        const weeklyRecords = await ActivityTracking.find({
            employeeId: employee._id,
            date: { $gte: weekStart }
        });

        // Monthly records
        const monthlyRecords = await ActivityTracking.find({
            employeeId: employee._id,
            date: { $gte: monthStart }
        });

        const avg = (records) => {

            if(records.length === 0) return 0;

            return Math.round(

                records.reduce(
                    (sum,item)=>sum+item.productivity,
                    0
                ) / records.length

            );

        };
        // Team Average (same department)

const teamEmployees = await Employee.find({
    department: employee.department
});

const teamIds = teamEmployees.map(emp => emp._id);

const teamRecords = await ActivityTracking.find({
    employeeId: { $in: teamIds },
    date: { $gte: monthStart }
});

const teamAverage = avg(teamRecords);


// Yesterday comparison

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
yesterday.setHours(0,0,0,0);

const yesterdayEnd = new Date(yesterday);
yesterdayEnd.setHours(23,59,59,999);

const yesterdayRecord = await ActivityTracking.findOne({
    employeeId: employee._id,
    date: {
        $gte: yesterday,
        $lte: yesterdayEnd
    }
});

const yesterdayChange =
    (todayRecord?.productivity || 0) -
    (yesterdayRecord?.productivity || 0);

       res.json({

    daily: todayRecord?.productivity || 0,

    weekly: avg(weeklyRecords),

    monthly: avg(monthlyRecords),

    team: teamAverage,

    yesterdayChange

});

    }

    catch(error){

        console.log(error);

        res.status(500).json({
            error:"Server Error"
        });

    }

};

export const getProductivityTrend = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        error: "User not authenticated",
      });
    }

    const employee = await Employee.findOne({
      userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const start = new Date();

    start.setDate(start.getDate() - 13);
    start.setHours(0, 0, 0, 0);

    const end = new Date();

    end.setHours(23, 59, 59, 999);

    const records = await ActivityTracking.find({
      employeeId: employee._id,

      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({
      date: 1,
    });

    const trend = records.map((item) => ({
      day: new Date(item.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),

      productivity: Number(
        item.productivity || 0
      ),
    }));

    console.log("TREND RECORDS:", records.length);
    console.log("TREND DATA:", trend);

    return res.json(trend);
  } catch (error) {
    console.log("Productivity Trend Error:", error);

    return res.status(500).json({
      error: "Server Error",
    });
  }
};

export const getAdminProductivity = async (req, res) => {
  const filter = req.query.filter || "today";

  try {
    console.log("========== ADMIN PRODUCTIVITY ==========");
    console.log("Filter:", filter);

    let startDate;
    let endDate = new Date();

    const now = new Date();

    if (filter === "today") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (filter === "week") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
    } else {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
    }

    console.log("Start:", startDate);
    console.log("End:", endDate);

    const records = await ActivityTracking.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate(
      "employeeId",
      "firstName lastName department"
    );

    console.log("Records Found:", records.length);


   const avgProductivity =
records.length > 0
?
Math.round(
    records.reduce(
        (sum,item)=>sum + (item.productivity || 0),
        0
    ) / records.length
)
:
0;


const totalActiveHours =
Math.round(
    records.reduce(
        (sum,item)=>sum + (item.activeTime || 0),
        0
    ) / 3600
);


const totalIdleHours =
Math.round(
    records.reduce(
        (sum,item)=>sum + (item.idleTime || 0),
        0
    ) / 3600
);

const bestDay = records.reduce(
    (max,item)=>
    item.productivity > (max?.productivity || 0)
    ? item
    : max,
    null
);
const ranking = records
.sort(
(a,b)=>
(b.productivity || 0) -
(a.productivity || 0)
)
.slice(0,5)
.map(item=>({

_id:item.employeeId?._id,

firstName:item.employeeId?.firstName,

lastName:item.employeeId?.lastName,

department:item.employeeId?.department,

productivity:item.productivity || 0

}));


res.json({

    records,

    avgProductivity,

    totalActiveHours,

    totalIdleHours,

    bestDay:{
        productivity: bestDay?.productivity || 0,
        date: bestDay?.date || null
    },

    ranking,

    filter

});


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

const employees = await Employee.find({});


const result=[];


for(const emp of employees){


const activity = await ActivityTracking
.findOne({
employeeId: emp._id
})
.sort({
createdAt:-1
});


result.push({

name:
`${emp.firstName} ${emp.lastName}`,


productivity:
activity?.productivity || 0,


productiveTime:
activity?.productiveTime || 0

});


}


res.json(result);


}
catch(error){

console.log(error);

res.status(500).json({
error:"Server Error"
});


}

};
export const getDepartmentProductivity = async (req, res) => {
    try {

        const employees = await Employee.find({});

        const departments = {};

        for (const emp of employees) {

            const activity = await ActivityTracking.findOne({
                employeeId: emp._id
            }).sort({ createdAt: -1 });

            const department = emp.department || "Other";

            if (!departments[department]) {

                departments[department] = {
                    total: 0,
                    count: 0
                };

            }

            departments[department].total += activity?.productivity || 0;
            departments[department].count++;

        }

const result = Object.keys(departments).map((department)=>{

    const productivity = Math.round(
        departments[department].total /
        departments[department].count
    );


    return {

        department,

        productivity,

        trend:
        productivity >= 85
        ? " 5.2%"
        :
        productivity >= 75
        ? " 2.1%"
        :
        " 1.8%",


        positive:
        productivity >= 75

    };

});
        return res.json(result);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: "Server Error"
        });

    }
};
export const getEmployeeComparison = async (req, res) => {

  try {

    const { emp1, emp2 } = req.query;

    if (!emp1 || !emp2) {
      return res.json({
        data: []
      });
    }

    const ids = [emp1, emp2];

    const result = [];

    for (const id of ids) {

      const emp = await Employee.findById(id);

      if (!emp) continue;

      const activity = await ActivityTracking
        .findOne({
          employeeId: emp._id
        })
        .sort({
          createdAt: -1
        });

      const tasks = await Workflow.find({
        employee: emp._id
      });

      const completedTasks =
        tasks.filter(
          t => t.status === "Completed"
        ).length;

      const onTimeTasks =
        tasks.filter(t =>
          t.status === "Completed" &&
          new Date(t.updatedAt) <=
          new Date(t.deadline)
        ).length;

      result.push({

        firstName: emp.firstName,

        activeHours:
          Math.round(
            (activity?.activeTime || 0) / 3600
          ),

        productivity:
          activity?.productivity || 0,

        tasksDone:
          completedTasks,

        onTime:
          tasks.length
            ? Math.round(
                (onTimeTasks / tasks.length) * 100
              )
            : 0

      });

    }

    res.json({
      data: result
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};

export const getWeeklyPerformance = async(req,res)=>{

try{


const userId=req.session.userId;


const employee=await Employee.findOne({
userId
});


const start=new Date();

start.setDate(start.getDate()-6);

start.setHours(0,0,0,0);



const end=new Date();

end.setHours(23,59,59,999);



const records=await ActivityTracking.find({

employeeId:employee._id,

date:{
$gte:start,
$lte:end
}

});



let result=[];



for(let i=6;i>=0;i--){


let date=new Date();

date.setDate(date.getDate()-i);



let record=records.find(item=>

new Date(item.date)
.toDateString()
===
date.toDateString()

);



result.push({

day:
date.toLocaleDateString(
"en-IN",
{
weekday:"short",
day:"numeric",
month:"short"
}
),


productivity:
record
?
Number(record.productivity)
:
null


});


}



res.json(result);



}
catch(error){

console.log(error);

res.status(500).json({
error:"Weekly error"
});

}

};
export const getMonthlyPerformance = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        error: "User not authenticated",
      });
    }

    const employee = await Employee.findOne({
      userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const start = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const records = await ActivityTracking.find({
      employeeId: employee._id,

      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({
      date: 1,
    });

    const weekly = {};

    records.forEach((item) => {
      const day = new Date(item.date).getDate();

      const week = `W${Math.ceil(day / 7)}`;

      if (!weekly[week]) {
        weekly[week] = [];
      }

      weekly[week].push(
        Number(item.productivity || 0)
      );
    });

    const result = Object.keys(weekly).map((week) => ({
      week,

      productivity: Math.round(
        weekly[week].reduce(
          (sum, value) => sum + value,
          0
        ) / weekly[week].length
      ),
    }));

    console.log("MONTHLY RECORDS:", records.length);
    console.log("MONTHLY DATA:", result);

    return res.json(result);
  } catch (error) {
    console.log("Monthly Performance Error:", error);

    return res.status(500).json({
      error: "Server Error",
    });
  }
};