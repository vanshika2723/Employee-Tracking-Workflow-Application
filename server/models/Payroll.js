import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    month: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    basicSalary: {
      type: Number,
      default: 0,
    },

    allowances: {
      type: Number,
      default: 0,
    },

    overtimePay: {
      type: Number,
      default: 0,
    },

    overtimeHours: {
      type: Number,
      default: 0,
    },

    presentDays: {
      type: Number,
      default: 0,
    },

    halfDays: {
      type: Number,
      default: 0,
    },

    lateLoginCount: {
      type: Number,
      default: 0,
    },

    earlyLogoutCount: {
      type: Number,
      default: 0,
    },

    idleMinutes: {
      type: Number,
      default: 0,
    },

    idleDeduction: {
      type: Number,
      default: 0,
    },

    productivityDeduction: {
      type: Number,
      default: 0,
    },

    attendanceAdjustment: {
      type: Number,
      default: 0,
    },

    lossOfPay: {
      type: Number,
      default: 0,
    },

    fixedDeduction: {
      type: Number,
      default: 0,
    },

    netSalary: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

payrollSchema.index(
  {
    employeeId: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
  }
);

const Payroll =
  mongoose.models.Payroll ||
  mongoose.model("Payroll", payrollSchema);

export default Payroll;