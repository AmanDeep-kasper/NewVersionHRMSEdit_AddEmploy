import React, { useEffect } from "react";
import { IoWarningOutline } from "react-icons/io5";
import "./BreakIndicator.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const BreakIndicator = ({ isonBreak }) => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    let titleInterval;
    const defaultTitle = document.title;

    if (isonBreak) {
      titleInterval = setInterval(() => {
        document.title = document.title === "On Break" ? " " : "On Break";
      }, 700);
    } else {
      document.title = defaultTitle;
    }

    return () => {
      clearInterval(titleInterval);
      document.title = defaultTitle;
    };
  }, [isonBreak]);

  const getBreakRoute = () => {
    if (userData?.Account === 1) {
      return "/admin/myAttendance";
    }
    if (userData?.Account === 2) {
      return "/hr/my-attendance";
    }
    if (userData?.Account === 3) {
      return "/employee/MyAttendance";
    }
    if (userData?.Account === 4) {
      return "/manager/myAttendance";
    }
    return "/"; // Default route in case the account type doesn't match
  };

  return (
    <Link to={getBreakRoute()}>
      {isonBreak && (
        <div title="On Break">
          <IoWarningOutline className="text-warning fs-4 blink" />
        </div>
      )}
    </Link>
  );
};

export default BreakIndicator;
