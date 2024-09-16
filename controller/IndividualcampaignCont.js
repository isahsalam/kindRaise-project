const campaignModel = require("../model/campaignModel")
const donationModel=require("../model/donationModel")
const individualModel = require("../model/individualModel")
const npoModel = require("../model/npoModel")
const cloudinary=require("../utilis/cloudinary")
const sendmail=require("../helpers/html")

exports.createCampaignByIndividual = async (req, res) => {
    try {
            console.log(req.user)
        const { title, subtitle, story, Goal,  } = req.body;
        const individualId= req.user.id;

        if (!title || !subtitle || !story || !Goal  ) {  
            return res.status(400).json({ info: 'All fields are required' });
        }
        const user=await individualModel.findById(individualId)
        if(!user){
            return res.status(404).json({info:`user not found`})
        }
 
        let profilePicsUrl = null
        if (req.file) {
            try {
                const uploadcampaignPhoto=await cloudinary.uploader.upload(req.file.path);
                 profilePicsUrl=uploadcampaignPhoto.url
            } catch (error) {
                return res.status(502).json({error:error.message})
            }
            
        }else{
            res.status(404).json({message:`profilepics is required`})
        }
      const lastDonationDate=new Date()
        const newCampaign = new campaignModel({
            title,
            subtitle,
            story,
            Goal,
            profilePic:profilePicsUrl,
            totalRaised:0,
            todaysDonation:0,
            lastDonationDate:lastDonationDate,
            status:'active',
            individual: individualId,
        });
         
        const savedCampaign = await newCampaign.save();
        
        return res.status(201).json({message:`campaign created by ${user.firstName}`,data:savedCampaign});
    } catch (error) {
        console.error('Error creating NPO campaign:', error);
        return res.status(500).json({ error: `An error occurred while creating the individual campaign because ${error}` });
    }
};




exports.getCampaignById = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const individualId=req.user.id
        const campaign = await campaignModel
            .findById(campaignId)
            .populate('individual', 'firstName lastName email'); 

        if (!campaign) {
            console.log(campaign)
            return res.status(404).json({ message: 'Campaign not found' });
        }
        if(campaign.individual._id.toString()!==individualId){
            return res.status(403).json({info:`oops you can only view the campaigns you created`})
        }

        res.status(200).json({ campaign });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAllIndividualCampaigns = async (req, res) => {
    try {
        const individualId = req.user.id; 
        
        const user = await individualModel.findById(individualId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const allCampaigns = await campaignModel.find({ 'individual': individualId }).populate('individual','firstName lastName email' );
       
        if (allCampaigns.length < 1) {
            return res.status(400).json({ message: `Oops, dear ${user.lastName}, you have not created any campaigns yet` });
        }
        
        return res.status(200).json({ 
            message: `Here are all campaigns created by ${user.lastName}`, 
            campaigns: allCampaigns 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller function to update campaign
exports.updateIndividualCampaign = async (req, res) => {
    try {
        const { story, subtitle } = req.body;
        const { campaignId } = req.params;

        const individualId = req.user.id; 
        
        // Find the campaign by ID
        const campaign = await campaignModel.findById(campaignId);
        console.log('Campaign Individual ID:', campaign.individual)
        if (!campaign) {
            return res.status(404).json({ info: `Campaign not found` });
        }
        const user = await individualModel.findById(individualId);
        // console.log('Campaign Individual ID:', campaign.individual)
        if (!user) {
            return res.status(404).json({ info: `user not found` });
        }
       
 
       // Check if the campaign has an individual reference
        if (campaign.individual.toString() !== individualId) { 
            return res.status(403).json({ info: `Unauthorized: You can only update your own campaign/campaigns` });
        }

        // Update the campaign
        campaign.story = story || campaign.story; 
        campaign.subtitle = subtitle || campaign.subtitle;
        await campaign.save();

        return res.status(200).json({ message: `Campaign updated successfully ${user.firstName}`, campaign });
    } catch (error) {
        return res.status(500).json({ error: `Server error: ${error.message}` });
    }
};

exports.deleteCampaign=async(req,res)=>{
    try {
        const allUsers = await individualModel.find()
        if (allUsers < 1) {
            return res.status(400).json({ info: `oops!,sorry no campaign found in database` })
        }
        const campaign=await campaignModel.deleteMany()
        
        return res.status(200).json({ message: `all ${allUsers.length}campaigns deleted successfully` });
    } catch (error) {
        return res.status(500).json({ error: `Server error: ${error.message}` });
    }
   
}