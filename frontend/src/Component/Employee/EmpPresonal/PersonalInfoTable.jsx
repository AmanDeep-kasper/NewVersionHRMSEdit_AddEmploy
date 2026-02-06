import React, { useEffect, useState } from "react";
import "./PersonalInfoTable.css";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import "./profilePage.css";

import FloralAbstract from "./FloralAbstract.jpg";
import { GoDotFill } from "react-icons/go";
import Education from "../EmpEducation/Education";
import WorkExperience from "../EmpWorkExp/WorkExperience";
import Document from "../Document/Document.jsx";
import FamilyInfo from "../EmpFamily/FamilyInfo";
import BASE_URL from "../../../Pages/config/config.js";

import { useLocation } from "react-router-dom";
import { useTheme } from "../../../Context/TheamContext/ThemeContext.js";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader.jsx";
import { useSelector } from "react-redux";
import { convertToAmPm } from "../../../Utils/GetDayFormatted.jsx";
import {
  MdCompareArrows,
  MdOutlineClose,
  MdOutlineDownloading,
} from "react-icons/md";
import api from "../../../Pages/config/api.js";
const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const PersonalInfoTable = (props) => {
  const location = useLocation().pathname.split("/")[2];
  const { userData } = useSelector((state) => state.user);
  const id =
    location === "employee"
      ? sessionStorage.getItem("personal_id")
      : userData?._id;
  const [personalInfoData, setPersonalInfoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [showlargeProfile, setShowlargeProfile] = useState(false);
  const [activeSection, setActiveSection] = useState(
    sessionStorage.getItem("activeSection") || "personalInfo",
  );
  const { darkMode } = useTheme();

  const loadPersonalInfoData = () => {
    api
      .get(`/api/personal-info/${id}`, {})
      .then((response) => {
        const data = response.data;
        setPersonalInfoData(data);
        setLoading(false);
        console.log(data)
        const temp = {
          data,
          FirstName: data["FirstName"] || "Not Available",
          MiddleName: data["MiddleName"] || "Not Available",
          LastName: data["LastName"] || "Not Available",
          empID: data["empID"] || "Not Available",
          Gender: data["Gender"] || "Not Available",
          ContactNo: data["ContactNo"] || "Not Available",
          Email: data["Email"] || "Not Available",
          PANcardNo: data["PANcardNo"] || "Not Available",
          UANNumber: data["PANcardNo"] || "Not Available",
          BankName: data["BankName"] || "Not Available",
          BankAccount: data["BankAccount"] || "Not Available",
          BankIFSC: data["BankIFSC"] || "Not Available",
          DOB: data["DOB"].slice(0, 10) || "Not Available",
          BloodGroup: data["BloodGroup"] || "Not Available",
          EmergencyContactNo: data["EmergencyContactNo"] || "Not Available",
          presonalEmail: data["presonalEmail"] || "Not Available",
          Hobbies: data["Hobbies"] || "Not Available",
          PresentAddress: data["PresentAddress"] || "Not Available",
          PermanetAddress: data["PermanetAddress"] || "Not Available",
          RoleName: data["role"][0] ? data["role"][0]["RoleName"] : "",
          DateOfJoining: data["DateOfJoining"].slice(0, 10),
          reportManager: data["reportManager"] || "Not Available", // Check if this value exists
          reportHr: data["reportHr"] || "Not Available", // Corrected here

          DepartmentName: data["department"][0]
            ? data["department"][0]["DepartmentName"]
            : "",
          shiftName: data["shifts"][0] ? data["shifts"][0]["name"] : "",
          shiftStart: data["shifts"][0] ? data["shifts"][0]["startTime"] : "",
          shiftEnd: data["shifts"][0] ? data["shifts"][0]["endTime"] : "",
          Account:
            data["Account"] === 1
              ? "Admin"
              : data["Account"] === 2
                ? "HR"
                : data["Account"] === 3
                  ? "Employee"
                  : data["Account"] === 4
                    ? "Manager"
                    : "",
          PositionName: data["position"][0]
            ? data["position"][0]["PositionName"]
            : "",
        };

        setRowData([temp]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadPersonalInfoData();
  }, [props.data]);

  useEffect(() => {
    sessionStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  // Function to handle section toggling
  const onToggleSection = (section) => {
    setActiveSection(section);
  };

  // task data
  const [tasks, setTasks] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await api.get(`/api/personal-info/${id}`);
        setEmail(response.data.Email);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadPersonalInfoData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`, {});
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
      setTimeout(fetchData, 60000);
    }
  };

  useEffect(() => {
    fetchData();

    return () => clearTimeout();
  }, []);

  // Count of different task statuses for the current employee
  const acceptedTasksCount = tasks.filter((task) =>
    task.employees?.some(
      (taskemp) =>
        taskemp.employee?.Email === email &&
        taskemp.empTaskStatus === "Accepted",
    ),
  ).length;
  const rejectedTasksCount = tasks.filter((task) =>
    task.employees?.some(
      (taskemp) =>
        taskemp.employee?.Email === email &&
        taskemp.empTaskStatus === "Rejected",
    ),
  ).length;

  const completedTasksCount = tasks.filter(
    (task) =>
      task.status === "Pending" &&
      task.employees.some((emp) => emp.empTaskStatus === "Completed"),
  ).length;

  const pendingTasksCount = tasks.filter((task) =>
    task.employees?.some(
      (taskemp) =>
        taskemp.employee?.Email === email && task.status === "Pending",
    ),
  ).length;

  const rowBodyStyle = {
    background: darkMode
      ? "var(--secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--primaryDashMenuColor)",
  };

  const colors = {
    bg: darkMode ? "#ffffff" : "#171717",
    border: darkMode ? "#e5e7eb" : "#333333",
    text: darkMode ? "#111827" : "#e5e7eb",
    muted: darkMode ? "#6b7280" : "#9ca3af",
    subtleBg: darkMode ? "#f9fafb" : "#1f1f1f",
    card: darkMode ? "#ffffff" : "#1c1c1c",

    textSecondary: darkMode ? "#6b7280" : "#9ca3af",
    today: "#16a34a",
    tomorrow: "#2563eb",
    soon: "#f59e0b",
  };

  return (
    <div
      style={{ height: "85vh", overflow: "auto" }}
      className="container-fluid pb-3 ">
      <div id="clear-both" />
      {!loading ? (
        <div className="d-flex flex-column pb-5">
          <div style={{ position: "relative" }} className="row">
            <div
              style={{
                minHeight: "80vh",
                maxHeight: "80vh",
              }}
              className="col-12 row mx-auto  justify-content-center align-items-start mt-4 gap-3 w-100">
              <div
                style={{
                  height: "35rem",
                  background: `url(${FloralAbstract})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                className="col-12 m-0 p-0  col-lg-4 rounded-3 bg-white shadow-sm">
                {rowData.map((items, index) => {
                  return (
                    <div
                      style={{
                        backgroundColor: darkMode
                          ? "rgba(258,258,258,.95)"
                          : "rgba(0, 0, 0, 0.88)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      className="d-flex flex-column rounded-2 gap-3 py-2 h-100"
                      key={index}>
                      <div className="d-flex align-items-center  gap-4 p-3">
                        <div
                          style={{
                            height: "5rem",
                            width: "5rem",
                            borderRadius: "50%",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                          }}>
                          {items?.data?.profile?.image_url ? (
                            <img
                              style={{
                                height: "100%",
                                width: "100%",
                                borderRadius: "50%",
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                              onClick={() => setShowlargeProfile(true)}
                              src={items?.data?.profile?.image_url}
                              alt={
                                items?.FirstName?.charAt(0).toUpperCase() ??
                                "" +
                                  " " +
                                  items?.LastName?.charAt(0).toUpperCase() ??
                                ""
                              }
                            />
                          ) : (
                            <span
                              style={{
                                fontSize: "35px",
                                fontWeight: "bold",
                                textAlign: "center",
                                lineHeight: "120px",
                              }}>
                              {items?.FirstName?.charAt(0).toUpperCase() ?? ""}
                              {items?.LastName?.charAt(0).toUpperCase() ?? ""}
                            </span>
                          )}
                        </div>
                        <div style={{ color: darkMode ? "black" : "white" }}>
                          <p className="m-0">#{items.empID}</p>
                          <h3 className="text-capitalize">
                            {items.FirstName} {personalInfoData.LastName}
                          </h3>
                          <p className="text-capitalize">{items.RoleName}</p>
                          <div>
                            <div>
                              <span
                                style={{ width: "fit-content" }}
                                className={`${
                                  darkMode
                                    ? "badge-primary text-uppercase fs-6"
                                    : "badge-primary-dark text-uppercase fs-6"
                                } `}>
                                {items.shiftName}
                              </span>
                              <span> {convertToAmPm(items.shiftStart)}</span>{" "}
                              <MdCompareArrows className="fs-5" />
                              <span>{convertToAmPm(items.shiftEnd)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex flex-column justify-content-between gap-2">
                        <div
                          style={rowBodyStyle}
                          className={`p-2  mx-3 d-flex px-3 justify-content-between rounded-2 ${
                            darkMode
                              ? "bg-light p-2 rounded-2 text-dark border dark-placeholder"
                              : "bg-dark p-2 d-flex align-items-center justify-content-between rounded-2 text-light border-0 light-placeholder"
                          }`}>
                          <span
                            style={{ alignItems: "center" }}
                            className="my-auto d-flex gap-2 ">
                            <GoDotFill className="text-primary fs-4" />
                            Total Assigned Task
                          </span>{" "}
                          <span className="text-primary my-auto">
                            {pendingTasksCount}
                          </span>
                        </div>
                        <div
                          style={rowBodyStyle}
                          className={`p-2  mx-3 d-flex px-3 justify-content-between rounded-2 ${
                            darkMode
                              ? "bg-light p-2 rounded-2 text-dark border dark-placeholder"
                              : "bg-dark p-2 d-flex align-items-center justify-content-between rounded-2 text-light border-0 light-placeholder"
                          }`}>
                          <span
                            style={{ alignItems: "center" }}
                            className="my-auto d-flex gap-2 ">
                            <GoDotFill className="text-warning fs-4" />
                            Total Active Task
                          </span>{" "}
                          <span className=" text-warning my-auto">
                            {acceptedTasksCount}
                          </span>
                        </div>
                        <div
                          style={rowBodyStyle}
                          className={`p-2  mx-3 d-flex px-3 justify-content-between rounded-2 ${
                            darkMode
                              ? "bg-light p-2 rounded-2 text-dark border dark-placeholder"
                              : "bg-dark p-2 d-flex align-items-center justify-content-between rounded-2 text-light border-0 light-placeholder"
                          }`}>
                          <span
                            style={{ alignItems: "center" }}
                            className="my-auto d-flex gap-2 ">
                            {" "}
                            <GoDotFill className="text-danger fs-4" />
                            Total Rejected Task
                          </span>{" "}
                          <span className=" my-auto text-danger">
                            {rejectedTasksCount}
                          </span>
                        </div>
                        <div
                          style={rowBodyStyle}
                          className={`p-2  mx-3 d-flex px-3 justify-content-between rounded-2 ${
                            darkMode
                              ? "bg-light p-2 rounded-2 text-dark border dark-placeholder"
                              : "bg-dark p-2 d-flex align-items-center justify-content-between rounded-2 text-light border-0 light-placeholder"
                          }`}>
                          <span
                            style={{ alignItems: "center" }}
                            className="my-auto d-flex gap-2 ">
                            <GoDotFill className="text-success fs-4" />
                            Total Completed Task
                          </span>{" "}
                          <span className=" my-auto text-success">
                            {completedTasksCount}
                          </span>
                        </div>
                      </div>
                      <span
                        onClick={() => props.onEditPersonalInfo(items.data)}
                        style={{
                          borderBottom:
                            activeSection === "documentDetails"
                              ? "4px solid blue"
                              : "none",
                          borderRadius: "0",
                          position: "absolute",
                          bottom: "0",
                          left: "0",
                          cursor: "pointer",
                        }}
                        className="btn px-3 w-100  btn-primary ">
                        Update Details
                      </span>
                      {showlargeProfile && (
                        <div
                          style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            height: "100%",
                            width: "100%",
                            zIndex: "50",
                          }}>
                          <span
                            style={{
                              position: "absolute",
                              top: "1rem",
                              right: "1rem",
                              height: "2rem",
                              width: "2rem",
                              borderRadius: "50%",
                              background: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => setShowlargeProfile(false)}>
                            <MdOutlineClose className="fs-5" />
                          </span>
                          <a
                            target="_blank"
                            href={items?.data?.profile?.image_url}
                            style={{
                              position: "absolute",
                              top: "1rem",
                              right: "3.5rem",
                              height: "2rem",
                              width: "2rem",
                              borderRadius: "50%",
                              background: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}>
                            <MdOutlineDownloading className="fs-4" />
                          </a>
                          <img
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            src={items?.data?.profile?.image_url}
                            alt={
                              (items?.FirstName
                                ? items.FirstName.toUpperCase()
                                : "") +
                              " " +
                              (items?.LastName
                                ? items.LastName.toUpperCase()
                                : "")
                            }
                          />{" "}
                          <span
                            className="rounded-2"
                            style={{
                              position: "absolute",
                              bottom: "1rem",
                              left: "1rem",
                              padding: ".2rem 1rem",
                              background: "rgba(255, 255, 255, 0.8)",
                            }}>
                            {(items?.FirstName
                              ? items.FirstName.toUpperCase()
                              : "") +
                              " " +
                              (items?.LastName
                                ? items.LastName.toUpperCase()
                                : "")}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  background: colors.card,
                  color: colors.textSecondary,
                  border: `2px solid ${colors.border}`,
                }}
                className={`col-12 col-lg-7 rounded-2  p-0 m-0 `}
                // style={rowBodyStyle}
              >
                <div
                  id="personalinfo"
                  style={{ height: "100%", overflow: "hidden" }}>
                  <div
                    style={{
                      background: darkMode
                        ? "var(--secondaryDashMenuColor)"
                        : "var(--secondaryDashColorDark)",
                      color: darkMode
                        ? "var(--secondaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      maxWidth: "100%",
                      overflow: "auto",
                      borderBottom: `1px solid ${
                        darkMode
                          ? "rgba(0,0,0,.1)"
                          : "rgba(233, 230, 230, 0.15)"
                      }`,
                      borderRadius: " 10px 10px 0 0",
                    }}
                    className={`shift-pages w-100 d-flex justify-content-start   px-2 gap-2 px-0 mb-3 ${
                      darkMode ? "bg-light" : "bg-black"
                    }`}>
                    <span
                      onClick={() => onToggleSection("personalInfo")}
                      style={{
                        whiteSpace: "pre",
                        borderBottom:
                          activeSection === "personalInfo"
                            ? "4px solid blue"
                            : "none",
                        borderRadius: "0",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        cursor: "pointer",
                      }}
                      className="py-2 px-3 d-flex align-items-center px-1 justify-content-center gap-2 ">
                      Personal
                    </span>
                    <span
                      onClick={() => onToggleSection("companyInfo")}
                      style={{
                        whiteSpace: "pre",
                        borderBottom:
                          activeSection === "companyInfo"
                            ? "4px solid blue"
                            : "none",
                        borderRadius: "0",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        cursor: "pointer",
                      }}
                      className="py-2 px-3 d-flex align-items-center px-1 justify-content-center gap-2 ">
                      Company
                    </span>
                    <span
                      onClick={() => onToggleSection("Educationalinfo")}
                      style={{
                        whiteSpace: "pre",
                        borderBottom:
                          activeSection === "Educationalinfo"
                            ? "4px solid blue"
                            : "none",
                        borderRadius: "0",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        cursor: "pointer",
                      }}
                      className="py-2 px-3 d-flex align-items-center px-1 justify-content-center gap-2 ">
                      Education
                    </span>

                    <span
                      onClick={() => onToggleSection("Document")}
                      style={{
                        whiteSpace: "pre",
                        borderBottom:
                          activeSection === "Document"
                            ? "4px solid blue"
                            : "none",
                        borderRadius: "0",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        cursor: "pointer",
                      }}
                      className="py-2 px-3 d-flex align-items-center px-1 justify-content-center gap-2 ">
                      Documents
                    </span>

                    <span
                      onClick={() => onToggleSection("WorkExperience")}
                      style={{
                        whiteSpace: "pre",
                        borderBottom:
                          activeSection === "WorkExperience"
                            ? "4px solid blue"
                            : "none",
                        borderRadius: "0",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        cursor: "pointer",
                      }}
                      className="py-2 px-3 d-flex align-items-center px-1 justify-content-center gap-2 ">
                      Experience
                    </span>
                    <span
                      onClick={() => onToggleSection("otherInfo")}
                      style={{
                        whiteSpace: "pre",
                        borderBottom:
                          activeSection === "otherInfo"
                            ? "4px solid blue"
                            : "none",
                        borderRadius: "0",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        cursor: "pointer",
                      }}
                      className="py-2 px-3 d-flex align-items-center px-1 justify-content-center gap-2 ">
                      Family
                    </span>
                  </div>
                  {activeSection === "personalInfo" && (
                    <div className="row">
                      <div
                        className="pb-3"
                        id="companyinfo"
                        style={{
                          overflow: "hidden auto",
                          height: "100%",
                          width: "100%",
                          scrollbarWidth: "thin",
                        }}>
                        {rowData.map((items, index) => {
                          return (
                            <div className="row w-100 container-fluid mx-auto justify-content-start py-3 row-gap-2">
                              <TittleHeader
                                title={"Personal Details"}
                                message={"You can view personal details here."}
                              />
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className=" ">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.FirstName}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className=" ">
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.LastName}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Phone Number
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.ContactNo}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Emergency Contact
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.EmergencyContactNo}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Personal Email
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-lowercase rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.presonalEmail}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Gender
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.Gender}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Date of Birth
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.DOB.slice(0, 10)}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Blood Group
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.BloodGroup}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  PAN Number
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-uppercase rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.PANcardNo}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  UAN Number
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-uppercase rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.UANNumber}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Bank Name
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-uppercase rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.BankName}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Bank Account Number
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.BankAccount}
                                />
                              </div>
                              <div className="col-12 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Bank IFSC Code
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.BankIFSC}
                                />
                              </div>
                              <div className="col-12  d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Present Address
                                </label>

                                <textarea
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.PresentAddress}
                                />
                              </div>
                              <div className="col-12 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Permanent Address
                                </label>

                                <textarea
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.PermanetAddress}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {activeSection === "companyInfo" && (
                    <div className="row pb-3">
                      <div
                        style={{
                          overflow: "hidden auto",
                          height: "100%",
                          scrollbarWidth: "thin",
                        }}>
                        {rowData.map((items, index) => {
                          return (
                            <div className="row container-fluid mx-auto justify-content-start py-3 row-gap-3">
                              <TittleHeader
                                title={"Company Details"}
                                message={"You can view company details here."}
                              />
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Employee ID
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.empID}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Work Email
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-lowercase rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.Email}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Role
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.RoleName}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Position
                                </label>
                                <input
                                  type="text"
                                  value={items.PositionName}
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Department
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.DepartmentName}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Date of Joining
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.DateOfJoining}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Account Access
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-capitalize rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.Account}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Reporting Manager
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-lowercase rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.reportManager}
                                />
                              </div>
                              <div className="col-12 col-sm-6 d-flex flex-column">
                                <label htmlFor="" className="  ">
                                  Reporting HR
                                </label>
                                <input
                                  type="text"
                                  className={`form-control  text-lowercase rounded-2 ${
                                    darkMode
                                      ? "bg-light text-dark border"
                                      : "bg-dark text-light border-0"
                                  }`}
                                  value={items.reportHr}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {activeSection === "Educationalinfo" && (
                    <div className="w-100 container ">
                      <Education data={props.data} />
                    </div>
                  )}

                  {activeSection === "Document" && (
                    <div className="w-100 container ">
                      <Document data={props.data} />
                    </div>
                  )}
                  {activeSection === "WorkExperience" && (
                    <div className="w-100 container ">
                      <WorkExperience data={props.data} />
                    </div>
                  )}
                  {activeSection === "otherInfo" && (
                    <div className="w-100 container ">
                      <FamilyInfo data={props.data} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="loading-bar">
          <RingLoader
            css={override}
            sizeUnit={"px"}
            size={50}
            color={"#0000ff"}
            loading={true}
          />
        </div>
      )}
    </div>
  );
};

export default PersonalInfoTable;
