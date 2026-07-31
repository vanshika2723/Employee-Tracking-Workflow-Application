// // // import { useEffect, useRef } from "react";
// // // import api from "../api/axios";

// // // const BREAK_TIME = 15 * 60 * 1000; // 15 minutes
// // // const IDLE_TIME = 5 * 60 * 1000; // 5 minutes

// // // const useActivityTracker = (isWorking) => {
// // //   const lastActivity = useRef(Date.now());

// // //   const activeTime = useRef(0);

// // //   const idleTime = useRef(0);

// // //   const screenInactiveTime = useRef(0);
// // //   const breakTime = useRef(0);
// // //   const systemLockDuration = useRef(0);
// // //   const lockStartTime = useRef(null);
// // //   const productiveTime = useRef(0);
// // //   const keyboardActivity = useRef(0);

// // // const mouseActivity = useRef(0);

// // // const screenLocked = useRef(false);

// // // const browserActivity = useRef(window.location.pathname);

// // // const currentTab = useRef(document.title);

// // //   // console.log("TRACKER STARTED");

// // //  useEffect(() => {

// // // if(!isWorking){
// // //   console.log("TRACKING STOPPED");
// // //   return;
// // // }

// // // console.log("TRACKING STARTED");
// // //     // console.log("USE EFFECT RUNNING");

// // //    const handleActivity = () => {
// // //   lastActivity.current = Date.now();
// // //   screenInactiveTime.current = 0;
// // // };

// // // const handleKeyDown = () => {
// // //   keyboardActivity.current++;
// // //   lastActivity.current = Date.now();
// // // };

// // // const handleMouseMove = () => {
// // //   mouseActivity.current++;
// // //   lastActivity.current = Date.now();
// // // };

// // //   const handleVisibility = () => {
// // //   screenLocked.current = document.hidden;

// // //   if (document.hidden) {
// // //     screenInactiveTime.current += 60;
// // //   }
// // // };

// // //     const handleBlur = () => {
// // //       lockStartTime.current = Date.now();
// // //     };

// // //     const handleFocus = () => {
// // //       if (lockStartTime.current) {
// // //         const seconds = Math.floor((Date.now() - lockStartTime.current) / 1000);

// // //         systemLockDuration.current += seconds;

// // //         lockStartTime.current = null;

// // //         console.log("SYSTEM LOCK:", systemLockDuration.current);
// // //       }
// // //     };

// // //     const inactiveInterval = setInterval(()=>{


// // //     const diff =
// // //     Date.now() - lastActivity.current;



// // //     if(diff > 5 * 60 * 1000){

// // //         screenInactiveTime.current += 1;


// // //         console.log(
// // //             "SCREEN INACTIVE:",
// // //             screenInactiveTime.current
// // //         );

// // //     }


// // // },1000);

// // //     document.addEventListener("visibilitychange", handleVisibility);

// // //     window.addEventListener("mousemove", handleMouseMove);
// // // window.addEventListener("keydown", handleKeyDown);

// // //     window.addEventListener("blur", handleBlur);
// // //     window.addEventListener("focus", handleFocus);

// // //     const interval = setInterval(() => {
// // //       const now = Date.now();

// // //       // console.log(
// // //       //   "CHECK IDLE:",
// // //       //   Math.floor((now - lastActivity.current) / 1000),
// // //       //   "seconds",
// // //       // );

// // //       const inactiveDuration = now - lastActivity.current;
      

// // //      if (inactiveDuration > BREAK_TIME) {

// // //   breakTime.current += 10;

// // // } else if (inactiveDuration > IDLE_TIME) {

// // //   idleTime.current += 10;

// // // } else {

// // //   activeTime.current += 10;

// // // }


// // //       api
// // //         .post("/activity/update", {
// // //           activeTime: activeTime.current,
// // //   idleTime: idleTime.current,
// // //   productiveTime: productiveTime.current,
// // //   breakTime: breakTime.current,
// // //   screenInactiveTime: screenInactiveTime.current,
// // //   systemLockDuration: systemLockDuration.current,

