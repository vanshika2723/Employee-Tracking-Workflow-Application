import React, { useEffect, useState } from "react";
import api from "../../api/axios";


const ShiftManagement = () => {


    const [shifts,setShifts] = useState([]);

    const [employees,setEmployees] = useState([]);



    const [assignData,setAssignData] = useState({

        shiftId:"",
        employeeId:""

    });



    const [form,setForm] = useState({

        name:"",
        startTime:"",
        endTime:"",
        gracePeriod:15

    });



    const fetchShifts = async()=>{

        try{

            const res = await api.get("/shifts");

            setShifts(res.data);

        }
        catch(error){

            console.log(error);

        }

    };



    const fetchEmployees = async()=>{

        try{

            const res = await api.get("/employees");


            setEmployees(
                res.data.data || res.data
            );


        }
        catch(error){

            console.log(error);

        }

    };



    useEffect(()=>{

        fetchShifts();

        fetchEmployees();

    },[]);




    const createShift = async(e)=>{

        e.preventDefault();


        try{

            await api.post(
                "/shifts/create",
                form
            );


            alert("Shift Created");


            setForm({

                name:"",
                startTime:"",
                endTime:"",
                gracePeriod:15

            });


            fetchShifts();


        }
        catch(error){

            console.log(error);

        }

    };





    const assignShift = async()=>{


        try{


            await api.post(
                "/shifts/assign",
                assignData
            );


            alert("Employee assigned");


            setAssignData({

                shiftId:"",
                employeeId:""

            });


        }
        catch(error){

            console.log(error);

        }

    };





    return (

        <div className="card p-5 mt-6">


            <h2 className="text-lg font-semibold mb-5">
                Shift Management
            </h2>




            {/* CREATE SHIFT */}


            <form

            onSubmit={createShift}

            className="grid grid-cols-1 md:grid-cols-4 gap-4"

            >



                <input

                className="border rounded-lg px-3 py-2"

                placeholder="Shift Name"

                value={form.name}

                onChange={(e)=>
                    setForm({
                        ...form,
                        name:e.target.value
                    })
                }

                />





                <input

                type="time"

                className="border rounded-lg px-3 py-2"

                value={form.startTime}

                onChange={(e)=>
                    setForm({
                        ...form,
                        startTime:e.target.value
                    })
                }

                />





                <input

                type="time"

                className="border rounded-lg px-3 py-2"

                value={form.endTime}

                onChange={(e)=>
                    setForm({
                        ...form,
                        endTime:e.target.value
                    })
                }

                />





                <button

                className="bg-indigo-600 text-white rounded-lg"

                >

                    Create Shift

                </button>



            </form>





            {/* SHIFT LIST */}



            <div className="mt-6">


            {
                shifts.length > 0 ?

                shifts.map(shift=>(


                    <div

                    key={shift._id}

                    className="border rounded-lg p-4 mb-3 flex justify-between"

                    >



                        <div>


                            <p className="font-semibold">

                                {shift.name}

                            </p>



                            <p className="text-sm text-gray-500">

                                {shift.startTime}
                                {" - "}
                                {shift.endTime}

                            </p>



                        </div>




                        <span>

                            Grace:
                            {" "}
                            {shift.gracePeriod}
                            {" "}
                            min

                        </span>



                    </div>


                ))

                :

                <p className="text-gray-500">

                    No shifts created

                </p>

            }



            </div>






            {/* ASSIGN SHIFT */}



            <div className="mt-8 border-t pt-5">


                <h3 className="font-semibold mb-4">

                    Assign Employee Shift

                </h3>





                <select

                className="border px-3 py-2 rounded-lg mr-3"

                value={assignData.shiftId}

                onChange={(e)=>
                    setAssignData({

                        ...assignData,

                        shiftId:e.target.value

                    })
                }

                >


                    <option value="">

                        Select Shift

                    </option>



                    {
                        shifts.map(shift=>(

                            <option

                            key={shift._id}

                            value={shift._id}

                            >

                                {shift.name}

                            </option>

                        ))
                    }


                </select>







                <select

                className="border px-3 py-2 rounded-lg mr-3"

                value={assignData.employeeId}

                onChange={(e)=>
                    setAssignData({

                        ...assignData,

                        employeeId:e.target.value

                    })
                }

                >


                    <option value="">

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


                            </option>


                        ))
                    }



                </select>






                <button

                onClick={assignShift}

                className="bg-green-600 text-white px-5 py-2 rounded-lg"

                >

                    Assign

                </button>




            </div>




        </div>

    );

};


export default ShiftManagement;