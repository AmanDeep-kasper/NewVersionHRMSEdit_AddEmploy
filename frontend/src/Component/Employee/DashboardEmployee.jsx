import React, { useState } from "react";
import NavBar from "../../Pages/Navbar/NavBar.jsx";
import { Outlet, HashRouter as Router } from "react-router-dom";
import "./DashboardEmployee.css";
import { useSidebar } from "../../Context/AttendanceContext/smallSidebarcontext.jsx";
import { useTheme } from "../../Context/TheamContext/ThemeContext.js";
import Footer from "../../Pages/Footer/Footer.jsx";
import MainSidebar from "../../Utils/Sidebar/MainSidebar.jsx";
import SmallScreenSidebar from "../../Utils/SmallScreenSidebar/SmallScreenSidebar.jsx";
import InnerDashContainer from "../InnerDashContainer.jsx";
import Calculator from "../../Utils/Tools/Calculator/Calculator.jsx";
import ToolMenu from "../../Utils/ToolMenu/ToolMenu.jsx";
import StickyNotes from "../../Utils/Tools/StickyNotes/StickyNotes.jsx";
import TodoList from "../../Utils/Tools/TodoList/TodoList.jsx";
// import BreakPushPoup from "../../Pages/Attendance/BreakPushPoup.jsx";

const DashboardEmployee = (props) => {
  const [checked, setChecked] = useState(true);

  const { isOpen } = useSidebar();
  const { darkMode } = useTheme();
  const handleChange = () => {
    if (checked) {
      document.getElementById("sidebar").setAttribute("class", "display-none");
    } else {
      document.getElementById("sidebar").setAttribute("class", "display-block");
    }

    setChecked(!checked);
  };

  return (
    <div
      style={{
        backgroundColor: darkMode
          ? "var(--secondaryDashMenuColor)"
          : "var(--secondaryDashColorDark)",
        maxHeight: "100vh",
        overflow: "hidden",
        position: "fixed",
        width: "100%",
        left: "0",
        top: "0",
      }}
    >
      {/* <ToolMenu /> */}
      <div className="dashboard-grid-employee">
        {/* <Calculator />
        <StickyNotes /> */}
        <div
          style={{
            transform: isOpen ? "translateX(0%)" : "translateX(-500%)",
            transition: "1s ease",
          }}
          className="sidebarsmall d-flex "
        >
          <SmallScreenSidebar />
        </div>
        <div className="employeenavbar-grid">
          <NavBar
            checked={checked}
            handleChange={handleChange}
            onLogout={props.onLogout}
          />
        </div>
        <div className="employeesidebar-grid">
          <MainSidebar />
        </div>
        <div className="mainbar-grid">
          <div style={{ maxHeight: "90vh", overflow: "auto" }} className="pb-4">
            <Outlet />
          </div>
          <div
            style={{ zIndex: "50", position: "absolute", bottom: "0" }}
            className="HrPannelFooter bg-dark w-100 text-white"
          >
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmployee;
