const Joi = require('joi');

const CityValidation = Joi.object().keys({
    _id: Joi.optional(),
    StateID: Joi.optional(),
    CityName: Joi.string().max(200).required()
});

module.exports = CityValidation