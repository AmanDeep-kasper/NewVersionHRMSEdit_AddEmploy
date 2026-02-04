const Joi = require('joi');

const RoleValidation = Joi.object().keys({
  RoleName: Joi.string().max(200).required(),
  CompanyID: Joi.required()
});

module.exports = {
    RoleValidation,
};
