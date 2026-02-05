import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { MdOutlineCancel, MdOutlineDoneAll } from "react-icons/md";
import { useLocation } from "react-router-dom";
import NumericInput from "../../Utils/InputBox/NumericInput";
import { GoEyeClosed } from "react-icons/go";
import { RxEyeOpen } from "react-icons/rx";
import { convertToAmPm } from "../../Utils/GetDayFormatted";
import TittleHeader from "../TittleHeader/TittleHeader";
import toast from "react-hot-toast";
import api from "../config/api";
import imageCompression from "browser-image-compression";
import { GrFormNext } from "react-icons/gr";
import { LuCheck } from "react-icons/lu";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const initialForm = {
  email: "",
  password: "",
  accountAccess: "",
  role: "",
  gender: "",
  firstName: "",
  lastName: "",
  dob: "",
  contactNo: "",
  department: "",
  position: "",
  doj: "",
  profileImage: null,
  reportingManager: "",
  reportingHr: "",
  shift: "",
  bankName: "",
  bankAccount: "",
  bankIFSC: "",
  uan: "",
  pan: "",
  locationType: "On Site",
};

const EmployeeForm = (props) => {
  const location = useLocation();

  const route = location.pathname.split("/")[1];

  const [seePass, setSeepass] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [filterManagerData, setFilterManagerData] = useState([]);
  const [filterHrData, setFilterHrData] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  // steps for the form
  const [step, setStep] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadRoleInfo();
    loadPositionInfo();
    loadDepartmentInfo();
    loadEmployeeData();
    fetchShifts();
  }, []);

  // in this all form items step 1 form
  const PayrollData = [
    {
      id: 1,
      pageName: "Personal Details",
    },
    {
      id: 2,
      pageName: "Employee Details",
    },
    {
      id: 3,
      pageName: "Bank Details",
    },
  ];

  // edit by aman
  const compressImageIfSmall = async (file) => {
    const sizeKB = file.size / 1024;

    // If image is already above 200KB → no need to compress
    if (sizeKB >= 200) return file;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      initialQuality: 0.8,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Compression error:", error);
      return file;
    }
  };

  // Manager/HR filter
  const managerFilterHandler = (value) => {
    setForm({ ...form, accountAccess: value });
    if (+value === 2 || +value === 4 || +value === 1) {
      const data = rowData.filter((val) => +val.Account === 1);
      setFilterManagerData(data);
    } else if (+value === 3) {
      const data = rowData.filter((val) => +val.Account === 4);
      setFilterManagerData(data);
    }
    const hrData = rowData.filter((val) => val.Account === 2);
    setFilterHrData(hrData);
  };

  const validateForm = (currentStep) => {
    const errors = {};

    // ---------------- STEP 1 VALIDATION ----------------
    if (currentStep === 1) {
      if (!form.firstName) errors.firstName = "First name required";
      // if (!form.lastName) errors.lastName = "Last name required";

      if (!form.email) errors.email = "Email required";
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(form.email)) errors.email = "Invalid email";

      if (!form.password) {
        errors.password = "Password required";
      } else {
        const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
        if (!passRegex.test(form.password)) {
          errors.password =
            "Password must contain uppercase, lowercase, number and be 8+ characters";
        }
      }

      if (!form.contactNo || form.contactNo.length !== 10)
        errors.contactNo = "Contact number must be 10 digits";

      if (!form.dob) errors.dob = "Date of birth required";
      if (!form.gender) errors.gender = "Gender required";

      // PROFILE IMAGE VALIDATION
      if (form.profileImage) {
        const allowed = ["image/jpeg", "image/png", "image/jpg"];

        if (!allowed.includes(form.profileImage.type)) {
          errors.profileImage = "Only JPG or PNG allowed";
        }

        const sizeKB = form.profileImage.size / 1024;

        if (sizeKB > 10240) {
          errors.profileImage = "Image must be less than 10 MB";
        }
      }
    }

    // ---------------- STEP 2 VALIDATION ----------------
    if (currentStep === 2) {
      if (!form.accountAccess) errors.accountAccess = "Account access required";
      if (!form.role) errors.role = "Role required";
      if (!form.position) errors.position = "Position required";
      if (!form.department) errors.department = "Department required";
      if (!form.doj) errors.doj = "Date of joining required";
      if (!form.shift) errors.shift = "Shift required";
      if (!form.locationType) errors.locationType = "Location type required";
    }

    // ---------------- STEP 3 VALIDATION ----------------
    if (currentStep === 3) {
      if (form.bankName && form.bankName.length < 3)
        errors.bankName = "Bank name must be at least 3 characters";

      if (
        form.bankAccount &&
        (form.bankAccount.length < 9 || form.bankAccount.length > 16)
      )
        errors.bankAccount = "Bank account must be 9–16 digits";

      if (form.bankIFSC && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(form.bankIFSC))
        errors.bankIFSC = "Invalid IFSC code";

      if (form.uan && form.uan.length !== 12)
        errors.uan = "UAN must be 12 digits";

      if (!form.pan || form.pan.length !== 10)
        errors.pan = "PAN must be exactly 10 characters";
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan))
        errors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
    }

    return errors;
  };

  // Edit Employee Form by  Aman

  // --------------------------
  // Handle input change
  // --------------------------
  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;
    let sanitizedValue = value.trimStart();

    if (name === "email") sanitizedValue = value.toLowerCase().trim();
    if (name === "firstName" || name === "lastName")
      sanitizedValue = value.replace(/[^a-zA-Z ]/g, "");
    if (name === "contactNo")
      sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
    if (name === "pan")
      sanitizedValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);
    if (name === "uan") sanitizedValue = value.replace(/\D/g, "").slice(0, 12);
    if (name === "bankAccount")
      sanitizedValue = value.replace(/\D/g, "").slice(0, 16);
    if (name === "bankIFSC")
      sanitizedValue = value.replace(/\s+/g, "").toUpperCase().slice(0, 12);

    // if (type === "file") sanitizedValue = files[0];
    if (type === "file" && name === "profile") {
      let uploadedFile = files[0];

      // Auto compress (if you added compression)
      uploadedFile = await compressImageIfSmall(uploadedFile);
      sanitizedValue = uploadedFile;

      // 🔥 Create preview image
      setPreview(URL.createObjectURL(uploadedFile));
    }

    setForm({ ...form, [name]: sanitizedValue });

    // Remove error for this field if valid
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "bankName" && sanitizedValue.length >= 3)
        delete newErrors.bankName;
      if (
        name === "bankAccount" &&
        sanitizedValue.length >= 9 &&
        sanitizedValue.length <= 16
      )
        delete newErrors.bankAccount;
      if (
        name === "bankIFSC" &&
        /^[A-Z]{4}0[A-Z0-9]{6}$/i.test(sanitizedValue.length === 12)
      )
        delete newErrors.bankIFSC;
      if (name === "UANNumber" && sanitizedValue.length === 12)
        delete newErrors.UANNumber;
      if (name === "pan" && sanitizedValue.length === 10) delete newErrors.pan;
      return newErrors;
    });
  };

  // Data loading functions
  const loadEmployeeData = () => {
    api.get(`/api/employee`, {}).then((response) => {
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
            LocationType: data["LocationType"],
          };
          setRowData((prevData) => [...prevData, temp]);
        });
      }
    });
  };
  const loadRoleInfo = () => {
    api.get(`/api/role`, {}).then((response) => setRoleData(response.data));
  };
  const loadPositionInfo = () => {
    api
      .get(`/api/position`, {})
      .then((response) => setPositionData(response.data));
  };
  const loadDepartmentInfo = () => {
    api
      .get(`/api/department`, {})
      .then((response) => setDepartmentData(response.data));
  };
  const fetchShifts = async () => {
    try {
      const response = await api.get(`/api/shifts`, {});
      if (Array.isArray(response.data)) setShifts(response.data);
    } catch (error) {}
  };

  // // Submit handler
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const errors = validateForm();
  //   setFormErrors(errors);
  //   if (Object.keys(errors).length === 0) {
  //     props.onEmployeeSubmit(e, form);
  //   }
  // };
  // --------------------------
  // Submit handler
  // --------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    // const errors = validateForm();
    //  validateForm(1); aman
    const errors = {
      ...validateForm(1),
      ...validateForm(2),
      ...validateForm(3),
    };

    setFormErrors(errors);

    console.log("Form Errors:", errors);
    if (Object.keys(errors).length === 0) {
      props.onEmployeeSubmit(e, form);
    } else {
      toast.error("Please fill the required form before submitting");
    }
  };

  // Calculate max DOB = Today - 18 years
  const today = new Date();
  const adultDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );
  const maxDOB = adultDate.toISOString().split("T")[0];

  return (
    <div className="container-fluid py-3">
      <TittleHeader
        title={"Create New Employee"}
        message={"You can create new user here."}
      />

      <div
        style={{ position: "relative", maxHeight: "80vh" }}
        className="d-flex flex-column flex-md-row  gap-2 justify-content-between mt-2">
        <div
          className="d-flex flex-column gap-2 rounded-2"
          style={{
            height: "fit-content",
            width: "18%",
            whiteSpace: "pre",
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
            position: "sticky",
            top: "0",
          }}>
          <div className="my-0 p-3">
            <h6 className="m-0 d-flex align-items-center gap-2">
              <span>{currentStep - 1}/3</span>
              <span className="d-none d-md-flex"> Completed</span>
            </h6>
          </div>

          <div className="d-flex flex-row w-100 flex-md-column gap-3 gap-md-2">
            {PayrollData.map((stepItem, index) => {
              const stepNumber = stepItem.id;
              const isCompleted = currentStep > stepNumber;
              const isActive = currentStep === stepNumber;

              return (
                <div
                  key={stepItem.id}
                  className="d-flex align-items-center gap-3"
                  style={{
                    borderTop: isCompleted
                      ? "5px solid #007aff"
                      : darkMode
                        ? "5px solid rgba(213, 215, 218, 1)"
                        : "5px solid rgba(75, 77, 78, 0.93)",
                    padding: ".25rem .625rem .625rem .625rem",
                    width: "100%",
                  }}>
                  {/* Completed ✔ */}
                  {isCompleted ? (
                    <span
                      className="badge-success d-flex align-items-center justify-content-center"
                      style={{
                        height: "2rem",
                        width: "2rem",
                        borderRadius: "50%",
                        border: "2px solid #07aaff",
                      }}>
                      <LuCheck />
                    </span>
                  ) : isActive ? (
                    // Active Step
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        height: "2rem",
                        width: "2rem",
                        borderRadius: "50%",
                        border: "2px solid #07aaff",
                        background: darkMode
                          ? "rgba(255, 255, 255, 0.76)"
                          : "rgba(54, 54, 54, 0.73)",
                      }}>
                      {stepNumber}
                    </div>
                  ) : (
                    // Inactive step
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        height: "2rem",
                        width: "2rem",
                        borderRadius: "50%",
                        background: darkMode
                          ? "rgba(206, 200, 200, 0.76)"
                          : "rgba(73, 72, 72, 0.73)",
                      }}>
                      {stepNumber}
                    </div>
                  )}

                  <div className="d-none d-md-flex flex-column">
                    <h6 className="my-0">{stepItem.pageName}</h6>
                    <p className="my-0">{stepItem.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="d-flex flex-column gap-3 flex-grow-1 p-2 rounded-2"
          style={{ width: "100%", overflow: "hidden" }}>
          {/* in this code aman */}
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            style={{
              height: "fit-content",
              maxHeight: "75vh",
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
              position: "relative",
              overflow: "auto",
            }}
            className={`d-flex flex-column flex-grow-1 p-2  rounded-2 mb-2 rounded-2`}>
            <div className="d-flex flex-column w-100 gap-2">
              <div
                style={{ height: "fit-content" }}
                className="d-flex align-items-start justify-content-between"></div>
              <div
                style={{
                  height: "66vh",
                  overflow: "auto",
                  position: "relative",

                  border: darkMode
                    ? "1px solid rgba(193,189,189)"
                    : "1px solid rgba(193,189,189)",
                }}
                className={`rounded-2`}>
                <div
                  className="mt-0 mb-0"
                  style={{
                    padding: "20px",
                  }}>
                  <div
                    className=" row  row-gap-2 m-0"
                    encType="multipart/form-data">
                    {step === 1 && (
                      <>
                        <label
                          style={{
                            color: darkMode
                              ? "var(--secondaryDashColorDark)"
                              : "var(--secondaryDashMenuColor)",
                          }}>
                          Profile Image
                        </label>
                        <div className="form-input mb-3">
                          <label
                            htmlFor="profileUpload"
                            className="p-1 text-center d-flex flex-column align-items-center justify-content-center"
                            style={{
                              border: "1px solid #887c7dff",
                              color: "#887c7dff",
                              cursor: "pointer",
                              borderRadius: "30px",
                              height: "120px",
                              width: "200px",
                              background: darkMode ? "#f3f3f3" : "#2d2d2d",
                              overflow: "hidden",
                            }}>
                            {preview ? (
                              <img
                                src={preview}
                                alt="Preview"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "20px",
                                }}
                              />
                            ) : (
                              <>
                                <span className="fs-1 fw-bold">+</span>
                                <div>Click to upload</div>
                              </>
                            )}
                          </label>

                          <input
                            id="profileUpload"
                            type="file"
                            accept="image/*"
                            // name="profileImage"
                            name="profile"
                            onChange={handleChange}
                            style={{ display: "none" }}
                          />

                          {formErrors.profileImage && (
                            <span className="text-danger">
                              {formErrors.profileImage}
                            </span>
                          )}
                        </div>

                        {/* Column 1 */}
                        <div className="col-12 col-md-6">
                          {/* First Name */}
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            First Name <sup className="text-danger">*</sup>
                          </label>
                          <div className="form-input mb-3">
                            <input
                              className={`form-control rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark"
                                  : "bg-dark text-light"
                              }`}
                              type="text"
                              placeholder="First Name"
                              name="firstName"
                              value={form.firstName}
                              onChange={handleChange}
                            />
                            {formErrors.firstName && (
                              <span className="text-danger">
                                {formErrors.firstName}
                              </span>
                            )}
                          </div>

                          {/* Last Name */}
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Last Name <sup className="text-danger">*</sup>
                          </label>
                          <div className="form-input mb-3">
                            <input
                              className={`form-control rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark"
                                  : "bg-dark text-light"
                              }`}
                              type="text"
                              placeholder="Last Name"
                              name="lastName"
                              value={form.lastName}
                              onChange={handleChange}
                            />
                            {formErrors.lastName && (
                              <span className="text-danger">
                                {formErrors.lastName}
                              </span>
                            )}
                          </div>

                          {/* Email */}
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Email <sup className="text-danger">*</sup>
                          </label>
                          <div className="form-input mb-3">
                            <input
                              className={`form-control rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark"
                                  : "bg-dark text-light"
                              }`}
                              type="email"
                              placeholder="Email"
                              name="email"
                              value={form.email}
                              onChange={handleChange}
                            />
                            {formErrors.email && (
                              <span className="text-danger">
                                {formErrors.email}
                              </span>
                            )}
                          </div>

                          {/* Password */}
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Password <sup className="text-danger">*</sup>
                          </label>
                          <div className="form-input position-relative mb-3">
                            <input
                              className={`form-control rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark"
                                  : "bg-dark text-light"
                              }`}
                              placeholder="Password"
                              type={seePass ? "text" : "password"}
                              name="password"
                              value={form.password}
                              onChange={handleChange}
                            />
                            <span
                              className="fs-5 text-muted"
                              style={{
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                cursor: "pointer",
                                transform: "translateY(-50%)",
                              }}
                              onClick={() => setSeepass(!seePass)}>
                              {seePass ? <GoEyeClosed /> : <RxEyeOpen />}
                            </span>

                            {formErrors.password && (
                              <span className="text-danger">
                                {formErrors.password}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Column 2 */}
                        <div className="col-12 col-md-6">
                          {/* Contact No */}
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Contact No <sup className="text-danger">*</sup>
                          </label>
                          <div className="form-input mb-3">
                            <NumericInput
                              value={form.contactNo}
                              maxLength={10}
                              placeholder="Contact No"
                              onChange={(val) =>
                                setForm({ ...form, contactNo: val })
                              }
                            />
                            {formErrors.contactNo && (
                              <span className="text-danger">
                                {formErrors.contactNo}
                              </span>
                            )}
                          </div>

                          {/* DOB */}
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            DOB <sup className="text-danger">*</sup>
                          </label>

                          <div className="form-input mb-3">
                            <input
                              className={`form-control rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark"
                                  : "bg-dark text-light"
                              }`}
                              type="date"
                              name="dob"
                              value={form.dob}
                              onChange={handleChange}
                              max={new Date().toISOString().split("T")[0]} // ✔ BLOCK FUTURE YEARS
                            />

                            {formErrors.dob && (
                              <span className="text-danger">
                                {formErrors.dob}
                              </span>
                            )}
                          </div>

                          {/* Gender */}
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Gender <sup className="text-danger">*</sup>
                          </label>
                          <div className="d-flex gap-3 mb-3">
                            <Form.Check
                              inline
                              type="radio"
                              label="Male"
                              value="male"
                              name="gender"
                              onChange={handleChange}
                              checked={form.gender === "male"}
                            />
                            <Form.Check
                              inline
                              type="radio"
                              label="Female"
                              value="female"
                              name="gender"
                              onChange={handleChange}
                              checked={form.gender === "female"}
                            />
                          </div>
                          {formErrors.gender && (
                            <span className="text-danger">
                              {formErrors.gender}
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    {/* step 2 form */}
                    {step === 2 && (
                      <>
                        {/* Account access */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Account access{" "}
                            <sup className="text-danger fs-6">*</sup>
                          </label>
                          <div className="form-input">
                            <select
                              className={`form-select ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              as="select"
                              name="accountAccess"
                              value={form.accountAccess}
                              onChange={(e) =>
                                managerFilterHandler(e.target.value)
                              }>
                              <option value="">Select Account Access</option>
                              {route === "hr" ? (
                                <>
                                  <option value="2">HR</option>
                                  <option value="3">Employee</option>
                                  <option value="4">Manager</option>
                                </>
                              ) : (
                                <>
                                  <option value="1">Admin</option>
                                  <option value="2">HR</option>
                                  <option value="3">Employee</option>
                                  <option value="4">Manager</option>
                                </>
                              )}
                            </select>
                            {formErrors.accountAccess && (
                              <span className="text-danger">
                                {formErrors.accountAccess}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Department */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Department <sup className="text-danger fs-6">*</sup>
                          </label>
                          <div className="form-input">
                            <select
                              className={`form-select ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              as="select"
                              name="department"
                              value={form.department}
                              onChange={handleChange}>
                              <option value="">Select your option</option>
                              {departmentData.map((data, index) => (
                                <option key={index} value={data["_id"]}>
                                  {data["DepartmentName"]}
                                </option>
                              ))}
                            </select>
                            {formErrors.department && (
                              <span className="text-danger">
                                {formErrors.department}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Position */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Position <sup className="text-danger fs-6">*</sup>
                          </label>
                          <div className="form-input">
                            <select
                              className={`form-select ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              as="select"
                              name="position"
                              value={form.position}
                              onChange={handleChange}>
                              <option value="">Select your option</option>
                              {positionData.map((data, index) => (
                                <option key={index} value={data["_id"]}>
                                  {data["PositionName"]}
                                </option>
                              ))}
                            </select>
                            {formErrors.position && (
                              <span className="text-danger">
                                {formErrors.position}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Role */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Role <sup className="text-danger fs-6">*</sup>
                          </label>
                          <div className="form-input">
                            <select
                              className={`form-select ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              as="select"
                              name="role"
                              value={form.role}
                              onChange={handleChange}>
                              <option value="">Select your option</option>
                              {roleData.map((data, index) => (
                                <option key={index} value={data["_id"]}>
                                  {data["RoleName"]}
                                </option>
                              ))}
                            </select>
                            {formErrors.role && (
                              <span className="text-danger">
                                {formErrors.role}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Date Of Joining */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Date Of Joining{" "}
                            <sup className="text-danger fs-6">*</sup>
                          </label>
                          <div className="form-input">
                            <input
                              className={`form-control ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              type="date"
                              name="doj"
                              value={form.doj}
                              onChange={handleChange}
                              max={new Date().toISOString().split("T")[0]}
                              placeholder="Date Of Joining"
                            />
                            {formErrors.doj && (
                              <span className="text-danger">
                                {formErrors.doj}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Reporting Manager */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Reporting Manager
                          </label>
                          <div className="form-input">
                            <select
                              className={`form-select ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              as="select"
                              name="reportingManager"
                              value={form.reportingManager}
                              onChange={handleChange}>
                              <option value="">Select your option</option>
                              {filterManagerData.map((data, index) => (
                                <option key={index} value={data["Email"]}>
                                  {data["Email"]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {/* Reporting Hr */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Reporting Hr
                          </label>
                          <div className="form-input">
                            <select
                              className={`form-select ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              as="select"
                              name="reportingHr"
                              value={form.reportingHr}
                              onChange={handleChange}>
                              <option value="">Select your option</option>
                              {filterHrData.map((data, index) => (
                                <option key={index} value={data.Email}>
                                  {data.Email}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {/* Location Type */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Location Type{" "}
                            <sup className="text-danger fs-6">*</sup>
                          </label>
                          <div className="form-input">
                            <select
                              className={`form-control ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              name="locationType"
                              value={form.locationType}
                              onChange={handleChange}>
                              <option value="On Site">On Site</option>
                              <option value="Remote">Remote</option>
                              <option value="Hybread">Hybrid</option>
                            </select>
                            {formErrors.locationType && (
                              <span className="text-danger">
                                {formErrors.locationType}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Shift */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Shift
                          </label>
                          <div className="form-input">
                            <select
                              className={`form-select ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              as="select"
                              name="shift"
                              value={form.shift}
                              onChange={handleChange}
                              required>
                              <option value="">Select Shift</option>
                              {shifts.map((data, index) => (
                                <option key={index} value={data._id}>
                                  {data.name} → {convertToAmPm(data.startTime)}{" "}
                                  → {convertToAmPm(data.endTime)}
                                </option>
                              ))}
                            </select>
                            {formErrors.shift && (
                              <span className="text-danger">
                                {formErrors.shift}
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* step 3 form */}
                    {step === 3 && (
                      <>
                        {/* Pan Number */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            PAN<sup className="text-danger fs-6">*</sup>
                          </label>
                          <div className="form-input">
                            <input
                              className={`form-control ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              type="text"
                              placeholder="Please enter Pan number"
                              name="pan"
                              value={form.pan}
                              onChange={handleChange}
                            />
                            {formErrors.pan && (
                              <span className="text-danger">
                                {formErrors.pan}
                              </span>
                            )}{" "}
                          </div>
                        </div>
                        {/* Bank Name */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Bank Name
                          </label>
                          <div className="form-input">
                            <input
                              className={`form-control ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              type="text"
                              placeholder="Please enter bank name"
                              name="bankName"
                              value={form.bankName}
                              onChange={handleChange}
                            />
                            {formErrors.bankName && (
                              <span className="text-danger">
                                {formErrors.bankName}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Bank Account Number */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            Bank Account Number
                          </label>
                          <div className="form-input">
                            <input
                              className={`form-control ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              type="number"
                              placeholder="Please enter bank account number"
                              name="bankAccount"
                              value={form.bankAccount}
                              onChange={handleChange}
                            />
                            {formErrors.bankAccount && (
                              <span className="text-danger">
                                {formErrors.bankAccount}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* IFSC Code */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            IFSC Code
                          </label>
                          <div className="form-input">
                            <input
                              className={`form-control ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              type="text"
                              placeholder="Please enter IFSC code"
                              name="bankIFSC"
                              value={form.bankIFSC}
                              onChange={handleChange}
                            />
                            {formErrors.bankIFSC && (
                              <span className="text-danger">
                                {formErrors.bankIFSC}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* UAN Number */}
                        <div className="col-12 col-md-6">
                          <label
                            style={{
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var(--secondaryDashMenuColor)",
                            }}>
                            UAN Number
                          </label>
                          <div className="form-input">
                            <input
                              className={`form-control ms-0 ms-md-auto rounded-2 ${
                                darkMode
                                  ? "bg-light text-dark border dark-placeholder"
                                  : "bg-dark text-light border-0 light-placeholder"
                              }`}
                              type="text"
                              placeholder="Please enter UAN number"
                              name="uan"
                              value={form.uan}
                              onChange={handleChange}
                            />
                            {formErrors.uan && (
                              <span className="text-danger">
                                {formErrors.uan}
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <hr className="m-0 py-1" style={{ opacity: "0" }} />
                </div>
              </div>
            </div>
            {/* nav btn */}

            {step === 1 && (
              <div className="p-2 d-flex flex-column gap-2 mt-2">
                <div
                  className={`d-flex align-items-end p-2 rounded-2 bg-red-200 justify-content-end ${
                    darkMode ? "bg-light text-dark" : "bg-dark text-light"
                  }`}>
                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      const errors = validateForm(1);
                      setFormErrors(errors);
                      if (Object.keys(errors).length === 0) {
                        setStep(2);
                        setCurrentStep(2);
                      } else {
                        toast.error("Please fill Personal Details correctly");
                      }
                    }}>
                    Next <GrFormNext />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-2 d-flex flex-column gap-2 mt-2">
                <div
                  className={`d-flex align-items-between p-2 rounded-2 justify-content-between ${
                    darkMode ? "bg-light text-dark" : "bg-dark text-light"
                  }`}>
                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setStep(1);
                    }}>
                    <IoChevronBack /> Back
                  </button>

                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      const errors = validateForm(2);
                      setFormErrors(errors);
                      if (Object.keys(errors).length === 0) {
                        setStep(3);
                        setCurrentStep(3);
                      } else {
                        toast.error("Please fill Employee Details correctly");
                      }
                    }}>
                    Next <GrFormNext />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-2 d-flex flex-column gap-2 mt-2">
                <div
                  className={`d-flex align-items-between p-2 rounded-2 justify-content-between ${
                    darkMode ? "bg-light text-dark" : "bg-dark text-light"
                  }`}>
                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setStep(2);
                      setCurrentStep(2);
                    }}>
                    <IoChevronBack /> Back
                  </button>

                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    type="submit">
                    Submit <MdOutlineDoneAll />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Form } from "react-bootstrap";
// import BASE_URL from "../config/config";
// import { useTheme } from "../../Context/TheamContext/ThemeContext";
// import { MdOutlineCancel, MdOutlineDoneAll } from "react-icons/md";
// import { useLocation } from "react-router-dom";
// import NumericInput from "../../Utils/InputBox/NumericInput";
// import { GoEyeClosed } from "react-icons/go";
// import { RxEyeOpen } from "react-icons/rx";
// import { convertToAmPm } from "../../Utils/GetDayFormatted";
// import TittleHeader from "../TittleHeader/TittleHeader";
// import toast from "react-hot-toast";

// const EmployeeForm = (props) => {
//   const location = useLocation();
//   const route = location.pathname.split("/")[1];
//   const [seePass, setSeepass] = useState(false);
//   const [password, setPassword] = useState("");
//   const [roleData, setRoleData] = useState([]);
//   const [positionData, setPositionData] = useState([]);
//   const [departmentData, setDepartmentData] = useState([]);
//   const [rowData, setRowData] = useState([]);
//   const [filterManagerData, setFilterManagerData] = useState([]);
//   const [filterHrData, setFilterHrData] = useState([]);
//   const [shifts, setShifts] = useState([]);
//   const [contactNo, setContactNo] = useState("");
//   const [error, setError] = useState(null);
//   const { darkMode } = useTheme();
//   useEffect(() => {
//     loadRoleInfo();
//     loadPositionInfo();
//     loadDepartmentInfo();
//     loadEmployeeData();
//   }, []);

//   const [dob, setDob] = useState("");
//   const [doj, setDoj] = useState("");

//   const handleDobChange = (e) => {
//     const selectedDate = new Date(e.target.value);
//     const today = new Date();
//     const minAllowedDate = new Date(
//       today.getFullYear() - 18,
//       today.getMonth(),
//       today.getDate()
//     );

//     if (selectedDate > minAllowedDate) {
//       toast.error("Age must be at least 18 years.");
//     }

//     setDob(e.target.value);
//   };

//   const handleDojChange = (e) => {
//     setDoj(e.target.value);
//   };

//   const loadEmployeeData = () => {
//     axios
//       .get(`${BASE_URL}/api/employee`, {
//         headers: {
//           authorization: localStorage.getItem("token") || "",
//         },
//       })
//       .then((response) => {
//         if (Array.isArray(response.data)) {
//           setRowData([]);
//           response.data.forEach((data) => {
//             let temp = {
//               Email: data["Email"],
//               Account:
//                 data["Account"] === 1
//                   ? 1
//                   : data["Account"] === 2
//                   ? 2
//                   : data["Account"] === 3
//                   ? 3
//                   : data["Account"] === 4
//                   ? 4
//                   : "",
//               FirstName: data["FirstName"],
//               LastName: data["LastName"],
//               empID: data["empID"],
//               BankName: data["BankName"],
//               BankAccount: data["BankAccount"],
//               BankIFSC: data["BankIFSC"],
//               UANNumber: data["UANNumber"],
//               LocationType: data["LocationType"],
//             };

//             // Use set function to update state
//             setRowData((prevData) => [...prevData, temp]);
//           });
//         } else {
//           console.error("Data received is not an array:", response.data);
//         }
//       })
//       .catch((error) => {});
//   };
//   const loadRoleInfo = () => {
//     axios
//       .get(`${BASE_URL}/api/role`, {
//         headers: {
//           authorization: localStorage.getItem("token") || "",
//         },
//       })
//       .then((response) => {
//         setRoleData(response.data);
//       })
//       .catch((error) => {});
//   };

//   const loadPositionInfo = () => {
//     axios
//       .get(`${BASE_URL}/api/position`, {
//         headers: {
//           authorization: localStorage.getItem("token") || "",
//         },
//       })
//       .then((response) => {
//         setPositionData(response.data);
//       })
//       .catch((error) => {});
//   };

//   const loadDepartmentInfo = () => {
//     axios
//       .get(`${BASE_URL}/api/department`, {
//         headers: {
//           authorization: localStorage.getItem("token") || "",
//         },
//       })
//       .then((response) => {
//         setDepartmentData(response.data);
//       })
//       .catch((error) => {});
//   };

//   const managerFilterHandler = (value) => {
//     if (+value === 2 || +value === 4 || +value === 1) {
//       const data = rowData.filter((val) => {
//         return +val.Account === 1;
//       });

//       setFilterManagerData(data);
//     } else if (+value === 3) {
//       const data = rowData.filter((val) => {
//         return +val.Account === 4;
//       });

//       setFilterManagerData(data);
//     }
//     const hrData = rowData.filter((val) => {
//       return val.Account === 2;
//     });
//     setFilterHrData(hrData);
//   };

//   // Fetch Shifts
// const fetchShifts = async () => {
//   try {
//     // const token = localStorage.getItem("token");

//     const response = await axios.get(`${BASE_URL}/api/shifts`, {
//      headers: {
//           authorization: localStorage.getItem("token") || "",
//         },
//     });

//     if (Array.isArray(response.data)) {
//       setShifts(response.data);
//       setError(null); // ✅ Reset error if previous error existed
//     } else {
//       console.error("Unexpected response format:", response.data);
//       setError("Unexpected response from server");
//     }
//   } catch (error) {
//     console.error("Error fetching shifts:", error);
//     setError("Error fetching shifts. Please try again.");
//   }
// };

//   useEffect(() => {
//     fetchShifts();
//   }, []);

//   return (
//     <div className="container-fluid py-3">
//       <TittleHeader
//         title={"Create New Employee"}
//         message={"You can create new user here."}
//       />

//       <div className="my-2">
//         <form
//           onSubmit={props.onEmployeeSubmit}
//           className=" row mt-3 row-gap-2 m-0"
//           encType="multipart/form-data"
//         >
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Email <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 type="email"
//                 placeholder="Email"
//               />
//             </div>
//           </div>

//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Password <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input position-relative">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 placeholder="Password"
//                 type={seePass ? "text" : "password"}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <span
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   transform: "translateY(-55%)",
//                   right: "3%",
//                   cursor: "pointer",
//                 }}
//                 className="fs-5 text-muted my-0"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setSeepass(!seePass);
//                 }}
//               >
//                 {seePass ? <GoEyeClosed /> : <RxEyeOpen />}
//               </span>
//             </div>
//           </div>

//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Account access <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input">
//               <select
//                 className={`form-select ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 as="select"
//                 onBlur={(e) => managerFilterHandler(e.target.value)}
//               >
//                 {route === "hr" ? (
//                   <>
//                     <option value="2">HR</option>
//                     <option value="3">Employee</option>
//                     <option value="4">Manager</option>
//                   </>
//                 ) : (
//                   <>
//                     {" "}
//                     <option value="1">Admin</option>
//                     <option value="2">HR</option>
//                     <option value="3">Employee</option>
//                     <option value="4">Manager</option>
//                   </>
//                 )}
//               </select>
//             </div>
//           </div>

//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Role <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input">
//               <select
//                 className={`form-select ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 as="select"
//                 name="role"
//               >
//                 <option disabled selected>
//                   Select your option
//                 </option>
//                 {roleData.map((data, index) => (
//                   <option key={index} value={data["_id"]}>
//                     {data["RoleName"]}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Gender <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="d-flex align-items-center gap-2">
//               <Form.Check
//                 style={{
//                   color: darkMode
//                     ? "var(--secondaryDashColorDark)"
//                     : "var(--secondaryDashMenuColor)",
//                 }}
//                 className="d-flex align-items-center gap-2"
//                 inline
//                 type="radio"
//                 label="Male"
//                 value="male"
//                 name="gender"
//                 onChange={props.onGenderChange}
//               />
//               <Form.Check
//                 inline
//                 style={{
//                   color: darkMode
//                     ? "var(--secondaryDashColorDark)"
//                     : "var(--secondaryDashMenuColor)",
//                 }}
//                 className="d-flex align-items-center gap-2"
//                 type="radio"
//                 label="Female"
//                 value="female"
//                 name="gender"
//                 onChange={props.onGenderChange}
//               />
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               First Name <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 type="text"
//                 placeholder="First Name"
//               />
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Last Name <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 type="text"
//                 placeholder="Last Name"
//               />
//             </div>
//           </div>
//           <div
//             style={{ position: "relative" }}
//             className="col-12 col-md-6 col-lg-4"
//           >
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               DOB <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 type="date"
//                 value={dob}
//                 onChange={handleDobChange}
//                 placeholder="DOB"
//               />
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Contact No <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input">
//               <NumericInput
//                 value={contactNo}
//                 onChange={setContactNo}
//                 maxLength={10}
//                 placeholder="Contact No"
//               />
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Department <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input">
//               <select
//                 className={`form-select ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 as="select"
//                 name="department"
//               >
//                 <option value="" disabled selected>
//                   Select your option
//                 </option>
//                 {departmentData.map((data, index) => (
//                   <option key={index} value={data["_id"]}>
//                     {data["DepartmentName"]}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Position <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input">
//               <select
//                 className={`form-select ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 as="select"
//                 name="position"
//               >
//                 <option value="" disabled selected>
//                   Select your option
//                 </option>
//                 {positionData.map((data, index) => (
//                   <option key={index} value={data["_id"]}>
//                     {data["PositionName"]}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Date Of Joining <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 type="date"
//                 value={doj}
//                 onChange={handleDojChange}
//                 placeholder="Date Of Joining"
//               />
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Profile Image
//             </label>
//             <div className="form-input">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 type="file"
//               />
//             </div>
//           </div>

//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Reporting Manager
//             </label>
//             <div className="form-input">
//               <select
//                 className={`form-select ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 as="select"
//                 name="role"
//               >
//                 <option selected>Select your option</option>
//                 {filterManagerData.map((data, index) => (
//                   <option key={index} value={data["Email"]}>
//                     {data["Email"]}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Reporting Hr
//             </label>
//             <div className="form-input">
//               <select
//                 className={`form-select ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 as="select"
//                 name="role"
//               >
//                 <option selected>Select your option</option>
//                 {filterHrData.map((data, index) => (
//                   <option key={index} value={data.Email}>
//                     {data.Email}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Shift
//             </label>
//             <div className="form-input">
//               <select
//                 className={`form-select ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 as="select"
//                 name="Shift"
//                 required
//               >
//                 <option selected>Select Shift</option>
//                 {shifts.map((data, index) => (
//                   <option key={index} value={data._id}>
//                     {data.name} → {convertToAmPm(data.startTime)} →{" "}
//                     {convertToAmPm(data.endTime)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Bank Name
//             </label>
//             <div className="form-input">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 type="text"
//                 placeholder="Please enter bank name"
//               />
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Bank Account Number
//             </label>
//             <div className="form-input">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 type="number"
//                 placeholder="Please enter bank account number"
//                 onInput={(e) => {
//                   if (e.target.value.length > 16) {
//                     e.target.value = e.target.value.slice(0, 16);
//                   }
//                 }}
//               />
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               IFSC Code
//             </label>
//             <div className="form-input">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 type="text"
//                 placeholder="Please enter IFSC code"
//               />
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               UAN Number
//             </label>
//             <div className="form-input">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 type="text"
//                 placeholder="Please enter UAN number"
//                 onInput={(e) => {
//                   if (e.target.value.length > 12) {
//                     e.target.value = e.target.value.slice(0, 12);
//                   }
//                 }}
//               />
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Pan Number
//             </label>
//             <div className="form-input">
//               <input
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 type="text"
//                 placeholder="Please enter Pan number"
//                 onInput={(e) => {
//                   if (e.target.value.length > 10) {
//                     e.target.value = e.target.value.slice(0, 10);
//                   }
//                 }}
//               />
//             </div>
//           </div>
//           <div className="col-12 col-md-6 col-lg-4">
//             <label
//               style={{
//                 color: darkMode
//                   ? "var(--secondaryDashColorDark)"
//                   : "var(--secondaryDashMenuColor)",
//               }}
//             >
//               Location Type <sup className="text-danger fs-6">*</sup>
//             </label>
//             <div className="form-input">
//               <select
//                 defaultValue={"On Sight"}
//                 className={`form-control ms-0 ms-md-auto rounded-2 ${
//                   darkMode
//                     ? "bg-light text-dark border dark-placeholder"
//                     : "bg-dark text-light border-0 light-placeholder"
//                 }`}
//                 name=""
//                 id=""
//               >
//                 <option value="On Sight">Onsite</option>
//                 <option value="Remote">Remote</option>
//                 <option value="Hybread">Hybrid</option>
//               </select>
//             </div>
//           </div>
//           <div
//             className="form-group col-12 d-flex  gap-5"
//             id="form-submit-button"
//           >
//             <button
//               className="btn btn-primary"
//               style={{
//                 backgroundColor: "var(--primaryDashColorDark)",
//                 color: "var(--primaryDashMenuColor)",
//                 border: "none",
//                 outline: "none",
//               }}
//               type="submit"
//             >
//               <MdOutlineDoneAll /> Submit
//             </button>
//             <button
//               className="btn btn-danger"
//               style={{
//                 backgroundColor: "red",
//                 color: "white",
//                 border: "none",
//                 outline: "none",
//               }}
//               type="reset"
//               onClick={props.onFormClose}
//             >
//               <MdOutlineCancel /> cancel
//             </button>
//           </div>
//           <div
//             className="col-12 col-md-6 col-lg-4"
//             id="form-cancel-button"
//           ></div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EmployeeForm;

// validate code
// --------------------------
// Validate form
// --------------------------
// const validateForm = () => {
//   const errors = {};
//   const emailRegex = /^[a-zA-Z0-9._%+-]\.com$/;
//   const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

//   if (!emailRegex.test(form.email)) errors.email = "Please enter email in correct format";
//   if (!passRegex.test(form.password))
//     errors.password = "Password must be 8+ chars with upper, lower, number";
//   if (!form.firstName) errors.firstName = "First name required";
//   if (!form.lastName) errors.lastName = "Last name required";
//   if (form.contactNo.length !== 10) errors.contactNo = "Contact No must be 10 digits";

//   if (form.bankName && form.bankName.length < 3) errors.bankName = "Bank Name must be at least 3 characters";
//   if (form.bankAccount && (form.bankAccount.length < 9 || form.bankAccount.length > 16))
//     errors.bankAccount = "Bank Account must be 9-16 digits";
//   if (form.bankIFSC && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(form.bankIFSC))
//     errors.bankIFSC = "Invalid IFSC code";
//   if (form.uan && form.uan.length !== 12) errors.uan = "UAN must be 12 digits";
//   if (form.pan && form.pan.length !== 10) errors.pan = "PAN must be 10 chars";

//   if (!form.department) errors.department = "Department required";
//   if (!form.position) errors.position = "Position required";
//   if (!form.doj) errors.doj = "Date of Joining required";
//   if (!form.shift) errors.shift = "Shift required";
//   if (!form.locationType) errors.locationType = "Location type required";
//   if (!form.gender) errors.gender = "Gender required";
//   if (!form.role) errors.role = "Role required";
//   if (!form.accountAccess) errors.accountAccess = "Account access required";

//   return errors;
// };

// // Sanitization and controlled input
// const handleChange = (e) => {
//   const { name, value, type, files } = e.target;
//   let sanitizedValue = value.trimStart();

//   if (name === "email") sanitizedValue = value.toLowerCase().trim();
//   if (name === "firstName" || name === "lastName")
//     sanitizedValue = value.replace(/[^a-zA-Z ]/g, "");
//   if (name === "contactNo")
//     sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
//   if (name === "pan")
//     sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
//   if (name === "uan")
//     sanitizedValue = value.replace(/\D/g, "").slice(0, 12);
//   if (name === "bankAccount")
//     sanitizedValue = value.replace(/\D/g, "").slice(0, 16);
//   if (name === "bankIFSC")
//     sanitizedValue = value.replace(/\s+/g, "").toUpperCase();
//   if (type === "file") sanitizedValue = files[0];

//   setForm({ ...form, [name]: sanitizedValue });

//   // Remove error for this field as soon as user fills correctly
//   setFormErrors((prev) => {
//     const newErrors = { ...prev };
//     // Only remove error if value is now valid
//     if (name === "bankName" && sanitizedValue.length >= 3) delete newErrors.bankName;
//     if (name === "bankAccount" && sanitizedValue.length >= 9 && sanitizedValue.length <= 16) delete newErrors.bankAccount;
//     if (name === "bankIFSC" && sanitizedValue.match(/^[A-Z]{4}0[A-Z0-9]{6}$/i)) delete newErrors.bankIFSC;
//     if (name === "uan" && sanitizedValue.length === 12) delete newErrors.uan;
//     if (name === "pan" && sanitizedValue.length === 10) delete newErrors.pan;
//     // Remove error if field is blank (optional)
//     if (["bankName","bankAccount","bankIFSC","uan","pan"].includes(name) && sanitizedValue === "") delete newErrors[name];
//     return newErrors;
//   });
// };
