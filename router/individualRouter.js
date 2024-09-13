const express = require("express");
const router = express.Router();
const uploads=require("../utilis/multer.js")

const { signUp, logIn,updatedindividual,verifyEmail,resendVerificationEmail,forgetPassword,resetPassword, changePassword,logOut,getOne}=require("../controller/individualController"); 

const userValidator=require("../middleware/validator") 

const{authenticate,authenticateAdmin,authenticateindividual}=require("../middleware/auth");
const { deleteByAdmin,makeAdmin,deleteAll,getAllIndividual,getAllNpo,deleteOneNpo } = require("../controller/adminController.js");
   //onboarding
router.post("/signup",uploads.single ('profilepics'),userValidator(true),signUp)  
router.post("/login",logIn) 
router.post("/logout",logOut,authenticate) 
//roles
 

router.patch("/updateuser/:id",updatedindividual)
router.get("/getone/:id",getOne) 
 
//security
router.get("/verifyemail/:token",verifyEmail)  
router.post("/resendVerificationEmail",resendVerificationEmail)
router.post("/forgetPassword",forgetPassword)
router.get("/resetPassword/:token",resetPassword)
router.put("/changePassword/:token",userValidator(false,["oldPassword",'ConfirmNewPassword','NewPassword']),changePassword)
////ADMIN MANAGEMENT///////
router.delete("/deleteoneIndividual/:id",authenticate,authenticateAdmin,deleteByAdmin)
router.put('/makeadmin/:id',authenticate,authenticateAdmin,makeAdmin)
router.delete("/deleteall",authenticate,authenticateAdmin,deleteAll) 
router.get("/get-allindividual",authenticate,authenticateAdmin,getAllIndividual) 
router.get("/getall-Npo",authenticate,authenticateAdmin,getAllNpo)  
router.get("/delete-Npo/:id",authenticate,authenticateAdmin,deleteOneNpo)
module.exports=router 
 