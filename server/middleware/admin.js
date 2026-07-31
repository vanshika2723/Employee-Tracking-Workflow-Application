export const adminOnly = (req,res,next)=>{

    try{

        if(!req.session){

            return res.status(401).json({
                error:"Unauthorized"
            });

        }


        if(req.session.role !== "ADMIN"){

            return res.status(403).json({
                error:"Admin access required"
            });

        }


        next();


    }
    catch(error){

        console.error("ADMIN AUTH ERROR:", error);

        return res.status(500).json({
            error:"Authorization failed"
        });

    }

};