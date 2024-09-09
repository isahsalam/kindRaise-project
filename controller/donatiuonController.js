
const donationModel=require("../model/donationModel")
const campaignModel=require("../model/campaignModel")
const individualModel=require("../model/individualModel")
const sendmail = require("../helpers/nodemailer")
const { donationTemplate} = require("../helpers/html")
const createDonation = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { amount, name, email, message, state, paymentMethod } = req.body;

        if (!amount || !state || !paymentMethod || !email) {
            return res.status(400).json({ error: "All fields are required, including email." });
        }

        // Find the campaign by ID
        const campaign = await campaignModel.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found" });
        }

        // Create new donation
        const newDonation = new donationModel({
            amount,
            name: name || 'anonymous',
            email,
            message,
            state,
            campaign: campaignId,
            paymentMethod,
        });

        // Save donation to the database
        await newDonation.save();

        // Update campaign with raised amount and supporters
        campaign.raised = (campaign.raised || 0) + amount;
        campaign.supporters = (campaign.supporters || 0) + 1;
        await campaign.save();

        const donationLink = `${req.protocol}://${req.get('host')}/api/v1/campaign/${campaignId}`;
        await sendmail({
            email: newDonation.email,
            subject: 'Thank You for Your Donation!',
            html: donationTemplate(donationLink,newDonation.name, amount, campaign.title, new Date().toLocaleDateString(), campaignId),
        });

        // Respond with a success message
        return res.status(201).json({
            message: `Dear ${newDonation.name}, thank you for your donation of ₦${amount} to the ${campaign.title} campaign!`,
            newDonation
        });

    } catch (error) {
        return res.status(500).json({ error: `Failed to create donation because ${error.message}` });
    }
};

// Get a single donation by ID
const getDonationById = async (req, res) => {
  try {
    const {donationId}=req.params
    
    const donation = await donationModel.findById(donationId).populate('campaign');
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    const campaignTitle=donation.campaign? donation.campaign.title:"unknown campaign"
    return res.status(200).json({message:`below are  donation donated to ${campaignTitle}`,donation});
  } catch (error) {
    return res.status(500).json({ error: `Failed to fetch donation${error}` });
  }
}; 
 
// Update a donation
const getAllDonation = async (req, res) => {
  try {
    const {campaignId} = req.params 
    const campaign = await campaignModel.findById(campaignId)

    //check if there is an campaign
    if(!campaign){
        return res.status(404).json({
            error: "campaign not found"
        })
    }   
    const donations = await donationModel.find({campaign:campaignId}).populate("campaign","title,")
    .populate("individual","firstName");
    if (!donations ||donations.length===0) {
      return res.status(404).json({ error: "donations not found in this campaign" });
    }
    return res.status(200).json({message:`below are ${donations.length} donations donated to ${campaign.title}`,donations});
  } catch (error) {
    return res.status(500).json({ error: `Failed to update donation because ${error}` });
  }
};


// Delete a donation
const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    return res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete donation" });
  }
};

module.exports = {
  createDonation,
  getDonationById,
  getAllDonation,
  deleteDonation
};
