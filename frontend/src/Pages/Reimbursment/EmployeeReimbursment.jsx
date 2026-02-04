// src/components/ReimbursementExpenseForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import BASE_URL from "../config/config";
import TittleHeader from "../TittleHeader/TittleHeader";
import { formatIndianCurrency } from "../../Utils/CurrencySymbol/formatIndianCurrency";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { IoCardOutline, IoFastFoodOutline } from "react-icons/io5";
import { TbTable } from "react-icons/tb";
import {
  FaBriefcaseMedical,
  FaBuilding,
  FaEllipsisH,
  FaPhone,
  FaPlane,
  FaShoppingCart,
} from "react-icons/fa";
import api from "../config/api";

const EmployeeReimbursment = () => {
  const [expensesData, setExpensesData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [viewType, setViewType] = useState(true);
  const { darkMode } = useTheme();
  const id = userData?._id;
  const [showMessage, setShowMessage] = useState(false);
  const [electedCardID, setSelectedCardID] = useState(null);

  const [expense, setExpense] = useState({
    date: "",
    type: "",
    appliedAmount: 0,
    status: "Pending",
    attachment: "",
    details: "",
    user: id,
  });

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const fetchReimbursmentExpenses = async () => {
  try {

    const response = await api.get(
      `/api/reimbursement-expenses/${userData?._id}`,
    );

    if (response.status === 200) {
      setExpensesData(response.data);
    } else {
      console.error("Failed to fetch reimbursement expenses:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching reimbursement expenses:", error);
  }
};


  useEffect(() => {
    fetchReimbursmentExpenses();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {

    await api.post(
      `/api/reimbursement-expenses`,
      expense,
    );

    alert("Expense created successfully!");
    setExpense({
      date: "",
      type: "",
      appliedAmount: 0,
      status: "",
      attachment: "",
      details: "",
      user: id,
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    alert("Error creating expense");
  }
};




  const ExpensesTypes = (type) => {
    switch (type) {
      case "Travel Expenses":
        return <FaPlane className="m-auto fs-1" />;
      case "Food & Beverages":
        return <IoFastFoodOutline className="m-auto fs-1" />;
      case "Telephone Expenses":
        return <FaPhone className="m-auto fs-1" />;
      case "Office supplies":
        return <FaShoppingCart className="m-auto fs-1" />;
      case "Office Expenses":
        return <FaBuilding className="m-auto fs-1" />;
      case "Medical Expenses":
        return <FaBriefcaseMedical className="m-auto fs-1" />;
      case "Miscellaneous":
        return <FaEllipsisH className="m-auto fs-1" />;
      default:
        return <FaEllipsisH className="m-auto fs-1" />; // Default icon for unknown types
    }
  };

  const groupedExpenses = expensesData.reduce((acc, expense) => {
    const createdAt = new Date(expense.createdAt);
    const year = createdAt.getFullYear();
    const month = createdAt.toLocaleString("default", { month: "short" });
    const date = createdAt.getDate(); // Extract day

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = {};
    if (!acc[year][month][date]) acc[year][month][date] = [];

    acc[year][month][date].push(expense);
    return acc;
  }, {});

  return (
    <div
      style={{ position: "relative", height: "95vh" }}
      className="container-fluid"
    >
      <div className="d-flex align-items-center justify-content-between">
        <TittleHeader
          title={"Reimbursment Expenses"}
          message={"You can add your reimbursment expenses here"}
        />
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => setViewType((prev) => !prev)}
            className="btn btn-light border"
          >
            {!viewType ? (
              <div className="d-flex align-items-center gap-2">
                <IoCardOutline className="fs-4" /> Card View
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <TbTable className="fs-4" /> Table View
              </div>
            )}
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary"
          >
            + Add
          </button>
        </div>
      </div>
      {isFormOpen && (
        <div
          className="d-flex flex-column gap-4 p-4 bg-white rounded-2"
          style={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: "translate(-50%)",
            zIndex: 100,
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <h6>Create Expenses</h6>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setIsFormOpen(false)}
            >
              {" "}
              Close ( X )
            </span>
          </div>
          <form className="row mx-auto row-gap-3" onSubmit={handleSubmit}>
            <input
              type="date"
              name="date"
              value={expense.date}
              onChange={handleChange}
              required
              className="form-control"
            />
            <select
              name="type"
              value={expense.type}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select Expenses Type</option>
              <option value="Travel Expenses">Travel Expenses</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Telephone Expenses">Telephone Expenses</option>
              <option value="Office supplies">Office supplies</option>
              <option value="Office expenses">Office expenses</option>
              <option value="Medical Expenses">Medical</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
            <input
              type="number"
              name="appliedAmount"
              value={expense.appliedAmount}
              onChange={handleChange}
              required
              className="form-control"
            />
            <input
              placeholder="Enter Attachments"
              type="text"
              name="attachment"
              value={expense.attachment}
              onChange={handleChange}
              className="form-control"
            />
            <textarea
              placeholder="Enter Expenses Details"
              name="details"
              value={expense.details}
              onChange={handleChange}
              className="form-control"
            ></textarea>
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </form>
        </div>
      )}

      <div>
        {viewType ? (
          <>
            <div
              className={`timeline-container my-3  p-3 rounded-2 ${
                darkMode ? "bg-light" : "bg-dark"
              }`}
              style={{
                height: "80vh",
                overflow: "auto",
                position: "relative",
                border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
                color: darkMode ? "black" : "white",
              }}
            >
              {Object.keys(groupedExpenses)
                .sort((a, b) => b - a) // Sort years descending
                .map((year) => (
                  <div key={year} className="year-section">
                    <h5 className="year-header d-flex align-items-center gap-2">
                      <div
                        style={{
                          height: ".5rem",
                          width: ".5rem",
                          borderRadius: "50%",
                          background: darkMode ? "black" : "white",
                        }}
                      ></div>{" "}
                      {year}
                    </h5>
                    {Object.keys(groupedExpenses[year])
                      .sort(
                        (a, b) =>
                          new Date(`${year} ${b}`) - new Date(`${year} ${a}`)
                      ) // Sort months descending
                      .map((month) => (
                        <div
                          style={{
                            borderLeft: `1px dashed  ${
                              darkMode ? "black" : "white"
                            } `,
                          }}
                          key={month}
                          className="month-section px-4"
                        >
                          <h5 className="month-header d-flex align-items-center gap-2">
                            <div
                              style={{
                                height: ".5rem",
                                width: ".5rem",
                                borderRadius: "50%",
                                background: darkMode ? "black" : "white",
                              }}
                            ></div>
                            {month}
                          </h5>
                          {Object.keys(groupedExpenses[year][month])
                            .sort((a, b) => b - a) // Sort days descending
                            .map((day) => (
                              <div
                                style={{
                                  borderLeft: `1px dashed  ${
                                    darkMode ? "black" : "white"
                                  } `,
                                }}
                                key={day}
                                className="day-section px-4"
                              >
                                <h6 className="day-header">Day {day}</h6>
                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                  {groupedExpenses[year][month][day].map(
                                    (data, index) => (
                                      <div
                                        key={index}
                                        className="p-2"
                                        style={{ width: "16rem" }}
                                        onMouseEnter={() => {
                                          setSelectedCardID(data._id);
                                          setShowMessage(true);
                                        }}
                                        onMouseLeave={() => {
                                          setShowMessage(false);
                                          setSelectedCardID(null);
                                        }}
                                      >
                                        <div
                                          style={{
                                            height: "18rem",
                                            background: !darkMode
                                              ? "var(--secondaryDashColorDark)"
                                              : "white",
                                            position: "relative",
                                            overflow: "hidden",
                                          }}
                                          className="rounded-2 p-2"
                                        >
                                          {electedCardID === data._id &&
                                            showMessage && (
                                              <div
                                                style={{
                                                  height: "100%",
                                                  width: "100%",
                                                  position: "absolute",
                                                  background: !darkMode
                                                    ? "var(--secondaryDashColorDark)"
                                                    : "white",
                                                  top: "0",
                                                  left: "0",
                                                  zIndex: "10",
                                                }}
                                                className="rounded-2 p-2 d-flex flex-column justify-content-between"
                                              >
                                                <p
                                                  style={{
                                                    height: "9rem",
                                                    padding: ".5rem ",
                                                    whiteSpace: "break-spaces",
                                                    width: "100%",
                                                    overflow: "auto",
                                                    background:
                                                      "rgba(87, 86, 86, 0.1)",
                                                  }}
                                                  className=" my-0 rounded-2"
                                                >
                                                  {data.details}
                                                </p>
                                                <div className="d-flex gap-2 align-items-center">
                                                  <div
                                                    style={{
                                                      flex: 1,
                                                      height: "7rem",
                                                      background:
                                                        "rgba(87, 86, 86, 0.1)",
                                                      overflow: "hidden",
                                                    }}
                                                    className="rounded-2"
                                                  >
                                                    <img
                                                      style={{
                                                        height: "100%",
                                                        width: "100%",
                                                        objectFit: "cover",
                                                        cursor: "pointer",
                                                      }}
                                                      alt="file"
                                                      src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                                                    ></img>
                                                  </div>
                                                  <div
                                                    style={{
                                                      flex: 1,
                                                      height: "7rem",
                                                      background:
                                                        "rgba(87, 86, 86, 0.1)",
                                                      overflow: "hidden",
                                                    }}
                                                    className="rounded-2"
                                                  ></div>
                                                </div>
                                              </div>
                                            )}

                                          <div
                                            style={{
                                              height: "5rem",
                                              width: "5rem",
                                              background:
                                                "linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
                                              justifyContent: "space-between",
                                              position: "absolute",
                                              right: "-.8rem",
                                              bottom: "-.8rem",
                                              color: "white",
                                              borderRadius: "50%",
                                            }}
                                            className="d-flex "
                                          >
                                            {ExpensesTypes(data.type)}
                                          </div>
                                          <div
                                            style={{
                                              height: "2rem",
                                              width: "2rem",
                                              background:
                                                "linear-gradient(90deg, rgba(178, 173, 175, 0.62) 0%, rgba(179, 179, 179, 0.77) 100%)",
                                              justifyContent: "space-between",
                                              position: "absolute",
                                              left: "-.2rem",
                                              bottom: "-.2rem",
                                              color: "white",
                                              borderRadius: "50%",
                                              zIndex: 0,
                                            }}
                                            className="d-flex"
                                          >
                                            <span className="m-auto">
                                              {" "}
                                              {index + 1}
                                            </span>
                                          </div>
                                          {data.status === "Approved" ? (
                                            <div className="badge-success mb-1 w-100 rounded-0 py-1 text-center">
                                              Approved
                                            </div>
                                          ) : data.status === "Rejected" ? (
                                            <div className="badge-danger mb-1 w-100 rounded-0 py-1 text-center">
                                              Rejected
                                            </div>
                                          ) : (
                                            " "
                                          )}

                                          <div>
                                            <h5
                                              style={{
                                                fontSize: "1.1rem",
                                                color: "rgba(27, 28, 28, 0.69)",
                                              }}
                                            >
                                              {data.type}
                                            </h5>
                                          </div>
                                          <div className="my-2">
                                            <p
                                              style={{
                                                fontSize: ".9rem",
                                                color:
                                                  "rgba(22, 75, 197, 0.66)",
                                              }}
                                              className="my-0 mb-1"
                                            >
                                              Applied Amount
                                            </p>
                                            <p
                                              style={{
                                                border: `1px dashed  rgba(22, 75, 197, 0.66)`,
                                              }}
                                              className="my-0 fs-4 text-primary rounded-2 px-2 fw-bold"
                                            >
                                              {formatIndianCurrency(
                                                data.appliedAmount ?? 0
                                              )}
                                            </p>
                                          </div>
                                          <div className="my-2">
                                            <p
                                              style={{
                                                fontSize: ".9rem",
                                                color:
                                                  "rgba(49, 205, 148, 0.87)",
                                              }}
                                              className="my-0 mb-1"
                                            >
                                              Approved Amount
                                            </p>
                                            <p
                                              style={{
                                                border: `1px dashed rgba(49, 205, 148, 0.87)`,
                                              }}
                                              className="my-0 fs-4 text-success px-2 rounded-2 fw-bold"
                                            >
                                              {formatIndianCurrency(
                                                data.approvedAmount ?? 0
                                              )}
                                            </p>
                                          </div>
                                          <p
                                            className={`my-0 my-2  ${
                                              data.status === "Approved"
                                                ? darkMode
                                                  ? "badge-success"
                                                  : "badge-success-dark"
                                                : data.status === "Rejected"
                                                ? darkMode
                                                  ? "badge-danger"
                                                  : "badge-danger-dark"
                                                : darkMode
                                                ? "badge-warning"
                                                : "badge-warning-dark"
                                            }`}
                                            style={{ width: "fit-content" }}
                                          >
                                            {data.status}
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </>
        ) : (
          <>
            {expensesData.length > 0 ? (
              <div
                style={{
                  height: "fit-content",
                  maxHeight: "75vh",
                  overflow: "auto",
                  position: "relative",
                  border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
                }}
                className="scroller  my-3 rounded-2"
              >
                <table className="table mb-0 table-hover">
                  <thead>
                    <tr>
                      <th style={rowHeadStyle(darkMode)}>S.No</th>
                      <th style={rowHeadStyle(darkMode)}>Bill Date</th>
                      <th style={rowHeadStyle(darkMode)}>Created Date</th>
                      <th style={rowHeadStyle(darkMode)}>Amount</th>
                      <th style={rowHeadStyle(darkMode)}>Expenses Type</th>
                      <th style={rowHeadStyle(darkMode)}>Expenses Details</th>
                      <th style={rowHeadStyle(darkMode)}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expensesData.map((data, index) => (
                      <tr key={index}>
                        <th style={rowBodyStyle(darkMode)}>{index + 1}</th>
                        <th style={rowBodyStyle(darkMode)}>{data.date}</th>
                        <th style={rowBodyStyle(darkMode)}>
                          {data.createdAt}{" "}
                        </th>
                        <th style={rowBodyStyle(darkMode)}>
                          {formatIndianCurrency(data.appliedAmount)}
                        </th>
                        <th style={rowBodyStyle(darkMode)}>{data.type}</th>
                        <th style={rowBodyStyle(darkMode)}>{data.details}</th>
                        <th style={rowBodyStyle(darkMode)}>{data.status}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>No Data Found</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeReimbursment;
