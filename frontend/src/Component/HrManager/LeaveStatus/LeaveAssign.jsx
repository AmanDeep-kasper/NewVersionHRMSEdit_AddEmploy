import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import api from "../../../Pages/config/api";
const LeaveAssign = () => {
  const { darkMode } = useTheme();
  const history = useNavigate();
  const route = useLocation().pathname.split("/")[1];

  const [empData, setEmpData] = useState([]);
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
            return val.Account === 3 && val.status === "active";
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
      .catch((error) => {
        console.log(error);
      });
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
        history.push(`/${route}/allEmpLeave`);
      })
      .catch((error) => {
        console.log(error);
      });
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
      style={{ color: darkMode ? "black" : "white" }}
      className="container-fluid"
    >
      <div className="mb-3">
        <TittleHeader
          title={"Leave Application Form"}
          message={"You can from here employee leave"}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="employees" className="form-label">
              Select Employees
            </label>
            <Select
              classNamePrefix={`text-capitalize rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              id="employees"
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
              className={`form-control  rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              id="sickLeave"
              name="sickLeave"
              value={formData.sickLeave}
              onChange={handleChange}
              min="0"
              placeholder="Please Enter Number of  Sick Leave "
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
              className={`form-control  rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              id="paidLeave"
              name="paidLeave"
              value={formData.paidLeave}
              onChange={handleChange}
              min="0"
              placeholder="Please Enter Number of  Paid Leave "
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="casualLeave" className="form-label">
              Casual Leave
            </label>
            <input
              type="number"
              className={`form-control  rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              id="casualLeave"
              name="casualLeave"
              value={formData.casualLeave}
              onChange={handleChange}
              min="0"
              placeholder="Please Enter Number of  Casual Leave "
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
              className={`form-control  rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              id="paternityLeave"
              name="paternityLeave"
              value={formData.paternityLeave}
              onChange={handleChange}
              min="0"
              placeholder="Please Enter Number of  Paternity Leave "
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="maternityLeave" className="form-label">
              Maternity Leave
            </label>
            <input
              type="number"
              className={`form-control  rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              id="maternityLeave"
              name="maternityLeave"
              value={formData.maternityLeave}
              onChange={handleChange}
              min="0"
              placeholder="Please Enter Number of  Maternity Leave "
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
