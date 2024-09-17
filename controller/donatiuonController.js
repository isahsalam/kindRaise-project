const mongoose=require("mongoose")
const donationModel=require("../model/donationModel")
const campaignModel=require("../model/campaignModel")
const individualModel=require("../model/individualModel")
const npoModel=require("../model/npoModel")
const messageModel=require("../model/messageModel")
const sendmail = require("../helpers/nodemailer")
const { donationTemplate,campaignCreatorTemplate} = require("../helpers/html")


const getDonationById = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { id } = req.user;

    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      return res.status(400).json({ error: "Invalid donation ID format." });
    }

    const donation = await donationModel.findById(donationId).populate('campaign');
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    // Check if the requesting user is the creator of the campaign
    const campaign = donation.campaign;
    if (campaign.individual && campaign.individual.toString() !== id) {
      return res.status(403).json({ message: "You can only view donations for the campaign you created." });
    }
    if (campaign.npo && campaign.npo.toString() !== id) {
      return res.status(403).json({ message: "You can only view donations for the campaign you created." });
    }

    const campaignTitle = campaign ? campaign.title : "Unknown campaign";
    return res.status(200).json({
      message: `Below are the details of the donation for campaign titled '${campaignTitle}'`,
      donation
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    return res.status(500).json({ error: `Failed to fetch donation: ${error.message}` });
  }
};
const getAllDonation = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { id } = req.user;

    // Validate campaign ID
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ error: "Invalid campaign ID format." });
    }

    // Fetch the campaign to verify ownership
    const campaign = await campaignModel.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    if (campaign.individual && campaign.individual.toString() !== id) {
      return res.status(403).json({ message: "You can only view donations for the campaign you created." });
    }
    if (campaign.npo && campaign.npo.toString() !== id) {
      return res.status(403).json({ message: "You can only view donations for the campaign you created." });
    }

    // Fetch donations for the campaign
    const donations = await donationModel.find({ campaign: campaignId }).populate("campaign");
    if (!donations || donations.length === 0) {
      return res.status(404).json({ error: "No donations found for this campaign" });
    }

    return res.status(200).json({
      message: `Here are the ${donations.length} donations made to the campaign titled '${campaign.title}'`,
      donations
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return res.status(500).json({ error: `Failed to get all donations: ${error.message}` });
  }
};



const createDonation = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { amount, name, email, message, state, paymentMethod } = req.body;

    if (!amount || !state || !paymentMethod) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Find the campaign by ID and populate the references
    const campaign = await campaignModel.findById(campaignId)
      .populate('individual')
      .populate('npo');

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
    // await newDonation.save();
    
    // campaign.totalRaised = (campaign.totalRaised || 0) + amount;
    // campaign.supporters = (campaign.supporters || 0) + 1;
    
    //  const today= new Date() 
    //  today.setHours(0,0,0,0)
    //  const lastDonationDate= new Date(campaign.lastDonationDate)
    //      lastDonationDate.setHours(0,0,0,)

    //      if(today.getTime() != lastDonationDate.getTime()){
    //        campaign.monthlyDonation=0
    //      }

    //      campaign.monthlyDonation += amount
    //      campaign.lastDonationDate= new Date()
    await newDonation.save();

campaign.totalRaised = (campaign.totalRaised || 0) + amount;
campaign.supporters = (campaign.supporters || 0) + 1;

const today = new Date();
const lastDonationDate = new Date(campaign.lastDonationDate);

// Check if the current month and year are different from the last donation month and year
if (
  today.getMonth() !== lastDonationDate.getMonth() ||
  today.getFullYear() !== lastDonationDate.getFullYear()
) {
  // If the month or year has changed, reset the monthly donation
  campaign.monthlyDonation = 0;
}

// Add the current donation to the monthly total
campaign.monthlyDonation += amount;
campaign.lastDonationDate = today;


    await campaign.save();
     
  
    const donationLink = `${req.protocol}://${req.get('host')}/api/v1/campaign/${campaignId}`;
    const campaignCreatorLink = `${req.protocol}://${req.get('host')}/api/v1/campaign/${campaignId}`;

    // Send email to the donor
    await sendmail({
      email: newDonation.email,
      subject: 'Thank You for Your Donation!',
      html: donationTemplate(newDonation.name, amount, campaign.title, new Date().toLocaleDateString(), campaignId, donationLink),
    });

    // Determine campaign creator email
    let campaignCreatorEmail = '';
    if (campaign.individual) {
      campaignCreatorEmail = campaign.individual.email;
    } else if (campaign.npo) {
      campaignCreatorEmail = campaign.npo.email;
    }

    // Check and send email to the campaign creator
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

 

