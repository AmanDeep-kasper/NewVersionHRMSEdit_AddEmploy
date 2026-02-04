const Country = require("../models/countryModel"); // Assuming you have a country model
const { CountryValidation } = require("../validations/countryValidation");
const State = require("../models/stateModel"); // Assuming you have a state model
const City = require("../models/cityModel"); // Assuming you have a city model
const Joi = require("joi");

// GET: Retrieve all countries
const getAllCountries = (req, res) => {
  Country.find()
    .populate({ path: "states", populate: { path: "cities" } })
    .exec((err, countries) => {
      if (err) {
        res.send(err);
      } else {
        res.send(countries);
      }
    });
};

// POST: Create a new country
// const createCountry = (req, res) => {
//   const { CountryName } = req.body;

//   Joi.validate(req.body, CountryValidation, async (err, result) => {
//     if (err) {
//       res.status(400).send(err.details[0].message);
//     } else {
//       const newCountry = Country({
//         CountryName: CountryName,
//       });

//       await Country.create(newCountry, (err, country) => {
//         if (err) {
//           res.send("error");
//         } else {
//           // res.send("country", country);
//           res.status(201).json({
//             message: "ok",
//             message: country,
//           });
//         }
//       });
//     }
//   });
// };

const createCountry = (req, res) => {
  const { CountryName } = req.body;

  Joi.validate(req.body, CountryValidation, async (err, result) => {
    if (err) {
      res.status(400).send(err.details[0].message);
    } else {
      // Check for duplicate country name (case-insensitive)
      const existingCountry = await Country.findOne({
        CountryName: { $regex: `^${CountryName}$`, $options: "i" }
      });
      if (existingCountry) {
        return res.status(409).json({
          message: "Country name already exists. Please use a unique name."
        });
      }

      const newCountry = Country({
        CountryName: CountryName,
      });

      // await Country.create(newCountry, (err, country) => {
      //   if (err) {
      //     res.send("error");
      //   } else {
      //     res.status(201).json({
      //       message: "ok",
      //       message: country,
      //     });
      //   }
      // });
      await Country.create(newCountry, (err, country) => {
        if (err) {
          res.status(500).json({
            message: "Failed to create country. Please try again.",
            error: err.message || err
          });
        } else {
          res.status(201).json({
            message: "ok",
            message: country,
          });
        }
      });
    }
  });
};

// PUT: Update an existing country
const updateCountry = (req, res) => {
  Joi.validate(req.body, CountryValidation, (err, result) => {
    if (err) {
      res.status(400).send(err.details[0].message);
    } else {
      let updatedCountry = {
        CountryName: req.body.CountryName,
      };

      Country.findByIdAndUpdate(
        req.params.id,
        updatedCountry,
        (err, country) => {
          if (err) {
            res.send("error");
          } else {
            res.send(updatedCountry);
          }
        }
      );
    }
  });
};

// DELETE: Delete a country
const deleteCountry = (req, res) => {
  Country.findById(req.params.id, (err, foundCountry) => {
    if (err) {
      res.send(err);
    } else {
      if (foundCountry.states.length !== 0) {
        res
          .status(403)
          .send(
            "First, delete all the states in this country before deleting this country"
          );
      } else {
        Country.findByIdAndRemove({ _id: req.params.id }, (err, country) => {
          if (!err) {
            State.deleteMany({ country: { _id: req.params.id } }, (err) => {
              if (err) {
                res.send("error");
              } else {
                res.status(200).json({
                  message: "country is deleted",
                });
              }
            });
          } else {
            res.send("error");
          }
        });
      }
    }
  });
};

module.exports = {
  getAllCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};
