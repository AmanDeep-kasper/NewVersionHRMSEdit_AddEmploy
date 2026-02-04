import React, { useEffect, useState } from "react";
import { TbDeviceMobileFilled, TbCopy } from "react-icons/tb";

const IPAddress = () => {
  const [ipAddress, setIpAddress] = useState(null);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip))
      .catch(console.error);
  }, []);

  const copyToClipboard = () => {
    if (ipAddress) {
      navigator.clipboard.writeText(ipAddress);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <TbDeviceMobileFilled className="text-gray-500" />
      <code className="font-mono text-gray-800">{ipAddress || "••••••••"}</code>
      {ipAddress && (
        <button
          onClick={copyToClipboard}
          className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Copy IP"
        >
          <TbCopy size={16} />
        </button>
      )}
    </div>
  );
};

export default IPAddress;
