


import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async(req,res,next)=>{

    try{

        const authHeader = req.headers.authorization;

        // console.log("AUTH HEADER:", authHeader);


        if(!authHeader || !authHeader.startsWith("Bearer "))
        {
            return res.status(401).json({
                error:"Unauthorized"
            });
        }


        const token = authHeader.split(" ")[1];

        console.log("TOKEN:", token);


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // console.log("DECODED:", decoded);


        const user = await User.findById(decoded.userId);

        // console.log("USER:", user);


        if(!user)
        {
            return res.status(401).json({
                error:"User not found"
            });
        }


        const activeSession = user.sessions.find(
            session => session.token === token
        );


        // console.log("ACTIVE SESSION:", activeSession);


        if(!activeSession)
        {
            return res.status(401).json({
                error:"Session expired. Login again"
            });
        }


        req.session = decoded;

        next();


    }
    catch(error){

        console.log("AUTH ERROR:",error.message);

        return res.status(401).json({
            error:"Unauthorized"
        });

    }

};



export const protectAdmin=(req,res,next)=>{


    if(req?.session?.role !== "ADMIN")
    {

        return res.status(403).json({
            error:"Admin access required"
        });

    }


    next();

};