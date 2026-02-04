const path = require('path');
const fs = require('fs');
const Company = require('../../models/companyModel');
const Branding = require('../../models/Settings/brandlogoModel');
const { uplodeImagesCloudinary, cloudinaryFileUploder, removeCloudinaryImage } = require('../../cloudinary/cloudinaryFileUpload');

// Upload branding (logo, mini icon, footer logo, footer mini logo, favicon) and attach/update Branding and Company
const uploadBranding = async (req, res) => {
    try {
        const files = req.files || {};
        const companyId = req.body.companyId;

        let company = null;
        if (companyId) company = await Company.findById(companyId);
        if (!company) company = await Company.findOne();
        if (!company) return res.status(404).json({ message: 'No company found to attach branding' });

        const uploadDir = path.join(__dirname, '..', 'employee_profile', 'branding');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        let logoUrl = null;
        let miniIconUrl = null;
        let footerLogoUrl = null;
        let footerMiniLogoUrl = null;
        let faviconLogoUrl = null;

        // Helper function to upload file
        const uploadFile = async (fileArray, fieldName) => {
            if (fileArray && fileArray[0]) {
                const file = fileArray[0];
                const dest = path.join(uploadDir, Date.now() + '-' + file.originalname);
                fs.renameSync(file.path, dest);
                try {
                    const uploaded = await uplodeImagesCloudinary(dest);
                    if (uploaded && uploaded.image_url) {
                        return uploaded.image_url;
                    } else {
                        return `/employee_profile/branding/${path.basename(dest)}`;
                    }
                } catch (err) {
                    console.error(`Cloudinary upload failed for ${fieldName}, falling back to local file`, err);
                    return `/employee_profile/branding/${path.basename(dest)}`;
                }
            }
            return null;
        };

        // Upload each file field
        if (files.logo && files.logo[0]) logoUrl = await uploadFile(files.logo, 'logo');
        if (files.miniIcon && files.miniIcon[0]) miniIconUrl = await uploadFile(files.miniIcon, 'miniIcon');
        if (files.footerLogo && files.footerLogo[0]) footerLogoUrl = await uploadFile(files.footerLogo, 'footerLogo');
        if (files.footerMiniLogo && files.footerMiniLogo[0]) footerMiniLogoUrl = await uploadFile(files.footerMiniLogo, 'footerMiniLogo');
        if (files.faviconLogo && files.faviconLogo[0]) faviconLogoUrl = await uploadFile(files.faviconLogo, 'faviconLogo');

        // Keep legacy fields on Company doc
        // if (logoUrl) company.logoUrl = logoUrl;
        // if (miniIconUrl) company.miniIconUrl = miniIconUrl;
        // await company.save();
        // ✅ PARTIAL UPDATE – NO VALIDATION
        const companyUpdate = {};

        if (logoUrl) companyUpdate.logoUrl = logoUrl;
        if (miniIconUrl) companyUpdate.miniIconUrl = miniIconUrl;

        if (Object.keys(companyUpdate).length > 0) {
            await Company.updateOne(
                { _id: company._id },
                { $set: companyUpdate },
                { runValidators: false } // 🔥 COMPANY VALIDATION IGNORED
            );
        }


        // upsert into Branding collection with all fields
        // Only update fields that have new values; preserve existing values
        const updateData = {
            company: company._id,
        };

        if (logoUrl) updateData.logoUrl = logoUrl;
        if (miniIconUrl) updateData.miniIconUrl = miniIconUrl;
        if (footerLogoUrl) updateData.footerLogoUrl = footerLogoUrl;
        if (footerMiniLogoUrl) updateData.footerMiniLogoUrl = footerMiniLogoUrl;
        if (faviconLogoUrl) updateData.faviconLogoUrl = faviconLogoUrl;

        const branding = await Branding.findOneAndUpdate(
            { company: company._id },
            updateData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({ message: 'Branding updated', branding });
    } catch (err) {
        console.error('uploadBranding error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get branding for a specific company (companyId optional)
const getBranding = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        let company = null;
        if (companyId) company = await Company.findById(companyId);
        if (!company) company = await Company.findOne();
        if (!company) return res.status(404).json({ message: 'No company found' });

        // try branding collection
        let branding = await Branding.findOne({ company: company._id }).populate('company', 'CompanyName');
        if (!branding) {
            // migrate from legacy fields if present
            branding = await Branding.findOneAndUpdate(
                { company: company._id },
                { company: company._id, logoUrl: company.logoUrl || null, miniIconUrl: company.miniIconUrl || null },
                { upsert: true, new: true }
            );
            branding = await Branding.findById(branding._id).populate('company', 'CompanyName');
        }

        return res.status(200).json({ branding });
    } catch (err) {
        console.error('getBranding error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all brandings with company populated
const getAllBranding = async (req, res) => {
    try {
        const brandings = await Branding.find().populate('company', 'CompanyName');
        // if none exist, try to create from companies
        if (!brandings || brandings.length === 0) {
            const companies = await Company.find();
            const created = [];
            for (const c of companies) {
                const b = await Branding.findOneAndUpdate(
                    { company: c._id },
                    { company: c._id, logoUrl: c.logoUrl || null, miniIconUrl: c.miniIconUrl || null },
                    { upsert: true, new: true }
                );
                // populate
                const populated = await Branding.findById(b._id).populate('company', 'CompanyName');
                created.push(populated);
            }
            return res.status(200).json({ brandings: created });
        }

        return res.status(200).json({ brandings });
    } catch (err) {
        console.error('getAllBranding error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { uploadBranding, getBranding, getAllBranding };
