const express=require("express")
const campaignrouter=express.Router()

const{ createCampaignByIndividual, getAllIndividualCampaigns, getCampaignById, updateIndividualCampaign }=require("../controller/IndividualcampaignCont")
const {createCampaignByNpo,getSingleCampaign,getNpoCampaigns,updateNpoCampaign}=require("../controller/npoCampaignCont")
  
const { authenticate, authenticateindividual }=require("../middleware/auth")
const staffEntryValidator = require("../middleware/validator")
     //individual campaign routes
campaignrouter.post("/createcampaign",authenticate,createCampaignByIndividual)
campaignrouter.get("/getallcampaigns",authenticate,getAllIndividualCampaigns)
campaignrouter.get("/getcampaignbyId/:campaignId",authenticate,getCampaignById)
campaignrouter.put("/updatecampaign/:campaignId",authenticate,authenticateindividual,updateIndividualCampaign)
         //npo campaign routes 
campaignrouter.post("/create-campaign",authenticate,createCampaignByNpo)
 campaignrouter.get("/get-campaignbyId/:campaignId",authenticate,getSingleCampaign)
campaignrouter.get("/get-allCampaign",authenticate,getNpoCampaigns)
campaignrouter.put("/update-campaign/:campaignId",authenticate,updateNpoCampaign)


module.exports=campaignrouter