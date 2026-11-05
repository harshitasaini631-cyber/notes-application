const jwt = require("jsonwebtoken");
const auth = (req,res,next)=>{

    try{
        const token = req.headers.authorization;
        console.log(token);
        const decoded = jwt.verify(token, "process.env.JWT_SECRET");
        // console.log(decoded);
        // console.log("Request body:", req.body);
        console.log("Decoded token:", decoded);
        req.userID = decoded.userID;
        next();
    }catch(error){
        res.send({mesg:"login first"});
    }

};

module.exports = {auth}