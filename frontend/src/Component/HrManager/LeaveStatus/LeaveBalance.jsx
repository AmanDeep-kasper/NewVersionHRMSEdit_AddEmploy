import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import BASE_URL from "../../../Pages/config/config";
import { useSelector } from "react-redux";
import LeavePolicy from "../../../Files/LeavePolicy.pdf";
import { PiFilePdfLight } from "react-icons/pi";
import api from "../../../Pages/config/api";

const LeaveBalance = () => {
  const [leaveBalance, setLeaveBalance] = useState([]);
  const { userData } = useSelector((state) => state.user);

  const id = userData?._id;
  const { darkMode } = useTheme();

  useEffect(() => {
    api
      .post(
        `/api/getLeave`,
        { id },
      )
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const leaveType = Object.keys(item)[0];
          const totalLeaveType = Object.keys(item)[1];
          return {
            leaveType: leaveType.replace(/([A-Z])/g, " $1").trim(),
            balance: item[leaveType],
            totalBalance: item[totalLeaveType],
          };
        });
        setLeaveBalance(formattedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const calculatePercentage = (used, total) => {
    if (total === 0) return 0;
    const percentage = (used / total) * 100;
    return Math.round(percentage) || 0;
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center mb-3 justify-content-between">
        <TittleHeader
          title={"Leaves Balance"}
          message={"You can see all new leave balances here."}
        />
        <a
          target="_blank"
          href={LeavePolicy}
          download
          className="d-flex align-items-center text-danger gap-2 px-3 py-2"
          style={{ cursor: "pointer", textDecoration: "none" }}
        >
          <PiFilePdfLight className="fs-5 " /> Leave Policy
        </a>
      </div>

      <div className="d-flex flex-wrap justify-content-between gap-2 my-2">
        {leaveBalance.length > 0 ? (
          <div className="row w-100">
            {" "}
            {leaveBalance.map(({ leaveType, balance, totalBalance }) => (
              <div
                key={leaveType}
                className="card-body col-6 col-md-3 col-lg-2 rounded-2 p-1"
              >
                <div
                  style={{
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--secondaryDashMenuColor)",
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                  }}
                  className="p-3 rounded-2"
                >
                  <div className="d-flex justify-content-between">
                    <p className="my-auto">
                      {leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}
                    </p>{" "}
                    {leaveType !== "sick Leave" ? (
                      <span
                        className={`${
                          darkMode
                            ? "badge-success border"
                            : "badge-success-dark"
                        }`}
                      >
                        Paid
                      </span>
                    ) : (
                      <span
                        className={`${
                          darkMode ? "badge-danger border" : "badge-danger-dark"
                        }`}
                      >
                        Unpaid
                      </span>
                    )}
                  </div>
                  <h6
                    style={{ fontWeight: "400" }}
                    className="card-text text-center my-4"
                  >
                    {totalBalance - balance} Out of / {totalBalance}
                  </h6>
                  <div>
                    <p
                      className="p-0 m-0 text-end"
                      style={{ fontSize: ".8rem" }}
                    >
                      {calculatePercentage(
                        totalBalance - balance,
                        totalBalance
                      )}
                      % of 100%
                    </p>
                    <div
                      style={{ height: "10px", outline:`3px solid ${darkMode? "rgba(219, 212, 212, 0.83)" : "rgba(90, 84, 84, 0.93)"}` }}
                      className="progress rounded-5 mt-1"
                    >
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{
                          width: `${calculatePercentage(
                            totalBalance - balance,
                            totalBalance
                          )}%`,
                          overflow: "hidden",
                        }}
                        aria-valuenow={25}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row  w-100">
            <div className="card-body col-6 col-md-3 col-lg-2 rounded-2 p-1">
              <div
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                }}
                className="p-3"
              >
                <div className="d-flex justify-content-between">
                  <p className="">Sick Leave</p>
                </div>
                <h6
                  style={{ fontWeight: "400" }}
                  className="card-text text-center mb-4"
                >
                  Leave Not Assigned
                </h6>
                <div>
                  <p className="p-0 m-0 text-end" style={{ fontSize: ".8rem" }}>
                    100 % of 100%
                  </p>
                  <div style={{ height: "6px" }} className="progress">
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{
                        width: `0%`,
                      }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body col-6 col-md-3 col-lg-2 rounded-2 p-1">
              <div
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                }}
                className="p-3"
              >
                <div className="d-flex justify-content-between">
                  <p className="">Paid Leave</p>
                </div>
                <h6
                  style={{ fontWeight: "400" }}
                  className="card-text text-center mb-4"
                >
                  Leave Not Assigned
                </h6>
                <div>
                  <p className="p-0 m-0 text-end" style={{ fontSize: ".8rem" }}>
                    100 % of 100%
                  </p>
                  <div style={{ height: "6px" }} className="progress">
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{
                        width: `0%`,
                      }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body col-6 col-md-3 col-lg-2 rounded-2 p-1">
              <div
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                }}
                className="p-3"
              >
                <div className="d-flex justify-content-between">
                  <p className="">Casual Leave</p>
                </div>
                <h6
                  style={{ fontWeight: "400" }}
                  className="card-text text-center mb-4"
                >
                  Leave Not Assigned
                </h6>
                <div>
                  <p className="p-0 m-0 text-end" style={{ fontSize: ".8rem" }}>
                    100 % of 100%
                  </p>
                  <div style={{ height: "6px" }} className="progress">
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{
                        width: `0%`,
                      }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body col-6 col-md-3 col-lg-2 rounded-2 p-1">
              <div
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                }}
                className="p-3"
              >
                <div className="d-flex justify-content-between">
                  <p className="">Unpaid Leave</p>
                </div>
                <h6
                  style={{ fontWeight: "400" }}
                  className="card-text text-center mb-4"
                >
                  Leave Not Assigned
                </h6>
                <div>
                  <p className="p-0 m-0 text-end" style={{ fontSize: ".8rem" }}>
                    100 % of 100%
                  </p>
                  <div style={{ height: "6px" }} className="progress">
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{
                        width: `0%`,
                      }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveBalance;
