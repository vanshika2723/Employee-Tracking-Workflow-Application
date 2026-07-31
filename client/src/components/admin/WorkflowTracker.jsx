import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const WorkflowTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emp1, setEmp1] = useState("");
  const [emp2, setEmp2] = useState("");

  const [comparison, setComparison] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const [form, setForm] = useState({
    employee: "",
    title: "",
    priority: "High",
    deadline: "",
  });

  // GET TASKS

  const fetchTasks = async () => {
    try {
      const res = await api.get("/workflow/all");

      setTasks(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // GET EMPLOYEES

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");

      console.log("EMPLOYEE DATA:", res.data);

      const empData = Array.isArray(res.data) ? res.data : res.data.data || [];

      console.log("FINAL EMPLOYEES:", empData);

      setEmployees(empData);
    } catch (error) {
      console.log("EMPLOYEE ERROR:", error);
    }
  };

const fetchComparison = async () => {

  console.log("emp1:", emp1);
  console.log("emp2:", emp2);

  if (!emp1 || !emp2) {
    setComparison([]);
    setAnalysis(null);
    return;
  }

  try {

    const res = await api.get(
      `/productivity/employee-comparison?emp1=${emp1}&emp2=${emp2}`
    );


    console.log("Comparison Response:", res.data);


    const data = res.data.data || [];

    setComparison(data);


    if(data.length > 0){
      generateAnalysis(data[0]);
    }


  } catch(error){

    console.log(error);

  }

};

  useEffect(() => {
    fetchComparison();
  }, [emp1, emp2]);



const generateAnalysis = (emp) => {

  console.log("ANALYSIS EMP DATA:", emp);


  let strengths = [];
  let watchAreas = [];


  if(emp.productivity >= 90){

    strengths.push(
      "Consistently high productivity (90%+)"
    );

  }


  if(emp.tasksDone > 0){

    strengths.push(
      "Fast task turnaround"
    );

  }


  if(emp.onTime >= 90){

    strengths.push(
      "Excellent task completion rate"
    );

  }



  if(emp.tasksDone === 0){

    watchAreas.push(
      "Need to complete more assigned tasks"
    );

  }



  if(emp.productivity < 50){

    watchAreas.push(
      "Low productivity needs attention"
    );

  }



  if(watchAreas.length === 0){

    watchAreas.push(
      "No major issues detected"
    );

  }



  const result = {

    name: emp.firstName || "Employee",

    department: emp.department || "Marketing",

    strengths,

    watchAreas

  };


  console.log("FINAL ANALYSIS:", result);


  setAnalysis(result);

};
  // CREATE TASK

  const assignWorkflow = async () => {
    try {
      await api.post("/workflow/create", form);

      await fetchTasks();

      setForm({
        employee: "",
        title: "",
        priority: "High",
        deadline: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // STATUS UPDATE

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(
        `/workflow/${id}/status`,

        {
          status,
        },
      );

      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data.data : task)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchTasks();

      await fetchEmployees();

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  const chartData = [
    {
      metric: "Active Hrs",
      emp1: comparison?.[0]?.activeHours || 0,
      emp2: comparison?.[1]?.activeHours || 0,
    },

    {
      metric: "Productivity %",
      emp1: comparison?.[0]?.productivity || 0,
      emp2: comparison?.[1]?.productivity || 0,
    },

    {
      metric: "Tasks Done",
      emp1: comparison?.[0]?.tasksDone || 0,
      emp2: comparison?.[1]?.tasksDone || 0,
    },

    {
      metric: "On-time %",
      emp1: comparison?.[0]?.onTime || 0,
      emp2: comparison?.[1]?.onTime || 0,
    },
  ];

  return (
//     <div className="p-6 bg-slate-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Workflow Management</h1>

//       {/* TASK TRACKER */}

//       <div className="bg-white rounded-xl shadow p-6 mb-8">
//         <div className="flex justify-between mb-5">
//           <h2 className="text-xl font-bold">Task Completion Tracker</h2>
//         </div>

//         {tasks.map((task) => (
//           <div
//             key={task._id}
//             className="border rounded-xl p-4 mb-4 flex justify-between"
//           >
//             <div>
//               <h3 className="font-bold text-lg">{task.title}</h3>

//               <p className="text-gray-500">
//                 {task.employee?.firstName} {task.employee?.lastName}
//                 {" · "}
//                 {task.employee?.department}
//               </p>

//               <p>Due : {new Date(task.deadline).toLocaleDateString("en-GB")}</p>
//             </div>

//             <select
//               value={task.status}
//               onChange={(e) => updateStatus(task._id, e.target.value)}
//               className="border rounded-lg px-3 py-2"
//             >
//               <option>Pending</option>

//               <option>In Progress</option>

//               <option>Completed</option>
//             </select>
//           </div>
//         ))}
//       </div>

//       {/* ASSIGN WORKFLOW */}

//       <div className="bg-white rounded-xl shadow p-6 mb-8">
//         <h2 className="text-xl font-bold mb-5">Assign Workflow</h2>

//         <select
//           className="border p-3 rounded w-full mb-3"
//           value={form.employee}
//           onChange={(e) =>
//             setForm({
//               ...form,
//               employee: e.target.value,
//             })
//           }
//         >
//           <option>Select Employee</option>

//           {employees.map((emp) => (
//             <option key={emp._id} value={emp._id}>
//               {emp.firstName} {emp.lastName}
//               {" — "}
//               {emp.department}
//             </option>
//           ))}
//         </select>

//         <input
//           className="border p-3 rounded w-full mb-3"
//           placeholder="Task / Workflow Title"
//           value={form.title}
//           onChange={(e) =>
//             setForm({
//               ...form,
//               title: e.target.value,
//             })
//           }
//         />

//         <select
//           className="border p-3 rounded w-full mb-3"
//           value={form.priority}
//           onChange={(e) =>
//             setForm({
//               ...form,
//               priority: e.target.value,
//             })
//           }
//         >
//           <option>High</option>

//           <option>Medium</option>

//           <option>Low</option>
//         </select>

//         <input
//           type="date"
//           className="border p-3 rounded w-full mb-4"
//           value={form.deadline}
//           onChange={(e) =>
//             setForm({
//               ...form,
//               deadline: e.target.value,
//             })
//           }
//         />

//         <button
//           onClick={assignWorkflow}
//           className="bg-indigo-600 text-white px-5 py-3 rounded-lg"
//         >
//           Assign Task
//         </button>
//       </div>

//       {/* PRODUCTIVITY */}

//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-xl font-bold mb-5">
//           Employee Productivity Comparison
//         </h2>
//         <div className="flex gap-3 mb-5">
//           <select
//             value={emp1}
//             onChange={(e) => setEmp1(e.target.value)}
//             className="border rounded-lg p-2"
//           >
//             <option value="">Select Employee</option>

//             {employees.map((emp) => (
//               <option key={emp._id} value={emp._id}>
//                 {emp.firstName} {emp.lastName}
//               </option>
//             ))}
//           </select>

//           <span className="pt-2">vs</span>

//           <select
//             value={emp2}
//             onChange={(e) => setEmp2(e.target.value)}
//             className="border rounded-lg p-2"
//           >
//             <option value="">Select Employee</option>

//             {employees.map((emp) => (
//               <option key={emp._id} value={emp._id}>
//                 {emp.firstName} {emp.lastName}
//               </option>
//             ))}
//           </select>
//         </div>

//         <ResponsiveContainer width="100%" height={350}>
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />

//             <XAxis dataKey="metric" />

//             <YAxis />

//             <Tooltip />

//             <Legend />

//             <Bar
//               dataKey="emp1"
//               name={comparison?.[0]?.firstName || "Employee 1"}
//               fill="#4F6BED"
//               radius={[8, 8, 0, 0]}
//             />

//             <Bar
//               dataKey="emp2"
//               name={comparison?.[1]?.firstName || "Employee 2"}
//               fill="#8B5CF6"
//               radius={[8, 8, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//     {analysis !== null && (

// <div className="bg-white rounded-xl shadow p-6 mt-8">


// <h2 className="text-xl font-bold mb-5">
// Performance Analysis
// </h2>


// <p className="font-semibold text-gray-700 mb-6">

// {analysis.name} — {analysis.department}

// </p>



// <div className="grid md:grid-cols-2 gap-8">


// <div>

// <h3 className="font-bold text-green-600 mb-3">
// Strengths
// </h3>


// <ul className="list-disc ml-5 space-y-2">

// {
// analysis.strengths.map((item,index)=>(

// <li key={index}>
// {item}
// </li>

// ))
// }

// </ul>


// </div>



// <div>

// <h3 className="font-bold text-orange-600 mb-3">
// Watch Areas
// </h3>


// <ul className="list-disc ml-5 space-y-2">

// {
// analysis.watchAreas.map((item,index)=>(

// <li key={index}>
// {item}
// </li>

// ))
// }

// </ul>


// </div>


// </div>


// </div>

// )}
//     </div>

<div className="p-6 bg-slate-100 min-h-screen">

  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

    {/* LEFT */}
    <div className="xl:col-span-2">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

<div className="flex justify-between items-center mb-6">

<h2 className="font-bold text-lg">
Task Completion Tracker
</h2>

<button className="text-indigo-600 text-sm">
+ New Task
</button>

</div>

<div className="space-y-5">

{tasks.map(task=>(

<div
key={task._id}
className="flex justify-between items-center border-b pb-4 last:border-none"
>

<div>

<h3 className="font-medium text-slate-800">
{task.title}
</h3>

<p className="text-xs text-gray-500">

{task.employee?.firstName} {task.employee?.lastName}

{" · "}

Due {new Date(task.deadline).toLocaleDateString("en-GB")}

</p>

</div>

<div className="flex items-center gap-5 min-w-[180px] justify-end">

<div className="w-24 h-1.5 rounded-full bg-slate-200">

<div
className={`h-full rounded-full
${
task.status==="Completed"
?"bg-green-500 w-full"
:task.status==="In Progress"
?"bg-orange-400 w-2/3"
:"bg-slate-400 w-1/3"
}`}
></div>

</div>

<span
className={`text-xs px-3 py-1 rounded-full
${
task.status==="Completed"
?"bg-green-100 text-green-700"
:task.status==="In Progress"
?"bg-orange-100 text-orange-600"
:"bg-slate-100 text-slate-600"
}`}
>

{task.status}

</span>

</div>

</div>

))}

</div>

</div>
    </div>

    {/* RIGHT */}
    <div>
       <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-5">Assign Workflow</h2>

       <select
          className="border p-3 rounded w-full mb-3"
          value={form.employee}
          onChange={(e) =>
            setForm({
              ...form,
              employee: e.target.value,
            })
          }
        >
          <option>Select Employee</option>

          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName}
              {" — "}
              {emp.department}
            </option>
          ))}
        </select>

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Task / Workflow Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

       <div className="grid grid-cols-2 gap-4 mb-4">

  <select
    className="border p-3 rounded-lg"
    value={form.priority}
    onChange={(e) =>
      setForm({
        ...form,
        priority: e.target.value,
      })
    }
  >
    <option>High</option>
    <option>Medium</option>
    <option>Low</option>
  </select>

  <input
    type="date"
    className="border p-3 rounded-lg"
    value={form.deadline}
    onChange={(e) =>
      setForm({
        ...form,
        deadline: e.target.value,
      })
    }
  />

</div>

      

        <button
          onClick={assignWorkflow}
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg"
        >
          Assign Task
        </button>
      </div>

    </div>

  </div>

  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

    {/* LEFT */}
    <div className="xl:col-span-2">
       <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-5">
        Employee Productivity Comparison
        </h2>
         <div className="flex gap-3 mb-5">
          <select
             value={emp1}
             onChange={(e) => setEmp1(e.target.value)}
           className="border rounded-lg p-2"
          >
            <option value="">Select Employee</option>

            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>

          <span className="pt-2">vs</span>

          <select
            value={emp2}
            onChange={(e) => setEmp2(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="">Select Employee</option>

            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="metric" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="emp1"
              name={comparison?.[0]?.firstName || "Employee 1"}
              fill="#4F6BED"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="emp2"
              name={comparison?.[1]?.firstName || "Employee 2"}
              fill="#8B5CF6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* RIGHT */}
    <div>
     <div>
  {analysis && (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="font-bold text-lg">
        Performance Analysis
      </h2>

      <p className="text-sm text-gray-500 mt-2">
        {analysis.name} — {analysis.department}
      </p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-semibold text-green-700 mb-3">
            Strengths
          </h3>

          <ul className="list-disc ml-5 space-y-2 text-sm">
            {analysis.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-50 rounded-xl p-4">
          <h3 className="font-semibold text-orange-600 mb-3">
            Watch Areas
          </h3>

          <ul className="list-disc ml-5 space-y-2 text-sm">
            {analysis.watchAreas.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )}
</div>
    </div>

  </div>

</div>
  );
};

export default WorkflowTracker;
