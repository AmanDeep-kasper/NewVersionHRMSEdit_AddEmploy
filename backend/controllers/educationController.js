const Joi = require("joi");
const { EducationValidation } = require("../validations/educationValidation");
const { Education } = require("../models/educationModel");
const { Employee } = require("../models/employeeModel");

const getAllEducation = async (req, res) => {
  Employee.findById(req.params.id)
    .populate({
      path: "education",
    })
    .select("FirstName LastName MiddleName")
    .exec(function (err, employee) {
      res.send(employee);
    });
};

const createEducation = async (req, res) => {
  try {
    // Validate request body
    const { error } = EducationValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find Employee
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Create Education object
    const newEducation = new Education({
      SchoolUniversity: req.body.SchoolUniversity,
      Degree: req.body.Degree,
      Grade: req.body.Grade,
      PassingOfYear: req.body.PassingOfYear,
      employeeObjID: req.body.employeeObjID,
      createdBy: req.body.createdBy,
      updatedBy: req.body.updatedBy || null,
    });

    // Save Education document
    const education = await newEducation.save();

    // Push education reference to employee
    employee.education.push(education._id);
    await employee.save();

    res
      .status(201)
      .json({ message: "Education added successfully", education });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// find and update the city
const updateEducation = async (req, res) => {
  try {
    // Validate request body
    const { error } = EducationValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Update Education
    const updatedEducation = await Education.findByIdAndUpdate(
      req.params.id,
      {
        SchoolUniversity: req.body.SchoolUniversity,
        Degree: req.body.Degree,
        Grade: req.body.Grade,
        PassingOfYear: req.body.PassingOfYear,
        employeeObjID: req.body.employeeObjID,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy || null,
      },
      { new: true, runValidators: true }
    );

    // Check if Education exists
    if (!updatedEducation) {
      return res.status(404).json({ error: "Education record not found" });
    }

    res.status(200).json({
      message: "Education updated successfully",
      updatedEducation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// find and delete the city
const deleteEducation = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
    if (err) {
      res.send("error");
    } else {
      Education.findByIdAndRemove(
        { _id: req.params.id2 },
        function (err, education) {
          if (!err) {
            Employee.update(
              { _id: req.params.id },
              { $pull: { education: req.params.id2 } },
              function (err, numberAffected) {
                res.send(education);
              }
            );
          } else {
            res.send("error");
          }
        }
      );
    }
  });
};

module.exports = {
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation,
};
