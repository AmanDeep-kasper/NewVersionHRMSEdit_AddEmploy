const Joi = require("joi");

const SalaryValidation = Joi.object().keys({
  BasicSalary: Joi.number().required(),
  HRASalary: Joi.number().required(),
  ConvenyanceAllowance: Joi.number().required(),
  otherAllowance: Joi.number().required(),
  totalSalary: Joi.number().required(),
});

module.exports = {
  SalaryValidation,
};
