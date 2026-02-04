import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import BASE_URL from "../config/config";
import TittleHeader from "../TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api"; // 👈 import api here

const SalaryFormEdit = (props) => {
  const [salaryData, setSalaryData] = useState([]);
  const { darkMode } = useTheme();

  const [BasicSalaryData, setBasicSalaryData] = useState(
    props.editData["salary"][0]["BasicSalary"]
  );

  const [totalSalaryData, settotalSalaryData] = useState(
    props.editData["salary"][0]["totalSalary"]
  );

  const [HRASalaryData, setHRASalaryData] = useState(
    props.editData["salary"][0]["HRASalary"]
  );
  const [ConvenyanceAllowanceData, setConvenyanceAllowanceData] = useState(
    props.editData["salary"][0]["ConvenyanceAllowance"]
  );
  const [otherAllowanceData, setotherAllowanceData] = useState(
    props.editData["salary"][0]["otherAllowance"]
  );

  const onHRASalaryDataChange = (e) => {
    setHRASalaryData(e.target.value);
  };
  const onConvenyanceAllowanceDataChange = (e) => {
    setConvenyanceAllowanceData(e.target.value);
  };
  const onotherAllowanceDataChange = (e) => {
    setotherAllowanceData(e.target.value);
  };
  const onBasicSalaryDataChange = (e) => {
    setBasicSalaryData(e.target.value);
  };

  const ontotalSalaryDataChange = (e) => {
    settotalSalaryData(e.target.value);
  };

  const loadSalaryInfo = () => {
    api
      .get(`/api/salary`, {
       
      })
      .then((response) => {
        setSalaryData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadSalaryInfo();
  }, []);

  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-2"
    >
      <TittleHeader
        title={"Edit Salary Details"}
        message={"You can edit salary details of the employee."}
      />
      <Form
        className="my-2"
        id="form"
        onSubmit={(e) => props.onSalaryEditUpdate(props.editData, e)}
      >
        <div className="row row-gap-3 ">
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Select Employee
            </label>
            <div>
              <Form.Control
                className={`form-select ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                as="select"
                required
                disabled
              >
                {salaryData.map((data, index) => (
                  <option
                    key={index}
                    value={data["_id"]}
                    selected={props.editData["_id"] === data["_id"]}
                    disabled
                  >
                    {`${data["FirstName"]} ${data["LastName"]}`}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Basic Salary
            </label>
            <div>
              <Form.Control
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                type="number"
                placeholder="Basic Salary"
                required
                value={BasicSalaryData}
                onChange={onBasicSalaryDataChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              House Rent Allowance (H.R.A.){" "}
            </label>
            <div>
              <Form.Control
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                type="number"
                placeholder=" House Rent Allowance"
                required
                value={HRASalaryData}
                onChange={onHRASalaryDataChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Convenyance Allowance
            </label>
            <div>
              <Form.Control
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                type="number"
                placeholder=" Convenyance Allowance"
                required
                value={ConvenyanceAllowanceData}
                onChange={onConvenyanceAllowanceDataChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Other Allowance
            </label>
            <div>
              <Form.Control
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                type="number"
                placeholder="Other Allowance"
                required
                value={otherAllowanceData}
                onChange={onotherAllowanceDataChange}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Total Salary
            </label>
            <div>
              <Form.Control
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                type="number"
                placeholder=" Total Salary"
                required
                value={totalSalaryData}
                onChange={ontotalSalaryDataChange}
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
            <button
              className="btn btn-danger"
              type="reset"
              onClick={props.onFormEditClose}
            >
              cancel
            </button>
          </div>
          <div
            className="col-12 col-md-6 col-lg-4"
            id="form-cancel-button"
          ></div>
        </div>
      </Form>
    </div>
  );
};

export default SalaryFormEdit;
