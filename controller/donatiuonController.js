const mongoose=require("mongoose")
const donationModel=require("../model/donationModel")
const campaignModel=require("../model/campaignModel")
const individualModel=require("../model/individualModel")
const sendmail = require("../helpers/nodemailer")
const { donationTemplate,campaignCreatorTemplate} = require("../helpers/html")



const getDonationById = async (req, res) => {
  try {
    const {donationId}=req.params
    const {id}=req.user
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
        return res.status(400).json({ error: "Invalid donation ID format." });
      }
  
    const donation = await donationModel.findById(donationId).populate('campaign');
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    // console.log(donation)
    console.log(donation.campaign.individual.toString())
    console.log(id)
    if(donation.campaign.individual.toString() !== id){
        return res.status(403).json({message:`oops, sorry you can only view donations made to the campaign you created`})
    }
    const campaignTitle=donation.campaign? donation.campaign.title:"unknown campaign"
    return res.status(200).json({message:`below are  donation donated to ${campaignTitle}`,donation});
  } catch (error) {
    return res.status(500).json({ error: `Failed to fetch donation${error}` });
  }
}; 
 
const createDonation = async (req, res) => {
  try {
      const { campaignId } = req.params;
      const { amount, name, email, message, state, paymentMethod } = req.body;

      if (!amount || !state || !paymentMethod || !email) {
          return res.status(400).json({ error: "All fields are required, including email." });
      }

      // Find the campaign by ID
      const campaign = await campaignModel.findById(campaignId).populate('individual')
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
          individual:campaign.individual._id,
          paymentMethod,
      });

      // Save donation to the database
      await newDonation.save();

      // Update campaign with raised amount and supporters
      campaign.raised = (campaign.raised || 0) + amount;
      campaign.supporters = (campaign.supporters || 0) + 1;
      await campaign.save();

      // Prepare email content
      const donationLink = `${req.protocol}://${req.get('host')}/api/v1/campaign/${campaignId}`;
      const campaignCreatorLink = `${req.protocol}://${req.get('host')}/api/v1/campaign/${campaignId}`;

      // Send email to the donor
      await sendmail({
          email: newDonation.email,
          subject: 'Thank You for Your Donation!',
          html: donationTemplate(newDonation.name, amount, campaign.title, new Date().toLocaleDateString(), campaignId, donationLink),
      });

      // Check and send email to the campaign creator
      const campaignCreatorEmail = campaign.individual.email;
      console.log(campaignCreatorEmail)
      if (campaignCreatorEmail) {
          await sendmail({
              email: campaignCreatorEmail,
              subject: 'DONATION ALERT!',
              html: campaignCreatorTemplate(campaignCreatorLink),
          });
      } else {
          console.error('No email address found for the campaign creator');
      }

      // Respond with a success message
      return res.status(201).json({
          message: `Dear ${newDonation.name}, thank you for your donation of ₦${newDonation.amount} to the ${campaign.title} campaign!`,
          newDonation
      });

  } catch (error) {
      console.error('Error creating donation or sending email:', error);
      return res.status(500).json({ error: `Failed to create donation: ${error.message}` });
  }
};


const getAllDonation = async (req, res) => {
  try {
    const { campaignId } = req.params;  
    const { id } = req.user;  
    
    const donations = await donationModel.find({
      campaign: campaignId,
      individual: id
    }).populate("campaign");
    
    if (!donations || donations.length === 0) {
      return res.status(404).json({ error: "No donations found for this campaign" });
    }

    const campaign = await campaignModel.findById(campaignId);
    if (campaign.individual.toString() !== id) {
      return res.status(403).json({ message: `Sorry, you can only view donations made to the campaign you created` });
    }

    return res.status(200).json({
      message: `Here are the ${donations.length} donations made to the campaign titled '${campaign.title}'`,
      donations
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: `Failed to get all donations because: ${error.message}` });
  }
};

module.exports = {
  createDonation,
  getDonationById,
  getAllDonation,
  
};
