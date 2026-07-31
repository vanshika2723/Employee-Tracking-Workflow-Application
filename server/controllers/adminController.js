import Employee from "../models/Employee.js";


export const getAdminStats = async(req,res)=>{

    try{

        const totalEmployees = await Employee.countDocuments({
            isDeleted:false
        });


        const activeEmployees = await Employee.countDocuments({
            employmentStatus:"ACTIVE",
            isDeleted:false
        });


        const inactiveEmployees = await Employee.countDocuments({
            employmentStatus:"INACTIVE",
            isDeleted:false
        });


        const departments = await Employee.distinct(
            "department"
        );


        res.status(200).json({

            totalEmployees,

            activeEmployees,

            inactiveEmployees,

            totalDepartments:departments.length

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};