// const getAllDonation = async (req, res) => {
//   try {
//     const { campaignId } = req.params;  
//     const { id } = req.user;  
    
//     const donations = await donationModel.find({
//       campaign: campaignId,
//       individual: id
//     }).populate("campaign");
    
//     if (!donations || donations.length === 0) {
//       return res.status(404).json({ error: "No donations found for this campaign" });
//     }

//     const campaign = await campaignModel.findById(campaignId);
//     if (campaign.individual.toString() !== id) {
//       return res.status(403).json({ message: `Sorry, you can only view donations made to the campaign you created` });
//     }

//     return res.status(200).json({
//       message: `Here are the ${donations.length} donations made to the campaign titled '${campaign.title}'`,
//       donations
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: `Failed to get all donations because: ${error.message}` });
//   }
// };

const NpoManagement = async (req, res) => {
    try {
      const { donorId } = req.params;
      const { campaignId, message } = req.body;
      console.log('Request body:', req.body);
      console.log('Message:', req.body.message);
      // Find the donor for the given donorId and campaignId
      const donor = await donationModel.findOne({ _id: donorId, campaign: campaignId });
      if (!donor) {
        return res.status(404).json({ message: 'Donor not found for the specified campaign' });
      }
  
      // Find the campaign to check the type and creator
      const campaign = await campaignModel.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
  
      // Verify if the donor's campaign matches the given campaignId
      if (donor.campaign.toString() !== campaignId) {
        return res.status(400).json({ message: 'No recent donation found for this campaign' });
      }
  
      // Determine campaign creator (NPO) and ensure it matches the current user
      const Nporeceiver = campaign.npo ? campaign.npo : null;
      if (!Nporeceiver || Nporeceiver.toString() !== req.user.id) {
        return res.status(401).json({ info: 'Only the NPO campaign creator can perform this action' });
      }
  
      // Create a new message record
      const Npomanagement = new messageModel({
        campaign: campaignId,
        donor: donorId,
        campaignCreator: campaign.npo,
        Nporeceiver,
        message,
      });
  
      await Npomanagement.save();
  
      // Send an email to the donor
      await sendmail({
        email: donor.email,
        subject: 'Message from the Campaign You Donated To',
        html: `<p>Hello,${req.body.message}.</p>`,
      });
  
      res.status(200).json({ message: 'Campaign creator successfully sent a message' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: `Cannot send message because: ${error.message}` });
    }
  };

  // const trackDonationHistory=async(req,res)=>{
  //   try{
  //       const userId=req.user
  //       const donations=await donationModel.find({individual:userId})
  //       .select("amount name message")
  //       .populate("campaign", "title")
  //       .sort({
  //         createdAt:-1
  //       })
  //       if(!donations.length){
  //         res.status(404).json({message:`no donation history found for ${userId}`})
  //       }
  //        res.status(200).json({message:`succesfully get donation history for user ${userId}`,donations})
  //   }catch(error){
  //     res.status(500).json({message:error.message})
  //   }

  // }
  
  // 
  const trackDonationHistory = async (req, res) => {
    const userId = req.user;  // Assuming req.user contains the userId
    let donations;

    try {
        // Fetch donations made by an individual
        donations = await donationModel.find({ individual: userId })
            .select("amount name message")
            .populate("campaign", "title")
            .sort({ createdAt: -1 });

        // If donations for individual exist, return them
        if (donations.length) {
            return res.status(200).json({
                message: `Successfully retrieved donation history for individual ${userId}`,
                donations
            });
        }

        // If no individual donations, check for NPO donations
        donations = await donationModel.find({ npo: userId })
            .select("amount name message")
            .populate("campaign", "title")
            .sort({ createdAt: -1 });

        // If NPO donations exist, return them
        if (donations.length) {
            return res.status(200).json({
                message: `Successfully retrieved donation history for NPO ${userId}`,
                donations
            });
        }

        // If no donations found
        return res.status(404).json({ message: `No donation history found for user ${userId}` });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

  

module.exports = {
  createDonation,
  getDonationById,
  getAllDonation,
  NpoManagement,
  trackDonationHistory,
  
};
