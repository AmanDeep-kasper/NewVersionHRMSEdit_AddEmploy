const Joi = require('joi');
const { Role } = require('../models/roleModel');
const { RoleValidation } = require('../validations/roleValidetion');
const { Employee } = require("../models/employeeModel");


const getAllRole = async(req, res) => {
    Role.find().populate("company").exec(function (err, role) {
        res.send(role);
      });
}

const createRole = async(req, res) => {
    Joi.validate(req.body, RoleValidation, (err, result) => {
        if (err) {

          res.status(400).send(err.details[0].message);
        } else {
          let newRole;
    
          newRole = {
            RoleName: req.body.RoleName,
            company: req.body.CompanyID
          };
    
          Role.create(newRole, function (err, role) {
            if (err) {
    
              res.send("error");
            } else {
              res.send(role);
            }
          });
        }
      });
}

const deleteRole = async(req, res) => {
    Employee.find({ role: req.params.id }, function (err, r) {
        if (err) {

          res.send(err);
        } else {
          if (r.length == 0) {
            Role.findByIdAndRemove({ _id: req.params.id }, function (err, role) {
              if (!err) {
                res.send(role);
              } else {
                
                res.send("err");
              }
            });
            
          } else {
            res
              .status(403)
              .send(
                "This role is associated with Employee so you can not delete this"
              );
          }
        }
      }); 
}

const updateRole = async(req, res) => {
    Joi.validate(req.body, RoleValidation, (err, result) => {
        if (err) {

          res.status(400).send(err.details[0].message);
        } else {
          let updateRole;
    
          updateRole = {
            RoleName: req.body.RoleName,
            company: req.body.CompanyID
          };
    
          Role.findByIdAndUpdate(req.params.id, updateRole, function (err, role) {
            if (err) {
              res.send("error");
            } else {
              res.send(updateRole);
            }
          });
        }

      });
}


module.exports = {
    getAllRole,
    createRole,
    deleteRole,
    updateRole
}