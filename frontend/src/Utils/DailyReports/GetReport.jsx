import React, { useState, useEffect, useMemo } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { FaWindows } from "react-icons/fa";
import { RiLinkUnlinkM } from "react-icons/ri";
import { useSelector } from "react-redux";

import api from "../../Pages/config/api";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import FullPageModel from "../CustomModal/FullPageModel";
import CreateReport from "./CreateReport";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

import noreport from "../../img/Report/noreport.svg";

const GetReport = () => {
  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);

  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [filterType, setFilterType] = useState("recent");
  const [createdByFilter, setCreatedByFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");

  /* -------------------- Helpers -------------------- */

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getStartOfPeriod = (period) => {
    const now = new Date();
    switch (period) {
      case "today":
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case "thisWeek":
        return new Date(now.setDate(now.getDate() - now.getDay() + 1));
      case "thisMonth":
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case "thisQuarter":
        return new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          1,
        );
      case "thisHalfYear":
        return new Date(now.getFullYear(), now.getMonth() < 6 ? 0 : 6, 1);
      case "thisYear":
        return new Date(now.getFullYear(), 0, 1);
      default:
        return null;
    }
  };

  /* -------------------- Fetch Reports -------------------- */

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/api/dailyReports/");
        const data = response?.data?.data || [];

        if (!userData) return;

        if (userData.Account === 1) {
          setReports(data); // Admin
        } else if (userData.Account === 4) {
          setReports(
            data.filter((r) => r.user.reportManager === userData.Email),
          );
        } else {
          setReports(data.filter((r) => r.user._id === userData._id));
        }

        if (!data.length) setError("No reports available.");
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      }
    };

    fetchReports();
  }, [userData]);

  /* -------------------- Filters -------------------- */

  const uniqueCreators = useMemo(() => {
    const list = reports.map((r) => `${r.user.FirstName} ${r.user.LastName}`);
    return ["all", ...new Set(list)];
  }, [reports]);

  const uniqueManagers = useMemo(() => {
    const list = reports.map((r) => r.user.reportManager);
    return ["all", ...new Set(list)];
  }, [reports]);

  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    if (filterType !== "recent") {
      const start = getStartOfPeriod(filterType);
      filtered = filtered.filter((r) => new Date(r.reportedDate) >= start);
    }

    if (createdByFilter !== "all") {
      filtered = filtered.filter(
        (r) => `${r.user.FirstName} ${r.user.LastName}` === createdByFilter,
      );
    }

    if (managerFilter !== "all") {
      filtered = filtered.filter((r) => r.user.reportManager === managerFilter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((r) =>
        r[searchBy]?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [
    reports,
    filterType,
    createdByFilter,
    managerFilter,
    searchTerm,
    searchBy,
  ]);

  /* -------------------- Keyboard Shortcut -------------------- */

  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.key === "r") setShowModal(true);
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* -------------------- UI -------------------- */

  return (
    <div className="container-fluid p-3" style={{ height: "90vh" }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <TittleHeader
          title="Daily Reports"
          message="Review and manage submitted daily work reports."
        />

        <Button
          className="rounded-pill px-4 d-flex align-items-center gap-2 mt-3 mt-md-0"
          onClick={() => setShowModal(true)}
        >
          Add Report <FaWindows />
          <span style={{ fontSize: 12, opacity: 0.8 }}>Alt + R</span>
        </Button>
      </div>

      {/* Filters */}
      <div
        className="d-grid gap-3 mb-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        <Form.Group>
          <Form.Label className="fw-semibold">Period</Form.Label>
          <Form.Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {[
              "recent",
              "today",
              "thisWeek",
              "thisMonth",
              "thisQuarter",
              "thisHalfYear",
              "thisYear",
            ].map((t) => (
              <option key={t} value={t}>
                {t.replace(/([A-Z])/g, " $1")}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label className="fw-semibold">Search By</Form.Label>
          <Form.Control
            placeholder={`Search ${searchBy}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="fw-semibold">Created By</Form.Label>
          <Form.Select
            value={createdByFilter}
            onChange={(e) => setCreatedByFilter(e.target.value)}
          >
            {uniqueCreators.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All" : c}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label className="fw-semibold">Manager</Form.Label>
          <Form.Select
            value={managerFilter}
            onChange={(e) => setManagerFilter(e.target.value)}
          >
            {uniqueManagers.map((m) => (
              <option key={m} value={m}>
                {m === "all" ? "All" : m}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Table */}
      {filteredReports.length ? (
        <div
          className="table-responsive rounded-3"
          style={{
            maxHeight: "65vh",
            border: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <Table hover className="mb-0 align-middle">
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                background: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <tr style={{ fontSize: "13px", textTransform: "uppercase" }}>
                <th>Date</th>
                <th>Employee</th>
                <th>Manager</th>
                <th>Title</th>
                <th>Description</th>
                <th>Complication</th>
                <th>Link</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "14px" }}>
              {filteredReports.map((r) => (
                <tr key={r._id}>
                  <td className="text-nowrap text-muted">
                    {formatDate(r.reportedDate)}
                  </td>

                  <td className="fw-semibold">
                    {r.user.FirstName} {r.user.LastName}
                  </td>

                  <td className="text-muted">{r.user.reportManager}</td>

                  <td style={{ maxWidth: 180 }}>
                    <div className="text-truncate" title={r.title}>
                      {r.title || "—"}
                    </div>
                  </td>

                  <td style={{ maxWidth: 240 }}>
                    <div className="text-truncate" title={r.description}>
                      {r.description}
                    </div>
                  </td>

                  <td style={{ maxWidth: 220 }}>
                    <div className="text-truncate" title={r.complication}>
                      {r.complication}
                    </div>
                  </td>

                  <td className="text-nowrap">
                    {r.link ? (
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noreferrer"
                        className="d-inline-flex align-items-center gap-1 text-decoration-none fw-medium"
                        style={{ color: "#2563eb" }}
                      >
                        <RiLinkUnlinkM /> View
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  <td style={{ maxWidth: 220 }}>
                    <div className="text-truncate" title={r.remarks}>
                      {r.remarks || "—"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "50vh" }}
        >
          <img src={noreport} alt="No reports" style={{ height: 180 }} />
          <p className="mt-3 fs-5 text-muted">
            No reports found for the selected criteria.
          </p>
        </div>
      )}

      {/* Modal */}
      <FullPageModel
        title="Create Report"
        show={showModal}
        setShow={setShowModal}
      >
        <CreateReport onclick={() => setShowModal(false)} />
      </FullPageModel>
    </div>
  );
};

export default GetReport;
