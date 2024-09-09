const express = require("express");
const router = express.Router();
const uploads=require("../utilis/multer")

const { NposignUp, NpologIn, deleteAllNpo, getAllNpo,updateNpo,deleteOneNpo,NpoverifyEmail,NporesendVerificationEmail,NpoforgetPassword,NporesetPassword, NpochangePassword,NpologOut,getOneNpo,makeAdmin}=require("../controller/npoController")

const staffEntryValidator=require("../middleware/validator") 

const{authenticate,authenticateAdmin}=require("../middleware/auth")
   //onboarding
router.post("/sign-up",uploads.single ('profilepics'),staffEntryValidator(true),NposignUp)  
router.post("/log-in",NpologIn)
router.post("/log-out",NpologOut)
//roles
router.delete("/delete-all",authenticate,authenticateAdmin,deleteAllNpo)  
router.get("/get-all",authenticate,authenticateAdmin,getAllNpo)
router.put("/update-user/:userId",updateNpo)
router.delete("/delete-one/:id",authenticate,authenticateAdmin,deleteOneNpo)
router.get("/get-one/:id",getOneNpo)  
router.get(`/make-admin/:userId`, authenticateAdmin, makeAdmin)
//security
router.get("/verify-email/:token",NpoverifyEmail)
router.post("/resend-VerificationEmail",NporesendVerificationEmail)
router.post("/forget-Password",NpoforgetPassword)
router.get("/reset-Password/:token",NporesetPassword)
router.put("/change-Password/:token",NpochangePassword)
//exports
module.exports=router 
 