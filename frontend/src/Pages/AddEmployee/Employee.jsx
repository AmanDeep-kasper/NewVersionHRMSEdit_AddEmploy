import React, { useState } from "react";
import axios from "axios";
import "./Employee.css";

import EmployeeTable from "./EmployeeTable.jsx";
import EmployeeForm from "./EmployeeForm.jsx";
import EmployeeFormEdit from "./EmployeeFormEdit.jsx";
import { Route, Routes, useNavigate } from "react-router-dom";
import PersonalInfo from "../../Component/Employee/EmpPresonal/PersonalInfo.jsx";
import Education from "../../Component/Employee/EmpEducation/Education.jsx";
import FamilyInfo from "../../Component/Employee/EmpFamily/FamilyInfo.jsx";
import WorkExperience from "../../Component/Employee/EmpWorkExp/WorkExperience.jsx";
import BASE_URL from "../config/config.js";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../config/api.js";

const Employee = () => {
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
        userType === 1
          ? "admin"
          : userType === 2
            ? "hr"
            : userType === 4
              ? "manager"
              : ""
      }/employee/info/personal-info`,
    );
  };

  const handleBack = () => {
    setEmpInfoBool(false);
  };

  const handleEmployeeSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("Email", event.target[0].value.toLowerCase());
    formData.append("Password", event.target[1].value);
    formData.append("Account", event.target[2].value);
    formData.append("RoleID", event.target[3].value);
    formData.append("Gender", addFormGender);
    formData.append("FirstName", event.target[6].value);
    formData.append("LastName", event.target[7].value);
    formData.append("DOB", event.target[8].value);
    formData.append("ContactNo", event.target[9].value);
    formData.append("DepartmentID", event.target[10].value);
    formData.append("PositionID", event.target[11].value);
    formData.append("DateOfJoining", event.target[12].value);
    formData.append("profile", event.target[13].files[0]);
    formData.append(
      "reportManager",
      event.target[14].value === "Select your option"
        ? ""
        : event.target[14].value,
    );
    formData.append(
      "reportHr",
      event.target[15].value === "Select your option"
        ? ""
        : event.target[15].value,
    );
    formData.append(
      "shifts",
      event.target[16].value === "Select Shift" ? "" : event.target[16].value,
    );

    formData.append("BankName", event.target[17].value || "N/A");
    formData.append("BankAccount", event.target[18].value || "N/A");
    formData.append("BankIFSC", event.target[19].value || "N/A");
    formData.append("UANNumber", event.target[20].value || "N/A");
    formData.append("PANcardNo", event.target[21].value || "N/A");
    formData.append("LocationType", event.target[22].value);
    formData.append("allowMobileLogin", "Not Allowed");
    formData.append("isFullandFinal", "No");
    formData.append("status", "active");
    formData.append("loginStatus", "loggedOut");
    await api
      .post(`/api/employee`, formData, {})
      .then((res) => {
        setTable(false);
        setTable(true);
        toast.success("Employee Created Successfylly");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          const data = err.response.data;
          if (data && data.missingFields && Array.isArray(data.missingFields)) {
            toast.error(
              `Missing required fields: ${data.missingFields.join(", ")}`,
            );
          } else if (typeof data === "string") {
            toast.error(data);
          } else if (data && data.message) {
            toast.error(data.message);
          } else {
            toast.error("Please fill all required fields.");
          }
        }
      });
  };

  const handleAddEmployee = () => {
    setTable(false);
  };

const handleEditEmployee = async (employee) => {
  try {
    // 🔥 Always fetch fresh data using ID
    const res = await api.get(`/api/employeeIdEditForm/${employee._id}`);

    if (res.data?.success) {
      const emp = res.data.data;

      setEditData(emp);
      setEditFormGender(emp.Gender || "");
      setEditStatus(emp.status || "active");
      setEditAllowMobileLogin(emp.allowMobileLogin || "Allowed");
      setEditFullandFinal(emp.isFullandFinal || "No");
      setEditForm(true);
    } else {
      toast.error("Unable to load employee data");
    }
  } catch (error) {
    console.error("Edit load error:", error);
    toast.error("Failed to load employee details");
  }
};


  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };
  const handleEmployeeEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();

    const formData = new FormData();
    formData.append("Email", newInfo.target[0].value.toLowerCase());
    formData.append("Account", newInfo.target[1].value);
    formData.append("RoleID", newInfo.target[2].value);
    formData.append("Gender", editFormGender);
    formData.append("FirstName", newInfo.target[5].value);
    formData.append("LastName", newInfo.target[6].value);
    formData.append("DOB", newInfo.target[7].value);
    formData.append("ContactNo", newInfo.target[8].value);
    formData.append("DepartmentID", newInfo.target[9].value);
    formData.append("PositionID", newInfo.target[10].value);
    formData.append("DateOfJoining", newInfo.target[11].value);
    formData.append("profile", newInfo.target[12]?.files[0]);

    formData.append(
      "reportManager",
      newInfo.target[13].value === "Select your option"
        ? ""
        : newInfo.target[13].value,
    );

    formData.append(
      "reportHr",
      newInfo.target[14].value === "Select your option"
        ? ""
        : newInfo.target[14].value,
    );

    formData.append("BankName", newInfo.target[15].value || "N/A");
    formData.append("BankAccount", newInfo.target[16].value || "N/A");
    formData.append("BankIFSC", newInfo.target[17].value || "N/A");
    formData.append("UANNumber", newInfo.target[18].value || "N/A");
    formData.append("PANcardNo", newInfo.target[19].value || "N/A");
    formData.append("LocationType", newInfo.target[20].value);
    if (editAllowMobileLogin && editAllowMobileLogin.trim() !== "") {
      formData.append("allowMobileLogin", editAllowMobileLogin);
    }

    if (editFullandFinal && editFullandFinal.trim() !== "") {
      formData.append("isFullandFinal", editFullandFinal);
    }

    formData.append("status", editStatus || "active");

    api
      .put(`/api/employee/${info["_id"]}`, formData)
      .then((res) => {
        toast.success(res.data?.message || "Employee updated successfully");
        setTable(false);
        setTable(true);
        setEditForm(false);
      })
      .catch((err) => {
        console.error("Update Error:", err);

        // ✅ THIS IS THE IMPORTANT FIX
        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
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

export default Employee;
