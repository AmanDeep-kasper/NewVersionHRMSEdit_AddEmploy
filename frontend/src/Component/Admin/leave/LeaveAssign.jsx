import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import toast from "react-hot-toast";
import api from "../../../Pages/config/api";

const LeaveAssign = () => {
  const [empData, setEmpData] = useState([]);
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    employees: [],
    sickLeave: "",
    paidLeave: "",
    casualLeave: "",
    paternityLeave: "",
    maternityLeave: "",
  });

  const loadEmployeeData = () => {
    api
      .get(`/api/employee`, {
       
      })
      .then((response) => {
        const employees = response.data
          .filter((val) => {
            return (
              (val.Account === 2 || val.Account === 4) &&
              val.status === "active"
            );
          })
          .map((employee) => ({
            value: employee._id,
            label: employee.Email,
          }));
        setEmpData([
          { value: "select_all", label: "Select All" },
          ...employees,
        ]);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "" || (Number(value) >= 0 && !isNaN(value))) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "select_all")) {
      setFormData({
        ...formData,
        employees: empData.filter((option) => option.value !== "select_all"),
      });
    } else {
      setFormData({
        ...formData,
        employees: selectedOptions,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .post(`/api/assignLeave`, formData, {
        
      })

      .then((response) => {
        toast.success("Leave Assign Successfully");
        setFormData({
          employees: [],
          sickLeave: "",
          paidLeave: "",
          casualLeave: "",
          paternityLeave: "",
          maternityLeave: "",
        });
      })
      .catch((error) => {});
  };

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: "400px", // Increase maximum height further
      overflowY: "auto",
    }),
    // Optionally adjust menuPortal styles
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <TittleHeader
        title={"Assign Leave Form"}
        message={"You Can Assign leave to single employee or multiple here."}
      />
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="employees" className="form-label">
              Select Employees
            </label>
            <Select
              id="employees"
              className="rounded-0"
              name="employees"
              value={formData.employees}
              onChange={handleSelectChange}
              options={empData}
              isMulti
              closeMenuOnSelect={false}
              isClearable
              styles={customStyles}
              menuPlacement="bottom"
              menuPortalTarget={document.body}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="sickLeave" className="form-label">
              Sick Leave
            </label>
            <input
              type="number"
              className="form-control"
              id="sickLeave"
              name="sickLeave"
              value={formData.sickLeave}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="paidLeave" className="form-label">
              Paid Leave
            </label>
            <input
              type="number"
              className="form-control"
              id="paidLeave"
              name="paidLeave"
              value={formData.paidLeave}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="casualLeave" className="form-label">
              Casual Leave
            </label>
            <input
              type="number"
              className="form-control"
              id="casualLeave"
              name="casualLeave"
              value={formData.casualLeave}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="paternityLeave" className="form-label">
              Paternity Leave
            </label>
            <input
              type="number"
              className="form-control"
              id="paternityLeave"
              name="paternityLeave"
              value={formData.paternityLeave}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="maternityLeave" className="form-label">
              Maternity Leave
            </label>
            <input
              type="number"
              className="form-control"
              id="maternityLeave"
              name="maternityLeave"
              value={formData.maternityLeave}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LeaveAssign;
