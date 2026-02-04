
const Joi = require('joi');

const CompanyValidation = Joi.object().keys({
  _id: Joi.optional(),
  CityID: Joi.optional(),
  CompanyName: Joi.string().max(200).required(),
  Address: Joi.string().max(2000).required(),
  PostalCode: Joi.number().max(999999).required(),
  Website: Joi.string().max(2000).required(),
  Email: Joi.string().max(1000).required(),
  ContactPerson: Joi.string().max(200).required(),
  ContactNo: Joi.string().max(10).required(),
  FaxNo: Joi.string().max(100),
  PanNo: Joi.string().max(200).required(),
  GSTNo: Joi.string().max(200).required(),
  CINNo: Joi.string().max(200).required(),
  Deleted: Joi.optional()
});

module.exports = CompanyValidation;