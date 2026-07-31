import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({

   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},

employeeId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Employee",
    required:false
},

    title:{
        type:String,
        required:true
    },


    message:{
        type:String,
        required:true
    },


  type:{
    type:String,
    enum:[
        "LATE_LOGIN",
        "IDLE_TIME",
        "LOGOUT_REMINDER",
        "ATTENDANCE_WARNING",
        "PRODUCTIVITY_ALERT",
        "ANNOUNCEMENT",
        "LEAVE",
        "LEAVE_STATUS",
        "PAYSLIP",
        "SYSTEM"
    ],
    default:"SYSTEM"
},
channel:{
    type:String,

    enum:[
        "IN_APP",
        "EMAIL",
        "SMS",
        "WHATSAPP",
        "PUSH"
    ],

    default:"IN_APP"
},


    isRead:{
        type:Boolean,
        default:false
    },


    createdAt:{
        type:Date,
        default:Date.now
    }


});


export default mongoose.model(
    "Notification",
    notificationSchema
);