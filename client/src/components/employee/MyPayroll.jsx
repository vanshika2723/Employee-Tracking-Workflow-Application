import React, { useEffect, useState } from "react";
import api from "../../api/axios";


const MyPayroll = ()=>{

    const [payroll,setPayroll] = useState([]);


    useEffect(()=>{

        const fetchPayroll = async()=>{

            try{

                const res = await api.get(
                    "/payroll/my"
                );

                setPayroll(res.data.payroll);

            }
            catch(error){

                console.log(error);

            }

        };


        fetchPayroll();


    },[]);



    return(

        <div className="p-6">


            <h2 className="text-2xl font-bold mb-5">
                My Payroll
            </h2>


            {
                payroll.map((item)=>(


                    <div
                    key={item._id}
                    className="card p-5 mb-4"
                    >


                        <p>
                            Month:
                            <b> {item.month}</b>
                        </p>


                        <p>
                            Basic Salary:
                            <b> ₹{item.basicSalary}</b>
                        </p>


                        <p>
                            Allowances:
                            <b> ₹{item.allowances}</b>
                        </p>


                        <p>
                            Overtime Pay:
                            <b> ₹{item.overtimePay}</b>
                        </p>


                        <p>
                            Idle Deduction:
                            <b> ₹{item.idleDeduction}</b>
                        </p>


                        <p>
                            Loss of Pay:
                            <b> ₹{item.lossOfPay}</b>
                        </p>


                        <hr className="my-3"/>


                        <p className="text-xl font-bold">
                            Net Salary:
                            ₹{item.netSalary}
                        </p>


                    </div>


                ))
            }


        </div>

    )

}


export default MyPayroll;