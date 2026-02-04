import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Link } from "react-router-dom";
// import "./profilePage.css";
import { FaCamera, FaEye, FaFilePdf, FaRegEdit } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import FloralAbstract from "../../EmpPresonal/FloralAbstract.jpg";
import { GoDotFill } from "react-icons/go";
import { IoArrowBackCircle, IoEye } from "react-icons/io5";
import BASE_URL from "../../../../Pages/config/config";
import api from "../../../../Pages/config/api";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const EmpProfile = (props) => {
  const [personalInfoData, setPersonalInfoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [showDownloadbtn, setShowDownloadbtn] = useState(false);
  const [visibleDocs, setVisibleDocs] = useState(true);
  const { userData} = useSelector((state)=> state.user);
  const employeeId = userData._id;
  const loadPersonalInfoData = () => {
    api
      .get(`/api/personal-info/` + employeeId, {
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
          Hobbies: data["Hobbies"] || "Not Avaiable",
          PresentAddress: data["PresentAddress"] || "Not Avaiable",
          PermanetAddress: data["PermanetAddress"] || "Not Avaiable",
          RoleName: data["role"][0] ? data["role"][0]["RoleName"] : "",
          DateOfJoining: data["DateOfJoining"].slice(0, 10),

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
            : ""
        };

        setRowData([temp]);
      })
      .catch((error) => {
          
      });
  };

  useEffect(() => {
    loadPersonalInfoData();
  }, [props.data]);

  const onToggleSection = (section) => {
    setActiveSection(section);
  };

  const onPersonalInfoDelete = (e) => {
      
    if (window.confirm("Are you sure to delete this record? ")) {
      api
        .delete(`/api/personalInfo/${e}`, {
        })
        .then(() => {
          loadPersonalInfoData();
        })
        .catch((err) => {
            
        });
    }
  };

  const renderEditButton = (params) => {
    if (props.back) {
      return <React.Fragment />;
    }
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => props.onEditPersonalInfo(params.data.data)}
      />
    );
  };

  return (
    <div
      style={{
        height: "33rem",
        background: `url(${FloralAbstract})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        overflow: "hidden"
      }}
      className=" m-0 p-0 rounded-3 bg-white shadow"
    >
      {rowData.map((items, index) => {
        return (
          <div
            style={{
              backgroundColor: "rgba(258,258,258,.95)",
              position: "relative"
            }}
            className="d-flex flex-column gap-3 py-2 h-100"
            key={index}
          >
            <div
              className="d-flex flex-column gap-2"
              style={{ width: "100%", padding: "1rem 1rem" }}
            >
              <div
                className="mx-auto"
                style={{
                  height: "120px",
                  width: "120px",
                  border: "6px solid #39A7FF",
                  borderRadius: "50%",
                  position: "relative"
                }}
              >
                <img
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                  src={
                    items?.data?.profile?.image_url
                      ? items?.data?.profile?.image_url
                      : "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
                  }
                  alt="employee"
                />
                <button
                  style={{
                    height: "30px",
                    width: "30px",
                    borderRadius: "50%",
                    border: "3px solid white",
                    position: "absolute",
                    bottom: "0",
                    right: "0"
                  }}
                  className="btn btn-primary text-white d-flex p-1 "
                >
                  <FaCamera className="m-auto" />
                </button>
              </div>
              <p
                style={{ position: "absolute", top: "0", left: "0" }}
                className="btn btn-success px-2 py-0 m-2 rounded-5 fw-bold shadow"
              >
                {items.empID}
              </p>
              {/* <p className="m-auto fw-bold fs-6">{items.empID}</p> */}
              <h3 className="text-capitalize my-0 fw-bold text-muted text-center">
                {items.FirstName} {personalInfoData.LastName}
              </h3>
              <p className="text-capitalize my-0 fw-bold text-center">
                {items.RoleName} {items.DepartmentName}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmpProfile;
