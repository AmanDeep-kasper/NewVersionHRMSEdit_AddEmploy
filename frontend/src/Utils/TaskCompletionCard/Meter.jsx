import React from 'react';
import MeterHandler from "./MeterHandler.png"

const Meter = ({ value }) => {
    // Ensure value is within bounds
    const boundedValue = Math.min(Math.max(value, 0), 100);
    
    // Convert value to corresponding angle (assuming the meter ranges from 0 to 180 degrees)
    const angle = (boundedValue / 100) * 180;

    return (
        <div style={{position:'relative'}}>
            <svg width="200" height="200" viewBox="0 0 200 100">
            {/* Background arc */}
            <path
                d="M10 90 A90 90 0 0 1 190 90"
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="40"
            />

            {/* Filled arc (dynamic based on value) */}
            <path
                d={`M10 90 A90 90 0 ${angle > 90 ? 1 : 0} 1 ${10 + 180 * (angle / 180)} ${90 - 90 * Math.sin((angle * Math.PI) / 180)}`}
                fill="none"
                stroke="#468beb"
                strokeWidth="30"
            />

            {/* Pointer */}
            <line
                x1="100"
                y1="90"
                x2={100 + 80 * Math.cos((angle - 90) * (Math.PI / 180))}
                y2={90 - 80 * Math.sin((angle - 90) * (Math.PI / 180))}
                stroke="black"
                strokeWidth="10"
            />
        </svg>
        <img style={{height:'5rem', width:'auto', position:'absolute',bottom:'25%', left:'25%', transform:"translate(-90%, -15%)"}} src={MeterHandler}  alt="" />
        </div>
    );
};

export default Meter;
