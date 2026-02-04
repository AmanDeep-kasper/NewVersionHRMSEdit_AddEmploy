
const Joi = require('joi');

const PortalValidation = Joi.object().keys({
    _id: Joi.optional(),
    ID: Joi.optional(),
    CreatedBy: Joi.optional(),
    CreatedDate: Joi.optional(),
    Deleted: Joi.optional(),
    ModifiedBy: Joi.optional(),
    ModifiedDate: Joi.optional(),
    PortalName: Joi.string().max(200).required(),
    Status: Joi.number().max(1).required()
  });

  
  module.exports = {
    PortalValidation
  }