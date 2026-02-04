import React from "react";
import BrowserIcon from "../../Utils/BrowserIcon";
import IPAddress from "../../Utils/IPAddress";
import GeoLocation from "../../Utils/GeoLocation";
import WifiStatus from "../../Utils/WifiStatus";
import CurrentTime from "../../Utils/CurrentTime";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const Footer = () => {
  const { darkMode } = useTheme();
  return (
    <div
      style={{
        backgroundColor: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="d-flex justify-content-center align-items-center gap-5 p-2"
    >
      <span className="d-none d-md-flex">
        <CurrentTime />
      </span>
      <WifiStatus />
      <BrowserIcon />
      <IPAddress />
      <GeoLocation />
    </div>
  );
};

export default Footer;
