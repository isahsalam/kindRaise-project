const express=require("express")
const router=express.Router()
const{ createNpo }=require("../controller/npoController")
const { authenticateNpo, authenticate }=require("../middleware/auth")
router.post("/npo-organization",authenticate,authenticateNpo,createNpo)
module.exports=router