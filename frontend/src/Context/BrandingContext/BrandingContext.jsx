import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../../Pages/config/api";

const BrandingContext = createContext(null);

export const BrandingProvider = ({ children }) => {
  const [brandings, setBrandings] = useState([]); // array
  const [brandingsMap, setBrandingsMap] = useState({}); // keyed by companyId
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const buildMap = (arr) => {
    const map = {};
    (arr || []).forEach((b) => {
      const companyId = b?.company?._id || b?.company;
      if (companyId) map[companyId] = b;
    });
    return map;
  };

  const loadAllBrandings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/settings/branding");
      const list = res.data?.brandings || res.data || [];
      setBrandings(list);
      setBrandingsMap(buildMap(list));
  setLastUpdated(Date.now());
      return list;
    } catch (err) {
      console.error("Branding: failed to load brandings", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchBranding = async (companyId, force = false) => {
    if (!companyId) return null;
    if (!force && brandingsMap[companyId]) return brandingsMap[companyId];
    try {
      const res = await api.get(`/api/settings/branding/${companyId}`);
      const b = res.data?.branding || res.data || null;
      if (b) updateBrandingCache(b);
      return b;
    } catch (err) {
      console.error("Branding: failed to fetch branding for", companyId, err);
      return null;
    }
  };

  const updateBrandingCache = (branding) => {
    if (!branding) return;
    const companyId = branding?.company?._id || branding?.company;
    setBrandings((prev) => {
      const found = prev.find((p) => (p.company?._id || p.company) === companyId);
      if (found) return prev.map((p) => ((p.company?._id || p.company) === companyId ? branding : p));
      return [branding, ...prev];
    });
    setBrandingsMap((prev) => ({ ...prev, [companyId]: branding }));
    setLastUpdated(Date.now());
  };

  useEffect(() => {
    loadAllBrandings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrandingContext.Provider
      value={{ brandings, brandingsMap, loading, lastUpdated, loadAllBrandings, fetchBranding, updateBrandingCache }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const ctx = useContext(BrandingContext);
  if (!ctx) throw new Error("useBranding must be used within BrandingProvider");
  return ctx;
};

export default BrandingContext;
