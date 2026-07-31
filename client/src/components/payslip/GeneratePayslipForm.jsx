// import { Loader2, Plus, X } from "lucide-react";
// import React, { useState } from "react";
// import api from "../../api/axios";
// import { toast } from "react-hot-toast";

// const GeneratePayslipForm=({employees,onSuccess})=>{
//     const [isOpen, setIsOpen] = useState(false)
//     const [loading,setLoading] = useState(false)

//     if(!isOpen) return (
//         <button
//         onClick={()=>setIsOpen(true)}
//         className="btn-primary flex items-center gap-2">
//             <Plus className="w-4 h-4"/> Generate Payslip
//         </button>
//     )





// const handleSubmit = async (e) => {
//   e.preventDefault();

//   setLoading(true);

//   const formData = new FormData(e.currentTarget);
//   const data = Object.fromEntries(formData.entries());

//   try {
//     await api.post("/payslips", data);

//     setIsOpen(false);
//     onSuccess();

//   } catch (error) {
//     toast.error(error?.response?.data?.error || error.message);

//   } finally {
//     setLoading(false);
//   }
// };
//     return(
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="card max-w-lg w-full p-6 animate-slide-up">
//                 <div className="flex justify-between items-center mb-6">
//                     <h3 className="text-lg font-bold text-slate-900">Generate Monthly Payslip</h3>
//                     <button onClick={()=>setIsOpen(false)}
//                     className="text-slate-400 hover:text-slate-600 p-1">
//                         <X size={20}/>
//                     </button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* {select employee} */}
//                     <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-2">
//                             Employee
//                         </label>
//                         <select name="employeeId" required>
//                             {employees.map((e)=>(
//                                 <option key={e.id} value={e.id}>
//                                     {e.firstName} {e.lastName} ({e.position})
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     {/* {select month & year} */}
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Month</label>
//                             <select name="month">
//                                 {Array.from({length:12} , (_, i)=>i+1).map((m)=>(
//                                     <option value={m} key={m}>
//                                         {m}
//                                     </option>
//                                 ))}
//                             </select>

//                         </div>
                   
                     
//                         <div>
//                                <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
//                            <input type="number" name="year" defaultValue={new Date().getFullYear()}/>
                            
//                     </div>
//                     </div>

//                     {/* {Basic Salary} */}
//  <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-2">Basic Salary</label>
//                            <input type="number" name="basicSalary" required placeholder="5000"/>
                        
                        
//                     </div>

//                     {/* {Allowances & Deductions} */}

//                          <div className="grid grid-cols-2 gap-4">
//                         <div>
//                              <label className="block text-sm font-medium text-slate-700 mb-2">Allowances</label>
//                            <input type="number" name="allowances" defaultValue="0"/>
                        
//                         </div>
//                         <div>
//                              <label className="block text-sm font-medium text-slate-700 mb-2">Deductions</label>
//                            <input type="number" name="deductions" defaultValue="0" />
                        
//                         </div>
//                         </div>

//                         {/* {buttons} */}
//                         <div className="flex justify-end gap-3 pt-2">
//                             <button  onClick={()=>setIsOpen(false)} type='button' className="btn-secondary">
// Cancel
//                             </button>

//                                 <button   disabled={loading} type='submit' className="btn-primary flex items-center">
//                                     {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
// Generate
//                             </button>

//                         </div>
                   

//                 </form>
//             </div>
//         </div>

//     )
// }


// export default GeneratePayslipForm;

import { Loader2, Plus, X } from "lucide-react";
import React, { useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const GeneratePayslipForm = ({ employees, onSuccess }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    if (!isOpen)
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="btn-primary flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Generate Payslip
            </button>
        );



    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);


        const formData = new FormData(e.currentTarget);

        const data = Object.fromEntries(
            formData.entries()
        );


        try {

            await api.post(
                "/payslips",
                data
            );


            toast.success(
                "Payslip generated successfully"
            );


            setIsOpen(false);


            onSuccess();


        } catch (error) {

            toast.error(
                error?.response?.data?.error ||
                error.message
            );

        }
        finally {

            setLoading(false);

        }

    };



    return (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">


            <div className="card max-w-lg w-full p-6 animate-slide-up">


                <div className="flex justify-between items-center mb-6">


                    <h3 className="text-lg font-bold text-slate-900">
                        Generate Monthly Payslip
                    </h3>


                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                    >

                        <X size={20}/>

                    </button>


                </div>



                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >



                    {/* Employee */}

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">

                            Employee

                        </label>


                        <select
                            name="employeeId"
                            required
                            className="w-full border rounded-lg px-3 py-2"
                        >

                            <option value="">
                                Select Employee
                            </option>


                            {
                                employees.map((e)=>(

                                    <option
                                        key={e.id || e._id}
                                        value={e.id || e._id}
                                    >

                                        {e.firstName} {e.lastName}
                                        {" "}
                                        ({e.position})

                                    </option>

                                ))
                            }


                        </select>


                    </div>




                    {/* Month Year */}

                    <div className="grid grid-cols-2 gap-4">


                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">

                                Month

                            </label>


                            <select
                                name="month"
                                required
                                className="w-full border rounded-lg px-3 py-2"
                            >

                                {
                                    Array.from(
                                        {length:12},
                                        (_,i)=>i+1
                                    )
                                    .map((m)=>(

                                        <option
                                            value={m}
                                            key={m}
                                        >

                                            {m}

                                        </option>

                                    ))
                                }


                            </select>


                        </div>



                        <div>


                            <label className="block text-sm font-medium text-slate-700 mb-2">

                                Year

                            </label>


                            <input

                                type="number"

                                name="year"

                                defaultValue={
                                    new Date().getFullYear()
                                }

                                required

                                className="w-full border rounded-lg px-3 py-2"

                            />


                        </div>


                    </div>





                    {/* Auto Calculation Info */}


                    <div className="bg-slate-100 rounded-lg p-4 text-sm text-slate-600">


                        <p className="font-medium mb-2">

                            Salary will be calculated automatically:

                        </p>


                        <ul className="list-disc ml-5 space-y-1">


                            <li>
                                Basic Salary
                            </li>


                            <li>
                                Allowances
                            </li>


                            <li>
                                Overtime Pay
                            </li>


                            <li>
                                Idle Time Deduction
                            </li>


                            <li>
                                Attendance Loss of Pay
                            </li>


                        </ul>


                    </div>





                    {/* Buttons */}


                    <div className="flex justify-end gap-3 pt-2">


                        <button

                            type="button"

                            onClick={() => setIsOpen(false)}

                            className="btn-secondary"

                        >

                            Cancel

                        </button>




                        <button

                            disabled={loading}

                            type="submit"

                            className="btn-primary flex items-center"

                        >

                            {
                                loading &&
                                <Loader2
                                    className="w-4 h-4 mr-2 animate-spin"
                                />
                            }


                            Generate


                        </button>



                    </div>




                </form>


            </div>


        </div>

    );

};


export default GeneratePayslipForm;