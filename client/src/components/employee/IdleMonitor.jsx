import { useEffect, useRef } from "react";
import api from "../../api/axios";


const IdleMonitor = () => {

  const timer = useRef(null);
  const idle = useRef(false);



  useEffect(()=>{


    const startIdle = async()=>{


      if(idle.current) return;


      idle.current = true;


      console.log("Employee idle started");


      try{

        const res = await api.post("/idle/start");

        console.log(
          "IDLE START RESPONSE:",
          res.data
        );


      }
      catch(error){

        console.log(
          "IDLE START ERROR:",
          error.response?.data || error.message
        );

      }


    };





    const endIdle = async()=>{


      if(!idle.current) return;


      idle.current = false;


      console.log(
        "Employee active again"
      );



      try{

        const res = await api.post("/idle/end");


        console.log(
          "IDLE END RESPONSE:",
          res.data
        );


      }
      catch(error){

        console.log(
          "IDLE END ERROR:",
          error.response?.data || error.message
        );

      }


    };







    const resetTimer = ()=>{


      clearTimeout(timer.current);



      timer.current = setTimeout(()=>{


        startIdle();


      },10000); // 4 minutes



    };







    const mouseHandler = ()=>{


      endIdle();


      resetTimer();


    };





    const keyboardHandler = ()=>{


      endIdle();


      resetTimer();


    };






    window.addEventListener(
      "mousemove",
      mouseHandler
    );



    window.addEventListener(
      "keydown",
      keyboardHandler
    );



    resetTimer();







    return ()=>{


      clearTimeout(timer.current);



      window.removeEventListener(
        "mousemove",
        mouseHandler
      );



      window.removeEventListener(
        "keydown",
        keyboardHandler
      );


    };



  },[]);





  return null;


};


export default IdleMonitor;