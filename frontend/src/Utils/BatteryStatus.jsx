import React, { useEffect, useState } from 'react';
import { TiBatteryFull, TiBatteryHigh, TiBatteryMid, TiBatteryLow, TiBatteryCharge } from "react-icons/ti";

const BatteryStatus = () => {
    const [batteryCharging, setBatteryCharging] = useState(false);
    const [batteryLevel, setBatteryLevel] = useState(0);

    useEffect(() => {
        const batteryStatusHandler = () => {
            navigator.getBattery().then(battery => {
                setBatteryCharging(battery.charging);
                setBatteryLevel(battery.level * 100); // Convert to percentage
            });
        };

        navigator.getBattery().then(battery => {
            setBatteryCharging(battery.charging);
            setBatteryLevel(battery.level * 100); // Convert to percentage
            battery.addEventListener('chargingchange', batteryStatusHandler);
            battery.addEventListener('levelchange', batteryStatusHandler);
        });

        return () => {
            navigator.getBattery().then(battery => {
                battery.removeEventListener('chargingchange', batteryStatusHandler);
                battery.removeEventListener('levelchange', batteryStatusHandler);
            });
        };
    }, []);

    let BatteryIcon = TiBatteryFull;

    if (batteryCharging) {
        BatteryIcon = TiBatteryCharge;
    } else if (batteryLevel >= 90) {
        BatteryIcon = TiBatteryFull;
    } else if (batteryLevel >= 60) {
        BatteryIcon = TiBatteryHigh;
    } else if (batteryLevel >= 30) {
        BatteryIcon = TiBatteryMid;
    } else if (batteryLevel >= 15) {
        BatteryIcon = TiBatteryLow;
    } else {
        BatteryIcon = TiBatteryLow; // Custom handling for very low battery levels
    }

    return <BatteryIcon className='fs-4' />;
};

export default BatteryStatus;
