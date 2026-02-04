const { Position } = require("../models/positionModel");
const Joi = require('joi');
const { PositionValidation } = require("../validations/postionValidation");
const { Employee } = require("../models/employeeModel");



const getAllEmployerPosition = async(req, res) => {
    Position.find().populate("company").exec(function (err, role) {
        res.send(role);
      });
}

const createEmployerPosition = async(req, res) => {
    Joi.validate(req.body, PositionValidation, (err, result) => {
        if (err) {
          res.status(400).send(err.details[0].message);
        } else {
          let newPosition;
    
          newPosition = {
            PositionName: req.body.PositionName,
            company: req.body.CompanyID
          };
    
          Position.create(newPosition, function (err, position) {
            if (err) {
              res.send("error");
            } else {
              res.send(position);
             
            }
          });
        }
      });
}

const deleteEmployerPosition = async(req, res) => {
    Employee.find({ position: req.params.id }, function (err, p) {
        if (err) {
          res.send(err);
        } else {
          if (p.length == 0) {
            Position.findByIdAndRemove({ _id: req.params.id }, function (
              err,
              position
            ) {
              if (!err) {
                res.send(position);
              } else {
                res.send("err");
              }
            });
          } else {
            res
              .status(403)
              .send(
                "This Position is associated with Employee so you can not delete this"
              );
          }
        }
      });
}

const updateEmployerPosition = async(req, res) => {
    Joi.validate(req.body, PositionValidation, (err, result) => {
        if (err) {
          res.status(400).send(err.details[0].message);
        } else {
          let updatePosition;
    
          updatePosition = {
            PositionName: req.body.PositionName,
            company: req.body.CompanyID
          };
    
          Position.findByIdAndUpdate(req.params.id, updatePosition, function (
            err,
            position
          ) {
            if (err) {
              res.send("error");
            } else {
              res.send(updatePosition);
            }
          });
        }
      });
}


module.exports = {
    getAllEmployerPosition,
    createEmployerPosition,
    deleteEmployerPosition,
    updateEmployerPosition
}