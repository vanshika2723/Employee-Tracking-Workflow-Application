import React, { useState } from "react";
import api from "../../api/axios";

const ReportExport = ({ reportType }) => {

  const [loading, setLoading] = useState("");

  const downloadReport = async (type) => {

    try {

      setLoading(type);

      const response = await api.get(
        `/reports/export/${type}/${reportType}`,
        {
          responseType:"blob",
        }
      );


      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;


      const ext =
        type === "excel"
        ? "xlsx"
        : type === "csv"
        ? "csv"
        : "pdf";


      link.download = `${reportType}.${ext}`;


      document.body.appendChild(link);

      link.click();

      link.remove();


      window.URL.revokeObjectURL(url);


    }
    catch(error){

      console.log(error);

    }
    finally{

      setLoading("");

    }

  };


  return (

   <div className="card p-5 mt-6 flex gap-4 justify-end items-center">

     

      

<button
onClick={()=>downloadReport("csv")}
disabled={loading==="csv"}
className="
px-5 py-2
bg-green-600
hover:bg-green-700
text-white
rounded-lg
shadow
transition
"
>
{loading==="csv" ? "Downloading..." : "⇩ CSV"}
</button>


<button
onClick={()=>downloadReport("excel")}
disabled={loading==="excel"}
className="
px-5 py-2
bg-blue-600
hover:bg-blue-700
text-white
rounded-lg
shadow
transition
"
>
{loading==="excel" ? "Downloading..." : "⇩ Excel"}
</button>


<button
onClick={()=>downloadReport("pdf")}
disabled={loading==="pdf"}
className="
px-5 py-2
bg-red-600
hover:bg-red-700
text-white
rounded-lg
shadow
transition
"
>
{loading==="pdf" ? "Downloading..." : "⇩ PDF"}
</button>
      </div>


   

  );

};


export default ReportExport;