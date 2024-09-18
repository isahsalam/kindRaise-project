const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true 
  },
  name: {
    type: String,
    default: 'anonymous'
  },
  email: {
    type: String,
    required: true
    
},
// paymentMethod: {
//   type: String,
//   default: 'Kora_pay',
//   required:true
// },

  message: {
    type: String,
    required: false
  },

  // month: { 
  //   type: Date,

  // },
  // state: {
  //   type: String,
  //   required: true
  // },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign"
  },
  individual: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "individual"
  },
  npo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "npo"
  },

}, { timestamps: true });



const donationModel = mongoose.model('donation', donationSchema);
module.exports = donationModel;
