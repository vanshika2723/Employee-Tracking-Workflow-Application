

import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../config/nodemailer.js";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
//Login for employee and admin



export const login = async (req,res)=>{
    
    try{
        // console.log("LOGIN BODY:", req.body);
        
        // const {email,password,role_type}=req.body;
        const {identity,password,role_type}=req.body;

        // if(!email || !password){
        //     return res.status(400).json({error:"Email and password are required"});
        // }
        if(!identity || !password){
    return res.status(400).json({error:"Employee ID/Email and password are required"});
}

        // const user=await User.findOne({email})
//         const user = await User.findOne({
//     $or:[
//         {email:identity},
//         {employeeId:identity}
//     ]
// });
let user = await User.findOne({
    email: identity
});


if(!user){

    const employee = await Employee.findOne({
        employeeId: identity
    });


    if(employee){
        user = await User.findById(employee.userId);
    }

}

// console.log("FOUND USER:", user);
// console.log("FOUND USER:", user);

        if(!user){
            return res.status(401).json({error :"Invalid credentials"});
        }

        if(role_type === "admin" && user.role !== "ADMIN"){
            return res.status(401).json({error: "Not authorized as admin"})
        }

         if(role_type === "employee" && user.role !== "EMPLOYEE"){
            return res.status(401).json({error: "Not authorized as employee"})
        }
const isValid = await bcrypt.compare(password, user.password)
if(!isValid){
    return  res.status(401).json({error:"Invalid credentials"})
}

const payload={
    userId:user._id.toString(),
    role:user.role,
    email:user.email,
}
const token=jwt.sign(payload, process.env.JWT_SECRET,
    {expiresIn:"7d"}

    
)

user.sessions.push({
    token: token,
    device: req.headers["user-agent"]
});

await user.save();
return res.json({user:payload,token});

    }catch(error){
        console.error("Login error:",error);
        return res.status(500).json({error:"Login Failed"});

    }
}


// Send OTP for forgot password

export const sendOTP = async(req,res)=>{
    try{

        console.log("SEND OTP BODY:", req.body);

        const {email}=req.body;

        const user = await User.findOne({email});

        // console.log("USER:", user);


        if(!user){
            return res.status(404).json({
                error:"Email not registered"
            });
        }


        const otp = Math.floor(
            100000 + Math.random()*900000
        ).toString();


        user.otp = otp;
        user.otpExpiry = Date.now()+10*60*1000;


        await user.save();


        console.log("GENERATED OTP:", otp);


        return res.json({
            success:true,
            message:"OTP sent successfully"
        });


    }catch(error){

        console.log("SEND OTP ERROR:",error);

        return res.status(500).json({
            error:"Failed to send OTP"
        });

    }
}

export const verifyOTP = async(req,res)=>{

    try{

        const {email,otp}=req.body;


        const user = await User.findOne({email});


        if(!user){
            return res.status(404).json({
                error:"User not found"
            });
        }


        if(user.otp !== otp){
            return res.status(400).json({
                error:"Invalid OTP"
            });
        }


        if(user.otpExpiry < Date.now()){
            return res.status(400).json({
                error:"OTP expired"
            });
        }


        return res.json({
            success:true,
            message:"OTP verified"
        });


    }catch(error){

        res.status(500).json({
            error:"OTP verification failed"
        });

    }

}
//get session for employee and admin

export const session=(req,res)=>{
    const session=req.session;
    return res.json({user:session})
}


//change password for employee and admin
export const changePassword=async(req,res)=>{
    try{
        const session=req.session;
        const {currentPassword, newPassword}=req.body;
        if(!currentPassword || !newPassword){
            return res.status(400).json({error:"Both passwords are required"})
        }
        const user=await User.findById(session.userId)
        if(!user) return res.status(404).json({error:"User not found"});
        const isValid=await bcrypt.compare(currentPassword, user.password);
        if(!isValid) return res.status(400).json({error:"Current password is incorrect"})
            const hashed=await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(session.userId, {password:hashed})
        return res.json({success:true})
    }catch(error){
         return res.status(500).json({error:"Failed to change password"})

    }
}

export const resetPassword = async(req,res)=>{

try{

const {token}=req.params;

const {newPassword}=req.body;


const user = await User.findOne({
    resetPasswordToken:token,
    resetPasswordExpiry:{
        $gt:Date.now()
    }
});


if(!user){

return res.status(400).json({
    error:"Invalid or expired reset link"
});

}



const hashedPassword = await bcrypt.hash(
    newPassword,
    10
);


user.password = hashedPassword;

user.resetPasswordToken = null;

user.resetPasswordExpiry = null;


await user.save();



res.json({

success:true,

message:"Password reset successful"

});


}catch(error){

console.log(error);

res.status(500).json({
error:"Failed to reset password"
});

}

}
export const forgotPassword = async(req,res)=>{

try{

const {email}=req.body;


const user=await User.findOne({email});


if(!user){
 return res.status(404).json({
 error:"Email not registered"
 });
}


// create token

const token = crypto.randomBytes(32).toString("hex");


user.resetPasswordToken = token;

user.resetPasswordExpiry =
Date.now() + 15*60*1000;


await user.save();



const resetLink =
`http://localhost:5173/reset-password/${token}`;



await sendEmail({
    to:user.email,
    subject:"Password Reset Request",
    body:`
        <h2>Reset your password</h2>

        <p>
        Click the button below to reset your password.
        </p>

        <a href="${resetLink}">
        Reset Password
        </a>

        <p>
        This link expires in 15 minutes.
        </p>
    `
});



res.json({

message:
"A password reset link has been sent to your registered email and expires in 15 minutes."

});


}catch(error){

console.log(error);

res.status(500).json({
error:"Failed to send reset link"
});

}

}

export const activateAccount = async(req,res)=>{

try{

const {email}=req.body;


const user = await User.findOne({email});


if(!user){
 return res.status(404).json({
    error:"Email not registered"
 })
}


const otp = Math.floor(
100000 + Math.random()*900000
).toString();


user.otp = otp;
user.otpExpiry = Date.now()+10*60*1000;


await user.save();


console.log("ACTIVATE OTP:",otp);



res.json({
success:true,
message:"OTP sent successfully"
})


}catch(error){

console.log(error);

res.status(500).json({
error:"Failed to send OTP"
})

}

}
export const verifyActivateOTP=async(req,res)=>{

try{

const {email,otp}=req.body;


const user=await User.findOne({email});


if(!user)
return res.status(404).json({
error:"User not found"
})


if(user.otp!==otp)
return res.status(400).json({
error:"Invalid OTP"
})


if(user.otpExpiry < Date.now())
return res.status(400).json({
error:"OTP expired"
})


user.isVerified=true;

await user.save();


res.json({
success:true,
message:"OTP verified"
})


}catch(error){

res.status(500).json({
error:"Verification failed"
})

}

}

export const createPassword=async(req,res)=>{

try{

const {email,password}=req.body;


const user=await User.findOne({email});


const hashed=await bcrypt.hash(password,10);


user.password=hashed;
user.firstLogin=false;


await user.save();


res.json({
success:true,
message:"Account activated"
})


}catch(error){

res.status(500).json({
error:"Password creation failed"
})

}

}