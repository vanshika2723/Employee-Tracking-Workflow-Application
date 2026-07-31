import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { format } from "date-fns";
import api from "../api/axios";


const PrintPayslip = ()=>{

    const {id}=useParams();

    const [payslip,setPayslip]=useState(null);
    const [loading,setLoading]=useState(true);



    useEffect(()=>{

        api.get(`/payslips/${id}`)
        .then((res)=>setPayslip(res.data))
        .catch(console.error)
        .finally(()=>setLoading(false));


    },[id]);



    if(loading)
        return <Loading/>;



    if(!payslip)
        return (
            <p className="text-center py-12 text-slate-400">
                Payslip not found
            </p>
        );



    return(

<div className="max-w-3xl mx-auto p-8 bg-white animate-fade-in">


<div className="text-center border-b pb-6 mb-8">

<h1 className="text-3xl font-bold text-slate-900">
PAYSLIP
</h1>

<p className="text-slate-500 mt-2">

{
format(
new Date(
payslip.year,
payslip.month-1
),
"MMMM yyyy"
)
}

</p>

</div>




<div className="grid grid-cols-2 gap-6 mb-8">


<div>

<p className="text-xs text-slate-400">
Employee Name
</p>

<p className="font-semibold">
{payslip.employee?.firstName}
{" "}
{payslip.employee?.lastName}
</p>

</div>



<div>

<p className="text-xs text-slate-400">
Position
</p>

<p className="font-semibold">
{payslip.employee?.position}
</p>

</div>



<div>

<p className="text-xs text-slate-400">
Email
</p>

<p className="font-semibold">
{payslip.employee?.email}
</p>

</div>



<div>

<p className="text-xs text-slate-400">
Period
</p>

<p className="font-semibold">

{
format(
new Date(
payslip.year,
payslip.month-1
),
"MMMM yyyy"
)
}

</p>

</div>


</div>





<div className="border rounded-xl overflow-hidden mb-8">


<table className="w-full text-sm">


<thead>

<tr className="bg-slate-50">

<th className="text-left px-4 py-3">
Description
</th>


<th className="text-right px-4 py-3">
Amount
</th>

</tr>

</thead>




<tbody>



<Row 
title="Basic Salary"
value={`£${payslip.basicSalary?.toLocaleString("en-GB")}`}
/>



<Row
title="Allowances"
value={`+ £${payslip.allowances?.toLocaleString("en-GB") || 0}`}
/>



<Row
title="Overtime Hours"
value={`${payslip.overtimeHours || 0} hrs`}
/>



<Row
title="Overtime Pay"
value={`+ £${payslip.overtimePay?.toLocaleString("en-GB") || 0}`}
/>



<Row
title="Idle Deduction"
value={`- £${payslip.idleDeduction?.toLocaleString("en-GB") || 0}`}
/>



<Row
title="Loss Of Pay"
value={`- £${payslip.lossOfPay?.toLocaleString("en-GB") || 0}`}
/>



<Row
title="Fixed Deduction"
value={`- £${payslip.fixedDeduction?.toLocaleString("en-GB") || 0}`}
/>



<tr className="border-t">

<td className="px-4 py-3">
Present Days
</td>

<td className="text-right px-4">
{payslip.presentDays || 0}
</td>

</tr>




<tr className="border-t">

<td className="px-4 py-3">
Half Days
</td>

<td className="text-right px-4">
{payslip.halfDays || 0}
</td>

</tr>




<tr className="border-t">

<td className="px-4 py-3">
Late Login Count
</td>

<td className="text-right px-4">
{payslip.lateLoginCount || 0}
</td>

</tr>




<tr className="border-t">

<td className="px-4 py-3">
Early Logout Count
</td>

<td className="text-right px-4">
{payslip.earlyLogoutCount || 0}
</td>

</tr>





<tr className="border-t-2 bg-slate-50">


<td className="px-4 py-4 font-bold">

Net Salary

</td>


<td className="text-right px-4 font-bold text-lg">

£{payslip.netSalary?.toLocaleString("en-GB")}

</td>


</tr>



</tbody>


</table>


</div>





<button

className="btn-primary print:hidden"

onClick={()=>window.print()}

>

Print Payslip

</button>


</div>


    )

}



const Row=({title,value})=>{

return (

<tr className="border-t">

<td className="px-4 py-3 text-slate-700">

{title}

</td>


<td className="text-right px-4 font-medium">

{value}

</td>

</tr>

)

}



export default PrintPayslip;