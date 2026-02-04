const Joi = require("joi");
const { Employee } = require("../models/employeeModel");
const { FamilyInfo } = require("../models/familyModel");
const { FamilyInfoValidation } = require("../validations/familyValidation");

// Fetch all family members of an employee
const getAllFamily = async (req, res) => {
  try {
    const { id } = req.params;

    const familyInfo = await FamilyInfo.find({ user: id });
    if (!familyInfo) {
      return res.status(404).json({ message: "No family details found" });
    }

    res.status(200).json({ familyInfo });
  } catch (error) {
    console.error("Error fetching family info:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new family member
const createFamily = async (req, res) => {
  try {
    const { error } = FamilyInfoValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { Name, Relationship, DOB, Occupation, parentMobile, createdBy, user } = req.body;

    // Check for duplicates
    const duplicate = await FamilyInfo.findOne({
      $or: [
        { Name, createdBy },
        { Relationship, createdBy },
        { parentMobile, createdBy }
      ]
    });

    const existingName = await FamilyInfo.findOne({ Name, createdBy });
    if (existingName) {
      return res.status(409).json({ message: "Name already exists" });
    }

    const existingRelation = await FamilyInfo.findOne({ Relationship, createdBy });
    if (existingRelation) {
      return res.status(409).json({ message: "Relationship already exists" });
    }

    const existingContact = await FamilyInfo.findOne({ parentMobile, createdBy });
    if (existingContact) {
      return res.status(409).json({ message: "Contact number already exists" });
    }


    const newFamilyMember = new FamilyInfo({
      Name,
      Relationship,
      DOB,
      Occupation,
      parentMobile,
      createdBy,
      user,
    });

    const savedRecord = await newFamilyMember.save();
    res.status(201).json({ message: "Family member added", data: savedRecord });

  } catch (error) {
    res.status(500).json({ message: "Error creating family record", error });
  }
};

// Update family member details
const updateFamily = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const updateData = req.body;
    console.log(req.params);
    

    const updatedRecord = await FamilyInfo.findOneAndUpdate(
      { user: id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Family member not found" });
    }

    res.status(200).json({
      message: "Family record updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating family record:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a family member
const deleteFamily = async (req, res) => {
  try {
    const familyInfo = await FamilyInfo.findByIdAndRemove(req.params.id2);
    if (!familyInfo) {
      return res.status(404).json({ message: "Family member not found" });
    }

    res.status(200).json({ message: "Family member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting family record", error });
  }
};

module.exports = {
  getAllFamily,
  createFamily,
  updateFamily,
  deleteFamily,
};
