const Joi = require("joi");

const FamilyInfoValidation = Joi.object({
  Name: Joi.string().max(200).required(),
  Relationship: Joi.string().max(200).required(),
  Occupation: Joi.string().max(200).required(),
  DOB: Joi.date().iso().max('now').required()
    .error(new Error("DOB must be a valid past date.")),
  parentMobile: Joi.string()
    .regex(/^[0-9]{10}$/)
    .required()
    .error(new Error("Mobile number must be exactly 10 digits long.")),
  user: Joi.string().length(24).hex().required(),
  createdBy: Joi.string().length(24).hex().allow(null),
  updatedBy: Joi.string().length(24).hex().allow(null),
});



module.exports = {
  FamilyInfoValidation,
};
