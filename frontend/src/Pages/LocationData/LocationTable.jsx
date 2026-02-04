import React from 'react';

const LocationTable = ({ locationData }) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Countries</th>
                        <th>States</th>
                        <th>Cities</th>
                    </tr>
                </thead>
                <tbody>
                    {locationData.map((location, locIndex) => {
                        const countryRowSpan = location.states.length;
                        let countryPrinted = false;

                        return (
                            <React.Fragment key={locIndex}>
                                {location.states.map((state, stateIndex) => (
                                    <tr key={stateIndex}>
                                        {!countryPrinted && (
                                            <td rowSpan={countryRowSpan}>
                                                {location.country}
                                            </td>
                                        )}
                                        <td>{state.name}</td>
                                        <td>{state.cities.join(', ')}</td>
                                        {countryPrinted = true}
                                    </tr>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default LocationTable;
