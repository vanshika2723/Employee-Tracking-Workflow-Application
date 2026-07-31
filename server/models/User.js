import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    employeeId:{
    type:String,
    unique:true,
    sparse:true
},

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        default:null
    },

    role:{
        type:String,
        enum:["ADMIN","EMPLOYEE"],
        default:"EMPLOYEE"
    },
    sessions:[
    {
        token:{
            type:String
        },
        device:{
            type:String
        },
        loginAt:{
            type:Date,
            default:Date.now
        }
    }
],
firstLogin:{
    type:Boolean,
    default:true
},

isVerified:{
    type:Boolean,
    default:false
},
otp:{
    type:String
},

otpExpiry:{
    type:Date
},
resetPasswordToken:{
    type:String,
    default:null
},

resetPasswordExpiry:{
    type:Date,
    default:null
}


   
},{timestamps:true})


const User =
mongoose.models.User || mongoose.model("User",userSchema)


export default User;