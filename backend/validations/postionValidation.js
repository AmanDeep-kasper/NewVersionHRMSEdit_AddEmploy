
const Joi = require('joi');

const PositionValidation = Joi.object().keys({
    PositionName: Joi.string().max(200).required(),
    CompanyID: Joi.required()
  });

module.exports = {
    PositionValidation,
};
