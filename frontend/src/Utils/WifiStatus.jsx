import React, { useEffect, useState } from "react";
import { FiWifi, FiWifiOff } from "react-icons/fi";

const WifiStatus = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  return online ? (
    <span className="d-flex align-items-center gap-2">
      <FiWifi /> <span className="d-none d-md-flex">Connected</span>
    </span>
  ) : (
    <span className="d-flex align-items-center gap-2">
      <FiWifiOff /> <span className="d-none d-md-flex">Disconnect</span>
    </span>
  );
};

export default WifiStatus;
