const Joi = require('joi');

const DepartmentValidation = Joi.object().keys({
    DepartmentName: Joi.string().max(200).required(),
    CompanyID: Joi.required()
  });

module.exports = DepartmentValidation