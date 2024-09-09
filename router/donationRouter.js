const express=require("express")
const router=express.Router()
const{ createDonation,getAllDonation,getDonationById}=require("../controller/donatiuonController")

router.post("/donate/:campaignId",createDonation)
router.get("/getAllDonation/:campaignId",getAllDonation)
router.get("/getDonationById/:donationId",getDonationById)
module.exports=router