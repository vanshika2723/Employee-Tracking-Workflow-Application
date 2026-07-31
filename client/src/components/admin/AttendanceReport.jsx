import React, { useEffect, useState } from "react";
import api from "../../api/axios";


const AttendanceReport = ()=>{

    const [reports,setReports] = useState({
        lateEmployees:[],
        missingLogout:[]
    });


    useEffect(()=>{

        api.get("/dashboard/attendance-reports")
        .then(res=>{
            setReports(res.data);
        })
        .catch(err=>{
            console.log(err);
        })

    },[]);



    return(

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">


            {/* Late Login */}

            <div className="card p-5">

                <h2 className="text-lg font-semibold mb-4">
                    Late Login Report
                </h2>


                <table className="w-full">

                    <thead>

                    <tr className="border-b text-left">

                        <th className="p-3">
                            Employee
                        </th>

                        <th className="p-3">
                            Department
                        </th>

                        <th className="p-3">
                            Login Time
                        </th>

                    </tr>

                    </thead>


                    <tbody>

                    {
                    reports.lateEmployees.map((item)=>(

                        <tr key={item._id} className="border-b">

                            <td className="p-3">
                            {
                            item.employeeId?.firstName
                            }{" "}
                            {
                            item.employeeId?.lastName
                            }
                            </td>


                            <td className="p-3">
                            {
                            item.employeeId?.department
                            }
                            </td>


                            <td className="p-3">
                            {
                            item.checkIn
                            ?
                            new Date(item.checkIn)
                            .toLocaleTimeString()
                            :
                            "-"
                            }
                            </td>

                        </tr>

                    ))
                    }

                    </tbody>

                </table>

            </div>




            {/* Missing Logout */}

            <div className="card p-5">

                <h2 className="text-lg font-semibold mb-4">
                    Missing Logout Report
                </h2>


                <table className="w-full">

                    <thead>

                    <tr className="border-b text-left">

                        <th className="p-3">
                            Employee
                        </th>

                        <th className="p-3">
                            Department
                        </th>

                        <th className="p-3">
                            Check In
                        </th>

                    </tr>

                    </thead>


                    <tbody>

                    {
                    reports.missingLogout.map((item)=>(

                        <tr key={item._id} className="border-b">


                            <td className="p-3">
                            {
                            item.employeeId?.firstName
                            }{" "}
                            {
                            item.employeeId?.lastName
                            }
                            </td>


                            <td className="p-3">
                            {
                            item.employeeId?.department
                            }
                            </td>


                            <td className="p-3">
                            {
                            item.checkIn
                            ?
                            new Date(item.checkIn)
                            .toLocaleTimeString()
                            :
                            "-"
                            }
                            </td>


                        </tr>

                    ))
                    }

                    </tbody>

                </table>


            </div>


        </div>

    )

}


export default AttendanceReport;