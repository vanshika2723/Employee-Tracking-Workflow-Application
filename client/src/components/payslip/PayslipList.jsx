import { format } from "date-fns";
import { Download } from "lucide-react";
import React from "react";

const PayslipList = ({ payslips, isAdmin }) => {

    return (
        <div className="card overflow-hidden">

            <div className="overflow-x-auto">

                <table className="table-modern">

                    <thead>

                        <tr>

                            {isAdmin && <th>Employee</th>}

                            <th>Period</th>

                            <th>Present Days</th>

                            <th>Half Days</th>

                            <th>Late Login</th>

                            <th>Overtime</th>

                            <th>Basic Salary</th>

                            <th>Idle Deduction</th>

                            <th>Loss Of Pay</th>

                            <th>Net Salary</th>

                            <th className="text-center">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                    {
                        payslips.length === 0 ? (

                            <tr>

                                <td
                                colSpan={isAdmin ? 11 : 10}
                                className="text-center py-12 text-slate-400"
                                >

                                    No payslips found

                                </td>

                            </tr>


                        ) : (


                        payslips.map((payslip)=>{


                            return (

                            <tr key={payslip._id || payslip.id}>


                            {
                            isAdmin && (

                            <td className="text-slate-900">

                                {payslip.employee?.firstName}
                                {" "}
                                {payslip.employee?.lastName}

                            </td>

                            )
                            }



                            <td className="text-slate-500">

                                {format(
                                    new Date(
                                        payslip.year,
                                        payslip.month-1
                                    ),
                                    "MMMM yyyy"
                                )}

                            </td>



                            <td>
                                {payslip.presentDays || 0}
                            </td>



                            <td>
                                {payslip.halfDays || 0}
                            </td>



                            <td>
                                {payslip.lateLoginCount || 0}
                            </td>



                            <td>

                                {payslip.overtimeHours || 0} hrs

                            </td>




                            <td>

                                £
                                {payslip.basicSalary?.toLocaleString("en-GB")}

                            </td>




                            <td className="text-red-500">

                                - £
                                {payslip.idleDeduction?.toLocaleString("en-GB") || 0}

                            </td>




                            <td className="text-red-500">

                                - £
                                {payslip.lossOfPay?.toLocaleString("en-GB") || 0}

                            </td>




                            <td className="font-bold text-green-600">

                                £
                                {payslip.netSalary?.toLocaleString("en-GB")}

                            </td>




                            <td className="text-center">


                                <button

                                onClick={()=>
                                    window.open(
                                    `/print/payslips/${payslip._id || payslip.id}`
                                    )
                                }


                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors ring-1 ring-blue-600/10"

                                >

                                <Download 
                                className="w-3 h-3 mr-1.5"
                                />

                                Download

                                </button>


                            </td>



                            </tr>

                            )

                        })

                        )

                    }


                    </tbody>


                </table>


            </div>


        </div>
    )

}


export default PayslipList;