// // //   keyboardActivity: keyboardActivity.current,
// // //   mouseActivity: mouseActivity.current,
// // //   screenLocked: screenLocked.current,
// // //   browserActivity: browserActivity.current,
// // //   currentTab: currentTab.current,

// // //   lastActivity: new Date(),
// // //         })
// // //         .catch((err) => {
// // //           console.log(err);
// // //         });

// // //       activeTime.current = 0;
// // //       idleTime.current = 0;
// // //       screenInactiveTime.current = 0;
// // //       breakTime.current = 0;
// // //       systemLockDuration.current = 0;
// // //       keyboardActivity.current = 0;
// // // mouseActivity.current = 0;
// // //     }, 10000);

// // //     return () => {
// // //      window.removeEventListener("mousemove", handleMouseMove);
// // // window.removeEventListener("keydown", handleKeyDown);

// // //       document.removeEventListener("visibilitychange", handleVisibility);

// // //       window.removeEventListener("blur", handleBlur);
// // //       window.removeEventListener("focus", handleFocus);

// // //       clearInterval(interval);
// // //       clearInterval(inactiveInterval);
// // //     };
// // //   }, [isWorking]);
// // // };

// // // export default useActivityTracker;


// // import { useEffect, useRef } from "react";
// // import api from "../api/axios";


// // // Testing ke liye 30 sec rakho
// // // Production me 5 * 60 * 1000 kar dena

// // const IDLE_TIME = 30 * 1000; // 30 seconds
// // const BREAK_TIME = 15 * 60 * 1000; // 15 minutes


// // const useActivityTracker = (isWorking) => {


// //   const lastActivity = useRef(Date.now());


// //   const activeTime = useRef(0);
// //   const idleTime = useRef(0);
// //   const breakTime = useRef(0);

// //   const productiveTime = useRef(0);


// //   const screenInactiveTime = useRef(0);

// //   const systemLockDuration = useRef(0);
// //   const lockStartTime = useRef(null);


// //   const keyboardActivity = useRef(0);
// //   const mouseActivity = useRef(0);


// //   const screenLocked = useRef(false);


// //   const browserActivity = useRef(
// //     window.location.pathname
// //   );


// //   const currentTab = useRef(
// //     document.title
// //   );



// // useEffect(()=>{


// // if(!isWorking){

// //  console.log(
// //   "TRACKING STOPPED"
// //  );

// //  return;

// // }



// // console.log(
// //  "TRACKING STARTED"
// // );



// // const updateActivityTime = ()=>{


// //  lastActivity.current = Date.now();

// //  screenInactiveTime.current = 0;


// // };



// // const handleKeyboard = ()=>{


// //  keyboardActivity.current++;

// //  updateActivityTime();


// // };



// // const handleMouse = ()=>{


// //  mouseActivity.current++;

// //  updateActivityTime();


// // };



// // const handleVisibility = ()=>{


// //  screenLocked.current =
// //  document.hidden;



// //  if(document.hidden){

// //   screenInactiveTime.current += 10;

// //  }


// // };




// // const handleBlur = ()=>{


// //  lockStartTime.current =
// //  Date.now();


// // };



// // const handleFocus = ()=>{


// // if(lockStartTime.current){


// //  const seconds =
// //  Math.floor(
// //  (Date.now()-lockStartTime.current)
// //  /1000
// //  );


// //  systemLockDuration.current += seconds;


// //  lockStartTime.current = null;


// // }



// // };




// // // MAIN TIMER

// // const interval = setInterval(()=>{


// // const now = Date.now();



// // const inactiveDuration =
// // now - lastActivity.current;



// // let idleStatus = "ACTIVE";



// // // ACTIVE

// // if(inactiveDuration < IDLE_TIME){


// //  activeTime.current += 10;

// //  productiveTime.current += 10;


// // }



// // // IDLE

