import AttendancePolicy from "../models/AttendancePolicy.js";

// =====================================================
// CREATE POLICY
// =====================================================

export const createPolicy = async (req, res) => {
  try {
    if (req.session.role !== "ADMIN") {
      return res.status(403).json({
        error: "Only admin can create policy",
      });
    }

    const existingPolicy = await AttendancePolicy.findOne();

    if (existingPolicy) {
      return res.status(400).json({
        error: "Policy already exists",
      });
    }

    const policy = await AttendancePolicy.create({
      minimumWorkingHours: req.body.minimumWorkingHours ?? 8,
      halfDayHours: req.body.halfDayHours ?? 4,
      overtimeAfter: req.body.overtimeAfter ?? 9,

      allowedIdleTime: req.body.allowedIdleTime ?? 60,
      idleDeductionRate: req.body.idleDeductionRate ?? 2,
      idleAdjustmentTrigger:
        req.body.idleAdjustmentTrigger ?? 240,

      breakPolicy: req.body.breakPolicy ?? "FIXED",
      breakDuration: req.body.breakDuration ?? 45,
      maxBreakCount: req.body.maxBreakCount ?? 3,
      breakOverrunPenaltyRate:
        req.body.breakOverrunPenaltyRate ?? 1,
      breakOverrunPenaltyInterval:
        req.body.breakOverrunPenaltyInterval ?? 15,

      gracePeriod: req.body.gracePeriod ?? 15,
      logoutGracePeriod:
        req.body.logoutGracePeriod ?? 10,
      lateLoginLimitPerMonth:
        req.body.lateLoginLimitPerMonth ?? 3,
    });

    res.json({
      success: true,
      data: policy,
    });
  } catch (error) {
    console.log("CREATE POLICY ERROR:", error);

    res.status(500).json({
      error: "Failed to create policy",
    });
  }
};


// =====================================================
// GET POLICY
// =====================================================

export const getPolicy = async (req, res) => {
  try {
    let policy = await AttendancePolicy.findOne();

    if (!policy) {
      policy = await AttendancePolicy.create({});
    }

    res.json({
      success: true,
      data: policy,
    });
  } catch (error) {
    console.log("GET POLICY ERROR:", error);

    res.status(500).json({
      error: "Failed to fetch policy",
    });
  }
};


// =====================================================
// UPDATE POLICY
// =====================================================

export const updatePolicy = async (req, res) => {
  try {

    if (req.session.role !== "ADMIN") {
      return res.status(403).json({
        error: "Only admin can update policy",
      });
    }

    const policy = await AttendancePolicy.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: policy,
    });

  } catch (error) {

    console.error("Update policy error:", error);

    res.status(500).json({
      error: "Failed to update policy",
    });

  }
};