const Company = require("../models/companyModel");
const Branding = require("../models/Settings/brandlogoModel");

// Create company
const createCompany = async (req, res) => {
  try {
    const newCompany = {
      CompanyName: req.body.CompanyName,
      Address: req.body.Address,
      city: req.body.CityID,
      PostalCode: req.body.PostalCode,
      Website: req.body.Website,
      Email: req.body.Email,
      ContactPerson: req.body.ContactPerson,
      ContactNo: req.body.ContactNo,
      FaxNo: req.body.FaxNo,
      PanNo: req.body.PanNo,
      GSTNo: req.body.GSTNo,
      CINNo: req.body.CINNo,
    };

    const company = await Company.create(newCompany);
    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all companies (include branding if available)
const getAllCompanyDetails = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate({
        path: "city",
        populate: {
          path: "state",
          model: "State",
          populate: {
            path: "country",
            model: "Country",
          },
        },
      });

    // Attach branding info (logoUrl, miniIconUrl) from Branding collection when present
    const companiesWithBranding = await Promise.all(
      companies.map(async (c) => {
        const branding = await Branding.findOne({ company: c._id });
        const companyObj = c.toObject ? c.toObject() : { ...c };
        if (branding) {
          companyObj.logoUrl = branding.logoUrl || companyObj.logoUrl || null;
          companyObj.miniIconUrl = branding.miniIconUrl || companyObj.miniIconUrl || null;
        }
        return companyObj;
      })
    );

    res.status(200).json(companiesWithBranding);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update company
const updateCompanyDtails = async (req, res) => {
  try {
    const updatedCompany = {
      CompanyName: req.body.CompanyName,
      Address: req.body.Address,
      city: req.body.CityID,
      PostalCode: req.body.PostalCode,
      Website: req.body.Website,
      Email: req.body.Email,
      ContactPerson: req.body.ContactPerson,
      ContactNo: req.body.ContactNo,
      FaxNo: req.body.FaxNo,
      PanNo: req.body.PanNo,
      GSTNo: req.body.GSTNo,
      CINNo: req.body.CINNo,
    };

    const company = await Company.findByIdAndUpdate(req.params.id, updatedCompany, { new: true });
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete company
const deleteCompanyDetails = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get single company by id with branding merged
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate({
        path: "city",
        populate: {
          path: "state",
          model: "State",
          populate: {
            path: "country",
            model: "Country",
          },
        },
      });
    if (!company) return res.status(404).json({ message: "Company not found" });

    const companyObj = company.toObject ? company.toObject() : { ...company };
    const branding = await Branding.findOne({ company: company._id });
    if (branding) {
      companyObj.logoUrl = branding.logoUrl || companyObj.logoUrl || null;
      companyObj.miniIconUrl = branding.miniIconUrl || companyObj.miniIconUrl || null;
    }

    return res.status(200).json({ success: true, data: companyObj });
  } catch (error) {
    console.error("Error fetching company by id:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createCompany,
  getAllCompanyDetails,
  updateCompanyDtails,
  deleteCompanyDetails,
  getCompanyById,
};
