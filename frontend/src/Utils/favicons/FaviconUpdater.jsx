import { useEffect } from 'react';
import { useBranding } from '../../Context/BrandingContext/BrandingContext';

const FaviconUpdater = () => {
  const { brandings } = useBranding();

  useEffect(() => {
    // Extract favicon logo URL from branding; fallback to mini logo
    const faviconUrl = brandings && brandings.length > 0
      ? (brandings[0]?.faviconLogoUrl || brandings[0]?.miniIconUrl || brandings[0]?.company?.miniIconUrl || null)
      : null;

    if (!faviconUrl) {
      
      return;
    }

    // Find or create favicon link element
    let link = document.querySelector("link[rel*='icon'][type*='image']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      link.type = 'image/png';
      document.head.appendChild(link);
    }

    // Update href to branding favicon logo
    link.href = faviconUrl;
  }, [brandings]);

  return null; // This component doesn't render anything
};

export default FaviconUpdater;
