import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import TittleHeader from "../TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import { IoIosFemale, IoIosMale } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { BsGenderAmbiguous } from "react-icons/bs";
import { MdOutlineSick } from "react-icons/md";
import { PiBabyBold, PiTelevision } from "react-icons/pi";
import { LiaBabyCarriageSolid } from "react-icons/lia";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import api from "../config/api";

const LeaveBalanceRegister = () => {
  const [leaveBalance, setLeaveBalance] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    api
      .get(`/api/getAllLeave`, {
      })
      .then((response) => {
        setLeaveBalance(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="container-fluid">
      <div className="my-2">
        <TittleHeader
          title={"Leave Register"}
          message={"You can see all employee leave records here"}
        />
      </div>

      <div>
        <div
          style={{
            height: "fit-content",
            maxHeight: "80vh",
            overflow: "auto",
            position: "relative",
            border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
          }}
          className="scroller mb-2 rounded-2"
        >
          <table className="table mb-0 table-hover">
            <thead>
              <tr>
                <th style={rowHeadStyle(darkMode)}>
                  <p className="d-flex align-items-center gap-2 m-0">
                    {" "}
                    <CgProfile className="fs-5" />
                    User Profile
                  </p>
                </th>
                <th style={rowHeadStyle(darkMode)}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    {" "}
                    <BsGenderAmbiguous className="fs-5" />
                    Gender
                  </p>
                </th>
                <th style={rowHeadStyle(darkMode)}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    {" "}
                    <MdOutlineSick className="fs-5" />
                    Sick Leave
                  </p>
                </th>
                <th style={rowHeadStyle(darkMode)}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    {" "}
                    <PiBabyBold className="fs-4" />
                    Maternity Leave
                  </p>
                </th>
                <th style={rowHeadStyle(darkMode)}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    {" "}
                    <LiaBabyCarriageSolid className="fs-4" />
                    Paternity Leave
                  </p>
                </th>
                <th style={rowHeadStyle(darkMode)}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    {" "}
                    <PiTelevision className="fs-4" />
                    Casual Leave
                  </p>
                </th>
                <th style={rowHeadStyle(darkMode)}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    {" "}
                    <HiOutlineCurrencyRupee className="fs-4" />
                    Paid Leave
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {leaveBalance.map((leaveData) => (
                <tr key={leaveData._id}>
                  <td style={rowBodyStyle(darkMode)}>
                    <div
                      style={{ width: "fit-content" }}
                      className="d-flex align-items-center gap-3"
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ height: "2.3rem", width: "2.3rem" }}
                      >
                        {leaveData?.profile?.image_url ? (
                          <img
                            style={{
                              height: "100%",
                              width: "100%",
                              overflow: "hidden",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                            className="border"
                            src={leaveData?.profile?.image_url}
                            alt={`${leaveData.FirstName} ${leaveData.LastName}`}
                          />
                        ) : (
                          <span
                            style={{
                              height: "100%",
                              width: "100%",
                              overflow: "hidden",
                              borderRadius: "50%",
                              objectFit: "cover",
                              fontWeight: "600",
                              color: darkMode ? "rgba(0,0,0,.8)" : "white",
                              background: darkMode ? "white" : "rgba(0,0,0,.8)",
                            }}
                            className="text-capitalize d-flex border py-1 align-items-center justify-content-center"
                          >
                            {leaveData?.FirstName?.charAt(0)?.toUpperCase()}
                            {leaveData?.LastName?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <span>{leaveData?.empID}</span>
                        <div className="text-capitalize">
                          {leaveData?.FullName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`text-center`} style={rowBodyStyle(darkMode)}>
                    {leaveData.Gender === "male" ? (
                      <span
                        className={`${
                          darkMode
                            ? "badge-primary border py-1"
                            : "badge-primary-dark py-1"
                        }`}
                        style={{ background: "#2a52be" }}
                      >
                        <IoIosMale /> Male
                      </span>
                    ) : (
                      <span
                        className={`${
                          darkMode
                            ? "badge-pink border py-1"
                            : "badge-pink-dark py-1"
                        }`}
                      >
                        <IoIosFemale /> Female
                      </span>
                    )}
                  </td>

                  <td className={`text-center`} style={rowBodyStyle(darkMode)}>
                    <div
                      style={{
                        boxShadow: darkMode
                          ? "0 0 4px 2px rgba(209, 206, 206, 0.31) inset"
                          : "0 0 4px 2px rgba(56, 55, 55, 0.31) inset",
                      }}
                      className={`rounded-2 d-flex align-items-center justify-content-evenly mx-auto gap-3 ${
                        darkMode ? "bg-white text-dark" : "bg-dark text-light"
                      }`}
                    >
                      <span className="p-2 px-3 rounded-2  ">
                        {leaveData.totalSickLeave - leaveData.sickLeave}
                      </span>{" "}
                      Out of{" "}
                      <span className="p-2 px-3 rounded-2 ">
                        {leaveData.totalSickLeave}
                      </span>
                    </div>
                  </td>
                  <td className={`text-center`} style={rowBodyStyle(darkMode)}>
                    {leaveData.Gender === "male" ? (
                      <span>Not Applicable</span>
                    ) : (
                      <>
                        <div
                          style={{
                            boxShadow: darkMode
                              ? "0 0 4px 2px rgba(209, 206, 206, 0.31) inset"
                              : "0 0 4px 2px rgba(56, 55, 55, 0.31) inset",
                          }}
                          className={`rounded-2 d-flex align-items-center justify-content-evenly mx-auto gap-3 ${
                            darkMode
                              ? "bg-white text-dark"
                              : "bg-dark text-light"
                          }`}
                        >
                          <span className="p-2 px-3 rounded-2 ">
                            {leaveData.totalMaternityLeave -
                              leaveData.maternityLeave}
                          </span>{" "}
                          Out of{" "}
                          <span className="p-2 px-3 rounded-2 ">
                            {leaveData.totalMaternityLeave}
                          </span>
                        </div>
                      </>
                    )}
                  </td>
                  <td className={`text-center`} style={rowBodyStyle(darkMode)}>
                    {leaveData.Gender === "female" ? (
                      <span>Not Applicable</span>
                    ) : (
                      <div
                        style={{
                          boxShadow: darkMode
                            ? "0 0 4px 2px rgba(209, 206, 206, 0.31) inset"
                            : "0 0 4px 2px rgba(56, 55, 55, 0.31) inset",
                        }}
                        className={`rounded-2 d-flex align-items-center justify-content-evenly mx-auto gap-3 ${
                          darkMode ? "bg-white text-dark" : "bg-dark text-light"
                        }`}
                      >
                        <span className="p-2 px-3 rounded-2 ">
                          {leaveData.totalPaternityLeave -
                            leaveData.paternityLeave}
                        </span>{" "}
                        Out of{" "}
                        <span className="p-2 px-3 rounded-2 ">
                          {leaveData.totalPaternityLeave}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className={`text-center`} style={rowBodyStyle(darkMode)}>
                    <div className="d-flex align-items-center  justify-content-evenly mx-auto gap-3">
                      <span className="p-2 px-3 rounded-2 ">
                        {leaveData.totalCasualLeave - leaveData.casualLeave}
                      </span>{" "}
                      Out of{" "}
                      <span className="p-2 px-3 rounded-2 ">
                        {leaveData.totalCasualLeave}
                      </span>
                    </div>
                  </td>
                  <td className={`text-center`} style={rowBodyStyle(darkMode)}>
                    <div
                      style={{
                        boxShadow: darkMode
                          ? "0 0 4px 2px rgba(209, 206, 206, 0.31) inset"
                          : "0 0 4px 2px rgba(56, 55, 55, 0.31) inset",
                      }}
                      className={`rounded-2 d-flex align-items-center justify-content-evenly mx-auto gap-3 ${
                        darkMode ? "bg-white text-dark" : "bg-dark text-light"
                      }`}
                    >
                      <span className="p-2 px-3 rounded-2 ">
                        {leaveData.totalPaidLeave - leaveData.paidLeave}
                      </span>{" "}
                      Out of{" "}
                      <span className="p-2 px-3 rounded-2 ">
                        {leaveData.totalPaidLeave}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalanceRegister;
