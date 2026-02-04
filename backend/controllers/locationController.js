// const Location = require('../models/LocationModel');

// // Create a new location
// exports.createLocation = async (req, res, next) => {
//     const { country, state, city } = req.body;

//     // Validate input
//     if (!country || !state || !city) {
//         return res.status(400).json({ message: 'Please fill in all fields.' });
//     }

//     try {
//         let location = await Location.findOne({ country });

//         if (location) {
//             // Check if the state already exists
//             const stateIndex = location.states.findIndex(st => st.name === state);
//             if (stateIndex !== -1) {
//                 // Check if the city already exists in the state

//                 const cityExists = location.states[stateIndex].cities.includes(city);
//                 if (cityExists) {

//                     return res.status(400).json({ message: 'Location already exists.' });
//                 } else {
//                     // Add new city to the existing state
//                     location.states[stateIndex].cities.push(city);
//                 }
//             } else {
//                 // Add new state with the city
//                 location.states.push({
//                     name: state,
//                     cities: [city]
//                 });
//             }
//         } else {
//             // Create a new location with the state and city
//             location = new Location({
//                 country,
//                 states: [{
//                     name: state,
//                     cities: [city]
//                 }]
//             });
//         }

//         // Save the location
//         await location.save();
//         res.status(201).json(location);
//     } catch (error) {
//         console.error("Error creating location:", error);
//         next(error); // Pass error to the error handler middleware
//     }
// };

// // Get all locations
// exports.getAllLocations = async (req, res, next) => {
//     try {
//         const locations = await Location.find();
//         res.status(200).json(locations);
//     } catch (error) {
//         console.error("Error fetching locations:", error);
//         next(error); // Pass error to the error handler middleware
//     }
// };


const Location = require('../models/LocationModel');

exports.createLocation = async (req, res) => {
    const { country, state, city } = req.body;

    if (!country || !state || !city) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    try {
        let location = await Location.findOne({ country });

        if (location) {
            const stateIndex = location.states.findIndex(st => st.name === state);
            if (stateIndex !== -1) {
                const cityExists = location.states[stateIndex].cities.includes(city);
                if (cityExists) {
                    return res.status(400).json({ message: 'Location already exists.' });
                } else {
                    location.states[stateIndex].cities.push(city);
                }
            } else {
                location.states.push({
                    name: state,
                    cities: [city]
                });
            }
        } else {
            location = new Location({
                country,
                states: [{
                    name: state,
                    cities: [city]
                }]
            });
        }

        await location.save();
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

