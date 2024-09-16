const campaignModel = require("../model/campaignModel")
const donationModel=require("../model/donationModel")

const checkCampaignStatus = async (req, res, next) => {
    try {
        // Find all active campaigns
        const activeCampaigns = await campaignModel.find({ status: 'active' });

        for (let campaign of activeCampaigns) {
            // Get the most recent donation for this campaign
            const lastDonation = await donationModel.findOne({ campaign: campaign._id }).sort({ createdAt: -1 });

            if (lastDonation) {
                // Calculate the days since the last donation
                const daysSinceLastDonation = (new Date() - new Date(lastDonation.createdAt)) / (1000 * 60*60*24);

                // If more than 30 days since the last donation, mark the campaign as inactive
             if (daysSinceLastDonation >365) {
                    campaign.status = 'inactive';
                    await campaign.save();
                }
            } 
           else {
                // If no donations at all, calculate days since the campaign's creation
                const daysSinceCreation = (new Date() - new Date(campaign.createdAt)) / (1000*60*60*24);

                // If 30 days without donations, mark as inactive
                if (daysSinceCreation >365) {
                    campaign.status = 'inactive';
                    await campaign.save();
                }
            }
        }

        next();  // Proceed with the next middleware or route handler

    } catch (error) {
        console.error('Error checking campaign statuses:', error);
        res.status(500).json({ error: 'Error checking campaign statuses.' });
    }
};

module.exports = checkCampaignStatus;
