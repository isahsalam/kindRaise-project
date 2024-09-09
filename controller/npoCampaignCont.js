const campaignModel = require("../model/campaignModel")
const individualModel = require("../model/individualModel")
const npoModel = require("../model/npoModel")
const cloudinary=require("../utilis/cloudinary")
const sendmail=require("../helpers/html")

exports.createCampaignByNpo = async (req, res) => {
    try {
            console.log(req.user)
        const { title, subtitle, story, Goal  } = req.body;
        const npoId= req.user.id;

        if (!title || !subtitle || !story || !Goal ) {  
            return res.status(400).json({ info: 'All fields are required' });
        }
        const user=await npoModel.findById(npoId)
        
        if(!user){
            return res.status(404).json({info:`user with id not found`})
        }
       
        let profilePicUrl = null;
        if (req.file) {
            try {
                const uploadResult = await cloudinary.uploader.upload(req.file.path);
                profilePicUrl = uploadResult.url;
            } catch (error) {
                return res.status(500).json({ message: `Image upload failed: ${error.message}` });
            } 
        }

        const newCampaign = new campaignModel({
            title,
            subtitle,
            story,
            Photo:profilePicUrl,
            Goal,
            raised:0,
            npo: npoId,
        });
      
        if(newCampaign.Goal === newCampaign.raised){
            newCampaign.status="inactive"
        }
        const savedCampaign = await newCampaign.save();
       
        return res.status(201).json({message:`campaign created by ${user.firstName}`,data:savedCampaign});
    } catch (error) {
        console.error('Error creating NPO campaign:', error);
        return res.status(500).json({ error: `An error occurred while creating the individual campaign because ${error}` });
    }
};

exports.getSingleCampaign = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const npoId=req.user.id
        const campaign = await campaignModel
            .findById(campaignId)
            .populate('npo', 'organizationName lastName email'); 

        if (!campaign) {
            console.log(campaign)
            return res.status(404).json({ message: 'Campaign not found' });
        }
        if(campaign.npo._id.toString() !== npoId){
            return res.status(403).json({info:`oops you can only view the campaigns you created`})
        }

        res.status(200).json({ campaign });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getNpoCampaigns = async (req, res) => {
    try {
        const npoId = req.user.id; 
        
        const user = await npoModel.findById(npoId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const allCampaigns = await campaignModel.find({ 'npo': npoId }).populate('npo','firstName organizationName email' );
       
        if (allCampaigns.length < 1) {
            return res.status(400).json({ message: `Oops, dear ${user.firstName}, you have not created any campaigns yet` });
        }
        return res.status(200).json({ 
            message: `Here are all campaigns created by ${user.organizationName}`, 
            campaigns: allCampaigns 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller function to update campaign
exports.updateNpoCampaign = async (req, res) => {
    try {
        const { story, subtitle,title } = req.body;
        const { campaignId } = req.params;

        const npoId = req.user.id; 
        
        // Find the campaign by ID
        const campaign = await campaignModel.findById(campaignId);
        console.log('Campaign Npo ID:', campaign.npo)
        if (!campaign) {
            return res.status(404).json({ info: `Campaign not found` });
        }
        const user = await npoModel.findById(npoId);
        // console.log('Campaign Individual ID:', campaign.individual)
        if (!user) {
            return res.status(404).json({ info: `user not found` });
        }
       
 
       // Check if the campaign has an individual reference
        if (campaign.npo.toString() !== npoId) { 
            return res.status(403).json({ info: `Unauthorized: You can only update your own campaign/campaigns` });
        }

        // Update the campaign
        campaign.title=title || campaign.title
        campaign.story = story || campaign.story; 
        campaign.subtitle = subtitle || campaign.subtitle;
        await campaign.save();

        return res.status(200).json({ message: `Campaign updated successfully ${user.firstName}`, campaign });
    } catch (error) {
        return res.status(500).json({ error: `Server error: ${error.message}` });
    }
};
