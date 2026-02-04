const Joi = require("joi");

const EducationValidation = Joi.object({
  SchoolUniversity: Joi.string().max(200).trim().required(),
  Degree: Joi.string().max(200).trim().required(),
  Grade: Joi.string().max(50).trim().required(),
  PassingOfYear: Joi.alternatives()
    .try(
      Joi.string()
        .regex(/^\d{4}(-\d{2})?$/)
        .max(10), // Allows "2025" or "2024-25"
      Joi.number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear() + 10) // Ensures a valid year
    )
    .required(),
  employeeObjID: Joi.string().hex().length(24).required(),
  createdBy: Joi.string().hex().length(24).optional(),
  updatedBy: Joi.string().hex().length(24).optional(),
});

module.exports = {
  EducationValidation,
};
