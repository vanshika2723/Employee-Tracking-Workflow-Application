import { Server } from "socket.io";


let io;


export const initSocket = (server)=>{

    io = new Server(server,{
        cors:{
            origin:true,
            credentials:true
        }
    });


    io.on("connection",(socket)=>{

        console.log(
            "Socket connected:",
            socket.id
        );

socket.on("joinUserRoom",(userId)=>{

  socket.join(userId);

  console.log(
    "USER JOINED:",
    userId
  );

});
        socket.on("disconnect",()=>{

            console.log(
                "Socket disconnected:",
                socket.id
            );

        });

    });


    return io;

};



export const getIO = ()=>{

    if(!io){
        throw new Error("Socket not initialized");
    }

    return io;

};

export const sendEmployeeLog = (employeeId, data)=>{

    if(!io){
        return;
    }


    io.to(employeeId).emit(
        "employeeActivityLog",
        data
    );

};