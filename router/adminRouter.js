const express=require("express")
const adminrouter=express.Router()

const{authenticate,authenticateAdmin}=require("../middleware/auth");

const { deleteByAdmin,makeAdmin,deleteAllIndividual,getAllIndividual,getAllNpo,deleteOneNpo,makeCampaignActive,makeCampaignInactive,getAllCampaign,deleteCampaignById } = require("../controller/adminController.js");



////ADMIN MANAGEMENT///////
adminrouter.delete("/deleteoneIndividual/:id",authenticate,authenticateAdmin,deleteByAdmin)
adminrouter.put('/makeadmin/:id',authenticate,authenticateAdmin,makeAdmin)
adminrouter.delete("/deleteAllIndividual",authenticate,authenticateAdmin,deleteAllIndividual) 
adminrouter.get("/get-allindividual",authenticate,authenticateAdmin,getAllIndividual) 
adminrouter.get("/getall-Npo",authenticate,authenticateAdmin,getAllNpo)  
adminrouter.get("/delete-Npo/:id",authenticate,authenticateAdmin,deleteOneNpo)
adminrouter.patch("/active/:campaignId",authenticate,authenticateAdmin,makeCampaignActive)
adminrouter.patch("/inactive/:campaignId",authenticate,authenticateAdmin,makeCampaignInactive)
adminrouter.get("/getallcampaigns",authenticate,authenticateAdmin,getAllCampaign)
adminrouter.delete("/deleteOneCampaign/:campaignId",authenticate,authenticateAdmin,deleteCampaignById)

module.exports=adminrouter