const Joi = require('joi');

const StateValidation = Joi.object().keys({
    _id: Joi.optional(),
    CountryID: Joi.optional(),
    StateName: Joi.string().max(200).required()
});

module.exports = {
    StateValidation,
};
