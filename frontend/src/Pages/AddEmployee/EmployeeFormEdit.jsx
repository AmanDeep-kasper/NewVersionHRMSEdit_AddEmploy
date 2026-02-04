import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import "./EmployeeFormEdit.css";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { MdOutlineCancel, MdOutlineDoneAll } from "react-icons/md";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../config/api";

const EmployeeFormEdit = (props) => {
  console.log(props);
  const { userData } = useSelector((state) => state.user);
  const [roleData, setRoleData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const { darkMode } = useTheme();
  const [filterManagerData, setFilterManagerData] = useState([
    { Email: props.editData["reportManager"] },
  ]);
  const [filterHrData, setFilterHrData] = useState([
    {
      Email: props.editData["reportHr"],
    },
  ]);
  const [rowData, setRowData] = useState([]);
  const userNumber = userData?.Account;

  const [genderData, setGenderData] = useState(props.editData["Gender"]);
  const [status, setStatus] = useState(props.editData["status"]);

  const [emailData, setEmailData] = useState(props.editData["Email"]);
  const [firstNameData, setFirstNameData] = useState(
    props.editData["FirstName"],
  );

  const [lastNameData, setLastNameData] = useState(props.editData["LastName"]);
  const [dobData, setDobData] = useState(
    props.editData?.DOB ? props.editData.DOB.slice(0, 10) : "",
  );
  const [BankNameData, setBankNameData] = useState(props.editData["BankName"]);
  const [BankAccountData, setBankAccountData] = useState(
    props.editData["BankAccount"],
  );
  const [BankIFSCData, setBankIFSCData] = useState(props.editData["BankIFSC"]);
  const [UANNumberData, setUANNumberData] = useState(
    props.editData["UANNumber"],
  );
  const [PANcardNoData, setPANcardNoData] = useState(
    props.editData["PANcardNo"],
  );
  const [LocationTypeData, setLocationTypeData] = useState(
    props.editData["LocationType"],
  );
  const [AllowMobileLoginData, setAllowMobileLoginData] = useState(
    props.editData["allowMobileLogin"] || "Allowed",
  );

  const [fullFinal, setFullFinal] = useState(
    props.editData["isFullandFinal"] || "No",
  );

  const [contactNoData, setContactNoData] = useState(
    props.editData["ContactNo"],
  );
  const [dateOfJoiningData, setDateOfJoiningData] = useState(
    props.editData?.DateOfJoining
      ? props.editData.DateOfJoining.slice(0, 10)
      : "",
  );

  // edit by aman
  // const [BankNameData, setBankNameData] = useState("");
  // const [BankAccountData, setBankAccountData] = useState("");
  // const [BankIFSCData, setBankIFSCData] = useState("");
  // const [UANNumberData, setUANNumberData] = useState("");
  // const [PANcardNoData, setPANcardNoData] = useState("");

  const handleDobChange = (eOrValue) => {
    let value;
    if (eOrValue && eOrValue.target) {
      value = eOrValue.target.value;
    } else {
      value = eOrValue;
    }
    const selectedDate = new Date(value);
    const today = new Date();
    const minAllowedDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );

    if (selectedDate > minAllowedDate) {
      toast.error("Age must be at least 18 years.");
      return;
    }
    onDOBDataChange(value);
  };

  const handleDojChange = (eOrValue) => {
    let value;
    if (eOrValue && eOrValue.target) {
      value = eOrValue.target.value;
    } else {
      value = eOrValue;
    }
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time for accurate comparison

    if (selectedDate < today) {
      toast.error("Date of Joining cannot be earlier than today.");
      return;
    }
    onDateOfJoiningDataChange(value);
  };

  useEffect(() => {
    loadRoleInfo();
    loadPositionInfo();
    loadDepartmentInfo();
    loadEmployeeData();
  }, []);

  const loadEmployeeData = () => {
    api
      .get(`/api/employee`, {})
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRowData([]);
          response.data.forEach((data) => {
            let temp = {
              Email: data["Email"],
              Account:
                data["Account"] === 1
                  ? 1
                  : data["Account"] === 2
                    ? 2
                    : data["Account"] === 3
                      ? 3
                      : data["Account"] === 4
                        ? 4
                        : "",
              FirstName: data["FirstName"],
              LastName: data["LastName"],
              empID: data["empID"],
              BankName: data["BankName"],
              BankAccount: data["BankAccount"],
              BankIFSC: data["BankIFSC"],
              UANNumber: data["UANNumber"],
              PANcardNo: data["PANcardNo"],
              LocationType: data["LocationType"],
            };

            // Use set function to update state
            setRowData((prevData) => [...prevData, temp]);
          });
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {});
  };

  const loadRoleInfo = () => {
    api
      .get(`/api/role`, {})
      .then((response) => {
        setRoleData(response.data);
      })
      .catch((error) => {});
  };

  const loadPositionInfo = () => {
    api
      .get(`/api/position`, {})
      .then((response) => {
        setPositionData(response.data);
      })
      .catch((error) => {});
  };

  const loadDepartmentInfo = () => {
    api
      .get(`/api/department`, {})
      .then((response) => {
        setDepartmentData(response.data);
      })
      .catch((error) => {});
  };

  const managerFilterHandler = (value) => {
    if (+value === 2 || +value === 4 || +value === 1) {
      const data = rowData.filter((val) => {
        return +val.Account === 1 && props.editData.Email !== val.Email;
      });

      setFilterManagerData(data);
    } else if (+value === 3) {
      const data = rowData.filter((val) => {
        return +val.Account === 4 && props.editData.Email !== val.Email;
      });

      setFilterManagerData(data);
    }
    const hrData = rowData.filter((val) => {
      return val.Account === 2 && props.editData.Email !== val.Email;
    });

    setFilterHrData(hrData);
  };

  const onEmailDataChange = (e) => {
    setEmailData(e.target.value);
  };

  const onFirstNameDataChange = (e) => {
    setFirstNameData(e.target.value);
  };

  const onLastNameDataChange = (e) => {
    setLastNameData(e.target.value);
  };

  const onContactNoDataChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    setContactNoData(numericValue);
  };

  const onGenderChange = (e) => {
    setGenderData(e.target.value);
    props.onGenderChange(e);
  };

  const onDOBDataChange = (eOrValue) => {
    let value;
    if (eOrValue && eOrValue.target) {
      value = eOrValue.target.value;
    } else {
      value = eOrValue;
    }
    setDobData(value);
  };

  const onDateOfJoiningDataChange = (eOrValue) => {
    let value;
    if (eOrValue && eOrValue.target) {
      value = eOrValue.target.value;
    } else {
      value = eOrValue;
    }
    setDateOfJoiningData(value);
  };

  const onFormClose = () => {
    props.onFormEditClose();
  };

  const onBankNameDataChange = (e) => {
    setBankNameData(e.target.value);
  };
  const onBankAccountDataChange = (e) => {
    setBankAccountData(e.target.value);
  };
  const onBankIFSCDataChange = (e) => {
    setBankIFSCData(e.target.value);
  };
  const onUANNumberDataChange = (e) => {
    setUANNumberData(e.target.value);
  };
  const onPANcardNoDataChange = (e) => {
    setPANcardNoData(e.target.value);
  };
  const onLocationTypeDataChange = (value) => {
    setLocationTypeData(value);
  };

  console.log("Updated Location Type:", LocationTypeData);

  const onStatusChange = (e) => {
    setStatus(e.target.value);
    props.onStatusChange(e);
  };
  const onFullandFinalChange = (e) => {
    setFullFinal(e.target.value);
    props.onFullandFinalChange(e);
  };

  const onFullandfinalChange = (value) => {
    setFullFinal(value);
    if (props.onFullandFinalChange) {
      props.onFullandFinalChange(value); // Pass to parent
    } else {
      console.warn("onFullandFinalChange prop not found");
    }
  };

  const onAllowMobileLoginChange = (e) => {
    setAllowMobileLoginData(e.target.value);
    if (props.onMobileAllowChange) {
      props.onMobileAllowChange(e.target.value); // Pass to parent
    } else {
      console.warn("onMobileAllowChange prop not found");
    }
  };

  useEffect(() => {
    if (!props.onMobileAllowChange) {
      console.warn("onMobileAllowChange not passed as prop");
    }
  }, []);

  const DarkandLightColor = {
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
  };

  return (
    <div className="container-fluid py-3">
      <div className="my-auto">
        <h5 style={DarkandLightColor} className="m-0 fw-bold">
          Edit Employee Details
        </h5>
        <p style={DarkandLightColor} className="m-0">
          You can edit user details here.
        </p>
      </div>
      <Form
        className="mt-3"
        onSubmit={(e) => props.onEmployeeEditUpdate(props.editData, e)}>
        <div className="d-flex w-100 flex-column gap-2 rounded ">
          <div className="row row-gap-3 ">
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                Email <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="email"
                  placeholder="Email"
                  required
                  value={emailData}
                  disabled
                  onChange={(value) => onEmailDataChange(value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                Account access <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <select
                  className={`form-select ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  as="select"
                  required
                  onBlur={(e) => managerFilterHandler(e.target.value)}>
                  <option value="1" selected={props.editData["Account"] == 1}>
                    Admin
                  </option>
                  <option value="2" selected={props.editData["Account"] == 2}>
                    HR
                  </option>
                  <option value="3" selected={props.editData["Account"] == 3}>
                    Employee
                  </option>
                  <option value="4" selected={props.editData["Account"] == 4}>
                    Manager
                  </option>
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                Role <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <select
                  className={`form-select ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  name="role">
                  <option disabled selected>
                    Select your option
                  </option>
                  {roleData.map((data, index) => (
                    <option
                      key={index}
                      value={data["_id"]}
                      selected={props.editData?.role?.[0]?._id === data._id}>
                      {data["RoleName"]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                Gender <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="d-flex align-items-center gap-2">
                <Form.Check
                  style={DarkandLightColor}
                  className="d-flex align-items-center gap-2"
                  inline
                  type="radio"
                  label="Male"
                  value="male"
                  name="gender"
                  onChange={onGenderChange}
                  checked={genderData == "male"}
                  required
                />
                <Form.Check
                  style={DarkandLightColor}
                  className="d-flex align-items-center gap-2"
                  inline
                  type="radio"
                  label="Female"
                  value="female"
                  name="gender"
                  onChange={onGenderChange}
                  checked={genderData == "female"}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                First Name <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="text"
                  placeholder="First Name"
                  required
                  value={firstNameData}
                  onChange={(value) => onFirstNameDataChange(value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                Last Name <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="text"
                  placeholder="Last Name"
                  required
                  value={lastNameData}
                  onChange={(value) => onLastNameDataChange(value)}
                />
              </div>
            </div>
            <div
              style={{ position: "relative" }}
              className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                DOB <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="date"
                  placeholder="DOB"
                  required
                  value={dobData}
                  onChange={handleDobChange}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                Contact No <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="text"
                  placeholder="Contact No "
                  required
                  maxLength={10}
                  min={0}
                  value={contactNoData}
                  onChange={(value) => onContactNoDataChange(value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                Department <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <select
                  className={`form-select ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  name="department"
                  required>
                  <option value="" disabled selected>
                    Select your option
                  </option>
                  {departmentData.map((data, index) => (
                    <option
                      key={index}
                      value={data._id}
                      selected={
                        props.editData?.department?.[0]?._id === data._id
                      }>
                      {data.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                Position <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <select
                  className={`form-select ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  name="position"
                  required>
                  <option value="" disabled selected>
                    Select your option
                  </option>
                  {positionData.map((data, index) => (
                    <option
                      key={index}
                      value={data._id}
                      selected={
                        props.editData?.position?.[0]?._id === data._id
                      }>
                      {data.PositionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}>
                Date Of Joining <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="date"
                  placeholder="Date Of Joining"
                  required
                  value={dateOfJoiningData}
                  onChange={handleDojChange} // Using the corrected function
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Profile Image</label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="file"
                  //  value={profile}
                  //  onChange={(value) => onProfileDataChange(value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                Reporting Manager{" "}
                {userNumber !== 1 && <sup className="text-danger fs-6">*</sup>}
              </label>
              <div className="form-input">
                <select
                  className={`form-select ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  name="manager">
                  <option disabled selected>
                    Select your option
                  </option>

                  {filterManagerData.map((data, index) => (
                    <option
                      key={index}
                      value={data["Email"]}
                      selected={props.editData["reportManager"]}>
                      {data["Email"]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                Reporting Hr{" "}
                {userNumber !== 1 && <sup className="text-danger fs-6">*</sup>}
              </label>
              <div className="form-input">
                <select
                  className={`form-select ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  name="hr">
                  <option disabled selected>
                    Select your option
                  </option>
                  {filterHrData.map((data, index) => (
                    <option
                      key={index}
                      value={data["Email"]}
                      selected={props.editData["reportHr"]}>
                      {data["Email"]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Bank Name</label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="text"
                  placeholder="Please enter bank name"
                  value={BankNameData}
                  onChange={(value) => onBankNameDataChange(value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Bank Account Number</label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="text"
                  placeholder="Please enter bank account number"
                  value={BankAccountData}
                  onChange={(value) => onBankAccountDataChange(value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>IFSC Code</label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="text"
                  placeholder="Please enter IFSC Code"
                  value={BankIFSCData}
                  onChange={(value) => onBankIFSCDataChange(value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>UAN Number</label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="text"
                  placeholder="Please enter UAN Number"
                  value={UANNumberData}
                  onChange={(value) => onUANNumberDataChange(value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>PAN Number</label>
              <div className="form-input">
                <input
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  type="text"
                  placeholder="Please enter PAN Number"
                  value={PANcardNoData}
                  onChange={(value) => onPANcardNoDataChange(value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}>
                Location Type <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <select
                  value={LocationTypeData || ""} // Ensure the value is properly assigned
                  onChange={(event) =>
                    onLocationTypeDataChange(event.target.value)
                  }
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}>
                  <option value="">Select Location Type</option>
                  <option value="On Site">On Site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* <div className="col-12 col-md-6 col-lg-4">
              <label
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}
              >
                Allow Mobile  <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <select

                  className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                    }`}
                >
                  <option value="">Select Permission</option>
                  <option value="Allowed">Allowed</option>
                  <option value="Not Allowed">Not Allowed</option>
                </select>
              </div>
            </div> */}
            <div className="col-12 col-md-6 col-lg-4">
              <label
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}>
                Allow Mobile <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <select
                  name="allowMobileLogin"
                  value={AllowMobileLoginData || ""}
                  onChange={onAllowMobileLoginChange}
                  className="form-control">
                  <option value="">Select Permission</option>
                  <option value="Allowed">Allowed</option>
                  <option value="Not Allowed">Not Allowed</option>
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}>
                Full & Final <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="form-input">
                <select
                  name="fullFinal"
                  value={fullFinal || ""}
                  onChange={(event) => onFullandfinalChange(event.target.value)}
                  className="form-control">
                  <option value="">Select </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>
                Status <sup className="text-danger fs-6">*</sup>
              </label>
              <div className="d-flex align-items-center gap-2">
                <Form.Check
                  style={DarkandLightColor}
                  className="d-flex align-items-center gap-2"
                  inline
                  type="radio"
                  label="active"
                  value="active"
                  name="status"
                  onChange={onStatusChange}
                  checked={status === "active"}
                  required
                />
                <Form.Check
                  style={DarkandLightColor}
                  className="d-flex align-items-center gap-2"
                  inline
                  type="radio"
                  label="Inactive"
                  value="Inactive"
                  name="status"
                  onChange={onStatusChange}
                  checked={status === "Inactive"}
                  required
                />
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-primary" type="submit">
                <MdOutlineDoneAll /> Submit
              </button>
              <button
                className="btn btn-danger"
                type="reset"
                onClick={onFormClose}>
                <MdOutlineCancel /> cancel
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EmployeeFormEdit;
