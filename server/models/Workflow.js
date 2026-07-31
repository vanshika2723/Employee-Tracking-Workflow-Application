import mongoose from "mongoose";


const workflowSchema = new mongoose.Schema({

employee:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Employee",
    required:true
},


title:{
    type:String,
    required:true
},


priority:{
    type:String,
    enum:[
        "High",
        "Medium",
        "Low"
    ],
    default:"High"
},


deadline:{
    type:Date,
    required:true
},


status:{
    type:String,
    enum:[
        "Pending",
        "In Progress",
        "Completed"
    ],
    default:"Pending"
},


createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}


},{
timestamps:true
});


export default mongoose.models.Workflow ||
mongoose.model("Workflow",workflowSchema);