import IdleSession from "../models/IdleSession.js";

import Employee from "../models/Employee.js";


// GET TODAY IDLE REPORT

export const getIdleReport = async(req,res)=>{

try{

const start = new Date();
start.setHours(0,0,0,0);

const end = new Date();
end.setHours(23,59,59,999);


const sessions = await IdleSession.find({
  excluded:false
})
.populate(
"employeeId",
"firstName lastName department"
);


const exceptions = await IdleSession.find({
  excluded:true
})
.populate(
"employeeId",
"firstName lastName department"
);



res.json({

success:true,

data:sessions,

exceptions:exceptions

});


}
catch(error){

res.status(500).json({
error:error.message
});

}

};


export const createAdjustment = async(req,res)=>{

try{

const {
employeeId,
duration,
reason
}=req.body;


const idle = await IdleSession.create({

employeeId,

attendanceId:null,

startTime:new Date(),

endTime:new Date(),

durationMinutes:Number(duration),

reason:reason || "Manual Adjustment"

});


res.json({

success:true,

data:idle

});


}
catch(error){

console.log(error);

res.status(500).json({

error:error.message

});

}

};


// APPROVE IDLE SESSION


export const approveIdle = async(req,res)=>{

try{

const idle = await IdleSession.findById(
req.params.id
);


if(!idle){

return res.status(404).json({
error:"Idle session not found"
});

}


idle.approved = true;
idle.excluded = false;


await idle.save();


res.json({
success:true,
data:idle
});


}
catch(error){

res.status(500).json({
error:error.message
});

}

};






// EXCLUDE IDLE SESSION


// EXCLUDE IDLE SESSION

export const excludeIdle = async(req,res)=>{

try{

const {
reason,
approvedBy
}=req.body;


const idle = await IdleSession.findById(
req.params.id
);


if(!idle){

return res.status(404).json({
error:"Idle session not found"
});

}


// exclude from productivity deduction

idle.excluded = true;

idle.approved = false;

idle.reason = reason || "Approved Exception";

idle.approvedBy = approvedBy || "Admin";


await idle.save();



res.json({

success:true,

data:idle

});


}
catch(error){

console.log(error);

res.status(500).json({

error:error.message

});

}

};