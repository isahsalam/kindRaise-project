const mongoose=require("mongoose")
const payOutSchema = new mongoose.Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "donation",
     
  },
  BankName: {
    type: String,
    required: true,
    trim: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  beneficiaryName: { 
    type: String,
    trim: true,
  },
  npo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "npo",

  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "campaign",
    
  },
}, { timestamps: true });

const payOutSchemaModel = mongoose.model("payOut", payOutSchema); 
module.exports = payOutSchemaModel;


