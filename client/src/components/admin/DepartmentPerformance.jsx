import React, { useEffect, useState } from "react";
import api from "../../api/axios";


const DepartmentPerformance = ({
    filter
})=>{

    const [departments,setDepartments] = useState([]);


    useEffect(()=>{

  api.get(
    `/dashboard/department-performance?filter=${filter}`
)
        .then(res=>{
               console.log("Department API:", res.data);
            setDepartments(res.data);
        })
        .catch(err=>{
            console.log(err);
        })

    },[filter]);



    return(

        <div className="card p-5 mt-6">

            <h2 className="text-lg font-semibold mb-5">
                Department Performance
            </h2>


            <div className="overflow-x-auto">

            <table className="w-full">

                <thead>

                <tr className="border-b text-left">

                    <th className="p-3">
                        Department
                    </th>


                    <th className="p-3">
                        Employees
                    </th>


                    <th className="p-3">
                        Average Productivity
                    </th>

                </tr>

                </thead>


                <tbody>

                {
                departments.map((dept)=>(

                    <tr 
                    key={dept._id}
                    className="border-b"
                    >

                        <td className="p-3 font-medium">
                            {dept._id}
                        </td>


                        <td className="p-3">
                            {dept.totalEmployees}
                        </td>


                        <td className="p-3">

                            <span className="font-semibold">
                                {
                                Math.round(
                                dept.averageProductivity
                                )
                                }%
                            </span>

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


export default DepartmentPerformance;