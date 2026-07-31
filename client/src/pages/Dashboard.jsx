import { useEffect, useState } from "react";
import {
  dummyEmployeeDashboardData,
  dummyAdminDashboardData,
} from "../assets/assets";
import Loading from "../components/Loading";
import EmployeeDashboard from "../components/EmployeeDashboard";
import AdminDashboard from "../components/AdminDashboard";
import api from "../api/axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);
  const [refresh,setRefresh] = useState(0);
  const [filter,setFilter] = useState("today");

useEffect(() => {

  api.get(`/dashboard?filter=${filter}`)
  .then((res)=>{
    //  console.log("DASHBOARD DATA:", res.data);
      setData(res.data);
  })
  .catch((err)=>{
      toast.error(
        err.response?.data?.error || err.message
      );
  })
  .finally(()=>{
      setLoading(false);
  });


},[refresh,filter]);
  if (loading) return <Loading />;
  if (!data)
    return (
      <p className="text-center text-slate-500 py-12">
        Failed to load Dashboard
      </p>
    );

if (data.role === "ADMIN") {
    return (
        <AdminDashboard
            data={data}
            filter={filter}
    setFilter={setFilter}
       refresh={refresh}
            onRefresh={()=>setRefresh(prev=>prev+1)}
        />
    );
} else {
   return (
<EmployeeDashboard 
    data={data}
    activity={activity}
/>
);
  }
};
export default Dashboard;
