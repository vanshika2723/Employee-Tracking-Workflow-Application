import Shift from "../models/Shift.js";


// Create Shift
export const createShift = async(req,res)=>{

    try{

        const {
            name,
            startTime,
            endTime,
            gracePeriod
        } = req.body;


        const shift = await Shift.create({

            name,

            startTime,

            endTime,

            gracePeriod

        });


        res.json({

            success:true,

            message:"Shift created",

            data:shift

        });


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error:error.message
        });

    }

};




// Get All Shifts
export const getShifts = async(req,res)=>{

    try{


        const shifts = await Shift.find()
        .populate(
            "employees",
            "firstName lastName department"
        );


        res.json(shifts);


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};




// Assign Employee To Shift
export const assignShift = async(req,res)=>{

    try{

        const {
            shiftId,
            employeeId
        } = req.body;



        const shift = await Shift.findById(
            shiftId
        );


        if(!shift){

            return res.status(404).json({
                error:"Shift not found"
            });

        }



        if(!shift.employees.includes(employeeId)){

            shift.employees.push(employeeId);

        }



        await shift.save();



        res.json({

            success:true,

            message:"Employee assigned to shift"

        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

// export const getShiftReport = async(req,res)=>{
//   try{

//     const shifts = await Shift.find();

//     const data = shifts.map((shift)=>({

//       name: shift.name,

//       timing:
//       `${shift.startTime} - ${shift.endTime}`,

//       employees:
//       shift.employees.length

//     }));


//     res.json({
//       success:true,
//       data
//     });


//   }catch(error){

//     res.status(500).json({
//       error:error.message
//     });

//   }
// };