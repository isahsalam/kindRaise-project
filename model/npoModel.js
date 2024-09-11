const mongoose = require('mongoose');

// NPO Schema
const npoSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    organizationName: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    role: { type: String, enum: ['npo', 'admin'],default: 'npo' },
    blackList: [{ type: String }],
    campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
   // individual: [{ type: mongoose.Schema.Types.ObjectId, ref: 'individual' }],
    totalRaised: { type: Number, default: 0 },
    profilePicture: {
        pictureId: { type: String },
        pictureUrl: { type: String } 
    }
}, { timestamps: true });

const npoModel = mongoose.model('npo', npoSchema);
module.exports = npoModel;



