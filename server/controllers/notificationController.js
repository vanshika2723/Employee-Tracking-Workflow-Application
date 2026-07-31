import Notification from "../models/Notification.js";
import Employee from "../models/Employee.js";
import { getIO } from "../socket.js";

/* =========================================================
   GET NOTIFICATIONS
========================================================= */

export const getNotifications = async (req, res) => {
  try {

    const userId = req.user?.userId || req.session?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }


    const notifications = await Notification.find({
      userId:userId
    })
    .sort({
      createdAt:-1
    })
    .limit(20);


    res.json(notifications);


  } catch(error){

    console.log(error);

    res.status(500).json({
      error:"Failed to fetch notifications"
    });

  }
};


/* =========================================================
   MARK NOTIFICATION AS READ
========================================================= */

export const markNotificationRead = async(req,res)=>{

try{

const userId=req.user?.userId || req.session?.userId;

const {id}=req.params;


const notification = await Notification.findOne({
 _id:id,
 userId:userId
});


if(!notification){

return res.status(404).json({
error:"Notification not found"
});

}


notification.isRead=true;

await notification.save();


res.json({
success:true
});


}
catch(error){

console.log(error);

res.status(500).json({
error:"Failed"
});

}

};


/* =========================================================
   SEND ADMIN ANNOUNCEMENT
========================================================= */

export const sendAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        error: "Title and message are required",
      });
    }

    const employees = await Employee.find({
      isDeleted: false,
    });

    if (!employees.length) {
      return res.status(404).json({
        error: "No employees found",
      });
    }

    const notifications = [];

    for (const employee of employees) {
      const notification = await createNotification({
        employeeId: employee._id,
        userId: employee.userId,
        title,
        message,
        type: "ANNOUNCEMENT",
        channel: "IN_APP",
      });

      if (notification) {
        notifications.push(notification);
      }
    }

    return res.json({
      success: true,
      message: "Announcement sent successfully",
      count: notifications.length,
    });
  } catch (error) {
    console.log("Announcement Error:", error);

    return res.status(500).json({
      error: "Failed to send announcement",
    });
  }
};


/* =========================================================
   TEST NOTIFICATION
========================================================= */

export const sendTestNotification = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        error: "employeeId is required",
      });
    }

    const notification = await createNotification({
      employeeId,
      title: "Idle Time Alert",
      message: "Inactive for 15 minutes at 2:05 PM",
      type: "IDLE_TIME",
      channel: "IN_APP",
    });

    if (!notification) {
      return res.status(500).json({
        error: "Notification could not be created",
      });
    }

    return res.json({
      success: true,
      message: "Test notification sent",
      notification,
    });
  } catch (error) {
    console.log("TEST NOTIFICATION ERROR:", error);

    return res.status(500).json({
      error: "Failed to send notification",
    });
  }
};