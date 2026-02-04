import React, { useEffect } from "react";
import { SiMicrosoftteams } from "react-icons/si";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../redux/slices/employeeSlice";
import AvatarGroup from "../AvatarGroup/AvatarGroup";

const EmployeeCounts = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee.employees);
  const status = useSelector((state) => state.employee.status);
  const error = useSelector((state) => state.employee.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEmployees());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  // Group employees by department and get their profile picture URLs
  const departmentProfilePics = employees.reduce((acc, employee) => {
    const departmentName = employee.department[0]?.DepartmentName || "Unknown";
    const profilePic = employee.profile?.image_url;

    if (profilePic) {
      acc[departmentName] = acc[departmentName] || [];
      acc[departmentName].push(profilePic);
    }

    return acc;
  }, {});

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
        <h5 className="my-0 fw-normal d-flex align-items-center gap-2">
          <SiMicrosoftteams />
          Team
        </h5>
        <span
          style={{
            minHeight: "1.6rem",
            minWidth: "1.6rem",
            borderRadius: "50%",
            background: darkMode ? "#ededf1f4" : "#1b1a1af0",
          }}
          className="d-flex align-items-center justify-content-center"
        >
          {employees.length}
        </span>
      </div>
      <div
        className="p-1 px-3 rounded-3"
        style={{
          height: "14rem",
          overflow: "auto",
          background: darkMode ? "#ededf1f4" : "#1b1a1af0",
        }}
      >
        {Object.entries(departmentProfilePics).map(([department, images]) => (
          <div
            key={department}
            className="d-flex align-items-center my-2 justify-content-between"
          >
            <div className="d-flex flex-column gap-0">
              <span>{department}</span>
              <AvatarGroup images={images} />
            </div>
            {department.length}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeCounts;
