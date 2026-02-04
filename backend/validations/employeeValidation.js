const Joi = require("joi");

const EmployeeValidation = Joi.object().keys({
  RoleID: Joi.optional(),
  PositionID: Joi.optional(),
  DepartmentID: Joi.optional(),
  SalaryID: Joi.optional(),
  FirstName: Joi.string().max(200).required(),
  reportManager: Joi.optional(),
  LastName: Joi.string().max(200).required(),
  Email: Joi.string().max(200).required(),
  Password: Joi.string().max(100).required(),
  Gender: Joi.string().max(100).required(),
  DOB: Joi.date().required(),
  DateOfJoining: Joi.date().required(),
  TerminateDate: Joi.date().optional(),
  Deleted: Joi.optional(),
  Photo: Joi.optional(),
  ContactNo: Joi.string().max(20).required(),
  Account: Joi.number().max(3).required(),
});

const EmployeeValidationUpdate = Joi.object().keys({
  RoleID: Joi.optional(),
  PositionID: Joi.optional(),
  DepartmentID: Joi.optional(),
  SalaryID: Joi.optional(),
  FirstName: Joi.string().max(200).required(),
  reportManager: Joi.optional(),
  LastName: Joi.string().max(200).required(),
  Email: Joi.string().max(200).required(),
  Gender: Joi.string().max(100).required(),
  DOB: Joi.date().required(),
  DateOfJoining: Joi.date().required(),
  TerminateDate: Joi.date().optional(),
  Deleted: Joi.optional(),
  Photo: Joi.optional(),
  ContactNo: Joi.string().max(20).required(),
  // EmployeeCode: Joi.string().max(100).required(),
  Account: Joi.number().max(3).required(),
});

const EmployeePersonalInfoValidation = Joi.object().keys({
  BloodGroup: Joi.string().optional(),
  DOB: Joi.date().optional(),

  ContactNo: Joi.string().max(20).required(),
  // Email: Joi.string().max(200).required(),
  EmergencyContactNo: Joi.string().max(20).required(),
  Gender: Joi.string().max(100).optional(),
  Hobbies: Joi.string().max(1000).optional(),
  PANcardNo: Joi.string().max(50).required(),
  PermanetAddress: Joi.string().max(200).optional(),
  PresentAddress: Joi.string().max(200).optional(),
  presonalEmail: Joi.string().max(200).optional(),
});

module.exports = {
  EmployeeValidation,
  EmployeePersonalInfoValidation,
  EmployeeValidationUpdate,
};
