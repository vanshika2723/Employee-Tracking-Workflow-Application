import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );


  useEffect(() => {

    if(dark){

      document.documentElement.classList.add("dark");
      localStorage.setItem("theme","dark");

    }else{

      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme","light");

    }

    console.log("Dark Mode:", dark);
    console.log(
      "HTML:",
      document.documentElement.className
    );

  },[dark]);


  return (

    <button
      onClick={()=>setDark(prev=>!prev)}
      className="
      p-2 rounded-lg
      text-slate-700
      dark:text-white
      hover:bg-slate-100
      dark:hover:bg-slate-800
      transition
      "
    >

      {
        dark 
        ? 
        <Moon size={20}/>
        :
        <Sun size={20}/>
      }

    </button>

  );
};

export default ThemeToggle;