// // else if(
// //  inactiveDuration >= IDLE_TIME &&
// //  inactiveDuration < BREAK_TIME
// // ){


// //  idleTime.current += 10;


// //  idleStatus = "IDLE";

// // }



// // // BREAK

// // else{


// //  breakTime.current += 10;


// //  idleStatus = "BREAK";


// // }




// // console.log(
// // {
// //  idleStatus,
// //  inactiveDuration:
// //  Math.floor(inactiveDuration/1000)
// // }
// // );





// // api.post(
// // "/activity/update",
// // {


// // activeTime:
// // activeTime.current,


// // idleTime:
// // idleTime.current,


// // breakTime:
// // breakTime.current,


// // productiveTime:
// // productiveTime.current,


// // screenInactiveTime:
// // screenInactiveTime.current,


// // systemLockDuration:
// // systemLockDuration.current,



// // keyboardActivity:
// // keyboardActivity.current,


// // mouseActivity:
// // mouseActivity.current,



// // screenLocked:
// // screenLocked.current,


// // browserActivity:
// // browserActivity.current,


// // currentTab:
// // currentTab.current,



// // idleStatus,


// // lastActivity:
// // new Date(lastActivity.current)


// // }

// // )

// // .catch(err=>{

// // console.log(
// // "ACTIVITY UPDATE ERROR",
// // err
// // );


// // });



// // // reset only event counters

// // keyboardActivity.current = 0;

// // mouseActivity.current = 0;


// // },10000);







// // window.addEventListener(
// // "mousemove",
// // handleMouse
// // );


// // window.addEventListener(
// // "keydown",
// // handleKeyboard
// // );


// // document.addEventListener(
// // "visibilitychange",
// // handleVisibility
// // );


// // window.addEventListener(
// // "blur",
// // handleBlur
// // );


// // window.addEventListener(
// // "focus",
// // handleFocus
// // );






// // return ()=>{


// // window.removeEventListener(
// // "mousemove",
// // handleMouse
// // );


// // window.removeEventListener(
// // "keydown",
// // handleKeyboard
// // );


// // document.removeEventListener(
// // "visibilitychange",
// // handleVisibility
// // );


// // window.removeEventListener(
// // "blur",
// // handleBlur
// // );


// // window.removeEventListener(
// // "focus",
// // handleFocus
// // );



// // clearInterval(interval);



// // };


// // },[isWorking]);



// // };


// // export default useActivityTracker;

// import { useEffect, useRef } from "react";
// import api from "../api/axios";

// const IDLE_TIME = 30 * 1000; // Testing: 30 seconds
// // Production:
// // const IDLE_TIME = 5 * 60 * 1000;

// const useActivityTracker = (isWorking) => {
//   const lastActivity = useRef(Date.now());

//   const activeTime = useRef(0);
//   const idleTime = useRef(0);
//   const productiveTime = useRef(0);

//   const screenInactiveTime = useRef(0);

//   const systemLockDuration = useRef(0);
//   const lockStartTime = useRef(null);

//   const keyboardActivity = useRef(0);
//   const mouseActivity = useRef(0);

//   const screenLocked = useRef(false);

//   const browserActivity = useRef(window.location.pathname);
//   const currentTab = useRef(document.title);

//   useEffect(() => {
//     if (!isWorking) {
//       console.log("TRACKING STOPPED");
//       return;
//     }

//     console.log("TRACKING STARTED");

//     // --------------------------------
//     // User Activity
//     // --------------------------------

//     const updateActivityTime = () => {
//       lastActivity.current = Date.now();
//       screenInactiveTime.current = 0;
//     };

//     const handleKeyboard = () => {
//       keyboardActivity.current += 1;
//       updateActivityTime();
//     };

//     const handleMouse = () => {
//       mouseActivity.current += 1;
//       updateActivityTime();
//     };

//     // --------------------------------
//     // Browser Visibility
//     // --------------------------------

//     const handleVisibility = () => {
//       screenLocked.current = document.hidden;

