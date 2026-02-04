import React, { useState } from "react";
import axios from "axios";
import "../../../Pages/AddEmployee/Employee.css";

import EmployeeTable from "../../../Pages/AddEmployee/EmployeeTable.jsx";
import EmployeeFormEdit from "../../../Pages/AddEmployee/EmployeeFormEdit.jsx";
import EmployeeForm from "../../../Pages/AddEmployee/EmployeeForm.jsx";
import {
  HashRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Education from "../../Employee/EmpEducation/Education.jsx";
import FamilyInfo from "../../Employee/EmpFamily/FamilyInfo.jsx";
import WorkExperience from "../../Employee/EmpWorkExp/WorkExperience.jsx";
import PersonalInfo from "../../Employee/EmpPresonal/PersonalInfo.jsx";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../../Pages/config/api.js";

const AdminEmployee = () => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const [addFormGender, setAddFormGender] = useState("");
  const [editFormGender, setEditFormGender] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [empInfo, setEmpInfo] = useState({});
  const [empInfoBool, setEmpInfoBool] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const userType = userData?.Account;
  const [editAllowMobileLogin, setEditAllowMobileLogin] = useState("");
  const [editFullandFinal, setEditFullandFinal] = useState("");

  const navigate = useNavigate();

  const handleEmpInfo = (e) => {
    setEmpInfo(e);
    sessionStorage.setItem("personal_id", e._id);
    sessionStorage.setItem("personal_email", e.Email);
    navigate(
      `/${
        userType === 1 ? "admin" : userType === 2 ? "hr" : ""
      }/employee/info/personal-info`,
    );
  };

  const handleBack = () => {
    setEmpInfoBool(false);
  };

  // Submit by empolyee
  const handleEmployeeSubmit = async (e, form) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("Email", form.email.toLowerCase());
    formData.append("Password", form.password);
    formData.append("Account", form.accountAccess);
    formData.append("RoleID", form.role);
    formData.append("Gender", form.gender);

    formData.append("FirstName", form.firstName);
    formData.append("LastName", form.lastName);
    formData.append("DOB", form.dob);
    formData.append("ContactNo", form.contactNo);

    formData.append("DepartmentID", form.department);
    formData.append("PositionID", form.position);
    formData.append("DateOfJoining", form.doj);

    if (form.profileImage) {
      formData.append("profile", form.profileImage);
    }

    // formData.append("reportManager", form.reportingManager || "");
    if (form.reportingManager) {
      formData.append("reportManager", form.reportingManager);
    }

    // formData.append("reportHr", form.reportingHr || "");
    if (form.reportingHr) {
      formData.append("reportHr", form.reportingHr);
    }

    // formData.append("shifts", form.shift || "");
    if (form.shift) {
      formData.append("shifts", form.shift);
    }

    // formData.append("BankName", form.bankName || "N/A");
    // formData.append("BankAccount", form.bankAccount || "N/A");
    // formData.append("BankIFSC", form.bankIFSC || "N/A");
    // formData.append("UANNumber", form.uan || "N/A");
    // formData.append("PANcardNo", form.pan || "N/A");
    if (form.bankName) formData.append("BankName", form.bankName);
    if (form.bankAccount) formData.append("BankAccount", form.bankAccount);
    if (form.bankIFSC) formData.append("BankIFSC", form.bankIFSC);
    if (form.uan) formData.append("UANNumber", form.uan);
    if (form.pan) formData.append("PANcardNo", form.pan);

    

    formData.append("LocationType", form.locationType);
    formData.append("allowMobileLogin", "Not Allowed");
    formData.append("status", "active");
    formData.append("loginStatus", "loggedOut");

    try {
      await api.post("/api/employee", formData);
      toast.success("Employee Created Successfully");
      setTable(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleAddEmployee = () => {
    setTable(false);
  };

  const handleEditEmployee = (e) => {
    setEditForm(true);
    setEditData(e);
    setEditFormGender(e["Gender"]);
    setEditStatus(e["status"]);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  // Edit by empolyee

  const handleEmployeeEditUpdate = (info, event) => {
    event.preventDefault();

    if (event.target[9].value) {
    }

    const formData = new FormData();

    formData.append("Email", event.target[0].value.toLowerCase());
    formData.append("Account", event.target[1].value);
    formData.append("RoleID", event.target[2].value);
    formData.append("Gender", editFormGender);
    formData.append("FirstName", event.target[5].value);
    // formData.append("MiddleName", event.target[6].value);
    formData.append("LastName", event.target[6].value);
    formData.append("DOB", event.target[7].value);
    formData.append("ContactNo", event.target[8].value);
    // formData.append("EmployeeCode", event.target[10].value);
    formData.append("DepartmentID", event.target[9].value);
    formData.append("PositionID", event.target[10].value);
    formData.append("DateOfJoining", event.target[11].value);
    // formData.append("profile", event.target[12].files[0]);
    if (event.target[12]?.files?.length > 0) {
      formData.append("profile", event.target[12].files[0]);
    }

    // formData.append(
    //   "reportManager",
    //   event.target[13].value === "Select your option"
    //     ? ""
    //     : event.target[13].value,
    // );
    if (event.target[13].value !== "Select your option") {
      formData.append("reportManager", event.target[13].value);
    }

    // formData.append(
    //   "reportHr",
    //   event.target[14].value === "Select your option"
    //     ? ""
    //     : event.target[14].value,
    // );

    if (event.target[14].value !== "Select your option") {
      formData.append("reportHr", event.target[14].value);
    }

    // formData.append("BankName", event.target[15].value || "N/A");
    // formData.append("BankAccount", event.target[16].value || "N/A");
    // formData.append("BankIFSC", event.target[17].value || "N/A");
    // formData.append("UANNumber", event.target[18].value || "N/A");
    // formData.append("PANcardNo", event.target[19].value || "N/A");

    if (event.target[15].value)
      formData.append("BankName", event.target[15].value);
    if (event.target[16].value)
      formData.append("BankAccount", event.target[16].value);
    if (event.target[17].value)
      formData.append("BankIFSC", event.target[17].value);
    if (event.target[18].value)
      formData.append("UANNumber", event.target[18].value);
    if (event.target[19].value)
      formData.append("PANcardNo", event.target[19].value);

    formData.append("LocationType", event.target[20].value);
    formData.append("allowMobileLogin", editAllowMobileLogin);
    formData.append("isFullandFinal", editFullandFinal);
    formData.append("status", editStatus);

    // console.log("Submitting allowMobileLogin:", editAllowMobileLogin);

    api
      // .put(`/api/employee/${info["_id"]}`, formData, {})
      // .then((res) => {
      //   setTable(false);
      //   setTable(true);
      //   setEditForm(false);
      // })
      // .catch((err) => {
      //   if (err.response.status === 400) {
      //     alert(err.response.data);
      //   }
      // });

      .put(`/api/employee/${info._id}`, formData)
      .then(() => {
        toast.success("Employee Updated Successfully");
        setEditForm(false);
        setTable(true);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Update failed");
      });
  };

  const handleAddFormGenderChange = (e) => {
    setAddFormGender(e.currentTarget.value);
  };

  const handleEditFormGenderChange = (e) => {
    setEditFormGender(e.currentTarget.value);
  };
  const handleEditFormStatusChange = (e) => {
    setEditStatus(e.currentTarget.value);
  };
  const handleEditFormMobileAllowChange = (value) => {
    setEditAllowMobileLogin(value);
  };

  const handleEditFormFullandFinalChange = (value) => {
    setEditFullandFinal(value);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          table ? (
            editForm ? (
              <EmployeeFormEdit
                onEmployeeEditUpdate={handleEmployeeEditUpdate}
                onFormEditClose={handleEditFormClose}
                editData={editData}
                onGenderChange={handleEditFormGenderChange}
                onStatusChange={handleEditFormStatusChange}
                onMobileAllowChange={handleEditFormMobileAllowChange}
                onFullandFinalChange={handleEditFormFullandFinalChange}
              />
            ) : (
              <EmployeeTable
                onAddEmployee={handleAddEmployee}
                onEditEmployee={handleEditEmployee}
                onEmpInfo={handleEmpInfo}
              />
            )
          ) : (
            <EmployeeForm
              onEmployeeSubmit={handleEmployeeSubmit}
              onFormClose={handleFormClose}
              onGenderChange={handleAddFormGenderChange}
            />
          )
        }
      />

      <Route
        path="info/personal-info"
        element={<PersonalInfo data={empInfo} back={true} />}
      />
      <Route
        path="info/education"
        element={<Education data={empInfo} back={true} />}
      />
      <Route
        path="info/family-info"
        element={<FamilyInfo data={empInfo} back={true} />}
      />
      <Route
        path="info/work-experience"
        element={<WorkExperience data={empInfo} back={true} />}
      />
    </Routes>
  );
};

export default AdminEmployee;
