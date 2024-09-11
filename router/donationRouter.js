const express=require("express")
const router=express.Router()
const{ createDonation,getAllDonation,getDonationById}=require("../controller/donatiuonController")
const { authenticate } = require("../middleware/auth")

router.post("/donate/:campaignId",createDonation)
router.get("/getAllDonation/:campaignId",authenticate,getAllDonation)
router.get("/getDonationById/:donationId",authenticate,getDonationById)
module.exports=router