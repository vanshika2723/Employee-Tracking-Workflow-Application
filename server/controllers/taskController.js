import TaskTracking from "../models/TaskTracking.js";
import Employee from "../models/Employee.js";

export const startTask = async (req, res) => {

    try {

        const userId = req.session.userId;

        const employee = await Employee.findOne({
            userId
        });

        if (!employee) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        const { taskName } = req.body;

        if (!taskName) {
            return res.status(400).json({
                error: "Task name is required"
            });
        }

        // Check if another task is already running
        const runningTask = await TaskTracking.findOne({
            employeeId: employee._id,
            status: "RUNNING"
        });

        if (runningTask) {
            return res.status(400).json({
                error: "Finish current task first"
            });
        }

        const task = await TaskTracking.create({

            employeeId: employee._id,

            taskName,

            startTime: new Date(),

            status: "RUNNING"

        });

        return res.json({
            success: true,
            message: "Task started",
            task
        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({
            error: "Failed to start task"
        });

    }

};

export const stopTask = async (req, res) => {

    try {

        const userId = req.session.userId;

        const employee = await Employee.findOne({
            userId
        });

        if (!employee) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        const task = await TaskTracking.findOne({

            employeeId: employee._id,

            status: "RUNNING"

        });

        if (!task) {
            return res.status(404).json({
                error: "No running task found"
            });
        }

        // task.endTime = new Date();

        // task.duration = Math.round(
        //     (task.endTime - task.startTime) / 1000
        // );

        // task.status = "COMPLETED";
        task.pauseTime = new Date();

task.duration += Math.floor(
    (task.pauseTime - task.startTime) / 1000
);

task.status = "PAUSED";

        await task.save();

        // return res.json({
        //     success: true,
        //     message: "Task stopped",
        //     task
        // });
        return res.json({
    success: true,
    message: "Task paused",
    task
});

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({
            error: "Failed to stop task"
        });

    }

};

export const resumeTask = async (req, res) => {
    try {

        const userId = req.session.userId;

        const employee = await Employee.findOne({ userId });

        if (!employee) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        const task = await TaskTracking.findOne({
            employeeId: employee._id,
            status: "PAUSED"
        });

        if (!task) {
            return res.status(404).json({
                error: "No paused task found"
            });
        }

        task.startTime = new Date();

        task.pauseTime = null;

        task.status = "RUNNING";

        await task.save();

        return res.json({
            success: true,
            message: "Task resumed",
            task
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: "Resume failed"
        });

    }
};
export const getCurrentTask = async (req, res) => {

    try {

        const userId = req.session.userId;

        const employee = await Employee.findOne({
            userId
        });

        if (!employee) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        // const task = await TaskTracking.findOne({
        //     employeeId: employee._id,
        //     status: "RUNNING"
        // });

        const task = await TaskTracking.findOne({
    employeeId: employee._id,
    status: { $in: ["RUNNING", "PAUSED"] }
});

        if (!task) {
            return res.json(null);
        }

        return res.json(task);

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({
            error: "Failed to get current task"
        });

    }

};




export const getMyTasks = async(req,res)=>{

 try{

   const tasks = await Task.find({
     assignedTo:req.user.id
   })
   .populate("assignedBy","name");


   res.json(tasks);


 }catch(error){

   res.status(500).json({
     message:error.message
   });

 }

};