const Joi = require("joi");

const CountryValidation = Joi.object({
  CountryName: Joi.string().required().label("Country Name"),
});


module.exports = {
    CountryValidation,
};
