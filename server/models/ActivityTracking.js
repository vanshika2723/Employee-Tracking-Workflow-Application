import mongoose from "mongoose";

const activityTrackingSchema = new mongoose.Schema({

    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
    },

    date:{
        type:Date,
        default:Date.now
    },

    loginTime:{
        type:Date,
        default:null
    },

    logoutTime:{
        type:Date,
        default:null
    },

    activeTime:{
        type:Number,
        default:0
    },

    idleTime:{
        type:Number,
        default:0
    },

    breakTime:{
        type:Number,
        default:0
    },
breakStartTime:{
    type:Date,
    default:null
},

breakEndTime:{
    type:Date,
    default:null
},

isOnBreak:{
    type:Boolean,
    default:false
},
    screenInactiveTime:{
        type:Number,
        default:0
    },
    systemLockDuration:{
    type:Number,
    default:0
},

    taskDuration:{
        type:Number,
        default:0
    },
       workingHours:{
    type:Number,
    default:0
},

    lastActivity:{
        type:Date,
        default:Date.now
    },

    productivity:{
        type:Number,
        default:0
    },
    productiveTime:{
    type:Number,
    default:0
},idleDeductionMinutes:{
    type:Number,
    default:0
},
idleStatus:{
    type:String,
    enum:[
        "ACTIVE",
        "IDLE",
        "APPROVED_IDLE"
    ],
    default:"ACTIVE"
},

idleStartTime:{
    type:Date,
    default:null
},

idleEndTime:{
    type:Date,
    default:null
},

idleReason:{
    type:String,
    default:null
},

adminAdjustmentMinutes:{
    type:Number,
    default:0
},

isApprovedIdle:{
    type:Boolean,
    default:false
},

extraBreakMinutes:{
    type:Number,
    default:0
},
 keyboardActivity: {
    type: Number,
    default: 0
},

mouseActivity: {
    type: Number,
    default: 0
},

screenLocked: {
    type: Boolean,
    default: false
},

browserActivity: {
    type: String,
    default: ""
},

currentTab: {
    type: String,
    default: ""
},

},{
    timestamps:true
});


const ActivityTracking =
mongoose.models.ActivityTracking ||
mongoose.model("ActivityTracking",activityTrackingSchema);


export default ActivityTracking;