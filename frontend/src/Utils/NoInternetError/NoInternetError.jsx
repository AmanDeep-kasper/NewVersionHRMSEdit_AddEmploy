import React, { useState, useEffect } from "react";
import "./NoInternetError.css";
import connectionLost from "../../img/connectionLost.png";
import { IoIosRefresh } from "react-icons/io";
import MUNCSMALL from "../../img/MUNCSMALL.png";
import MiniLogo from "../../img/MiniLogo.png";

const NoInternetError = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Detect online and offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners to handle online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup listeners when component unmounts
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    !isOnline && (
      <div className="no-internet-overlay">
        <img
          style={{
            height: "3rem",
            width: "auto",
            position: "absolute",
            top: "2rem",
            left: "2rem",
          }}
          src={MUNCSMALL}
          alt=""
        />
        <img
          style={{
            height: "5rem",
            width: "auto",
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
          }}
          src={MiniLogo}
          alt=""
        />
        <div className="no-internet-message">
          <img
            style={{ height: "15rem", width: "auto" }}
            src={connectionLost}
            alt=""
          />
          <h2>No Internet Connection</h2>
          <p>Please check your network and try again.</p>

          <button className="btn btn-warning px-4" onClick={handleRefresh}>
            Retry <IoIosRefresh />
          </button>
        </div>
      </div>
    )
  );
};

export default NoInternetError;
