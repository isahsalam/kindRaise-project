const express = require("express");
const router = express.Router();
const uploads=require("../utilis/multer")

const { NposignUp, NpologIn,updateNpo,NpoverifyEmail,NporesendVerificationEmail,NpoforgetPassword,NporesetPassword, NpochangePassword,NpologOut,getOneNpo}=require("../controller/npoController")

const staffEntryValidator=require("../middleware/validator") 

const{authenticate,authenticateAdmin}=require("../middleware/auth")
   //onboarding
router.post("/sign-up",uploads.single ('profilepics'),staffEntryValidator(true),NposignUp)  
router.post("/log-in",NpologIn)
router.post("/log-out",NpologOut)
//roles
router.put("/update-user/:userId",updateNpo)

router.get("/get-one/:id",getOneNpo)  
//security
router.get("/verify-email/:token",NpoverifyEmail)
router.post("/resend-VerificationEmail",NporesendVerificationEmail)
router.post("/forget-Password",NpoforgetPassword)
router.get("/reset-Password/:token",NporesetPassword)
router.put("/change-Password/:token",NpochangePassword)
//exports
module.exports=router 
 