import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const TopPerformers = () => {

  const [performers, setPerformers] = useState([]);


useEffect(() => {

  api.get("/productivity/admin?filter=week")
    .then(res => {

      console.log("API Response:", res.data);

      const data = res.data.records || [];

      console.log("Daily Data:", data);

      const sorted = data
        .sort((a,b)=> b.productivity - a.productivity)
        .slice(0,5);

      console.log("Sorted:", sorted);

      setPerformers(sorted);

    })
    .catch(err => {
      console.log(err);
    });

}, []);



return (

<div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">


<div className="flex justify-between items-center mb-5">

<h2 className="text-xl font-bold text-gray-800">
Top Performers
</h2>


<button className="text-indigo-600 text-sm font-semibold">
View All
</button>

</div>



<div className="space-y-4">


{
performers.map((emp,index)=>(


<div 
key={emp._id}
className="flex items-center justify-between border-b pb-3 last:border-0"
>


<div className="flex items-center gap-4">


<div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
{index+1}
</div>



<div>

<p className="font-semibold text-gray-800">
{emp.employeeId?.firstName}{" "}
{emp.employeeId?.lastName}
</p>


<p className="text-sm text-gray-500">
{emp.employeeId?.department || "N/A"}
</p>


</div>


</div>



<div className="font-bold text-indigo-600">
{emp.productivity}%
</div>


</div>


))
}


</div>


</div>

);

};


export default TopPerformers;