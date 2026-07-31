// import { io } from "socket.io-client";


// const socket = io("http://localhost:4000",{
//     withCredentials:true
// });


// export default socket;

import { io } from "socket.io-client";


const socket = io(
    "http://localhost:4000",
    {
        withCredentials:true
    }
);



socket.on(
    "connect",
    ()=>{

        console.log(
            "Socket Connected:",
            socket.id
        );

    }
);



socket.on(
    "connect_error",
    (error)=>{

        console.log(
            "Socket Error:",
            error.message
        );

    }
);



export default socket;