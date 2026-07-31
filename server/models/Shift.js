import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    startTime:{
        type:String,
        required:true
    },

    endTime:{
        type:String,
        required:true
    },

    gracePeriod:{
        type:Number,
        default:15
    },

    employees:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Employee"
        }
    ]

},{
    timestamps:true
});


const Shift =
mongoose.models.Shift ||
mongoose.model("Shift",shiftSchema);


export default Shift;