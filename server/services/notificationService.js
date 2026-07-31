import Employee from "../models/Employee.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket.js";

export const createNotification = async (data) => {
  try {
    // employeeId se userId automatically nikalo
    if (!data.userId && data.employeeId) {
      const employee = await Employee.findById(data.employeeId);

      if (!employee) {
        console.log("Employee not found:", data.employeeId);
        return null;
      }

      data.userId = employee.userId;
    }

    if (!data.userId) {
      console.log("Notification userId missing");
      return null;
    }

    const notification = await Notification.create(data);

    // Real-time notification
    if (data.employeeId) {
      try {
        const io = getIO();

       io.to(data.userId.toString()).emit(
  "newNotification",
  notification
);

        console.log(
          "NOTIFICATION SENT:",
          data.employeeId.toString()
        );
      } catch (socketError) {
        console.log(
          "Socket notification error:",
          socketError.message
        );
      }
    }

    return notification;
  } catch (error) {
    console.log("Create Notification Error:", error);
    return null;
  }
};