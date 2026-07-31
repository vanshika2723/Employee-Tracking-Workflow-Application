import mongoose from "mongoose";

const idleConfigurationSchema = new mongoose.Schema({

    idleMinutes:{
        type:Number,
        default:4
    },

    pauseTimer:{
        type:Boolean,
        default:true
    },

    autoReport:{
        type:Boolean,
        default:false
    },

    notifyEmployee:{
        type:Boolean,
        default:true
    }

},{
    timestamps:true
});


export default mongoose.models.IdleConfiguration ||
mongoose.model(
"IdleConfiguration",
idleConfigurationSchema
);