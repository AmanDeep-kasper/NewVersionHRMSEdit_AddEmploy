import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiPartyFlags } from "react-icons/gi";
import { fetchHolidays } from "../../Redux/Slices/holidaysSlice";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import holidayImage from "../../img/holidayImage.svg";

const HolidayDashSecond = () => {
  const dispatch = useDispatch();
  const holidaysData = useSelector((state) => state.holidays.holidaysData);
  const status = useSelector((state) => state.holidays.status);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchHolidays());
    }
  }, [status, dispatch]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = new Date().getMonth(); // getMonth() returns 0-11
  const currentYear = new Date().getFullYear();

  const monthName = monthNames[currentMonth];

  return (
    <div
      style={{
        height: "17rem",
        overflow: "hidden",
        color: darkMode ? "black" : "White",
        background: darkMode ? "#F5F5F6" : "#161515f6",
      }}
      className="px-3 shadow-sm rounded-2 d-flex flex-column gap-2 justify-content-between pb-3 pt-2"
    >
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="my-0 fw-normal  d-flex align-items-center gap-2">
          <GiPartyFlags />
          Holidays
        </h5>
        <span
          className="d-flex align-items-center justify-content-center"
          style={{
            height: "25px",
            width: "25px",
            borderRadius: "50%",
            background: darkMode ? "#ededf1d4" : "#252424c3",
          }}
        >
          {
            holidaysData.filter(
              (holiday) =>
                holiday.holidayYear === currentYear &&
                holiday.holidayMonth === currentMonth + 1
            ).length
          }
        </span>
      </div>
      <span className="text-end">
        {monthName}, {currentYear}
      </span>
      <div
        style={{
          height: "12rem",
          overflow: "auto",
          background: darkMode ? "#ededf1d4" : "#252424c3",
        }}
        className="rounded-3 p-2 py-0"
      >
        {" "}
        {holidaysData.filter(
          (holiday) =>
            (holiday.holidayYear === currentYear) &
            (holiday.holidayMonth === currentMonth + 1)
        ).length >= 0 ? (
          <div>
            {holidaysData
              .filter(
                (holiday) =>
                  (holiday.holidayYear === currentYear) &
                  (holiday.holidayMonth === currentMonth + 1)
              )
              .map((holiday, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center my-2 justify-content-between"
                >
                  <span className="text-start d-flex align-items-center gap-3 ">
                    <span
                      style={{
                        height: "30px",
                        width: "30px",
                        background: darkMode ? "#ededf1f4" : "#1b1a1af0",
                      }}
                      className="d-flex align-items-center justify-content-center rounded-3"
                    >
                      {holiday.holidayDate}
                    </span>{" "}
                    {holiday.holidayName}
                  </span>
                  <span
                    style={{
                      background: darkMode ? "#2f99ea4a" : "#2c2cf341",
                      color: darkMode ? "#572be8f0" : "#ffffff",
                      fontSize: ".8rem",
                      width: "fit-content",
                    }}
                    className="px-2 py-1 rounded-3"
                  >
                    {holiday.holidayType}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div
            className="d-flex flex-column justify-content-center align-items-center gap-1"
            style={{ height: "100%", width: "100%" }}
          >
            <img
              style={{ height: "100px", width: "100px" }}
              className="mx-auto"
              src={holidayImage}
              alt="Happy Birthday"
            />
            <p
              style={{ opacity: "60%", fontSize: "13px" }}
              className="text-center w-75 mx-auto"
            >
              Holiday Not available this month
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayDashSecond;
