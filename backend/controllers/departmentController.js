const Joi = require("joi");
const Department = require("../models/departmentModel");
const DepartmentValidation = require("../validations/departmentValideton");
const { Employee } = require("../models/employeeModel");

const getAllDepartment = async (req, res) => {
  Department.find()
    .populate("company")
    .exec(function (err, employees) {
      res.send(employees);
    });
};
const getAllDepartmentOnly = async (req, res) => {
  Department.find().select("_id DepartmentName")
    .exec(function (err, employees) {
      res.send(employees);
    });
};

const createDepartment = async (req, res) => {
  Joi.validate(req.body, DepartmentValidation, (err, result) => {
    if (err) {
      res.status(400).send(err.details[0].message);
    } else {
      let newDepartment;

      newDepartment = {
        DepartmentName: req.body.DepartmentName,
        company: req.body.CompanyID,
      };

      Department.create(newDepartment, function (err, department) {
        if (err) {
          res.send("error");
        } else {
          res.send(department);
        }
      });
    }
  });
};

const deleteDepartment = async (req, res) => {
  Employee.find({ department: req.params.id }, function (err, d) {
    if (err) {
      res.send(err);
    } else {
      if (d.length == 0) {
        Department.findByIdAndRemove(
          { _id: req.params.id },
          function (err, department) {
            if (!err) {
              res.send(department);
              // });
            } else {
              res.send("err");
            }
          }
        );
      } else {
        res
          .status(403)
          .send(
            "This department is associated with Employee so you can not delete this"
          );
      }
    }
  });
};

const updateDepartment = async (req, res) => {
  Joi.validate(req.body, DepartmentValidation, (err, result) => {
    if (err) {
      res.status(400).send(err.details[0].message);
    } else {
      let updateDepartment;

      updateDepartment = {
        DepartmentName: req.body.DepartmentName,
        company: req.body.CompanyID,
      };

      Department.findByIdAndUpdate(
        req.params.id,
        updateDepartment,
        function (err, department) {
          if (err) {
            res.send("error");
          } else {
            res.send(updateDepartment);
          }
        }
      );
    }
  });
};

module.exports = {
  getAllDepartment,
  createDepartment,
  deleteDepartment,
  updateDepartment,
  getAllDepartmentOnly,
};
