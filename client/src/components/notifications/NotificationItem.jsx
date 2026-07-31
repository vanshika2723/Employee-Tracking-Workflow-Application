import React from "react";


const NotificationItem = ({
    notification,
    onRead
}) => {


    const icons = {

        LATE_LOGIN:"⏰",

        IDLE_TIME:"🕒",

        LOGOUT_REMINDER:"🚪",

        ATTENDANCE_WARNING:"⚠️",

        PRODUCTIVITY_ALERT:"📉",

        ANNOUNCEMENT:"📢",

        SYSTEM:"🔔"

    };



    const labels = {

        LATE_LOGIN:"Late login alert",

        IDLE_TIME:"Idle time alert",

        LOGOUT_REMINDER:"Logout reminder",

        ATTENDANCE_WARNING:"Attendance warning",

        PRODUCTIVITY_ALERT:"Productivity alert",

        ANNOUNCEMENT:"Admin announcement",

        SYSTEM:"System"

    };



return (

<div

onClick={()=>{
    if(!notification.isRead){
        onRead(notification._id);
    }
}}

className={`
p-4
border-b
cursor-pointer
transition

${
notification.isRead

?

"bg-white dark:bg-slate-900"

:

"bg-indigo-50 dark:bg-indigo-950"

}

hover:bg-slate-100
dark:hover:bg-slate-800

`}

>


<div className="
flex
items-start
gap-3
">


<div className="
text-xl
">

{
icons[notification.type] || "🔔"
}

</div>



<div className="
flex-1
">


<div className="
flex
justify-between
items-center
">


<h4 className="
font-semibold
">

{
labels[notification.type]
||
notification.title
}

</h4>



{
!notification.isRead &&

<span className="
text-xs
bg-red-500
text-white
px-2
py-1
rounded-full
">

New

</span>

}


</div>




<p className="
text-sm
text-slate-600
dark:text-slate-300
mt-1
">

{notification.message}

</p>




<small className="
text-xs
text-slate-400
">

{
new Date(
notification.createdAt
).toLocaleString()
}

</small>



</div>


</div>


</div>

);

};


export default NotificationItem;