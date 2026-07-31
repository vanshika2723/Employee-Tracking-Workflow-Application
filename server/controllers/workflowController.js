import Workflow from "../models/Workflow.js";


// ===============================
// CREATE WORKFLOW / ASSIGN TASK
// ===============================

export const createWorkflow = async(req,res)=>{

try{


const workflow = await Workflow.create({

employee:req.body.employee,

title:req.body.title,

priority:req.body.priority,

deadline:req.body.deadline,

createdBy:req.user?._id

});



const populatedWorkflow = await Workflow.findById(workflow._id)
.populate(
"employee",
"firstName lastName department"
);



res.json({

success:true,

data:populatedWorkflow

});


}
catch(error){

console.log(error);

res.status(500).json({

error:error.message

});

}

};





// ===============================
// GET ALL WORKFLOWS
// ===============================


export const getWorkflows = async(req,res)=>{

try{


const workflows = await Workflow.find()

.populate(
"employee",
"firstName lastName department"
)

.sort({
createdAt:-1
});



res.json({

success:true,

data:workflows

});


}
catch(error){


console.log(error);


res.status(500).json({

error:error.message

});


}

};






// ===============================
// UPDATE WORKFLOW STATUS
// ===============================


export const updateWorkflowStatus = async(req,res)=>{

try{


const {status}=req.body;



let workflow = await Workflow.findByIdAndUpdate(

req.params.id,

{
status
},

{
new:true
}

);



if(!workflow){

return res.status(404).json({

error:"Workflow not found"

});

}




workflow = await Workflow.findById(workflow._id)

.populate(

"employee",

"firstName lastName department"

);





res.json({

success:true,

data:workflow

});



}
catch(error){


console.log(error);


res.status(500).json({

error:error.message

});


}

};





// ===============================
// DELETE WORKFLOW (OPTIONAL)
// ===============================


export const deleteWorkflow = async(req,res)=>{

try{


const workflow = await Workflow.findByIdAndDelete(
req.params.id
);



if(!workflow){

return res.status(404).json({

error:"Workflow not found"

});

}



res.json({

success:true,

message:"Workflow deleted"

});



}
catch(error){


res.status(500).json({

error:error.message

});


}

};