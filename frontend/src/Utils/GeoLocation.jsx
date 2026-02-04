import React, { useEffect, useState } from "react";
import { GrLocationPin } from "react-icons/gr";

// Helper function to convert decimal degrees to DMS
const convertToDMS = (decimal) => {
  const degrees = Math.floor(decimal);
  const minutesDecimal = (decimal - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = ((minutesDecimal - minutes) * 60).toFixed(1);

  return `${degrees}°${minutes}'${seconds}"`;
};

const GeoLocation = () => {
  const [geoLocation, setGeoLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Error fetching geolocation:", err);
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!geoLocation.lat || !geoLocation.lon) {
    return <div>Loading...</div>;
  }

  const latDMS =
    convertToDMS(geoLocation.lat) + (geoLocation.lat >= 0 ? "N" : "S");
  const lonDMS =
    convertToDMS(geoLocation.lon) + (geoLocation.lon >= 0 ? "E" : "W");

  return (
    <a
      href={`https://www.google.com/maps?q=${geoLocation.lat},${geoLocation.lon}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Open in Google Maps"
      className="d-flex align-items-center gap-1 text-decoration-none"
    >
      <GrLocationPin />
      {latDMS} {lonDMS}
    </a>
  );
};

export default GeoLocation;
