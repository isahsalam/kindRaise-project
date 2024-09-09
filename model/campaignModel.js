const mongoose = require('mongoose');
const campaignSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    story: String,
    Photo: String,
    Goal: Number,
    raised: Number,
    status: String,
    isSponsored: Boolean,
    sponsoredAt: Date,
    individual: {type: mongoose.Schema.Types.ObjectId, ref: 'individual'},
    npo: {type: mongoose.Schema.Types.ObjectId,ref: 'npo'},  
    donation:{type: mongoose.Schema.Types.ObjectId,ref: 'donation'},  
    supporters:{type:Number} 
}, {timestamps: true});

const CampaignModel = mongoose.model('Campaign', campaignSchema);
module.exports = CampaignModel;
  