//       if (document.hidden) {
//         screenInactiveTime.current += 10;
//       } else {
//         updateActivityTime();
//       }
//     };

//     // --------------------------------
//     // Window Blur
//     // --------------------------------

//     const handleBlur = () => {
//       if (!lockStartTime.current) {
//         lockStartTime.current = Date.now();
//       }
//     };

//     // --------------------------------
//     // Window Focus
//     // --------------------------------

//     const handleFocus = () => {
//       if (lockStartTime.current) {
//         const seconds = Math.floor(
//           (Date.now() - lockStartTime.current) / 1000
//         );

//         systemLockDuration.current += seconds;

//         lockStartTime.current = null;
//       }

//       updateActivityTime();
//     };

//     // --------------------------------
//     // MAIN TRACKING TIMER
//     // --------------------------------

//     const interval = setInterval(() => {
//       const now = Date.now();

//       const inactiveDuration =
//         now - lastActivity.current;

//       let idleStatus = "ACTIVE";

//       // --------------------------------
//       // ACTIVE
//       // --------------------------------

//       if (inactiveDuration < IDLE_TIME) {
//         activeTime.current += 10;

//         productiveTime.current += 10;

//         idleStatus = "ACTIVE";
//       }

//       // --------------------------------
//       // IDLE
//       // --------------------------------

//       else {
//         idleTime.current += 10;

//         idleStatus = "IDLE";
//       }

//       console.log("ACTIVITY TRACKER:", {
//         idleStatus,
//         inactiveSeconds: Math.floor(
//           inactiveDuration / 1000
//         ),
//         activeTime: activeTime.current,
//         idleTime: idleTime.current,
//       });

//       // --------------------------------
//       // SEND UPDATE
//       // --------------------------------

//       api
//         .post("/activity/update", {
//           activeTime: activeTime.current,

//           idleTime: idleTime.current,

//           productiveTime: productiveTime.current,

//           screenInactiveTime:
//             screenInactiveTime.current,

//           systemLockDuration:
//             systemLockDuration.current,

//           keyboardActivity:
//             keyboardActivity.current,

//           mouseActivity:
//             mouseActivity.current,

//           screenLocked:
//             screenLocked.current,

//           browserActivity:
//             browserActivity.current,

//           currentTab:
//             currentTab.current,

//           idleStatus,

//           lastActivity:
//             new Date(lastActivity.current),
//         })
//         .catch((err) => {
//           console.log(
//             "ACTIVITY UPDATE ERROR:",
//             err.response?.data || err
//           );
//         });

//       // --------------------------------
//       // RESET ONLY TEMPORARY COUNTERS
//       // --------------------------------

//       keyboardActivity.current = 0;
//       mouseActivity.current = 0;

//       activeTime.current = 0;
//       idleTime.current = 0;
//       productiveTime.current = 0;
//       screenInactiveTime.current = 0;
//       systemLockDuration.current = 0;
//     }, 10000);

//     // --------------------------------
//     // EVENTS
//     // --------------------------------

//     window.addEventListener(
//       "mousemove",
//       handleMouse
//     );

//     window.addEventListener(
//       "keydown",
//       handleKeyboard
//     );

//     document.addEventListener(
//       "visibilitychange",
//       handleVisibility
//     );

//     window.addEventListener(
//       "blur",
//       handleBlur
//     );

//     window.addEventListener(
//       "focus",
//       handleFocus
//     );

//     // --------------------------------
//     // CLEANUP
//     // --------------------------------

//     return () => {
//       window.removeEventListener(
//         "mousemove",
//         handleMouse
//       );

//       window.removeEventListener(
//         "keydown",
//         handleKeyboard
//       );

//       document.removeEventListener(
//         "visibilitychange",
//         handleVisibility
//       );

//       window.removeEventListener(
//         "blur",
//         handleBlur
//       );

//       window.removeEventListener(
//         "focus",
//         handleFocus
//       );

