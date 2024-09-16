const express=require("express")
const campaignrouter=express.Router()
const uploads=require("../utilis/multer.js")

const{deleteCampaign, createCampaignByIndividual, getAllIndividualCampaigns, getCampaignById, updateIndividualCampaign }=require("../controller/IndividualcampaignCont")
const {createCampaignByNpo,getSingleCampaign,getNpoCampaigns,updateNpoCampaign}=require("../controller/npoCampaignCont")
  
const { authenticate, authenticateindividual }=require("../middleware/auth")
const staffEntryValidator = require("../middleware/validator")
const checkCampaignStatus=require("../middleware/checkStatus.js")

     //individual campaign routes
campaignrouter.delete("/deletecampaign",deleteCampaign) 
campaignrouter.post("/createcampaign",uploads.single ('campaignPic'),authenticate,createCampaignByIndividual)
campaignrouter.get("/getallIndividualcampaigns",authenticate,checkCampaignStatus,getAllIndividualCampaigns)
campaignrouter.get("/getcampaignbyId/:campaignId",authenticate,checkCampaignStatus,getCampaignById)
campaignrouter.put("/updatecampaign/:campaignId",authenticate,authenticateindividual,updateIndividualCampaign)
         //npo campaign routes 
campaignrouter.post("/create-campaign",uploads.single("campaignPic"),authenticate,createCampaignByNpo)
 campaignrouter.get("/get-campaignbyId/:campaignId",authenticate,checkCampaignStatus,getSingleCampaign)
campaignrouter.get("/get-NpoallCampaign",authenticate,checkCampaignStatus,getNpoCampaigns)
campaignrouter.put("/update-campaign/:campaignId",authenticate,checkCampaignStatus,updateNpoCampaign)


module.exports=campaignrouter