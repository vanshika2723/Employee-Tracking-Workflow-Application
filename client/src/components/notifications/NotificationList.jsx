import React, { useState } from "react";
import NotificationItem from "./NotificationItem";

const NotificationList = ({
    notifications,
    onRead
}) => {


    const [filter,setFilter] = useState("ALL");


    const filteredNotifications =
    filter==="ALL"
    ?
    notifications
    :
    notifications.filter(
        item=>item.type===filter
    );



    const filters = [
        {
            label:"All",
            value:"ALL"
        },
        {
            label:"Late login",
            value:"LATE_LOGIN"
        },
        {
            label:"Idle",
            value:"IDLE_TIME"
        },
        {
            label:"Logout",
            value:"LOGOUT_REMINDER"
        },
        {
            label:"Attendance",
            value:"ATTENDANCE_WARNING"
        },
        {
            label:"Productivity",
            value:"PRODUCTIVITY_ALERT"
        },
        {
            label:"Admin",
            value:"ANNOUNCEMENT"
        }
    ];



    return (

        <div>


            {/* Header */}

            <div className="
            p-4
            border-b
            ">

                <h2 className="
                text-lg
                font-semibold
                ">
                    Notifications
                </h2>


                <p className="
                text-sm
                text-slate-500
                ">
                    {notifications.filter(
                        n=>!n.isRead
                    ).length} unread
                </p>


            </div>




            {/* Filters */}

            <div className="
            flex
            gap-2
            p-3
            overflow-x-auto
            border-b
            ">


            {
                filters.map((item)=>(

                    <button

                    key={item.value}

                    onClick={()=>setFilter(item.value)}

                    className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    
                    ${
                    filter===item.value
                    ?
                    "bg-indigo-600 text-white"
                    :
                    "bg-slate-100"
                    }

                    `}

                    >

                    {item.label}

                    </button>

                ))
            }


            </div>





            {/* Notification Items */}


            {

            filteredNotifications.length===0

            ?

            (

            <p className="
            p-5
            text-center
            text-slate-500
            ">
                🔕 No notifications
            </p>

            )

            :

            filteredNotifications.map((item)=>(

                <NotificationItem

                key={item._id}

                notification={item}

                onRead={onRead}

                />

            ))

            }



        </div>

    );

};


export default NotificationList;