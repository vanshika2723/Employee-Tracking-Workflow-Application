import mongoose from "mongoose";

const taskTrackingSchema = new mongoose.Schema({

    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
    },

    taskName:{
        type:String,
        required:true
    },

    startTime:{
        type:Date,
        default:Date.now
    },

    endTime:{
        type:Date,
        default:null
    },

    duration:{
        type:Number,
        default:0
    },

   status: {
  type: String,
  enum: ["RUNNING", "PAUSED", "COMPLETED"],
  default: "RUNNING"
},
pauseTime: {
  type: Date,
  default: null
},

pausedDuration: {
  type: Number,
  default: 0
},

},{
    timestamps:true
});

const TaskTracking =
mongoose.models.TaskTracking ||
mongoose.model("TaskTracking", taskTrackingSchema);

export default TaskTracking;