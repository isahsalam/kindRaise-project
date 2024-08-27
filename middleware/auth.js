const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../model/userModel');

exports.authenticate=async(req,res,next)=>{
    try {
        const auth=req.header.authorization
        if(!auth){
            return res.status(400).json({info:`access denied,needs authorization to continue`})
        }
        const token=req.auth.split(" ")[1]
        if(!token){
            return res.status(400).json({message:"no,or invalid token"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user=await userModel.findById(decoded.id)
        if(!user){
            return res.status(400).json({message:"user not found or details incorrect"})
        }
        req.user=user
        next()
    } catch (error) {
        
    }
}

  
exports.authenticateAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin1' && req.user.role !== 'Admin2') {
        return res.status(403).json({ message: 'Access Denied. Admin privileges required.' });
    }
    next();
};
 