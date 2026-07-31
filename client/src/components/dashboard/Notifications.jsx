import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const Notifications = () => {

  const [notifications, setNotifications] = useState([]);


  useEffect(() => {

    api.get("/notifications")
      .then(res => {
        setNotifications(res.data.slice(0,4));
      })
      .catch(err => {
        console.log(err);
      });

  }, []);



  const getIcon = (title = "") => {

    if(title.toLowerCase().includes("late"))
      return "⏰";

    if(title.toLowerCase().includes("idle"))
      return "☕";

    if(title.toLowerCase().includes("report"))
      return "✓";

    return "⚠️";
  };



  const markRead = async(id)=>{

    try{

      await api.put(`/notifications/${id}/read`);

      setNotifications(prev =>
        prev.map(item =>
          item._id === id
          ? {...item,isRead:true}
          : item
        )
      );

    }
    catch(err){
      console.log(err);
    }

  };



return (

<div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mt-6">


<div className="flex justify-between items-center mb-6">

<h2 className="text-xl font-bold text-gray-800">
Alerts & Notifications
</h2>


<button className="text-indigo-600 text-sm font-semibold">
View All
</button>

</div>



<div className="space-y-4">


{
notifications.length === 0 ?

<p className="text-gray-500 text-sm">
No notifications available
</p>


:

notifications.map((item)=>(


<div 
key={item._id}
className="flex justify-between items-start border-b pb-4 last:border-0"
>


<div className="flex gap-3">


<div className="text-xl">
{getIcon(item.title)}
</div>


<div>

<p className="font-semibold text-gray-800">
{item.title}
</p>


<p className="text-sm text-gray-500">
{item.message}
</p>


{
!item.isRead &&
<button
onClick={()=>markRead(item._id)}
className="text-xs text-indigo-600 mt-1"
>
Mark read
</button>
}


</div>


</div>



<div className="text-xs text-gray-400 whitespace-nowrap">

{
item.createdAt
?
new Date(item.createdAt).toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})
:
""
}

</div>


</div>


))

}


</div>


</div>

);


};


export default Notifications;