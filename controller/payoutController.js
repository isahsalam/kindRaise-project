const npoModel=require("../model/npoModel")
const individualModel=require("../model/individualModel")
const donationModel = require("../model/donationModel")
const campaignModel=require("../model/campaignModel")
const payOutSchemaModel=require("../model/payOutModel")
exports.createPayOuts = async (req, res) => {
    try {
      const { donation, BankName, accountNumber, beneficiaryName, npo, campaign } = req.body;
  
    
      const accountNumStr = String(accountNumber);  
      if (accountNumStr.length !== 10) {
        return res.status(400).json({
          success: false,
          message: "Account number must be exactly 10 digits",
        });
      }
  
      // If beneficiaryName is not provided, set it to 'N/A'
      const beneficiary = beneficiaryName || "N/A";
  
      // Create a new payout
      const newPayOut = new payOutSchemaModel({
        donation,
        BankName,
        accountNumber,
        beneficiaryName: beneficiary,  // Use the default if necessary
        npo,
        campaign,
      });
  
      await newPayOut.save();
  
      return res.status(201).json({
        success: true,
        message: "Payout created successfully",
        payout: newPayOut,
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to create payout",
        error: error.message,
      });
    }
  };
  
  exports.createPayOut = async (req, res) => {
    try {
        const { donation, BankName, accountNumber, beneficiaryName } = req.body;

        const accountNumStr = String(accountNumber);  
        if (accountNumStr.length !== 10) {
            return res.status(400).json({
                success: false,
                message: "Account number must be exactly 10 digits",
            });
        }

        const npoId = req.user._id; 
        const campaignData = await campaignModel.findOne({ npo: npoId }); 

        if (!campaignData) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }


        const isCampaignCreator = (campaignData.npo && campaignData.npo.toString() === npoId.toString())
                                  
        if (!isCampaignCreator) {
            return res.status(403).json({
                success: false,
                message: "Only the campaign creator can initiate a payout",
            });
        }

        // Check if the campaign has raised any donations
        const totalDonations = await donationModel.aggregate([
            { $match: { campaign: campaignData._id } },
            { $group: { _id: "$campaign", total: { $sum: "$amount" } } }
        ]);

        if (totalDonations.length === 0 || totalDonations[0].total === 0) {
            return res.status(400).json({
                success: false,
                message: "No funds raised for this campaign",
            });
        }

        // If beneficiaryName is not provided, set it to 'N/A'
        const beneficiary = beneficiaryName || "N/A";

        // Create a new payout
        const newPayOut = new payOutSchemaModel({
            donation,
            BankName,
            accountNumber,
            beneficiaryName: beneficiary,
            npo: npoId,
            campaign: campaignData._id,
        });

        await newPayOut.save();

        return res.status(201).json({
            success: true,
            message: "Payout created successfully",
            payout: newPayOut,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create payout",
            error: error.message,
        });
    }
};


