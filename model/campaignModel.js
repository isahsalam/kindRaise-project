const mongoose = require('mongoose');
const campaignSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    story: String,
    Goal: Number,
    profilePic: { type: String,required:true },
    totalRaised:{type:Number,default:0},
    monthlyDonation:{type:Number,default:0},
    lastDonationDate:{type:Date},
    status: {type:String,enum:['active','inactive'],default:'active'},
    isSponsored: Boolean,
    sponsoredAt: Date,
    individual: {type: mongoose.Schema.Types.ObjectId, ref: 'individual'},
    npo: {type: mongoose.Schema.Types.ObjectId,ref: 'npo'},  
    donation:{type: mongoose.Schema.Types.ObjectId,ref: 'donation'},  
    supporters:{type:Number,default:0} 
}, {timestamps: true});

campaignSchema.virtual('lastDonationMonth').get(function() {
    if (this.lastDonationDate) {
        return new Date(this.lastDonationDate).toLocaleString('en-US', { month: 'short' });
    }
    return null; 
});

  
  campaignSchema.set('toJSON', { virtuals: true });
  campaignSchema.set('toObject', { virtuals: true });

const CampaignModel = mongoose.model('Campaign', campaignSchema);
module.exports = CampaignModel;
  