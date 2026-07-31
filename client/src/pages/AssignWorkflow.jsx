import React,{useEffect,useState} from "react";
import api from "../api/axios";


const AssignWorkflow =()=>{


const [employees,setEmployees]=useState([]);


const [form,setForm]=useState({

employee:"",
title:"",
priority:"High",
deadline:""

});



useEffect(()=>{


const fetchEmployees=async()=>{

try{

const res=await api.get(
"/workflow/employees"
);


setEmployees(
res.data.data || []
);


}catch(error){

console.log(error);

}

};


fetchEmployees();


},[]);





const assignTask=async()=>{


try{


await api.post(
"/workflow/create",
form
);


alert("Workflow Assigned Successfully");


setForm({

employee:"",
title:"",
priority:"High",
deadline:""

});


}catch(error){

console.log(error);

}

};





return(


<div className="bg-white rounded-xl shadow p-6">


<h2 className="text-2xl font-bold mb-6">

Assign Workflow

</h2>



<label className="block mb-2">

Employee

</label>


<select

className="border p-3 rounded-lg w-full mb-5"

value={form.employee}

onChange={(e)=>
setForm({
...form,
employee:e.target.value
})
}

>


<option>

Select Employee

</option>


{

employees.map(emp=>(


<option

key={emp._id}

value={emp._id}

>


{emp.firstName}

{" "}

{emp.lastName}

{" — "}

{emp.department}



</option>


))


}



</select>






<label className="block mb-2">

Task / Workflow Title

</label>


<input

className="border p-3 rounded-lg w-full mb-5"

placeholder="e.g. Design onboarding screens"

value={form.title}

onChange={(e)=>
setForm({
...form,
title:e.target.value
})
}

/>







<label className="block mb-2">

Priority

</label>


<select

className="border p-3 rounded-lg w-full mb-5"

value={form.priority}

onChange={(e)=>
setForm({
...form,
priority:e.target.value
})
}

>


<option>
High
</option>

<option>
Medium
</option>

<option>
Low
</option>


</select>







<label className="block mb-2">

Deadline

</label>


<input

type="date"

className="border p-3 rounded-lg w-full mb-6"

value={form.deadline}

onChange={(e)=>
setForm({
...form,
deadline:e.target.value
})
}

/>






<button

onClick={assignTask}

className="bg-indigo-600 text-white px-6 py-3 rounded-lg"

>

Assign Task

</button>



</div>


);


};


export default AssignWorkflow;