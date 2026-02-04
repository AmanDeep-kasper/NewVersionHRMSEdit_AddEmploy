const Joi = require('joi');
const City = require('../models/cityModel');
const CityValidation = require('../validations/cityValidation');
const State = require('../models/stateModel');
const Company = require('../models/companyModel');


// // get all citys 

const getAllcity = async (req, res, next) => {
  try {
    const cities = await City.find()
      .populate({ path: "state", populate: { path: "country" } })
      .exec();
    res.status(200).json(cities);
  } catch (err) {
    next(err);  // Pass the error to the error handling middleware
  }
};

// create a city 
// const createCity = async (req, res, next) => {
//   try {
//     const { error } = Joi.validate(req.body, CityValidation);
//     if (error) {
//       throw new Error(error.details[0].message);
//     }

//     const newCity = {
//       CityName: req.body.CityName,
//       state: req.body.StateID
//     };

//     const city = await City.create(newCity);
//     const state = await State.findById(req.body.StateID);

//     if (!state) {
//       throw new Error("State not found");
//     }

//     state.cities.push(city);
//     await state.save();

//     res.status(201).json(city);
//   } catch (err) {
//     next(err);  // Pass the error to the error handling middleware
//   }
// };
// ...existing code...

const createCity = async (req, res, next) => {
  try {
    const { error } = Joi.validate(req.body, CityValidation);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check for duplicate city name (case-insensitive)
    const existingCity = await City.findOne({ CityName: { $regex: `^${req.body.CityName}$`, $options: 'i' } });
    if (existingCity) {
      return res.status(409).json({ message: "City name already exists. Please enter a unique city name." });
    }

    const newCity = {
      CityName: req.body.CityName,
      state: req.body.StateID
    };

    const city = await City.create(newCity);
    const state = await State.findById(req.body.StateID);

    if (!state) {
      throw new Error("State not found");
    }

    state.cities.push(city);
    await state.save();

    res.status(201).json(city);
  } catch (err) {
    next(err);  // Pass the error to the error handling middleware
  }
};

// ...existing code...

// find and update the city 
const updateCity = async (req, res, next) => {
  try {
    const { error } = Joi.validate(req.body, CityValidation);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const updatedCity = {
      CityName: req.body.CityName,
      state: req.body.StateID
    };

    const city = await City.findByIdAndUpdate(req.params.id, updatedCity, { new: true });

    if (!city) {
      throw new Error("City not found");
    }

    res.status(200).json(city);
  } catch (err) {
    next(err);  // Pass the error to the error handling middleware
  }
};

// Delete a city
const deleteCity = async (req, res, next) => {
  try {
    const companies = await Company.find({ city: req.params.id });

    if (companies.length > 0) {
      return res.status(403).json({ message: "This city is associated with a company, so it cannot be deleted" });
    }

    const city = await City.findByIdAndRemove(req.params.id);

    if (!city) {
      throw new Error("City not found");
    }

    await State.updateOne(
      { _id: city.state },
      { $pull: { cities: city._id } }
    );

    res.status(200).json({ message: "City deleted successfully" });
  } catch (err) {
    next(err);  // Pass the error to the error handling middleware
  }
};



module.exports = {
  getAllcity,
  createCity,
  updateCity,
  deleteCity
}