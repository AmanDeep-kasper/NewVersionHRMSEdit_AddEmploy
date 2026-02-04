const Joi = require('joi');
const State = require('../models/stateModel');
const  { StateValidation } = require('../validations/stateValidation');
const Country = require('../models/countryModel');


// get all states 
const getAllStates = async (req, res) => {
    State.find().populate("country citiesx").exec(function (err, country) {
        res.send(country);
    });
}

// create ane state 
const createState = async (req, res) => {
    Joi.validate(req.body, StateValidation, (err, result) => {
        if (err) {
            
            res.status(400).send(err.details[0].message);
        } else {
            let newState;

            newState = {
                StateName: req.body.StateName,
                country: req.body.CountryID
            };


            State.create(newState, function (err, state) {
                if (err) {
                    res.send("error");
                } else {
                    Country.findById(req.body.CountryID, function (err, country) {
                        if (err) {
                            res.send("err");
                        } else {
                            country.states.push(state);
                            country.save(function (err, data) {
                                if (err) {
                                    
                                } else {
                                    res.send(state);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

// find one and update  
const updateState = async (req, res) => {
    Joi.validate(req.body, StateValidation, (err, result) => {
        if (err) {
          
          res.status(400).send(err.details[0].message);
        } else {
          let newState;
    
          newState = {
            StateName: req.body.StateName,
            country: req.body.CountryID
          };
    
          State.findByIdAndUpdate(req.params.id, newState, function (err, state) {
            if (err) {
              res.send("error");
            } else {
              res.send(newState);
            }
          });
        }
      });
}

// find one and delete 
const deleteState = async (req, res) => {
    State.findById(req.params.id, function (err, foundState) {
        if (err) {
          res.send(err);
        } else {
            
          if (!foundState.cities.length == 0) {
            res
              .status(403)
              .send(
                "First Delete All The cities in this state before deleting this state"
              );
          } else {
            State.findByIdAndRemove({ _id: req.params.id }, function (err, state) {
              if (!err) {
                Country.update(
                  { _id: state.country[0] },
                  { $pull: { states: state._id } },
                  function (err, numberAffected) {
                    res.status(200).json({
                      message : "state is deleted",
                    });
                  }
                );
              } else {
                res.send("error");
              }
            });
          }
        }
      });
}


module.exports = {
    getAllStates,
    createState,
    deleteState,
    updateState
}