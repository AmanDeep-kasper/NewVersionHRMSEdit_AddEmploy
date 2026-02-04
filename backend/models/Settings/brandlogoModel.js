const mongoose = require('mongoose');

const brandingSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, unique: true },
    logoUrl: { type: String, default: null },
    miniIconUrl: { type: String, default: null },
    footerLogoUrl: { type: String, default: null },
    footerMiniLogoUrl: { type: String, default: null },
    faviconLogoUrl: { type: String, default: null },
}, { timestamps: true });

const Branding = mongoose.model('Branding', brandingSchema);

module.exports = Branding;
