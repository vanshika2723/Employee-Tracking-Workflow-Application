import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const ProductivityAnalytics = ({
    filter
})=>{
    
const [loading,setLoading] = useState(true);

    const formatChartData = (arr)=>{

    return arr.map(item=>({

       day:new Date(item.date)
.toLocaleDateString("en-GB",{
    day:"2-digit",
    month:"short"
}),

        productivity:item.productivity

    }));

}

    const [data,setData]=useState({
        daily:[],
        weekly:[],
        monthly:[]
    });


useEffect(()=>{


const fetchData=()=>{

api.get(
    `/productivity/admin?filter=${filter}`
)
.then(res=>{

    console.log("Productivity API:",res.data);

    setData({
        daily: res.data.daily || [],
        weekly: res.data.weekly || [],
        monthly: res.data.monthly || []
    });

})
.catch(err=>{
    console.log(err);
})
.finally(()=>{
    setLoading(false);
});

}



fetchData();


const interval=setInterval(()=>{
    fetchData();
},30000);



return ()=>clearInterval(interval);


},[filter]);


 const getAverage=(arr)=>{

    if(!Array.isArray(arr) || arr.length===0){
        return 0;
    }

    const total = arr.reduce(
        (sum,item)=>sum + (item.productivity || 0),
        0
    );

    return Math.round(total / arr.length);

}


    return(

        <div className="card p-5 mt-6">


           <div className="mb-5">
    <h2 className="text-xl font-bold text-gray-800">
        Team Productivity Trend
    </h2>

    <p className="text-sm text-gray-500 mt-1">
        21 July – 28 July 2026
    </p>
</div>



            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


               <div className="p-5 rounded-lg bg-slate-100">

    <p className="text-sm">
        Daily Productivity
    </p>

    <h3 className="text-3xl font-bold mt-2">
        {getAverage(data.daily)}%
    </h3>

</div>


                <div className="p-5 rounded-lg bg-slate-100">

                    <p className="text-sm">
                        Weekly Productivity
                    </p>

                    <h3 className="text-3xl font-bold mt-2">
                        {getAverage(data.weekly)}%
                    </h3>

                </div>



                <div className="p-5 rounded-lg bg-slate-100">

                    <p className="text-sm">
                        Monthly Productivity
                    </p>

                    <h3 className="text-3xl font-bold mt-2">
                        {getAverage(data.monthly)}%
                    </h3>

                </div>


            </div>

<div className="mt-8">

<h3 className="font-semibold mb-4">
    Team Productivity Trend
</h3>


<div className="h-72">

<ResponsiveContainer width="100%" height="100%">

<LineChart data={formatChartData(data.daily)}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="day"/>

<YAxis/>

<Tooltip/>

<Line 
type="monotone"
dataKey="productivity"
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>


            <div className="mt-8">

                <h3 className="font-semibold mb-4">
                    Employee Productivity Ranking
                </h3>


                {
                (data.daily || []).map((emp)=>(
                    
                    <div
                    key={emp._id}
                    className="flex justify-between border-b py-3"
                    >

                        <span>
                        {
                        emp.employeeId?.firstName
                        }{" "}
                        {
                        emp.employeeId?.lastName
                        }
                        </span>


                        <span className="font-semibold">
                        {emp.productivity}%
                        </span>


                    </div>

                ))
                }


            </div>


        </div>

    )

}


export default ProductivityAnalytics;