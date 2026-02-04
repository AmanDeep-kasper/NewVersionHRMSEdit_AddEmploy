const Joi = require("joi");
const { Employee } = require("../models/employeeModel");
const WorkExperience = require("../models/workExperienceModle");
const {
  WorkExperienceValidation,
} = require("../validations/workExperienceValidation");

const getAllWorkExperience = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate({
        path: "workExperience",
      })
      .select("FirstName LastName MiddleName");

    if (!employee) {
      const error = new Error("Employee not found");
      error.status = 404;
      throw error;
    }

    res.status(200).send(employee);
  } catch (err) {
    next(err); // Forward the error to the error-handling middleware
  }
};

const createWorkExperience = async (req, res, next) => {
  try {

    const { error } = Joi.validate(req.body, WorkExperienceValidation);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      const err = new Error("Employee not found");
      err.status = 404;
      throw err;
    }

    // Prevent duplicate work experience for same employee
    const duplicate = await WorkExperience.findOne({
      CompanyName: req.body.CompanyName,
      Designation: req.body.Designation,
      FromDate: req.body.FromDate,
      ToDate: req.body.ToDate
    });
    if (duplicate && employee.workExperience.includes(duplicate._id)) {
      return res.status(409).send("Duplicate work experience entry not allowed.");
    }

    // Calculate duration between FromDate and ToDate
    const fromDate = new Date(req.body.FromDate);
    const toDate = new Date(req.body.ToDate);

    if (fromDate > toDate) {
      return res
        .status(400)
        .send("Invalid date range: FromDate cannot be later than ToDate");
    }

    const diffTime = Math.abs(toDate - fromDate);
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30)); // Approximate conversion to months
    const diffYears = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;

    const durationStr =
      diffYears > 0
        ? `${diffYears} year(s) and ${remainingMonths} month(s)`
        : `${remainingMonths} month(s)`;

    const newWorkExperience = {
      CompanyName: req.body.CompanyName,
      Designation: req.body.Designation,
      FromDate: req.body.FromDate,
      ToDate: req.body.ToDate,
      Duration: durationStr, // Add calculated duration to the document
    };

    const workExperience = await WorkExperience.create(newWorkExperience);
    employee.workExperience.push(workExperience);
    await employee.save();

    res.status(201).send(workExperience);
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
};
const updateWorkExperience = async (req, res, next) => {
  try {
    const { error } = Joi.validate(req.body, WorkExperienceValidation);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const fromDate = new Date(req.body.FromDate);
    const toDate = new Date(req.body.ToDate);

    if (fromDate > toDate) {
      return res
        .status(400)
        .send("Invalid date range: FromDate cannot be later than ToDate");
    }

    const diffTime = Math.abs(toDate - fromDate);
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30)); // Approximate conversion to months
    const diffYears = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;

    const durationStr =
      diffYears > 0
        ? `${diffYears} year(s) and ${remainingMonths} month(s)`
        : `${remainingMonths} month(s)`;

    const newWorkExperience = {
      CompanyName: req.body.CompanyName,
      Designation: req.body.Designation,
      FromDate: req.body.FromDate,
      ToDate: req.body.ToDate,
      Duration: durationStr, // Add the calculated duration to the updated document
    };

    const workExperience = await WorkExperience.findByIdAndUpdate(
      req.params.id2, // Assuming this refers to the work experience ID
      newWorkExperience,
      { new: true } // To return the updated document
    );

    if (!workExperience) {
      const error = new Error("Work experience not found");
      error.status = 404;
      throw error;
    }

    res.status(200).send(workExperience);
  } catch (err) {
    next(err);
  }
};

const deleteWorkExperience = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      const error = new Error("Employee not found");
      error.status = 404;
      throw error;
    }

    const workExperience = await WorkExperience.findByIdAndRemove(
      req.params.id2
    );

    if (!workExperience) {
      const error = new Error("Work experience not found");
      error.status = 404;
      throw error;
    }

    await Employee.update(
      { _id: req.params.id },
      { $pull: { workExperience: req.params.id2 } }
    );

    res.status(200).send(workExperience);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllWorkExperience,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
};
