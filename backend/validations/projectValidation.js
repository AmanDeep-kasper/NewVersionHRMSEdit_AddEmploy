const Joi = require('joi')

const ProjectValidation = Joi.object().keys({
    _id: Joi.optional(),
    ID: Joi.optional(),
    CreatedBy: Joi.optional(),
    CreatedDate: Joi.optional(),
    Deleted: Joi.optional(),
    EmpFullName: Joi.string().max(200).optional(),
    EstimatedCost: Joi.optional(),
    EstimatedTime: Joi.optional(),
    ModifiedBy: Joi.optional(),
    ModifiedDate: Joi.optional(),
    ProjectDesc: Joi.string().max(2000).optional(),
    ProjectTitle: Joi.string().max(200).required(),
    ProjectURL: Joi.string().max(1000).optional(),
    Remark: Joi.string().max(2000).optional(),
    ResourceID: Joi.optional(),
    Status: Joi.string().max(10).required(),
    portal: Joi.optional(),
    Portal_ID: Joi.optional(),
    TimePeriod: Joi.string().max(20).required(),
    Currency: Joi.string().max(20).required(),
  });

  module.exports = {
    ProjectValidation
  }