//       clearInterval(interval);
//     };
//   }, [isWorking]);
// };

// export default useActivityTracker;

import { useEffect, useRef } from "react";
import api from "../api/axios";

const IDLE_TIME = 30 * 1000; // TESTING: 30 seconds
// Production:
// const IDLE_TIME = 5 * 60 * 1000;

const useActivityTracker = (isWorking) => {
  const lastActivity = useRef(Date.now());

  const activeTime = useRef(0);
  const idleTime = useRef(0);
  const breakTime = useRef(0);
  const productiveTime = useRef(0);

  const screenInactiveTime = useRef(0);
  const systemLockDuration = useRef(0);

  const keyboardActivity = useRef(0);
  const mouseActivity = useRef(0);

  const screenLocked = useRef(false);

  const browserActivity = useRef(window.location.pathname);
  const currentTab = useRef(document.title);

  useEffect(() => {
    if (!isWorking) {
      console.log("TRACKING STOPPED");
      return;
    }

    console.log("TRACKING STARTED");

    // ------------------------------------
    // USER ACTIVITY
    // ------------------------------------

    const updateLastActivity = () => {
      lastActivity.current = Date.now();
      screenInactiveTime.current = 0;
    };

    const handleKeyboard = () => {
      keyboardActivity.current += 1;
      updateLastActivity();
    };

    const handleMouse = () => {
      mouseActivity.current += 1;
      updateLastActivity();
    };

    // ------------------------------------
    // SCREEN VISIBILITY
    // ------------------------------------

    const handleVisibility = () => {
      screenLocked.current = document.hidden;

      if (!document.hidden) {
        updateLastActivity();
      }
    };

    // ------------------------------------
    // MAIN TRACKING
    // ------------------------------------

    const interval = setInterval(async () => {
      const now = Date.now();

      const inactiveDuration =
        now - lastActivity.current;

      let idleStatus = "ACTIVE";

      let activeDelta = 0;
      let idleDelta = 0;
      let breakDelta = 0;
      let productiveDelta = 0;

      // -------------------------
      // ACTIVE
      // -------------------------

      if (inactiveDuration < IDLE_TIME) {
        activeDelta = 10;
        productiveDelta = 10;

        activeTime.current += 10;
        productiveTime.current += 10;

        idleStatus = "ACTIVE";
      }

      // -------------------------
      // IDLE
      // -------------------------

      else {
        idleDelta = 10;

        idleTime.current += 10;

        idleStatus = "IDLE";
      }

      console.log("TRACK STATUS:", {
        idleStatus,
        inactiveSeconds: Math.floor(
          inactiveDuration / 1000
        ),
        activeDelta,
        idleDelta,
        breakDelta,
      });

      try {
        await api.post("/activity/update", {
          activeTime: activeDelta,
          idleTime: idleDelta,
          breakTime: breakDelta,
          productiveTime: productiveDelta,

          screenInactiveTime: 0,
          systemLockDuration: 0,

          keyboardActivity:
            keyboardActivity.current,

          mouseActivity:
            mouseActivity.current,

          screenLocked:
            screenLocked.current,

          browserActivity:
            window.location.pathname,

          currentTab:
            document.title,

          idleStatus,

          lastActivity:
            new Date(lastActivity.current),
        });

        // Reset only event counters
        keyboardActivity.current = 0;
        mouseActivity.current = 0;

      } catch (error) {
        console.log(
          "ACTIVITY UPDATE ERROR:",
          error.response?.data || error.message
        );
      }
    }, 10000);

    // ------------------------------------
    // EVENTS
    // ------------------------------------

    window.addEventListener(
      "mousemove",
      handleMouse
    );

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    // ------------------------------------
    // CLEANUP
    // ------------------------------------

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouse
      );

      window.removeEventListener(
        "keydown",
        handleKeyboard
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      clearInterval(interval);

      console.log("TRACKING CLEANED");
    };
  }, [isWorking]);
};

export default useActivityTracker;