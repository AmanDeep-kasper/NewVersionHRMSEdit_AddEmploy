import React, { useState, useEffect } from "react";
import AddMarketingReport from "./AddMarketingReport";
import FullPageModel from "../CustomModal/FullPageModel";
import { FaWindows } from "react-icons/fa";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketingReports } from "../../redux/slices/marketingReportSlice";
import noreport from "../../img/Report/noreport.svg";
import styles from "./ViewMarketingReport.module.css";
import { IoOptionsOutline } from "react-icons/io5";
import AddMarketingReportMany from "./AddMarketingReportMany";
import { IoMdLink } from "react-icons/io";

const ViewMarketingReport = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showModalMany, setShowModalMany] = useState(false);
  const [filterType, setFilterType] = useState("recent");
  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);
  const [showOption, setShowOption] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);

  const { marketingReports } = useSelector((state) => state.marketingReports);

  useEffect(() => {
    dispatch(fetchMarketingReports());
  }, [dispatch]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.altKey && event.key === "s") {
        setShowModal(true);
      }
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const handleKeyPressMany = (event) => {
      if (event.altKey && event.key === "m") {
        setShowModalMany(true);
      }
      if (event.key === "Escape") {
        setShowModalMany(false);
      }
    };

    window.addEventListener("keydown", handleKeyPressMany);

    return () => {
      window.removeEventListener("keydown", handleKeyPressMany);
    };
  }, []);



  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const filterReports = (reports) => {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const startOfQuarter = new Date(
      today.getFullYear(),
      Math.floor(today.getMonth() / 3) * 3,
      1
    );
    const startOfHalfYear = new Date(
      today.getFullYear(),
      today.getMonth() < 6 ? 0 : 6,
      1
    );
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    switch (filterType) {
      case "today":
        return reports.filter(
          (report) =>
            new Date(report.datePosted).toDateString() ===
            new Date().toDateString()
        );
      case "thisWeek":
        return reports.filter(
          (report) => new Date(report.datePosted) >= startOfWeek
        );
      case "thisMonth":
        return reports.filter(
          (report) =>
            new Date(report.datePosted).getMonth() === today.getMonth()
        );
      case "thisQuarter":
        return reports.filter(
          (report) => new Date(report.datePosted) >= startOfQuarter
        );
      case "thisHalfYear":
        return reports.filter(
          (report) => new Date(report.datePosted) >= startOfHalfYear
        );
      case "thisYear":
        return reports.filter(
          (report) =>
            new Date(report.datePosted).getFullYear() === today.getFullYear()
        );
      case "recent":
        return reports.slice(-10);
      default:
        return [];
    }
  };

  const filteredReportByUser = (() => {
    if (!userData || !marketingReports) return [];

    switch (userData.Account) {
      case 1:
        return marketingReports;
      case 4:
        return marketingReports.filter(
          (data) => data.user.reportManager === userData.Email
        );
      default:
        return marketingReports.filter((data) => data.user === userData._id);
    }
  })();

  const filteredReports = filterReports(filteredReportByUser);

  const sortedReports = filteredReports.sort(
    (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
  );

  const noDataMessages = {
    today: "No data available for today.",
    thisWeek: "No data recorded this week.",
    thisMonth: "No data found for this month.",
    thisQuarter: "No data available for this quarter.",
    thisHalfYear: "No data recorded for this half-year.",
    thisYear: "No data available for the current year.",
    recent: "No recent data to display.",
  };

  const [columnVisibility, setColumnVisibility] = useState({
    postedDate: true,
    domain: true,
    liveUrl: true,
    anchorTag: true,
    title: true,
    description: true,
    targetedPage: true,
    da: true,
    pa: true,
    ss: true,
    backLinkType: true,
    statusType: true,
    remarks: true,
  });

  return (
    <div style={{ height: "100vh" }} className="container-fluid">
      <div className="row align-items-start align-items-md-center gap-1 flex-column flex-md-row justify-content-between">
        <div className="col-12 col-md-3">
          <TittleHeader
            title={"SEO Reports"}
            message={"You can add and view your reports here."}
          />
        </div>

        <div className="col-12 col-md-6 d-flex align-items-center justify-content-between gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`form-select ms-0 ms-md-auto rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            style={{ maxWidth: "fit-content" }}
          >
            <option value="recent">Recent</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week (Mon-Sun)</option>
            <option value="thisMonth">This Month</option>
            <option value="thisQuarter">This Quarter</option>
            <option value="thisHalfYear">This Half Year</option>
            <option value="thisYear">This Year</option>
          </select>

          <div style={{ position: "relative", width: "fit-content" }}>
            <button
              title="Options"
              onClick={() => setShowOption((prev) => !prev)}
              className={`${
                showOption
                  ? darkMode
                    ? "bg-primary p-2 d-flex align-items-center justify-content-between rounded-2 text-light border dark-placeholder"
                    : "bg-primary p-2 d-flex align-items-center justify-content-between rounded-2 text-light border-0 light-placeholder"
                  : darkMode
                  ? "bg-light p-2 d-flex align-items-center justify-content-between rounded-2 text-dark border dark-placeholder"
                  : "bg-dark p-2 d-flex align-items-center justify-content-between rounded-2 text-light border-0 light-placeholder"
              }`}
            >
              <IoOptionsOutline className="fs-5" />
            </button>
            {showOption && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "100%",

                  width: "fit-content",
                  padding: ".5rem",
                  zIndex: "100",
                  border: "1px solid rgba(0,0,0,.3)",
                }}
                className=" d-flex text-black flex-column rounded-2 shadow-sm bg-light"
              >
                {Object.keys(columnVisibility).map((column) => (
                  <div
                    key={column}
                    className="form-check d-flex align-items-center gap-2 form-check-inline"
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={column}
                      checked={columnVisibility[column]}
                      onChange={(e) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          [column]: e.target.checked,
                        }))
                      }
                    />
                    <label
                      style={{ whiteSpace: "pre" }}
                      className="form-check-label "
                      htmlFor={column}
                    >
                      {column.charAt(0).toUpperCase() +
                        column.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          {userData.Account === 3 && (
            <button
              style={{ whiteSpace: "pre" }}
              className="btn d-flex align-items-center gap-3 btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Single
              <span className="d-flex align-items-center gap-2">
                <FaWindows />
                Alt + S
              </span>
            </button>
          )}
          {userData.Account === 3 && (
            <button
              style={{ whiteSpace: "pre" }}
              className="btn d-flex align-items-center gap-3 btn-primary"
              onClick={() => setShowModalMany(true)}
            >
              + Multi
              <span className="d-flex align-items-center gap-2">
                <FaWindows />
                Alt + M
              </span>
            </button>
          )}
        </div>
      </div>{" "}
      <div
        className={`table-responsive container-fluid ${
          darkMode ? " tableParent-light" : " tableParent-dark"
        }`}
      >
        <div
          style={{
            height: "fit-content",
            maxHeight: "75vh",
            overflow: "auto",
            position: "relative",
          }}
          className={`${styles.scroller}`}
        >
          {sortedReports.length > 0 ? (
            <table
              style={{ position: "relative" }}
              className="table mb-0 table-hover table-striped"
            >
              <thead>
                <tr>
                  <th style={rowHeadStyle(darkMode)}>S. No</th>
                  {userData.Account !== 3 && (
                    <th style={rowHeadStyle(darkMode)}>Created By</th>
                  )}
                  {userData.Account !== 3 && (
                    <th style={rowHeadStyle(darkMode)}>Manager</th>
                  )}
                  {columnVisibility.postedDate && (
                    <th style={rowHeadStyle(darkMode)}>Posted Date</th>
                  )}
                  {columnVisibility.domain && (
                    <th style={rowHeadStyle(darkMode)}>Domain</th>
                  )}
                  {columnVisibility.liveUrl && (
                    <th style={rowHeadStyle(darkMode)}>Live URL</th>
                  )}
                  {columnVisibility.anchorTag && (
                    <th style={rowHeadStyle(darkMode)}>Anchor Tag</th>
                  )}
                  {columnVisibility.title && (
                    <th style={rowHeadStyle(darkMode)}>Title</th>
                  )}
                  {columnVisibility.description && (
                    <th style={rowHeadStyle(darkMode)}>Description</th>
                  )}
                  {columnVisibility.targetedPage && (
                    <th style={rowHeadStyle(darkMode)}>Targeted Page</th>
                  )}
                  {columnVisibility.da && (
                    <th style={rowHeadStyle(darkMode)}>DA</th>
                  )}
                  {columnVisibility.pa && (
                    <th style={rowHeadStyle(darkMode)}>PA</th>
                  )}
                  {columnVisibility.ss && (
                    <th style={rowHeadStyle(darkMode)}>SS</th>
                  )}
                  {columnVisibility.backLinkType && (
                    <th style={rowHeadStyle(darkMode)}>Backlink Type</th>
                  )}
                  {columnVisibility.statusType && (
                    <th style={rowHeadStyle(darkMode)}>Status Type</th>
                  )}
                  {columnVisibility.remarks && (
                    <th style={rowHeadStyle(darkMode)}>Remarks</th>
                  )}
                </tr>
              </thead>
              <hr className="m-0 py-1" style={{ opacity: "0" }} />
              <tbody>
                {sortedReports.map((report, index) => (
                  <tr key={index}>
                    <td className="text-center" style={rowBodyStyle(darkMode)}>
                      {index + 1}
                    </td>
                    {userData.Account !== 3 && (
                      <td style={rowBodyStyle(darkMode)}>
                        {report.user.FirstName} {report.user.LastName}
                      </td>
                    )}
                    {userData.Account !== 3 && (
                      <td style={rowBodyStyle(darkMode)}>
                        {report.user.reportManager}
                      </td>
                    )}
                    {columnVisibility.postedDate && (
                      <td style={rowBodyStyle(darkMode)}>
                        <span
                          style={{
                            color:
                              report.statusType === "Active"
                                ? "inherit"
                                : "red",
                          }}
                        >
                          {formatDate(report.datePosted)}
                        </span>
                      </td>
                    )}

                    {columnVisibility.domain && (
                      <td style={rowBodyStyle(darkMode)}>
                        <a
                          style={{
                            color:
                              report.statusType === "Active"
                                ? "inherit"
                                : "red",
                            textDecoration: "none",
                          }}
                          href={report.domain}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {report.domain}
                        </a>
                      </td>
                    )}
                    {columnVisibility.liveUrl && (
                      <td style={rowBodyStyle(darkMode)}>
                        <a
                          style={{
                            color:
                              report.statusType === "Active"
                                ? "inherit"
                                : "red",
                            position: "relative",
                            textDecoration: "none",
                          }}
                          className="d-flex"
                          href={report.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {sortedReports.filter(
                            (r) => r.liveUrl === report.liveUrl
                          ).length > 1 && (
                            <span
                              onMouseEnter={() =>
                                setShowTooltip(report.liveUrl)
                              }
                              onMouseLeave={() => setShowTooltip(null)}
                              style={{
                                width: "fit-content",
                                position: "relative",
                              }}
                              className={`d-flex align-items-center justify-content-between mx-2 ms-2 ${
                                darkMode ? "badge-danger" : "badge-danger-dark"
                              }`}
                            >
                              <IoMdLink className="fs-5" />
                              {showTooltip === report.liveUrl && (
                                <div
                                  className={
                                    darkMode
                                      ? "badge-danger"
                                      : "badge-danger-dark"
                                  }
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: "100%",
                                    // transform: "translateX(-50%)",
                                    marginTop: "5px",
                                    padding: "5px 10px",
                                    color: "white",
                                    borderRadius: "5px",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                    zIndex: 1000,
                                  }}
                                >
                                  The link provided is a duplicate.
                                </div>
                              )}
                            </span>
                          )}

                          {report.liveUrl}
                        </a>
                      </td>
                    )}
                    {columnVisibility.anchorTag && (
                      <td style={rowBodyStyle(darkMode)}>
                        <span
                          style={{
                            color:
                              report.statusType === "Active"
                                ? "inherit"
                                : "red",
                          }}
                        >
                          {report.anchorTag}
                        </span>
                      </td>
                    )}
                    {columnVisibility.title && (
                      <td style={rowBodyStyle(darkMode)}>
                        <span
                          style={{
                            color:
                              report.statusType === "Active"
                                ? "inherit"
                                : "red",
                          }}
                        >
                          {report.title}
                        </span>
                      </td>
                    )}
                    {columnVisibility.description && (
                      <td
                        style={{
                          ...rowBodyStyle(darkMode),
                        }}
                      >
                        <textarea
                          name=""
                          id=""
                          style={{
                            color:
                              report.statusType === "Active"
                                ? "inherit"
                                : "red",
                            minWidth: "15rem",
                            height: "2rem",
                          }}
                          value={report.description}
                          className={`form-control ms-0 ms-md-auto rounded-2 ${
                            darkMode
                              ? "bg-light text-dark border dark-placeholder"
                              : "bg-dark text-light border-0 light-placeholder"
                          }`}
                        ></textarea>
                      </td>
                    )}
                    {columnVisibility.targetedPage && (
                      <td style={rowBodyStyle(darkMode)}>
                        <span
                          style={{
                            color:
                              report.statusType === "Active"
                                ? "inherit"
                                : "red",
                          }}
                        >
                          {report.targetedPage}
                        </span>
                      </td>
                    )}
                    {columnVisibility.da && (
                      <td style={rowBodyStyle(darkMode)}>
                        <span
                          style={{
                            color:
                              report.statusType === "Active"
                                ? "inherit"
                                : "red",
                          }}
                        >
                          {report.da}
                        </span>{" "}
                      </td>
                    )}
                    {columnVisibility.pa && (
                      <td style={rowBodyStyle(darkMode)}>
                        <span
                          style={{
                            color:
                              report.statusType === "Active"
                                ? "inherit"
                                : "red",
                          }}
                        >
                          {report.pa}
                        </span>{" "}
                      </td>
                    )}
                    {columnVisibility.ss && (
                      <td style={rowBodyStyle(darkMode)}>
                        <span
                          style={{
                            color:
                              report.statusType === "Active"
                                ? "inherit"
                                : "red",
                          }}
                        >
                          {report.ss} %
                        </span>{" "}
                      </td>
                    )}
                    {columnVisibility.backLinkType && (
                      <td style={rowBodyStyle(darkMode)}>
                        <span
                          style={{
                            color:
                              report.statusType === "Active"
                                ? "inherit"
                                : "red",
                          }}
                        >
                          {report.backLinkType}
                        </span>
                      </td>
                    )}
                    {columnVisibility.statusType && (
                      <td style={rowBodyStyle(darkMode)}>
                        {report.statusType === "Active" ? (
                          <span
                            style={{ fontWeight: "normal" }}
                            className={
                              darkMode ? "badge-success" : "badge-success-dark"
                            }
                          >
                            {report.statusType}
                          </span>
                        ) : (
                          <span
                            style={{ fontWeight: "normal" }}
                            className={
                              darkMode ? "badge-danger" : "badge-danger-dark"
                            }
                          >
                            {report.statusType}
                          </span>
                        )}
                      </td>
                    )}
                    {columnVisibility.remarks && (
                      <td
                        style={{
                          ...rowBodyStyle(darkMode),
                        }}
                      >
                        <textarea
                          name=""
                          id=""
                          value={report.remarks}
                          className={`form-control ms-0 ms-md-auto rounded-2 ${
                            darkMode
                              ? "bg-light text-dark border dark-placeholder"
                              : "bg-dark text-light border-0 light-placeholder"
                          }`}
                          style={{ height: "2rem", minWidth: "15rem" }}
                        ></textarea>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <hr className="m-0 pt-3" style={{ opacity: "0" }} />
            </table>
          ) : (
            <div
              style={{
                width: "100%",
                height: "75vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: darkMode ? "black" : "white",
              }}
            >
              <img
                style={{ height: "15rem", width: "auto" }}
                src={noreport}
                alt=""
              />
              <p className="text-center mt-5">{noDataMessages[filterType]}</p>
            </div>
          )}
        </div>
      </div>
      <FullPageModel show={showModal} setShow={setShowModal}>
        <AddMarketingReport onClick={(prev) => setShowModal(!prev)} />
      </FullPageModel>
      <FullPageModel show={showModalMany} setShow={setShowModalMany}>
        <AddMarketingReportMany onClick={(prev) => setShowModalMany(!prev)} />
      </FullPageModel>
    </div>
  );
};

export default ViewMarketingReport;
