import Employee from "../models/Employee.js";
import User from "../models/User.js";

export const getProfile = async(req,res)=>{
  try{

    const session = req.session;


    const employee = await Employee.findOne({
      userId: session.userId
    });


    if(!employee){

      const admin = await User.findById(
        session.userId
      );


      return res.json({

        userId: session.userId,

        _id: admin?._id,

        firstName:"Admin",

        lastName:"",

        email:session.email,

        role: admin?.role || "ADMIN"

      });

    }


    return res.json({

      userId: session.userId,

      _id: employee._id,

      firstName: employee.firstName,

      lastName: employee.lastName,

      email: employee.email,

      role:"EMPLOYEE"

    });


  }catch(error){

    console.log(error);

    return res.status(500).json({
      error:"Failed to fetch profile"
    });

  }
}


export const updateProfile=async(req,res)=>{

    try{
         const session=req.session;
        const employee=await Employee.findOne({userId:session.userId})
         if(!employee)
            return res.status(404).json({error:"Employee not found"});

         if(employee.isDeleted){
            return res.status(403).json({error:"Your account is deactivated.You cannot update your profile."})
         }
                 await Employee.findByIdAndUpdate(employee._id,{
                    bio:req.body.bio
                 }) 
                 return res.json({success:true})  
    }catch{
  return res.status(500).json({error:"Failed to update profile"})

    }
    
}