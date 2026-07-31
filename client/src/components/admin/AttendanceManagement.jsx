import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AttendanceManagement = () => {

  const [attendance, setAttendance] = useState([]);
  const [missingReport, setMissingReport] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [showShiftModal, setShowShiftModal] = useState(false);

const [shiftForm, setShiftForm] = useState({
  name:"",
  startTime:"",
  endTime:"",
  gracePeriod:15
});
const createShift = async()=>{

try{

const res = await api.post(
"/shifts",
shiftForm
);


setShifts([
...shifts,
res.data.data
]);


setShowShiftModal(false);


setShiftForm({
name:"",
startTime:"",
endTime:"",
gracePeriod:15
});


}catch(error){

console.log(error);

}

};

  useEffect(() => {

    const fetchAttendance = async () => {
      try {

        const res = await api.get(
          "/admin-report/daily-attendance"
        );

        setAttendance(res.data.data || []);

      } catch(error){
        console.log(error);
      }
    };


    const fetchMissing = async () => {
      try {

        const res = await api.get(
          "/admin-report/missing-attendance"
        );

        setMissingReport(res.data.data || []);

      } catch(error){
        console.log(error);
      }
    };


   const fetchShifts = async () => {
  try {

    const res = await api.get("/shifts");

    setShifts(res.data || []);

  } catch(error){
    console.log(error);
  }
};


    fetchAttendance();
    fetchMissing();
    fetchShifts();

  },[]);



  const presentToday = attendance.filter(
    e=>e.status==="Present"
  ).length;


  const lateArrivals = attendance.filter(
    e=>e.status==="Late"
  ).length;


  const absent = attendance.filter(
    e=>e.status==="Absent"
  ).length;


  const missingLogout = attendance.filter(
    e=>!e.logout
  ).length;



return (

<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">


<div className="mb-8">

<h1 className="text-4xl font-bold text-slate-800">
Attendance Management
</h1>

<p className="text-slate-500 mt-2">
Monitor attendance, shifts and employee working hours.
</p>

</div>



{/* TOP CARDS */}

<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">


<div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <div className="flex justify-between items-start">
        <p className="text-sm text-slate-500">
            Present Today
        </p>

        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            ✅
        </div>
    </div>

    <h2 className="text-3xl font-bold text-green-500 mt-6">
        {presentToday}
    </h2>
</div>


<div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <div className="flex justify-between items-start">
        <p className="text-sm text-slate-500">
           Late Arrivals
        </p>

        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            ⏰ 
        </div>
    </div>

    <h2 className="text-3xl font-bold text-green-500 mt-6">
        {lateArrivals}
    </h2>
</div>


<div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <div className="flex justify-between items-start">
        <p className="text-sm text-slate-500">
            Absent
        </p>

        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
           🚫 
        </div>
    </div>

    <h2 className="text-3xl font-bold text-green-500 mt-6">
        {absent}
    </h2>
</div>

<div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <div className="flex justify-between items-start">
        <p className="text-sm text-slate-500">
            Missing Logout
        </p>

        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
           ❓ 
        </div>
    </div>

    <h2 className="text-3xl font-bold text-green-500 mt-6">
        {missingLogout}
    </h2>
</div>















</div>





{/* ATTENDANCE TABLE */}


<div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden mb-8">


<div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b">

<h2 className="text-xl font-bold">
Attendance Records
</h2>


<div className="flex gap-3">
<input
type="date"
className="border rounded-lg px-3 py-2"
/>


<select className="border rounded-lg px-3 py-2">

<option>
All Departments
</option>

</select>

<button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl">
Export
</button>
</div>


</div>





<table className="w-full ">


<thead className="bg-slate-50 border-b">
  <tr className="text-left text-xs font-semibold uppercase text-slate-500">
    <th className="px-6 py-4">Employee</th>
    <th className="px-6 py-4">Status</th>
    <th className="px-6 py-4">Login</th>
    <th className="px-6 py-4">Logout</th>
    <th className="px-6 py-4">Working Hours</th>
    <th className="px-6 py-4">Late By</th>
  </tr>
</thead>


<tbody>
  {attendance.map((emp, index) => (
    <tr
      key={index}
      className="border-b border-slate-100 hover:bg-slate-50 transition"
    >
      {/* Employee */}
      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-semibold flex items-center justify-center flex-shrink-0">
            {emp.name
              ?.split(" ")
              .map((x) => x[0])
              .join("")}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-800 text-sm truncate">
              {emp.name}
            </p>

            <p className="text-xs text-slate-500 truncate">
              {emp.department || "-"}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 align-middle">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            emp.status === "Present"
              ? "bg-green-100 text-green-600"
              : emp.status === "Late"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              emp.status === "Present"
                ? "bg-green-500"
                : emp.status === "Late"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          ></span>

          {emp.status}
        </span>
      </td>

      {/* Login */}
      <td className="px-6 py-4 text-sm text-slate-700 align-middle whitespace-nowrap">
        {emp.login || "—"}
      </td>

      {/* Logout */}
      <td className="px-6 py-4 text-sm text-slate-700 align-middle whitespace-nowrap">
        {emp.logout || "—"}
      </td>

      {/* Working Hours */}
      <td className="px-6 py-4 text-sm font-medium text-slate-700 align-middle whitespace-nowrap">
        {emp.workingHours || "—"}
      </td>

      {/* Late By */}
      <td className="px-6 py-4 text-sm text-slate-700 align-middle whitespace-nowrap">
        {emp.lateBy || "—"}
      </td>
    </tr>
  ))}
</tbody>


</table>


</div>


<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

    <div className="xl:col-span-2">

       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">


<div className="flex items-center justify-between p-6 border-b">
    <h2 className="text-lg font-bold text-slate-800">
        Missing Login / Logout Report
    </h2>
</div>


<table className="w-full">


<thead className="border-b bg-slate-50">
  <tr>
    <th className="px-6 py-3 text-left w-[28%]">Employee</th>
    <th className="px-6 py-3 text-left w-[18%]">Date</th>
    <th className="px-6 py-3 text-left w-[22%]">Issue</th>
    <th className="px-6 py-3 text-left w-[18%]">Action</th>
  </tr>
</thead>



<tbody>
  {missingReport.map((item, index) => (
    <tr
      key={index}
      className="border-b border-slate-100 hover:bg-slate-50"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
            {item.name
              ?.split(" ")
              .map((x) => x[0])
              .join("")}
          </div>

          <p>{item.name}</p>
        </div>
      </td>

      <td className="px-6 py-4">{item.date}</td>

      <td className="px-6 py-4">
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs">
          {item.issue}
        </span>
      </td>

      <td className="px-6 py-4">
        <button className="text-indigo-600 font-medium">
          Review
        </button>
      </td>
    </tr>
  ))}
</tbody>


</table>


</div>
    </div>

    <div>

       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">


<div className="flex justify-between items-center p-6 border-b">
<h2 className="text-lg font-bold text-slate-800">
Shift Management
</h2>


<button
onClick={()=>setShowShiftModal(true)}
className="text-indigo-600 text-sm font-semibold hover:underline"
>
+ Add Shift
</button>


</div>



<table className="w-full">

<thead className="bg-white border-b text-[11px] uppercase tracking-wide text-slate-500">

<tr>

<th className="px-6 py-3 text-left w-[35%]">Shift</th>
<th className="px-6 py-3 text-left w-[40%]">Timing</th>
<th className="px-6 py-3 text-left w-[25%]">Employees</th>

</tr>

</thead>



<tbody>


{
shifts.map((shift,index)=>(


<tr
key={index}
className="border-b border-slate-100 hover:bg-slate-50 transition"
>


<td className="px-6 py-4">{shift.name}</td>

<td className="px-6 py-4">
  {shift.startTime} - {shift.endTime}
</td>

<td className="px-6 py-4">
  {shift.employees?.length || 0}
</td>


</tr>


))
}


</tbody>


</table>


</div>





{/* ADD SHIFT MODAL */}


{
showShiftModal && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white rounded-xl p-6 w-96 shadow-lg">


<h2 className="text-xl font-bold mb-5">
Add New Shift
</h2>



<input
type="text"
placeholder="Shift Name"
className="border rounded-lg p-3 w-full mb-3"

value={shiftForm.name}

onChange={(e)=>
setShiftForm({
...shiftForm,
name:e.target.value
})
}

/>



<input
type="time"

className="border rounded-lg p-3 w-full mb-3"

value={shiftForm.startTime}

onChange={(e)=>
setShiftForm({
...shiftForm,
startTime:e.target.value
})
}

/>



<input
type="time"

className="border rounded-lg p-3 w-full mb-3"

value={shiftForm.endTime}

onChange={(e)=>
setShiftForm({
...shiftForm,
endTime:e.target.value
})
}

/>



<input
type="number"

placeholder="Grace Period"

className="border rounded-lg p-3 w-full mb-5"

value={shiftForm.gracePeriod}

onChange={(e)=>
setShiftForm({
...shiftForm,
gracePeriod:e.target.value
})
}

/>



<div className="flex justify-end gap-3">


<button

onClick={()=>{
setShowShiftModal(false)
}}

className="px-4 py-2 border rounded-lg"
>

Cancel

</button>



<button

onClick={createShift}

className="px-4 py-2 bg-indigo-600 text-white rounded-lg"

>

Save

</button>



</div>


</div>


</div>

)

}

    </div>

</div>





{/* MISSING REPORT */}











{/* SHIFT MANAGEMENT */}



{/* SHIFT MANAGEMENT */}







</div>

);


};


export default AttendanceManagement;