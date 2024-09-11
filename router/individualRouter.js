const express = require("express");
const router = express.Router();
const uploads=require("../utilis/multer.js")

const { signUp, logIn, deleteAll, getAll,updatedUser,deleteOne,verifyEmail,resendVerificationEmail,forgetPassword,resetPassword, changePassword,logOut,getOne,makeAdmin}=require("../controller/individualController"); 

const staffEntryValidator=require("../middleware/validator") 

const{authenticate,authenticateAdmin,authenticateindividual}=require("../middleware/auth");
const { deleteByAdmin } = require("../controller/adminController.js");
   //onboarding
router.post("/signup",uploads.single ('profilepics'),staffEntryValidator(true),signUp)  
router.post("/login",logIn) 
router.post("/logout",logOut) 
//roles
router.delete("/deleteall",authenticate,authenticateAdmin,deleteAll)  
router.get("/getall",getAll) 
router.put("/updateuser/:userId",updatedUser)
router.delete("/deleteone/:id",authenticate,authenticateAdmin,deleteOne)
router.get("/getone/:id",getOne) 
router.put('/makeadmin/:id',makeAdmin) 
//security
router.get("/verifyemail/:token",verifyEmail) 
router.post("/resendVerificationEmail",resendVerificationEmail)
router.post("/forgetPassword",forgetPassword)
router.get("/resetPassword/:token",resetPassword)
router.put("/changePassword/:token",changePassword)
////ADMIN MANAGEMENT///////
router.delete("/deleteOne/:id",authenticate,authenticateAdmin,deleteByAdmin)

module.exports=router 
 