import React, { useEffect, useState } from "react";
import "./PersonalInfoTable.css";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Link } from "react-router-dom";

import "./profilePage.css";

import FloralAbstract from "./FloralAbstract.jpg";
import { GoDotFill, GoPencil } from "react-icons/go";
import { IoArrowBackCircle } from "react-icons/io5";
import Education from "../EmpEducation/Education";
import WorkExperience from "../EmpWorkExp/WorkExperience";
import Document from "../Document/Document.jsx";
import FamilyInfo from "../EmpFamily/FamilyInfo";
import BASE_URL from "../../../Pages/config/config.js";

import { useLocation } from "react-router-dom";
import { useTheme } from "../../../Context/TheamContext/ThemeContext.js";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader.jsx";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api.js";
const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const PersonalInfoTable = (props) => {
  const location = useLocation().pathname.split("/")[2];
  const { userData} = useSelector((state)=> state.user);

  const [personalInfoData, setPersonalInfoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [activeSection, setActiveSection] = useState("personalInfo");
  const { darkMode } = useTheme();

  const id =
    location === "employee" ? props.data["_id"] :  userData?._id;;
  const loadPersonalInfoData = () => {
    api
      .get(`/api/personal-info/${id}`, {
      })
      .then((response) => {
        const data = response.data;
        setPersonalInfoData(data);
        setLoading(false);

        const temp = {
          data,
          FirstName: data["FirstName"] || "Not Avaiable",
          MiddleName: data["MiddleName"] || "Not Avaiable",
          LastName: data["LastName"] || "Not Avaiable",
          empID: data["empID"] || "Not Avaiable",
          Gender: data["Gender"] || "Not Avaiable",
          ContactNo: data["ContactNo"] || "Not Avaiable",
          Email: data["Email"] || "Not Avaiable",
          PANcardNo: data["PANcardNo"] || "Not Avaiable",
          DOB: data["DOB"].slice(0, 10) || "Not Avaiable",
          BloodGroup: data["BloodGroup"] || "Not Avaiable",
          EmergencyContactNo: data["EmergencyContactNo"] || "Not Avaiable",
          presonalEmail: data["presonalEmail"] || "Not Avaiable",
          Hobbies: data["Hobbies"] || "Not Avaiable",
          PresentAddress: data["PresentAddress"] || "Not Avaiable",
          PermanetAddress: data["PermanetAddress"] || "Not Avaiable",
          RoleName: data["role"][0] ? data["role"][0]["RoleName"] : "",
          DateOfJoining: data["DateOfJoining"].slice(0, 10),
          reportManager: data["reportManager"] || "Not Available", // Check if this value exists
          reportHr: data["reportHr"] || "Not Avaiable", // Corrected here
          DepartmentName: data["department"][0]
            ? data["department"][0]["DepartmentName"]
            : "",
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
        const response = await api.get(
          `/api/personal-info/${id}`,
        );
        setEmail(response.data.Email);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadPersonalInfoData();
  }, []);

 const fetchData = async () => {
  try {
    const response = await api.get(`/api/tasks`, {
     
    });
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
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Accepted"
    )
  ).length;

  const rejectedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Rejected"
    )
  ).length;

  const completedTasksCount = tasks.filter(
    (task) =>
      task.status === "Pending" &&
      task.employees.some((emp) => emp.emptaskStatus === "Completed")
  ).length;

  const pendingTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) => taskemp.empemail === email && task.status === "Pending"
    )
  ).length;

  const rowBodyStyle = {
    background: darkMode
      ? "var(--secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--primaryDashMenuColor)",
  };

  return (
    <div className="container-fluid">
      <div id="clear-both" />
      {!loading ? (
        <div
          style={{ maxHeight: "100%", minHeight: "80vh" }}
          className="row mx-auto"
        >
          <div
            style={{
              backgroundPosition: "center",
              backgroundSize: "cover",
              background: darkMode ? "#FFFFFF" : "#0e0d0d",
              color: darkMode ? "#080808" : "#ffffff",
       
            }}
            className="col-1 m-0 p-2 rounded-2 shadow-sm"
          >
            <span
              onClick={() => onToggleSection("personalInfo")}
              style={{
                whiteSpace: "pre",
                background:
                  activeSection === "personalInfo" ? "#a8fcf175" : "none",
                color: darkMode ? "#000000" : "#ffffff",
                borderRadius: "0",
              }}
              className="rounded-3 my-3 py-1 d-flex align-items-center px-3 gap-2"
            >
              Personal
            </span>
            <span
              onClick={() => onToggleSection("companyInfo")}
              style={{
                whiteSpace: "pre",
                background:
                  activeSection === "companyInfo" ? "#99d9f394" : "none",
                color: darkMode ? "#000000" : "#ffffff",
                borderRadius: "0",
              }}
              className="rounded-3 my-3 py-1 d-flex align-items-center px-3 gap-2"
            >
              Company
            </span>
            <span
              onClick={() => onToggleSection("Educationalinfo")}
              style={{
                whiteSpace: "pre",
                background:
                  activeSection === "Educationalinfo" ? "#99d9f394" : "none",
                color: darkMode ? "#000000" : "#ffffff",
                borderRadius: "0",
              }}
              className="rounded-3 my-3 py-1 d-flex align-items-center px-3 gap-2"
            >
              Education
            </span>
            <span
              onClick={() => onToggleSection("Document")}
              style={{
                whiteSpace: "pre",
                background: activeSection === "Document" ? "#99d9f394" : "none",
                color: darkMode ? "#000000" : "#ffffff",
                borderRadius: "0",
              }}
              className="rounded-3 my-3 py-1 d-flex align-items-center px-3 gap-2"
            >
              Documents
            </span>
            <span
              onClick={() => onToggleSection("WorkExperience")}
              style={{
                whiteSpace: "pre",
                background:
                  activeSection === "WorkExperience" ? "#99d9f394" : "none",
                color: darkMode ? "#000000" : "#ffffff",
                borderRadius: "0",
              }}
              className="rounded-3 my-3 py-1 d-flex align-items-center px-3 gap-2"
            >
              Experience
            </span>
            <span
              onClick={() => onToggleSection("otherInfo")}
              style={{
                whiteSpace: "pre",
                background:
                  activeSection === "otherInfo" ? "#99d9f394" : "none",
                color: darkMode ? "#000000" : "#ffffff",
                borderRadius: "0",
              }}
              className="rounded-3 my-3 py-1 d-flex align-items-center px-3 gap-2"
            >
              Family
            </span>
          </div>

          <div className="row col-11 d-flex mx-auto flex-column gap-3">
            <div className="m-0 p-0">
              {activeSection === "personalInfo" && (
                <h4 className="m-0 p-0">My Profile </h4>
              )}
              {activeSection === "companyInfo" && (
                <h4 className="m-0 p-0">Company </h4>
              )}
              {activeSection === "Educationalinfo" && (
                <h4 className="m-0 p-0">Education </h4>
              )}
              {activeSection === "Document" && (
                <h4 className="m-0 p-0">Documents </h4>
              )}
              {activeSection === "WorkExperience" && (
                <h4 className="m-0 p-0">Experience </h4>
              )}
              {activeSection === "otherInfo" && (
                <h4 className="m-0 p-0">Family </h4>
              )}
            </div>
            <div
              style={{
                height: "fit-content",
                backgroundPosition: "center",
                backgroundSize: "cover",
                overflow: "hidden",
                background: darkMode ? "#FFFFFF" : "#0e0d0d",
                color: darkMode ? "#080808" : "#ffffff",
                width: "100%",
                
              }}
              className="m-0 p-2 rounded-2 shadow-sm "
            >
              {rowData.map((items, index) => {
                return (
                  <div key={index}>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        style={{
                          height: "4rem",
                          width: "4rem",
                          borderRadius: "50%",
                        }}
                      >
                        <img
                          src={
                            items?.data?.profile?.image_url
                              ? items?.data?.profile?.image_url
                              : "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
                          }
                          alt="employee"
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="m-1">
                          {items.FirstName} {personalInfoData.LastName}
                        </h4>
                        {/* <p className="m-0">{items.empID}</p> */}

                        <p className="m-1">{items.Email}</p>
                        <div className="d-flex align-items-center gap-2">
                          <p
                            style={{ width: "fit-content" }}
                            className={
                              darkMode ? "badge-warning" : "badge-warning-dark"
                            }
                          >
                            {items.DepartmentName}
                          </p>
                          <p
                            style={{ width: "fit-content" }}
                            className={
                              darkMode ? "badge-primary" : "badge-primary-dark"
                            }
                          >
                            {items.PositionName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                height: "fit-content",
                backgroundPosition: "center",
                backgroundSize: "cover",
                overflow: "hidden",
                background: darkMode ? "#FFFFFF" : "#0e0d0d",
                color: darkMode ? "#080808" : "#ffffff",
                       height:"59vh"
                      //  height:"69vh"
              }}
              className="m-0 p-2 rounded-2 shadow-sm "
            >
              {activeSection === "personalInfo" && (
                <div className="row">
                  <div
                    className="pb-0"
                    id="companyinfo"
                    style={{
                      overflow: "hidden auto",
                      // height: "100%",
                      // width: "100%",
                      scrollbarWidth: "thin",
                      scrollbarwidth: "none",
                      height:"59vh"
                    }}
                  >
                    {rowData.map((items, index) => {
                      return (
                        <div className="row w-100 rouned-2 container-fluid mx-auto justify-content-start py-3 row-gap-2">
                          <div className="col-12 d-flex align-items-center justify-content-between">
                            <h5>Information</h5>
                            <span
                              onClick={() =>
                                props.onEditPersonalInfo(items.data)
                              }
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                height: "2.1rem",
                                width: "2.1rem",
                                borderRadius: "50%",
                                background: darkMode
                                  ? "#6fa5e486"
                                  : "#6aa9f090",
                                color: darkMode ? "#1a41c4" : "#ffffff",
                                cursor: "pointer",
                              }}
                            >
                              <GoPencil />
                            </span>
                          </div>

                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.FirstName}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Last Name
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.LastName}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.ContactNo}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Emergency Contact
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.EmergencyContactNo}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Presonal Email
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.presonalEmail}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Gender
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.Gender}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Date of Birth
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.DOB.slice(0, 10)}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Blood Group
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.BloodGroup}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              PAN Number
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.PANcardNo}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Present Address
                            </label>

                            <textarea
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.PresentAddress}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Permanent Address
                            </label>

                            <textarea
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
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
                <div className="row">
                  <div
                    style={{
                      overflow: "hidden auto",
                      height: "100%",
                      scrollbarWidth: "thin",
                      
                    }}
                  >
                    {rowData.map((items, index) => {
                      return (
                        <div className="row container-fluid mx-auto justify-content-start py-3 row-gap-3">
                          <div className="col-12 d-flex align-items-center justify-content-between">
                            <h5>Details</h5>
                            <span
                              onClick={() =>
                                props.onEditPersonalInfo(items.data)
                              }
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                height: "2.1rem",
                                width: "2.1rem",
                                borderRadius: "50%",
                                background: darkMode
                                  ? "#6fa5e486"
                                  : "#6aa9f090",
                                color: darkMode ? "#1a41c4" : "#ffffff",
                                cursor: "pointer",
                              }}
                            >
                              <GoPencil />
                            </span>
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Employee ID
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.empID}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Work Email
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.Email}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Role
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.RoleName}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Position
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.PositionName}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Department
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.DepartmentName}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Date of Joining
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.DateOfJoining}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Account Access
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.Account}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Reporting Manager
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
                              value={items.reportManager}
                            />
                          </div>
                          <div className="col-12 col-sm-6 d-flex flex-column">
                            <label htmlFor="" className="text-muted">
                              Reporting HR
                            </label>
                            <input
                              type="text"
                              className="border-0 rounded-1 py-2 text-capitalize px-1 bg-light "
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
                <div className="w-100 h-100  container ">
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
