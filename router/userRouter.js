const express = require("express");
const router = express.Router();
const uploads=require('../utilities/multer')
const { signUp, logIn, deleteAll, getAll,updatedUser,makeAdmin ,getAllAdmins,deleteOne,verifyEmail,resendVerificationEmail,forgetPassword,resetPassword, changePassword,logOut,getOne}=require("../controller/userController");

const{authenticate,authenticateAdmin}=require("../middleware/auth")
  
router.post("/sign-up",uploads.single ('profilepics'),signUp)  
router.post("/log-in",logIn)
router.delete("/delete-all",authenticate,authenticateAdmin,deleteAll)  
router.get("/get-all",authenticate,authenticateAdmin,getAll)
router.put("/update-user/:userId",authenticate,authenticateAdmin,updatedUser)
router.patch("/make-admin/:userId",makeAdmin)

router.get("/get-all-admin",authenticate,authenticateAdmin,getAllAdmins)
router.delete("/delete-one/:id",authenticate,authenticateAdmin,deleteOne)
router.get("/verify-email/:token",verifyEmail)
router.post("/resendVerificationEmail",resendVerificationEmail)
router.post("/forgetPassword",forgetPassword)
router.get("/reset-Password/:token",resetPassword)
router.put("/change-Password/:token",changePassword)
router.post("/log-out",logOut)
router.get("/get-one/:id",getOne)
module.exports=router 
