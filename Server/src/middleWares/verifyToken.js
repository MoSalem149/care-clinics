const jwt=require('jsonwebtoken')
const verifyToken=(req,res,next)=>{
const authHeader=req.headers['Authorization'] || req.headers['authorization']
if(!authHeader){
    res.json({error:"token is required"})
}
const token=authHeader.split(' ')[1]
try{
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY)
console.log("decodedToken",decodedToken)

next()
}catch(err){res.json({err:"invalid token"})}

}
module.exports={
    verifyToken
}