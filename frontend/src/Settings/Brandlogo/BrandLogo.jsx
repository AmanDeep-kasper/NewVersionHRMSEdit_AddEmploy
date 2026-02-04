import React, { useState, useEffect } from "react";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api";
import { toast } from "react-hot-toast";
import { useBranding } from "../../Context/BrandingContext/BrandingContext";
const BrandingSettings = () => {
  const { darkMode } = useTheme();

  const [currentLogo, setCurrentLogo] = useState("");
  const [currentMini, setCurrentMini] = useState("");
  const [currentCompanyId, setCurrentCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [brandings, setBrandings] = useState([]);
  const [showModal, setShowModal] = useState(false);

//   console.log("Current Company ID:", brandings);

  const [logoFile, setLogoFile] = useState(null);
  const [miniFile, setMiniFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [miniPreview, setMiniPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const [footerLogoFile, setFooterLogoFile] = useState(null);
  const [footerMiniLogoFile, setFooterMiniLogoFile] = useState(null);
  const [faviconLogoFile, setFaviconLogoFile] = useState(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState(null);
  const [footerMiniLogoPreview, setFooterMiniLogoPreview] = useState(null);
  const [faviconLogoPreview, setFaviconLogoPreview] = useState(null);

  const [currentFooterLogo, setCurrentFooterLogo] = useState("");
  const [currentFooterMini, setCurrentFooterMini] = useState("");
  const [currentFaviconLogo, setCurrentFaviconLogo] = useState("");

  useEffect(() => {
    loadCompanies();
    // load cached brandings from context
    loadBrandings();
  }, []);

  const loadCompanies = async () => {
    try {
      const res = await api.get("/api/company");
      setCompanies(res.data);

      if (res.data.length > 0) {
        setCurrentCompanyId(res.data[0]._id);
      }
    } catch (error) {
      console.error("Failed to load companies:", error);
    }
  };

  useEffect(() => {
    if (currentCompanyId) {
      // Prefer cached value from branding context first
      const cached = brandings.find((b) => (b.company?._id || b.company) === currentCompanyId);
      if (cached) {
        setCurrentLogo(cached?.logoUrl || "/logo.webp");
        setCurrentMini(cached?.miniIconUrl || "/MiniLogo.png");
        setCurrentFooterLogo(cached?.footerLogoUrl || "");
        setCurrentFooterMini(cached?.footerMiniLogoUrl || "");
        setCurrentFaviconLogo(cached?.faviconLogoUrl || "");
      } else {
        fetchBranding(currentCompanyId);
      }
    }
  }, [currentCompanyId]);

  // use context fetchBranding when possible
  const { brandings: contextBrandings, fetchBranding: contextFetchBranding, updateBrandingCache, loadAllBrandings } = useBranding();

  const fetchBranding = async (companyId) => {
    try {
      const b = await contextFetchBranding(companyId);
      if (b) {
        setCurrentLogo(b?.logoUrl || "/logo.webp");
        setCurrentMini(b?.miniIconUrl || "/MiniLogo.png");
      }
    } catch (error) {
      console.error("Failed to fetch branding:", error);
    }
  };

  const loadBrandings = async () => {
    try {
      // load from branding context (already caches from provider). If absent, force load.
      let out = contextBrandings && contextBrandings.length ? contextBrandings : [];
      if (!out.length) {
        const loaded = await loadAllBrandings();
        out = loaded || [];
      }
      setBrandings(out);
    } catch (err) {
      console.error('Failed to load brandings:', err);
    }
  };

  useEffect(() => {
    setLogoPreview(logoFile ? URL.createObjectURL(logoFile) : null);
  }, [logoFile]);

  useEffect(() => {
    setMiniPreview(miniFile ? URL.createObjectURL(miniFile) : null);
  }, [miniFile]);

  useEffect(() => {
    setFooterLogoPreview(footerLogoFile ? URL.createObjectURL(footerLogoFile) : null);
  }, [footerLogoFile]);

  useEffect(() => {
    setFooterMiniLogoPreview(footerMiniLogoFile ? URL.createObjectURL(footerMiniLogoFile) : null);
  }, [footerMiniLogoFile]);

  useEffect(() => {
    setFaviconLogoPreview(faviconLogoFile ? URL.createObjectURL(faviconLogoFile) : null);
  }, [faviconLogoFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logoFile && !miniFile && !footerLogoFile && !footerMiniLogoFile && !faviconLogoFile) 
      return toast.error("Please select at least one file.");

    setSaving(true);
    try {
      const formData = new FormData();
      if (logoFile) formData.append("logo", logoFile);
      if (miniFile) formData.append("miniIcon", miniFile);
      if (footerLogoFile) formData.append("footerLogo", footerLogoFile);
      if (footerMiniLogoFile) formData.append("footerMiniLogo", footerMiniLogoFile);
      if (faviconLogoFile) formData.append("faviconLogo", faviconLogoFile);
      formData.append("companyId", currentCompanyId);

      const res = await api.post(
        "/api/settings/upload-branding",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const branding = res.data?.branding || res.data;
      setCurrentLogo(branding?.logoUrl || currentLogo);
      setCurrentMini(branding?.miniIconUrl || currentMini);
      setCurrentFooterLogo(branding?.footerLogoUrl || currentFooterLogo);
      setCurrentFooterMini(branding?.footerMiniLogoUrl || currentFooterMini);
      setCurrentFaviconLogo(branding?.faviconLogoUrl || currentFaviconLogo);

      // update shared cache so other pages render updated branding quickly
      try {
        updateBrandingCache(branding);
      } catch (e) {
        // ignore if context not available
      }

      // refresh provider cache and notify listeners (other pages)
      try {
        await loadAllBrandings();
      } catch (e) {
        // fallback to fetching this company only
        fetchBranding(currentCompanyId);
      }

      setLogoFile(null);
      setMiniFile(null);
      setFooterLogoFile(null);
      setFooterMiniLogoFile(null);
      setFaviconLogoFile(null);
      setLogoPreview(null);
      setMiniPreview(null);
      setFooterLogoPreview(null);
      setFooterMiniLogoPreview(null);
      setFaviconLogoPreview(null);

      toast.success("Branding updated successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      <TittleHeader title="Branding Settings" message="Upload site logo & mini icon" />

      <form onSubmit={handleSubmit} className="row g-4 mt-2">

        {/* Company selector */}
        <div className="col-12">
          <label className="form-label">Select Company</label>
          <select className="form-select" value={currentCompanyId || ''} onChange={(e) => setCurrentCompanyId(e.target.value)}>
            <option value="" disabled>Select company</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>{c.CompanyName}</option>
            ))}
          </select>
        </div>

        {/* Logo */}
        <div className="col-md-6">
          <label className="form-label">Header Logo</label>
          <div className="p-2 border rounded-2" style={{ background: darkMode ? "#fff" : "#111" }}>
            <img
              src={logoPreview || currentLogo}
              style={{ width: "100%", height: 90, objectFit: "contain" }}
              alt="logo"
            />
          </div>
          <input type="file" className="form-control mt-2" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
        </div>

  {/* Mini Icon */}
        <div className="col-md-6">
          <label className="form-label">Header Mini Icon</label>
          <div className="p-2 border rounded-2" style={{ width: 70, height: 70, background: darkMode ? "#fff" : "#111" }}>
            <img
              src={miniPreview || currentMini}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              alt="mini"
            />
          </div>
          <input type="file" className="form-control mt-2" accept="image/*" onChange={(e) => setMiniFile(e.target.files[0])} />
        </div>

        {/* Footer Logo */}
        <div className="col-md-6">
          <label className="form-label">Footer Logo</label>
          <div className="p-2 border rounded-2" style={{ background: darkMode ? "#fff" : "#111" }}>
            <img
              src={footerLogoPreview || currentFooterLogo || "/logo.webp"}
              style={{ width: "100%", height: 60, objectFit: "contain" }}
              alt="footer-logo"
            />
          </div>
          <input type="file" className="form-control mt-2" accept="image/*" onChange={(e) => setFooterLogoFile(e.target.files[0])} />
        </div>

        {/* Footer Mini Logo */}
        <div className="col-md-6">
          <label className="form-label">Footer Mini Logo</label>
          <div className="p-2 border rounded-2" style={{ width: 50, height: 50, background: darkMode ? "#fff" : "#111" }}>
            <img
              src={footerMiniLogoPreview || currentFooterMini || "/MiniLogo.png"}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              alt="footer-mini"
            />
          </div>
          <input type="file" className="form-control mt-2" accept="image/*" onChange={(e) => setFooterMiniLogoFile(e.target.files[0])} />
        </div>

        {/* Favicon Logo */}
        <div className="col-md-6">
          <label className="form-label">Favicon Logo</label>
          <div className="p-2 border rounded-2" style={{ width: 50, height: 50, background: darkMode ? "#fff" : "#111" }}>
            <img
              src={faviconLogoPreview || currentFaviconLogo || "/favicon.ico"}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              alt="favicon"
            />
          </div>
          <input type="file" className="form-control mt-2" accept="image/*" onChange={(e) => setFaviconLogoFile(e.target.files[0])} />
        </div>

        <div className="col-12">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              'Save Branding'
            )}
          </button>
          {/* <button type="button" className="btn btn-outline-primary ms-2" onClick={() => setShowModal(true)}>
            Open Branding Modal
          </button> */}
        </div>
      </form>

      {/* <BrandingModal open={showModal} onClose={() => setShowModal(false)} onSaved={fetchBranding} /> */}

      {/* Branding list table */}
      {/* <div className="mt-4">
        <h6>Companies Branding</h6>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Company</th>
                <th>Logo</th>
                <th>Mini Icon</th>
              </tr>
            </thead>
            <tbody>
              {brandings.map((b) => (
                <tr key={b._id || b.company?._id}>
                  <td>{b.company?.CompanyName || b.companyName || 'N/A'}</td>
                  <td>
                    {b.logoUrl ? (
                      <img src={b.logoUrl} alt="logo" style={{ height: 50, objectFit: 'contain' }} />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {b.miniIconUrl ? (
                      <img src={b.miniIconUrl} alt="mini" style={{ height: 30, objectFit: 'contain' }} />
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default BrandingSettings;