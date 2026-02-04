import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import BASE_URL from "../config/config";
import TittleHeader from "../TittleHeader/TittleHeader";
import { formatIndianCurrency } from "../../Utils/CurrencySymbol/formatIndianCurrency";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import {
  IoArrowForwardCircleOutline,
  IoArrowUpCircleOutline,
  IoCalendarClearOutline,
  IoCardOutline,
  IoFastFoodOutline,
} from "react-icons/io5";
import { TbTable } from "react-icons/tb";
import {
  FaBriefcaseMedical,
  FaBuilding,
  FaEllipsisH,
  FaPhone,
  FaPlane,
  FaShoppingCart,
} from "react-icons/fa";
import ProfileAvatar from "../../Utils/ProfileAvatar/ProfileAvatar";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import EditReimbursementExpense from "./EditReimbursementExpense";
import api from "../config/api";

const AdminHRReimbursmentView = () => {
  const [expensesData, setExpensesData] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const [viewType, setViewType] = useState(true);
  const { darkMode } = useTheme();
  const id = userData?._id;
  const [showMessage, setShowMessage] = useState(false);
  const [electedCardID, setSelectedCardID] = useState(null);
  const [selectedExpenseType, setSelectedExpenseType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [expandedYears, setExpandedYears] = useState(() => {
    const saved = sessionStorage.getItem("expandedYears");
    return saved ? JSON.parse(saved) : {};
  });
  const [expandedMonths, setExpandedMonths] = useState(() => {
    const saved = sessionStorage.getItem("expandedMonths");
    return saved ? JSON.parse(saved) : {};
  });
  const [expandedDays, setExpandedDays] = useState(() => {
    const saved = sessionStorage.getItem("expandedDays");
    return saved ? JSON.parse(saved) : {};
  });
  const [SelectedCardEditID, setSelectedCardEditID] = useState({
    date: "",
    type: "",
    appliedAmount: "",
    status: "",
    attachment: "",
    details: "",
    cardID: "",
    Open: "",
  });

 const fetchReimbursmentExpenses = async () => {
  try {

    const response = await api.get(`/api/reimbursement-expenses`, {
    });

    setExpensesData(response.data);
  } catch (error) {
    console.error("Error fetching reimbursement expenses:", error);
    console.error(
      error?.response?.data?.message || "Failed to fetch reimbursement expenses."
    );
  }
};


  useEffect(() => {
    fetchReimbursmentExpenses();
  }, []);

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

  const getUsers = () => {
    const usersSet = new Set();
    Object.values(groupedExpenses).forEach((year) =>
      Object.values(year).forEach((month) =>
        Object.values(month).forEach((day) =>
          day.forEach((expense) =>
            usersSet.add(
              `${expense.user._id}#${expense.user.FirstName} ${expense.user.LastName}`
            )
          )
        )
      )
    );
    return Array.from(usersSet);
  };

  // Apply filtering based on selected user
  const filteredExpenses = Object.keys(groupedExpenses).reduce((acc, year) => {
    const filteredYear = Object.keys(groupedExpenses[year]).reduce(
      (monthAcc, month) => {
        const filteredMonth = Object.keys(groupedExpenses[year][month]).reduce(
          (dayAcc, day) => {
            const filteredDay = groupedExpenses[year][month][day].filter(
              (data) => {
                return (
                  (selectedUser === "" || data.user._id === selectedUser) &&
                  (selectedStatus === "" || data.status === selectedStatus) &&
                  (selectedExpenseType === "" ||
                    data.type === selectedExpenseType)
                );
              }
            );

            if (filteredDay.length > 0) {
              dayAcc[day] = filteredDay;
            }
            return dayAcc;
          },
          {}
        );

        if (Object.keys(filteredMonth).length > 0) {
          monthAcc[month] = filteredMonth;
        }
        return monthAcc;
      },
      {}
    );

    if (Object.keys(filteredYear).length > 0) {
      acc[year] = filteredYear;
    }
    return acc;
  }, {});

  useEffect(() => {
    sessionStorage.setItem("expandedYears", JSON.stringify(expandedYears));
  }, [expandedYears]);

  useEffect(() => {
    sessionStorage.setItem("expandedMonths", JSON.stringify(expandedMonths));
  }, [expandedMonths]);

  useEffect(() => {
    sessionStorage.setItem("expandedDays", JSON.stringify(expandedDays));
  }, [expandedDays]);

  const toggleYear = (year) => {
    setExpandedYears((prev) => {
      const newState = { ...prev, [year]: !prev[year] };
      sessionStorage.setItem("expandedYears", JSON.stringify(newState));
      return newState;
    });
  };

  const toggleMonth = (year, month) => {
    setExpandedMonths((prev) => {
      const newState = {
        ...prev,
        [`${year}-${month}`]: !prev[`${year}-${month}`],
      };
      sessionStorage.setItem("expandedMonths", JSON.stringify(newState));
      return newState;
    });
  };

  const toggleDay = (year, month, day) => {
    setExpandedDays((prev) => {
      const newState = {
        ...prev,
        [`${year}-${month}-${day}`]: !prev[`${year}-${month}-${day}`],
      };
      sessionStorage.setItem("expandedDays", JSON.stringify(newState));
      return newState;
    });
  };

  const getOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) return "th"; // Special case for 11, 12, 13
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

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
          <div className="d-flex gap-2">
            <select
              className="form-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">All Users</option>
              {getUsers().map((userString) => {
                const [id, name] = userString.split("#");
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>

            <select
              className="form-select"
              value={selectedExpenseType}
              onChange={(e) => setSelectedExpenseType(e.target.value)}
            >
              <option value="">All Expense Types</option>
              <option value="Travel Expenses">Travel Expenses</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Telephone Expenses">Telephone Expenses</option>
              <option value="Office supplies">Office supplies</option>
              <option value="Office Expenses">Office Expenses</option>
              <option value="Medical Expenses">Medical Expenses</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>

            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

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
        </div>
      </div>
      <EditReimbursementExpense
        isOpen={SelectedCardEditID.Open}
        date={SelectedCardEditID.date}
        type={SelectedCardEditID.type}
        appliedAmount={SelectedCardEditID.appliedAmount}
        status={SelectedCardEditID.status}
        attachment={SelectedCardEditID.attachment}
        details={SelectedCardEditID.details}
        cardID={SelectedCardEditID.cardID}
      />
      <div className="row my-2">
        <div className="col-3 text-center px-2">
          <div className="text-center text-primary border bg-light py-4 d-flex flex-column gap-2 rounded-2">
            <h6 className="my-0">Total Reimbursment Applied</h6>
            <h3 className="my-0">
              {formatIndianCurrency(
                expensesData.reduce(
                  (sum, item) => sum + (item.appliedAmount || 0),
                  0
                )
              )}
            </h3>
          </div>
        </div>
        <div className="col-3 text-warning text-center px-2">
          <div className="text-center rounded-2 border bg-light py-4 d-flex flex-column gap-2 ">
            <h6 className="my-0">Total Pending</h6>
            <h3 className="my-0">
              {formatIndianCurrency(
                expensesData.reduce(
                  (sum, item) => sum + (item.appliedAmount || 0),
                  0
                ) -
                  expensesData.reduce(
                    (sum, item) => sum + (item.approvedAmount || 0),
                    0
                  )
              )}
            </h3>
          </div>
        </div>
        <div className="col-3 text-success text-center px-2">
          <div className="text-center rounded-2 border bg-light py-4 d-flex flex-column gap-2 ">
            <h6 className="my-0">Total Approved</h6>
            <h3 className="my-0">
              {formatIndianCurrency(
                expensesData.reduce(
                  (sum, item) => sum + (item.approvedAmount || 0),
                  0
                )
              )}
            </h3>
          </div>
        </div>
        <div className="col-3 text-danger text-center px-2">
          <div className="text-center rounded-2 border bg-light py-4 d-flex flex-column gap-2 ">
            <h6 className="my-0">Total Rejected</h6>
            <h3 className="my-0">
              {formatIndianCurrency(
                expensesData
                  .filter((data) => data.status === "Rejected")
                  .reduce((sum, item) => sum + (item.appliedAmount || 0), 0) -
                  expensesData
                    .filter((data) => data.status === "Rejected")
                    .reduce((sum, item) => sum + (item.approvedAmount || 0), 0)
              )}
            </h3>
          </div>
        </div>
      </div>
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
              {Object.keys(filteredExpenses).length ? (
                <>
                  {Object.keys(filteredExpenses)
                    .sort((a, b) => b - a)
                    .map((year) => (
                      <div key={year} className="year-section">
                        <div
                          style={{
                            border: darkMode
                              ? "var(--borderLight)"
                              : "var(--borderDark)",
                          }}
                          className=" my-1 d-flex alignitems-center justify-content-between"
                        >
                          <h5
                            style={{
                              cursor: "pointer",
                              width: "fit-content",
                              borderRadius: "0 20px 20px 0",
                              border: "1px solid rgba(0,0,0,.1)",
                              background: "orange",
                              color: "white",
                            }}
                            className="year-header my-2 py-1 px-2 d-flex align-items-center gap-2 py-2"
                            onClick={() => toggleYear(year)}
                          >
                            <div
                              style={{
                                height: ".5rem",
                                width: ".5rem",
                                borderRadius: "0%",
                                transform: "rotate(45deg)",
                                background: "white",
                                marginTop: ".1rem",
                              }}
                            ></div>{" "}
                            {year}{" "}
                            {expandedYears[year] ? (
                              <MdKeyboardArrowUp />
                            ) : (
                              <MdKeyboardArrowDown />
                            )}
                          </h5>
                          <div
                            style={{ color: "rgba(56, 54, 54, 0.8)" }}
                            className="d-flex align-items-center gap-2 justify-content-between px-3"
                          >
                            <h6 className="my-0">Total Pending</h6>
                            <h6 className="my-0">
                              {formatIndianCurrency(
                                expensesData
                                  .filter(
                                    (item) =>
                                      new Date(item.date).getFullYear() ===
                                      Object.keys(filteredExpenses[year])
                                  )
                                  .reduce(
                                    (sum, item) =>
                                      sum + (item.appliedAmount || 0),
                                    0
                                  ) -
                                  expensesData
                                    .filter(
                                      (item) =>
                                        new Date(item.date).getFullYear() ===
                                        Object.keys(filteredExpenses[year])
                                    )
                                    .reduce(
                                      (sum, item) =>
                                        sum + (item.approvedAmount || 0),
                                      0
                                    )
                              )}
                            </h6>
                          </div>
                        </div>
                        {expandedYears[year] &&
                          Object.keys(filteredExpenses[year])
                            .sort(
                              (a, b) =>
                                new Date(`${year} ${b}`) -
                                new Date(`${year} ${a}`)
                            ) // Sort months descending
                            .map((month) => (
                              <div
                                style={{
                                  borderLeft: `1px dashed  ${
                                    darkMode ? "black" : "white"
                                  } `,
                                  marginLeft: ".8rem",
                                }}
                                key={month}
                                className="month-section pl-4"
                              >
                                {" "}
                                <div
                                  style={{
                                    border: darkMode
                                      ? "var(--borderLight)"
                                      : "var(--borderDark)",
                                  }}
                                  className=" my-1"
                                >
                                  <h5
                                    style={{
                                      cursor: "pointer",
                                      width: "fit-content",
                                      borderRadius: "0 20px 20px 0",
                                      border: "1px solid rgba(0,0,0,.1)",
                                      // background: "rgb(22, 103, 224)",
                                      // color: "white",
                                    }}
                                    className="month-header my-2 py-1 px-2 d-flex align-items-center gap-2 py-2"
                                    onClick={() => toggleMonth(year, month)}
                                  >
                                    <IoCalendarClearOutline />
                                    {month}{" "}
                                    {expandedMonths[`${year}-${month}`] ? (
                                      <MdKeyboardArrowUp />
                                    ) : (
                                      <MdKeyboardArrowDown />
                                    )}
                                  </h5>
                                </div>
                                {expandedMonths[`${year}-${month}`] &&
                                  Object.keys(filteredExpenses[year][month])
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
                                        <div className="">
                                          <h6
                                            style={{
                                              cursor: "pointer",
                                              width: "fit-content",
                                              borderRadius: "0",
                                              fontWeight: "normal",
                                              background:
                                                "rgba(25, 90, 231, 0.84)",
                                              color: "white",
                                              clipPath:
                                                "polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)",
                                            }}
                                            className="day-header my-2 px-2 d-flex align-items-center gap-2 py-2"
                                            onClick={() =>
                                              toggleDay(year, month, day)
                                            }
                                          >
                                            <span
                                              style={{ gap: ".1rem" }}
                                              className="d-flex fw-bold align-items-center "
                                            >
                                              {day}
                                              <sup>{getOrdinalSuffix(day)}</sup>
                                            </span>
                                            {expandedDays[
                                              `${year}-${month}-${day}`
                                            ] ? (
                                              <MdKeyboardArrowUp className="fs-5" />
                                            ) : (
                                              <MdKeyboardArrowDown className="fs-5" />
                                            )}
                                          </h6>
                                        </div>

                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                          {expandedDays[
                                            `${year}-${month}-${day}`
                                          ] &&
                                            filteredExpenses[year][month][
                                              day
                                            ].map((data, index) => (
                                              <div
                                                key={index}
                                                className="p-2"
                                                style={{ width: "21rem" }}
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
                                                    height: "23rem",
                                                    background: !darkMode
                                                      ? "var(--secondaryDashColorDark)"
                                                      : "white",
                                                    position: "relative",
                                                    overflow: "hidden",
                                                  }}
                                                  className="rounded-2 p-3"
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
                                                        className="rounded-2 p-2 d-flex flex-column justify-content-between border-0 shadow-0"
                                                      >
                                                        <button
                                                          onClick={() =>
                                                            setSelectedCardEditID(
                                                              {
                                                                Open: true,
                                                                date: data.date,
                                                                type: data.type,
                                                                appliedAmount:
                                                                  data.appliedAmount,
                                                                status:
                                                                  data.status,
                                                                attachment:
                                                                  data.attachment,
                                                                details:
                                                                  data.details,
                                                                cardID:
                                                                  data._id,
                                                              }
                                                            )
                                                          }
                                                          style={{
                                                            height: "2rem",
                                                            width: "2rem",
                                                            position:
                                                              "absolute",
                                                            background:
                                                              !darkMode
                                                                ? "var(--secondaryDashColorDark)"
                                                                : "white",
                                                            color: darkMode
                                                              ? "var(--secondaryDashColorDark)"
                                                              : "white",
                                                            top: ".1rem",
                                                            right: ".1rem",
                                                            zIndex: 11,
                                                          }}
                                                          className="btn btn-light d-flex align-items-center justify-content-center p-0"
                                                        >
                                                          <MdOutlineModeEditOutline className="fs-6" />
                                                        </button>
                                                        <div
                                                          style={{
                                                            height: "9rem",
                                                            padding: ".5rem ",
                                                            whiteSpace:
                                                              "break-spaces",
                                                            width: "100%",
                                                            overflow: "auto",
                                                            background:
                                                              "rgba(87, 86, 86, 0.1)",
                                                          }}
                                                          className=" my-0 rounded-2"
                                                        >
                                                          <p
                                                            className=" my-0"
                                                            style={{
                                                              fontWeight: "500",
                                                            }}
                                                          >
                                                            Rembursment Details
                                                          </p>
                                                          <p className=" my-0">
                                                            {data.details}
                                                          </p>
                                                        </div>
                                                        <div
                                                          style={{
                                                            height: "5rem",
                                                            padding: ".5rem ",
                                                            whiteSpace:
                                                              "break-spaces",
                                                            width: "100%",
                                                            overflow: "auto",
                                                            background:
                                                              "rgba(87, 86, 86, 0.1)",
                                                          }}
                                                          className=" my-0 rounded-2"
                                                        >
                                                          <p
                                                            className=" my-0"
                                                            style={{
                                                              fontWeight: "500",
                                                            }}
                                                          >
                                                            Final Remarks
                                                          </p>
                                                          <p className=" my-0">
                                                            {data.finalRemarks}
                                                          </p>
                                                        </div>
                                                        <div className="d-flex gap-2 align-items-center">
                                                          <div
                                                            style={{
                                                              flex: 1,
                                                              height: "7rem",
                                                              background:
                                                                "rgba(87, 86, 86, 0.1)",
                                                              overflow:
                                                                "hidden",
                                                            }}
                                                            className="rounded-2"
                                                          >
                                                            <img
                                                              style={{
                                                                height: "100%",
                                                                width: "100%",
                                                                objectFit:
                                                                  "cover",
                                                                cursor:
                                                                  "pointer",
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
                                                              overflow:
                                                                "hidden",
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
                                                      justifyContent:
                                                        "space-between",
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
                                                      justifyContent:
                                                        "space-between",
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
                                                  {data.status ===
                                                  "Approved" ? (
                                                    <div className="badge-success mb-1 w-100 rounded-0 py-1 text-center">
                                                      Approved
                                                    </div>
                                                  ) : data.status ===
                                                    "Rejected" ? (
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
                                                        color:
                                                          "rgba(27, 28, 28, 0.69)",
                                                      }}
                                                    >
                                                      {data.type}
                                                    </h5>
                                                  </div>
                                                  <div className="p-2 bg-light border rounded-2">
                                                    <p className="my-0">
                                                      Expenses of:
                                                    </p>
                                                    <p
                                                      style={{
                                                        fontWeight: "500",
                                                      }}
                                                      className="my-0"
                                                    >
                                                      {data.user.FirstName}{" "}
                                                      {data.user.LastName}
                                                    </p>
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
                                                  <div>
                                                    <p
                                                      className={`my-0 my-2  ${
                                                        data.status ===
                                                        "Approved"
                                                          ? darkMode
                                                            ? "badge-success"
                                                            : "badge-success-dark"
                                                          : data.status ===
                                                            "Rejected"
                                                          ? darkMode
                                                            ? "badge-danger"
                                                            : "badge-danger-dark"
                                                          : darkMode
                                                          ? "badge-warning"
                                                          : "badge-warning-dark"
                                                      }`}
                                                      style={{
                                                        width: "fit-content",
                                                      }}
                                                    >
                                                      {data.status}
                                                    </p>
                                                    {data.status ===
                                                    "Accepted" ? (
                                                      <span>
                                                        Shashi Kumar Jha
                                                      </span>
                                                    ) : data.status ===
                                                      "Accepted" ? (
                                                      <span>
                                                        Shashi Kumar Jha
                                                      </span>
                                                    ) : (
                                                      " "
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    ))}
                              </div>
                            ))}
                      </div>
                    ))}
                </>
              ) : (
                <div>Data Not Available</div>
              )}
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
                      <th style={rowHeadStyle(darkMode)}>User Name</th>
                      <th style={rowHeadStyle(darkMode)}>User Position</th>
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
                        <th style={rowBodyStyle(darkMode)}>
                          <ProfileAvatar
                            imageURL={data.user.profile.image_url}
                            firstName={data.user.FirstName}
                            lastName={data.user.LastName}
                            additional={
                              data.user.Account === 1
                                ? "Admin"
                                : data.user.Account === 2
                                ? "Hr"
                                : data.user.Account === 3
                                ? "Manager"
                                : "Employee"
                            }
                          />
                        </th>
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

export default AdminHRReimbursmentView;
