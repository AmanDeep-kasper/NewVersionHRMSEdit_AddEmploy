import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LocationTable from './LocationTable';
import BASE_URL from "../../Pages/config/config";
import api from '../config/api';

const CreateLocationForm = () => {
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const [existingCountries, setExistingCountries] = useState([]);
    const [existingStates, setExistingStates] = useState([]);
    const [existingCities, setExistingCities] = useState([]);
    const [locationData, setLocationData] = useState([]);

    const handleCountryChange = (e) => {
        setCountry(e.target.value);
        setState('');
        setCity('');
    };

    const handleStateChange = (e) => {
        setState(e.target.value);
        setCity('');
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };


 useEffect(() => {
  const fetchLocations = async () => {
    try {

      const response = await api.get(`/api/locations`, {
      });

      const data = response.data;
      setLocationData(data);

      const existingCountries = data.map((loc) => loc.country);
      setExistingCountries(existingCountries);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  fetchLocations();
}, []);


    useEffect(() => {
        const existingStates = locationData
            .filter(loc => loc.country === country)
            .flatMap(loc => loc.states)
            .map(state => state.name);
        setExistingStates(existingStates);
    }, [country, locationData]);

    useEffect(() => {
    }, [locationData]);


    useEffect(() => {
        const existingCities = locationData
            .filter(loc => loc.country === country)
            .flatMap(loc => loc.states)
            .filter(st => st.name === state)
            .flatMap(st => st.cities);
        setExistingCities(existingCities);
    }, [country, state, locationData]);

const handleSubmit = (e) => {
  e.preventDefault();

  if (!country || !state || !city) {
    setError('Please fill in all fields.');
    return;
  }


  api.post(
    `/api/locations`,
    { country, state, city },
  )
  .then((response) => {
    setLocationData([...locationData, response.data]);
    setCountry('');
    setState('');
    setCity('');
    setError('');
  })
  .catch((error) => {
    setError(error?.response?.data?.message || 'Failed to save location.');
    console.error('Error saving location:', error);
  });
};


    return (
        <div>
            <div className='container py-5'>
                <form className='d-flex flex-column gap-2' onSubmit={handleSubmit}>
                    <label className='row gap-2 py-2'>
                        <p style={{ whiteSpace: 'pre' }} className='col-2 my-auto'>Country:</p>
                        <select className='col-2 my-1 mx-2 py-1 rounded-2' value={country} onChange={handleCountryChange}>
                            <option value="">--Select--</option>
                            {existingCountries.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                        <input className='col-4 my-1 mx-2 py-1 rounded-2' placeholder='Select Option Or Create New Country' type="text" value={country} onChange={handleCountryChange} />
                    </label>
                    <br />
                    <label className='d-flex align-items-center gap-3 justify-content-between'>
                        <p style={{ whiteSpace: 'pre' }} className='my-auto'>State:</p>
                        <div className='d-flex align-items-center gap-2 justify-content-between'>
                            <select className='form-select' value={state} onChange={handleStateChange}>
                                <option value="">--Select--</option>
                                {existingStates.map((state, index) => (
                                    <option key={index} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <input className='form-control' placeholder='Select Option Or Create New State' type="text" value={state} onChange={handleStateChange} />
                    </label>
                    <br />
                    <label className='d-flex align-items-center gap-3 justify-content-between'>
                        <p style={{ whiteSpace: 'pre' }} className='my-auto'>City:</p>
                        <select className='form-select' value={city} onChange={handleCityChange}>
                            <option value="">--Select--</option>
                            {existingCities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                        <input className='form-control' placeholder='Select Option Or Create New City' type="text" value={city} onChange={handleCityChange} />
                    </label>
                    <br />
                    <button type="submit">Create Location</button>
                </form>
                {error && <p>{error}</p>}
            </div>
            <div className="category-table container mx-auto">
                <LocationTable locationData={locationData} />
            </div>
        </div>
    );
};

export default CreateLocationForm;
