import mongoose from "mongoose";

const idleSessionSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    attendanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      default: null,
    },

    durationMinutes: {
      type: Number,
      default: 0,
    },

    approved: {
      type: Boolean,
      default: false,
    },
    excluded:{
 type:Boolean,
 default:false
},
reason:{
  type:String,
  default:""
},
approvedBy:{
 type:String,
 default:"Admin"
}
  },
  { timestamps: true }
);

export default mongoose.models.IdleSession ||
mongoose.model("IdleSession", idleSessionSchema);