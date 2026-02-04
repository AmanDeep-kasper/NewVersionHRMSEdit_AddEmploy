import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../../Pages/config/config";
import api from "../../../../Pages/config/api";

function AttendanceDashboard() {
  const [dashboardData, setDashboardData] = useState({
    total: 0,
    login: 0,
    logout: 0,
    break: 0,
    resume: 0
  });

 useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/api/attendance`, {
      
      });

      const data = response.data;

      const total = data.length;
      const login = data.filter((entry) => entry.status === "login").length;
      const logout = data.filter((entry) => entry.status === "logout").length;
      const breakCount = data.filter((entry) => entry.status === "break").length;
      const resume = data.filter((entry) => entry.status === "resume").length;

      setDashboardData({
        total,
        login,
        logout,
        break: breakCount,
        resume,
      });
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  fetchData();
}, []);


  return (
    <div className="dashboard">
      <h2>Attendance Dashboard</h2>
      <p>Total Entries: {dashboardData.total}</p>
      <p>Login Count: {dashboardData.login}</p>
      <p>Logout Count: {dashboardData.logout}</p>
      <p>Break Count: {dashboardData.break}</p>
      <p>Resume Count: {dashboardData.resume}</p>
    </div>
  );
}

export default AttendanceDashboard;
