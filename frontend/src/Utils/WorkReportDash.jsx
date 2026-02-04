import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../Context/TheamContext/ThemeContext";
import { FaChartBar } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";
import { fetchMarketingReports } from "../redux/slices/marketingReportSlice";
import { Link } from "react-router-dom";

const WorkReportDash = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { marketingReports = [] } = useSelector(
    (state) => state.marketingReports
  );
  const { darkMode } = useTheme();

  useEffect(() => {
    dispatch(fetchMarketingReports());
  }, [dispatch]);

  // Safety check
  if (!userData?._id) return null;

  const filteredReportByUser = marketingReports.filter(
    (data) => data.user === userData._id
  );

  const now = new Date();

  const reportsToday = filteredReportByUser.filter((report) => {
    const reportDate = new Date(report.datePosted);
    return (
      reportDate.getDate() === now.getDate() &&
      reportDate.getMonth() === now.getMonth() &&
      reportDate.getFullYear() === now.getFullYear()
    );
  });

  const reportsThisMonth = filteredReportByUser.filter((report) => {
    const reportDate = new Date(report.datePosted);
    return (
      reportDate.getMonth() === now.getMonth() &&
      reportDate.getFullYear() === now.getFullYear()
    );
  });

  const reportsThisYear = filteredReportByUser.filter((report) => {
    const reportDate = new Date(report.datePosted);
    return reportDate.getFullYear() === now.getFullYear();
  });

  return (
    <div
      className="shadow-sm rounded-2 d-flex flex-column gap-2 p-2 px-3"
      style={{
        height: "18rem",
        overflow: "hidden",
        color: darkMode ? "black" : "white",
        background: darkMode ? "#F5F5F6" : "#161515f6",
        border: darkMode
          ? "1px solid rgba(223, 220, 220, 0.95)"
          : "1px solid rgba(39, 36, 36, 0.95)",
      }}
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mt-2">
        <span
          className="d-flex align-items-center gap-2"
          style={{
            color: darkMode ? "#3c3c3c" : "#f2f2f2",
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          <FaChartBar className="fs-5" />
          Marketing Report
        </span>

        <Link to="/employee/viewReport">
          <span
            className={`d-flex align-items-center py-1 ${
              darkMode ? "badge-primary" : "badge-primary-dark"
            }`}
            style={{ cursor: "pointer" }}
          >
            <FaChevronRight />
          </span>
        </Link>
      </div>

      {/* Body */}
      <div
        className="p-2 px-3 rounded-3 d-flex flex-column align-items-center justify-content-center"
        style={{
          height: "13rem",
          overflow: "auto",
          background: darkMode ? "#ededf1f4" : "#252424c3",
        }}
      >
        <div className="d-flex justify-content-around gap-3 w-100">
          {/* Today */}
          <ReportBox
            count={reportsToday.length}
            label="Today"
            color="success"
            iconBorder="green"
            darkMode={darkMode}
          />

          {/* This Month */}
          <ReportBox
            count={reportsThisMonth.length}
            label="This Month"
            color="primary"
            iconBorder="blue"
            darkMode={darkMode}
          />

          {/* This Year */}
          <ReportBox
            count={reportsThisYear.length}
            label="This Year"
            color="danger"
            iconBorder="red"
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};

const ReportBox = ({ count, label, color, iconBorder, darkMode }) => (
  <h1
    className={`fw-bold text-${color} my-0 p-3 px-4 rounded-2 shadow-sm`}
    style={{
      position: "relative",
      border: "1.5px dashed gray",
      minWidth: "7rem",
      textAlign: "center",
    }}
  >
    <span
      className={`fs-4 fw-normal ${darkMode ? "bg-white" : "bg-dark"}`}
      style={{
        position: "absolute",
        left: ".3rem",
        top: "-.8rem",
        transform: "translate(-50%)",
        height: "2rem",
        width: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: `1px dashed ${iconBorder}`,
      }}
    >
      <IoIosLink />
    </span>

    {count}

    <span
      className={`fs-6 fw-normal badge-${color}`}
      style={{
        position: "absolute",
        left: "50%",
        bottom: "-1.1rem",
        transform: "translate(-50%)",
        border: `1px dashed ${iconBorder}`,
      }}
    >
      {label}
    </span>
  </h1>
);

export default WorkReportDash;
