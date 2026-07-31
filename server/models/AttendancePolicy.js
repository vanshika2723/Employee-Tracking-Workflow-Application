import mongoose from "mongoose";

const attendancePolicySchema = new mongoose.Schema(
  {
    // ==============================
    // WORKING HOURS
    // ==============================

    minimumWorkingHours: {
      type: Number,
      default: 8,
    },

    halfDayHours: {
      type: Number,
      default: 4,
    },

    overtimeAfter: {
      type: Number,
      default: 9,
    },

    // ==============================
    // IDLE POLICY
    // ==============================

    allowedIdleTime: {
      type: Number,
      default: 60, // minutes
    },

    idleDeductionRate: {
      type: Number,
      default: 2, // %
    },

    idleAdjustmentTrigger: {
      type: Number,
      default: 240, // 4 hours in minutes
    },

    // ==============================
    // BREAK POLICY
    // ==============================

    breakPolicy: {
      type: String,
      enum: ["FIXED", "FLEXIBLE"],
      default: "FIXED",
    },

    breakDuration: {
      type: Number,
      default: 45, // minutes
    },

    maxBreakCount: {
      type: Number,
      default: 3,
    },

    breakOverrunPenaltyRate: {
      type: Number,
      default: 1, // %
    },

    breakOverrunPenaltyInterval: {
      type: Number,
      default: 15, // minutes
    },

    // ==============================
    // GRACE TIMINGS
    // ==============================

    gracePeriod: {
      type: Number,
      default: 15, // login grace in minutes
    },

    logoutGracePeriod: {
      type: Number,
      default: 10, // minutes
    },

    lateLoginLimitPerMonth: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

const AttendancePolicy =
  mongoose.models.AttendancePolicy ||
  mongoose.model("AttendancePolicy", attendancePolicySchema);

export default AttendancePolicy;