import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { IoChevronBackOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const GoBack = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  const { userData } = useSelector((state) => state.user);
  const userType = userData?.Account;

  // Define the routes where the back button should not be displayed
  const shouldHideButton =
    (userType == 1 && location.pathname === "/admin/dashboard") ||
    (userType == 2 && location.pathname === "/hr/dashboard") ||
    (userType == 3 && location.pathname === "/manager/dashboard") ||
    (userType == 4 && location.pathname === "/employee/dashboard");

  return (
    <div>
      {!shouldHideButton && (
        <span
          style={{ cursor: "pointer", color: darkMode ? "black" : "white" }}
          className="py-1 px-2 d-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <IoChevronBackOutline className="fs-4" />{" "}
          <span className="d-none d-md-block">Back</span>
        </span>
      )}
    </div>
  );
};

export default GoBack;
