const campaignModel = require("../model/campaignModel")
const individualModel = require("../model/individualModel")
const npoModel = require("../model/npoModel")
const messageModel=require("../model/messageModel")
const sendmail=require("../helpers/html")
const donationModel = require("../model/donationModel")

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
       
       

        const newCampaign = new campaignModel({ 
            title,
            subtitle,
            story,
            
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
            message: `Here are all campaigns created by ${user.firstName}`, 
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

// exports.NpoManagement=async(req,res)=>{
//     try {
//         const {donorId}=req.params
//         const {campaignId,message}=req.body

//         const donor=await donationModel.findOne({_id:donorId,campaign:campaignId})
//         if(!donor){
//             return res.status(404).json({message:`donor not found`})
//         }
//         if(donor.campaign.toString()!==campaignId){
//             return res.status(400).json({info:`hey,no recent donation has been made to your campaign,you can send to your old donors anyways`})
//         }
//         let Individualreceiver=donor.npo ?donor.npo:null
//         let Nporeceiver=donor.individual ?donor.individual:null
 
//         const Npomanagement= new messageModel({
//             campaign:campaignId,
//             donor:donorId,
//             campaignCreator:campaign.npo,
//             Nporeceiver:Nporeceiver,
//             Individualreceiver:Individualreceiver,
//             message
//         })
//         await Npomanagement.save()
//         const donorEmail=donor.email
//         await sendmail({
//             email:donorEmail,
//             subject:"message from the campaign you donated to",
//             html:`<p>${message}</p>`
//         })
//         res.status(200).json({message:`campaign creator successully send message`})
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({message:`can not send message because ${error}`})
//     }
// 