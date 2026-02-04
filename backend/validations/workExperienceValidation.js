const Joi = require("joi");

const WorkExperienceValidation = Joi.object().keys({
  CompanyName: Joi.string().max(200).required(),
  Designation: Joi.string().max(200).required(),
  FromDate: Joi.date().required(),
  ToDate: Joi.date().required(),
});

module.exports = {
  WorkExperienceValidation,
};
