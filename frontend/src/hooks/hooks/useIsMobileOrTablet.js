import { useEffect, useState } from "react";

export default function useIsMobileOrTablet() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  const checkDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /iphone|ipod|android.*mobile|windows phone|blackberry/.test(userAgent);
    const isTabletUA = /ipad|android(?!.*mobile)|tablet/.test(userAgent);

    const isSmallScreen = window.innerWidth < 763;

    setIsMobileOrTablet(isMobileUA || isTabletUA || isSmallScreen);
  };

  useEffect(() => {
    checkDevice(); // check on mount
    window.addEventListener("resize", checkDevice); // recalculate on resize
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return isMobileOrTablet;
}
