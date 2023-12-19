const jwt=require('jsonwebtoken')
require('dotenv').config();

module.exports=(req,res,next)=>{
    try{
    let authHeader=req.headers.authorization
    if(authHeader==undefined){
        res.status(401).send({error:"no token provided"})
    }
    let token=authHeader.split(" ")[1]
    console.log(token,"token from middleware");
   const verified= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(err,decoded){

if(err){
    console.log("JWT Verification Error:", err.message);
    res.send({error:"Autentication failed"})
}else{
    const userId = decoded.id;
    const username = decoded.username;
    req.userId = userId;
    req.username = username;
    next()
}
    })
  
}catch(err){
    res.status(400).send("invalid token")
}
}
