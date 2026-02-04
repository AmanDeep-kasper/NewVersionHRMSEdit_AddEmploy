import React from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { SiMinutemailer } from "react-icons/si";
import { TbPhoneCalling } from "react-icons/tb";
const Profile = () => {
  const getBackgroundColor = (accountType) => {
    switch (accountType) {
      case "Admin":
        return "#8EAC50";
      case "HR":
        return "#0079FF";
      case "Employee":
        return "purple";
      default:
        return "#FF9B50";
    }
  };
  return (
    <div className="p-4">
      <div id="clear-both" />

      <div className="employee-card-holder">
        <div
          style={{
            boxShadow: "4px 4px 3px rgba(226, 223, 223, 0.608)",
            border: "1px solid rgba(226, 223, 223, 0.608) ",
            overflow: "hidden",
            maxWidth: "250px",
          }}
          className="card-top-upper position-relative bg-light text-center px-2 py-3  rounded-3  my-3"
        >
          <div>
            <div
              style={{
                width: "fit-content",
                right: "7%",
                top: "3%",
                position: "absolute",
                color: "white",
                zIndex: "1",
                cursor: "pointer",
              }}
            >
              <button
                // onClick={() => props.onEmpInfo(items.data)}
                className=" btn p-0 text-white"
                to=""
              >
                <IoMdInformationCircleOutline className="fs-4" />
              </button>
            </div>
          </div>
          <div
            className="card-top-upper"
            style={{
              position: "absolute",
              height: "30%",
              width: "100%",
              background: getBackgroundColor(),
              top: "0%",
              right: "0",
              borderRadius: "0% 0% 50% 50%",
              opacity: "80%",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: "0%",
              display: "flex",
              width: "94%",
              justifyContent: "space-between",
            }}
            className="div m-auto"
          >
            <button
              //   onClick={() => props.onEditEmployee(items.data)}
              style={{ zIndex: "1", cursor: "pointer" }}
              className="btn"
            >
              <FaRegEdit className="fs-4 text-primary bg-white p-1 rounded-5" />
            </button>
            <button
              //   onClick={() => onEmployeeDelete(items.data["_id"])}
              style={{ zIndex: "1", cursor: "pointer" }}
              className="btn"
            >
              <MdDeleteForever className="fs-4 text-danger bg-white p-1 rounded-5" />
            </button>
          </div>
          <div
            className="card-top-lower"
            style={{
              position: "absolute",
              height: "30%",
              width: "100%",
              background: getBackgroundColor(),
              bottom: "0%",
              right: "0",
              borderRadius: "50% 50% 0% 0% ",
              opacity: "30%",
            }}
          ></div>
          <div className="row mb-3">
            <div className="col-12 d-flex justify-center aline-center">
              <div
                style={{
                  height: "90px",
                  width: "90px",
                  overflow: "hidden",
                  borderRadius: "50%",
                  padding: "2px",
                }}
                className="profile-image bg-white "
              >
                <img
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  className="m-auto"
                  src="https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
                  alt=""
                />
              </div>
            </div>
            <div className="col-12 text-start d-flex flex-column gap-0 text-center position-relative">
              <p
                style={{
                  fontSize: ".9rem",
                  width: "fit-content",
                }}
                className="m-auto my-2 text-uppercase  bg-warning px-2 rounded-5 text-white fw-bold"
              >
                {/* {items.empID} */}
              </p>
              <p className=" w-100 fs-5 m-auto fw-bolder text-uppercase text-primary">
                {/* {items.FirstName} {items.LastName} */}
              </p>
              <p className=" text-uppercase w-100 text-muted m-auto  fw-bold mb-3">
                {/* {items.PositionName} */}
              </p>
            </div>
            <div className="details d-flex flex-column gap-0">
              <a
                // href={`mailto:${items.Email}`}
                style={{
                  textShadow: "2px 2px 3px gray",
                  cursor: "pointer",
                  zIndex: "1",
                  opacity: "60%",
                }}
                className="m-auto bg-primary px-1 text-decoration-none my-auto d-flex text-white justify-center aline-center rounded-5 d-flex gap-2 aline-center"
              >
                <SiMinutemailer style={{ height: "100%" }} />
                <p
                  style={{ transition: "1s ease" }}
                  className="hover_number rounded-5 m-auto"
                >
                  {/* {items.Email} */}
                </p>
              </a>
              <a
                // href={`tel:${items.ContactNo}`}
                style={{
                  cursor: "pointer",
                  zIndex: "1",
                  opacity: "100%",
                }}
                className="m-auto mt-1 px-1 bg-white text-decoration-none my-auto d-flex text-muted justify-center aline-center rounded-5 d-flex gap-2 aline-center"
              >
                <TbPhoneCalling />
                {/* {items.ContactNo} */}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit } from "@fortawesome/free-solid-svg-icons";
// import { RingLoader } from "react-spinners";
// import { css } from "@emotion/core";
// import { Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import employee from "../../img/employe.bmp";
// import InnerDashContainer from "../InnerDashContainer";
// import { IoMdInformationCircleOutline } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
// import { SiMinutemailer } from "react-icons/si";
// import { TbPhoneCalling } from "react-icons/tb";
// import "./profilePage.css";

// const override = css`
//   display: block;
//   margin: 0 auto;
//   margin-top: 45px;
//   border-color: red;
// `;

// const PersonalInfoTable = (props) => {
//   const [personalInfoData, setPersonalInfoData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [rowData, setRowData] = useState([]);

//   const loadPersonalInfoData = () => {
//     axios
//       .get(`http://localhost:4000/api/personal-info/${props.data["_id"]}`, {
//         headers: {
//           authorization: localStorage.getItem("token") || ""
//         }
//       })
//       .then((response) => {
//         const data = response.data;
//         setPersonalInfoData(data);
//         setLoading(false);

//         const temp = {
//           data,
//           FirstName: data["FirstName"] || "Not Avaiable",
//           MiddleName: data["MiddleName"] || "Not Avaiable",
//           LastName: data["LastName"] || "Not Avaiable",
//           empID: data["empID"] || "Not Avaiable",
//           Gender: data["Gender"] || "Not Avaiable",
//           ContactNo: data["ContactNo"] || "Not Avaiable",
//           Email: data["Email"] || "Not Avaiable",
//           PANcardNo: data["PANcardNo"] || "Not Avaiable",
//           DOB: data["DOB"].slice(0, 10) || "Not Avaiable",
//           Hobbies: data["Hobbies"] || "Not Avaiable",
//           PresentAddress: data["PresentAddress"] || "Not Avaiable",
//           PositionName: data["position"][0]
//             ? data["position"][0]["PositionName"]
//             : ""
//         };

//         setRowData([temp]);
//       })
//       .catch((error) => {
//
//       });
//   };

//   useEffect(() => {
//     loadPersonalInfoData();
//   }, [props.data]);

//   const onPersonalInfoDelete = (e) => {
//
//     if (window.confirm("Are you sure to delete this record? ")) {
//       axios
//         .delete(`http://localhost:4000/api/personalInfo/${e}`, {
//           headers: {
//             authorization: localStorage.getItem("token") || ""
//           }
//         })
//         .then(() => {
//           loadPersonalInfoData();
//         })
//         .catch((err) => {
//
//         });
//     }
//   };

//   const renderEditButton = (params) => {
//     if (props.back) {
//       return <React.Fragment />;
//     }
//     return (
//       <FontAwesomeIcon
//         icon={faEdit}
//         onClick={() => props.onEditPersonalInfo(params.data.data)}
//       />
//     );
//   };
//   const getBackgroundColor = (accountType) => {
//     switch (accountType) {
//       case "Admin":
//         return "#8EAC50";
//       case "HR":
//         return "#0079FF";
//       case "Employee":
//         return "purple";
//       default:
//         return "#FF9B50";
//     }
//   };

//   return (
//     // <div className="col-lg-12">
//     //   <h3 className="fw-bolder text-muted">
//     //     Profile{" "}
//     //     {props.back
//     //       ? "of " +
//     //         personalInfoData["FirstName"] +
//     //         " " +
//     //         personalInfoData["LastName"]
//     //       : ""}
//     //   </h3>
//     //   {props.back ? (
//     //     <Link to="/hr/employee">
//     //       <Button variant="primary" id="add-button">
//     //         Back
//     //       </Button>
//     //     </Link>
//     //   ) : (
//     //     <React.Fragment />
//     //   )}

//     //   <div id="clear-both" />

//     //   {!loading ? (
//     //     <div className="employee-card-holder">
//     //       {rowData.map((items, index) => (
//     //         <div
//     //           key={index}
//     //           style={{
//     //             boxShadow: "4px 4px 3px rgba(226, 223, 223, 0.608)",
//     //             border: "1px solid rgba(226, 223, 223, 0.608) ",
//     //             overflow: "hidden",
//     //             maxWidth: "250px"
//     //           }}
//     //           className="card-top-upper position-relative bg-light text-center px-2 py-3  rounded-3  my-3"
//     //         >
//     //           <div>
//     //             <div
//     //               style={{
//     //                 width: "fit-content",
//     //                 right: "7%",
//     //                 top: "3%",
//     //                 position: "absolute",
//     //                 color: "white",
//     //                 zIndex: "1",
//     //                 cursor: "pointer"
//     //               }}
//     //             ></div>
//     //           </div>
//     //           <div
//     //             className="card-top-upper"
//     //             style={{
//     //               position: "absolute",
//     //               height: "30%",
//     //               width: "100%",
//     //               background: getBackgroundColor(items.Account),
//     //               top: "0%",
//     //               right: "0",
//     //               borderRadius: "0% 0% 50% 50%",
//     //               opacity: "80%"
//     //             }}
//     //           ></div>
//     //           <div
//     //             style={{
//     //               position: "absolute",
//     //               bottom: "0%",
//     //               display: "flex",
//     //               width: "94%",
//     //               justifyContent: "space-between"
//     //             }}
//     //             className="div m-auto"
//     //           >
//     //             <button
//     //               onClick={() => props.onEditPersonalInfo(items.data)}
//     //               style={{ zIndex: "1", cursor: "pointer" }}
//     //               className="btn"
//     //             >
//     //               <FaRegEdit className="fs-4 text-primary bg-white p-1 rounded-5" />
//     //             </button>
//     //           </div>
//     //           <div
//     //             className="card-top-lower"
//     //             style={{
//     //               position: "absolute",
//     //               height: "30%",
//     //               width: "100%",
//     //               background: getBackgroundColor(items.Account),
//     //               bottom: "0%",
//     //               right: "0",
//     //               borderRadius: "50% 50% 0% 0% ",
//     //               opacity: "30%"
//     //             }}
//     //           ></div>
//     //           <div className="row mb-3">
//     //             <div className="col-12 d-flex justify-center aline-center">
//     //               <div
//     //                 style={{
//     //                   height: "90px",
//     //                   width: "90px",
//     //                   overflow: "hidden",
//     //                   borderRadius: "50%",
//     //                   padding: "2px"
//     //                 }}
//     //                 className="profile-image bg-white "
//     //               >
//     //                 <img
//     //                   style={{
//     //                     height: "100%",
//     //                     width: "100%",
//     //                     objectFit: "cover"
//     //                   }}
//     //                   className="m-auto"
//     //                   src="https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
//     //                   alt=""
//     //                 />
//     //               </div>
//     //             </div>
//     //             <div className="col-12 text-start d-flex flex-column gap-0 text-center position-relative">
//     //               <p
//     //                 style={{
//     //                   fontSize: ".9rem",
//     //                   width: "fit-content"
//     //                 }}
//     //                 className="m-auto my-2 text-uppercase  bg-warning px-2 rounded-5 text-white fw-bold"
//     //               >
//     //                 {items.empID}
//     //               </p>
//     //               <p className=" w-100 fs-5 m-auto fw-bolder text-uppercase text-primary">
//     //                 {items.FirstName} {items.LastName}
//     //               </p>
//     //               <p className=" text-uppercase w-100 text-muted m-auto  fw-bold mb-3">
//     //                 {items.PositionName}
//     //               </p>
//     //             </div>
//     //             <div className="details d-flex flex-column gap-0">
//     //               <a
//     //                 href={`mailto:${items.Email}`}
//     //                 style={{
//     //                   textShadow: "2px 2px 3px gray",
//     //                   cursor: "pointer",
//     //                   zIndex: "1",
//     //                   opacity: "60%"
//     //                 }}
//     //                 className="m-auto bg-primary px-1 text-decoration-none my-auto d-flex text-white justify-center aline-center rounded-5 d-flex gap-2 aline-center"
//     //               >
//     //                 <SiMinutemailer style={{ height: "100%" }} />
//     //                 <p
//     //                   style={{ transition: "1s ease" }}
//     //                   className="hover_number rounded-5 m-auto"
//     //                 >
//     //                   {items.Email}
//     //                 </p>
//     //               </a>
//     //               <a
//     //                 href={`tel:${items.ContactNo}`}
//     //                 style={{
//     //                   cursor: "pointer",
//     //                   zIndex: "1",
//     //                   opacity: "100%"
//     //                 }}
//     //                 className="m-auto mt-1 px-1 bg-white text-decoration-none my-auto d-flex text-muted justify-center aline-center rounded-5 d-flex gap-2 aline-center"
//     //               >
//     //                 <TbPhoneCalling />
//     //                 {items.ContactNo}
//     //               </a>
//     //             </div>
//     //           </div>
//     //         </div>
//     //       ))}
//     //     </div>
//     //   ) : (
//     //     <div id="loading-bar">
//     //       <RingLoader
//     //         css={override}
//     //         sizeUnit={"px"}
//     //         size={50}
//     //         color={"#0000ff"}
//     //         loading={true}
//     //       />
//     //     </div>
//     //   )}
//     // </div>
//     <div className="info-page">
//       <div className="card">
//         {/* <div className='ProfilePage-image'>
//             <img src={product1} alt='employee' />
//         </div> */}
//         card
//       </div>

//       <div className="profilePage">
//         <div className="company_info ">
//           <div className="company_info_heading">
//             <h3>Personal Information</h3>
//           </div>
//           <div className="company_info_content">
//             <div className="company_info_content_left">
//               <div className="company_info_content_left_section">
//                 <p>FirstName</p> <h4>Abhay</h4>
//               </div>

//               <div className="company_info_content_left_section">
//                 <p>MiddleName</p> <h4>Pratap</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>LastName</p> <h4>Singh</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>DOB</p> <h4>14/45/1458</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>ContactNo</p> <h4>7531597412</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>EmployeeCode</p> <h4>KASPE012</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>DateOfJoining</p> <h4>14/45/1458</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>EmployeeID</p> <h4>25</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>Role</p> <h4>Front End Developer</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>Position</p> <h4>Employee</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>Department</p> <h4>Web Developement</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>Salary</p> <h4>25,000</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="company_info personal">
//           <div className="company_info_heading">
//             <h3>Company Information</h3>
//           </div>
//           <div className="company_info_content">
//             <div className="company_info_content_left">
//               <div className="company_info_content_left_section">
//                 <p>CompanyName</p> <h4>Kasper infotech pvt ltd</h4>
//               </div>

//               <div className="company_info_content_left_section">
//                 <p>Website</p> <h4>kasperinfotech.org</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>Email</p> <h4>info@gmail.com</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>ContactPerson</p> <h4>12345467890</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>ContactNo</p> <h4>234567890</h4>
//               </div>

//               <div className="company_info_content_left_section">
//                 <p>City</p> <h4>Noida</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>State</p> <h4>Uttar Pradesh</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>Country</p> <h4>India</h4>
//               </div>
//               <div className="company_info_content_left_section">
//                 <p>Address</p>{" "}
//                 <h4>Office Number 214, Tower B, The iThum Towers, Sector 62</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfoTable;

{
  /* <div className="profilePage  ">
<div className=" col-md-6 profilePage-profile shadow-sm rounded-3">
  <div className="ProfilePage-image">
    <img src={employee} alt="employee" />
  </div>
  <div className="profilePage-details">
    <h2 className="text-capitalize text-white">
      {personalInfoData.FirstName} {personalInfoData.LastName}
    </h2>
    <p>{personalInfoData.Email}</p>
    <p>{rowData.PositionName}</p>
  </div>
</div>
<div className="company_info">
  <div className="company_info_heading">
    <h5 className="fw-bold text-white">Personal Information</h5>
  </div>
  <div className="company_info_content">
    <div className="company_info_content_left">
      <div className="row justify-content-between">
        <div className="company_info_content_left_section col-12 col-md-3">
          <p className="d-flex justify-content-between ">
            First Name <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4 className="text-capitalize">
            {personalInfoData.FirstName}{" "}
          </h4>
        </div>
        <div className="company_info_content_left_section col-12 col-md-3">
          <p className="d-flex justify-content-between ">
            Middle Name{" "}
            <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4 className="text-capitalize">
            {personalInfoData.MiddleName}
          </h4>
        </div>
        <div className="company_info_content_left_section col-12 col-md-3">
          <p className="d-flex justify-content-between text-c ">
            Last Name <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4 className="text-capitalize">
            {personalInfoData.LastName}
          </h4>
        </div>
      </div>
      <div className="row justify-content-between">
        <div className="company_info_content_left_section col-12 col-3">
          <p className="d-flex justify-content-between ">
            Date Of Birth{" "}
            <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{personalInfoData.DOB.slice(0, 10)}</h4>
        </div>
        <div className="company_info_content_left_section col-12 col-3">
          <p className="d-flex justify-content-between ">
            Personal email
            <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{personalInfoData.Email}</h4>
        </div>
        <div className="company_info_content_left_section col-12 col-3">
          <p className="d-flex justify-content-between ">
            Mobile No <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{personalInfoData.ContactNo}</h4>
        </div>
      </div>
      <div className="row justify-content-between">
        <div className="company_info_content_left_section col-12 col-3">
          <p className="d-flex justify-content-between ">
            Blood Group
            <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{personalInfoData.BloodGroup}</h4>
        </div>
        <div className="company_info_content_left_section col-12 col-3">
          <p className="d-flex justify-content-between ">
            Age<span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>18</h4>
        </div>
        <div className="company_info_content_left_section col-12 col-3">
          <p className="d-flex justify-content-between ">
            PANcardNo <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{personalInfoData.PANcardNo}</h4>
        </div>
      </div>
      <div className="row justify-content-between">
        <div className="company_info_content_left_section col-12 col-md-3">
          <p className="d-flex justify-content-between ">
            Qualification
            <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>Btech</h4>
        </div>
        <div className="company_info_content_left_section col-12 col-md-3">
          <p className="d-flex justify-content-between ">
            Address<span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{personalInfoData.PresentAddress}</h4>
        </div>
      </div>
    </div>
  </div>
</div>
<div className="company_info">
  <div className="company_info_heading">
    <h5 className="fw-bold text-white">Company Information</h5>
  </div>
  <div className="company_info_content">
    <div className="company_info_content_left">
      <div className="row justify-content-between">
        <div className="company_info_content_left_section col-12 col-md-3">
          <p className="d-flex justify-content-between ">
            Emp ID <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{personalInfoData.empID}</h4>
        </div>
        <div className="company_info_content_left_section">
          <p className="d-flex justify-content-between ">
            Date Of Joining{" "}
            <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{personalInfoData.DateOfJoining.slice(0, 10)}</h4>
        </div>
        <div className="company_info_content_left_section col-12 col-md-3">
          <p className="d-flex justify-content-between ">
            Account Access{" "}
            <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{personalInfoData.Account}</h4>
        </div>
      </div>

      <div className="row justify-content-between">
        <div className="company_info_content_left_section col-12 col-3">
          <p>
            Contact <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{personalInfoData.ContactNo}</h4>
        </div>
      </div>
      <div className="row justify-content-between">
        <div className="company_info_content_left_section col-12 col-md-3">
          <p className="d-flex justify-content-between ">
            Role <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{personalInfoData.PANcardNo}</h4>
        </div>
        <div className="company_info_content_left_section col-12 col-md-3">
          <p className="d-flex justify-content-between ">
            Position <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4> {personalInfoData.PositionName}</h4>
        </div>
        <div className="company_info_content_left_section col-12 col-md-3">
          <p className="d-flex justify-content-between ">
            Department <span style={{ paddingRight: "1rem" }}>:</span>
          </p>{" "}
          <h4>{rowData.DepartmentName}</h4>
        </div>
      </div>
    </div>
  </div>
</div>
</div> */
}
