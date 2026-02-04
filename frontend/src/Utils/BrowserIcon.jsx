import React, { useEffect, useState } from 'react';
import { FaChrome, FaFirefox, FaEdge, FaSafari, FaOpera, FaInternetExplorer } from "react-icons/fa";

const BrowserIcon = () => {
    const [browserIcon, setBrowserIcon] = useState(null);

    useEffect(() => {
        const userAgent = navigator.userAgent;

        if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1 && userAgent.indexOf("OPR") === -1) {
            setBrowserIcon(<span><FaChrome /> Chrome</span>);
        } else if (userAgent.indexOf("Firefox") > -1) {
            setBrowserIcon(<span><FaFirefox /> Firefox</span>);
        } else if (userAgent.indexOf("Edg") > -1) {
            setBrowserIcon(<span><FaEdge /> Edge</span>);
        } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
            setBrowserIcon(<span><FaSafari /> Safari</span>);
        } else if (userAgent.indexOf("OPR") > -1 || userAgent.indexOf("Opera") > -1) {
            setBrowserIcon(<span><FaOpera /> Opera</span>);
        } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
            setBrowserIcon(<span><FaInternetExplorer /> Explorer</span>);
        } else {
            setBrowserIcon(<span>Unknown Browser</span>);
        }
    }, []);

    return browserIcon;
};

export default BrowserIcon;
