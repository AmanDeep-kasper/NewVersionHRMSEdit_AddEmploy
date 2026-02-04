import React, { useEffect, useState } from "react";
import MyTodaysLoginData from "./MyTodaysLoginData";
import api from "../../../../Pages/config/api"; // ✅ use api instance (auto handles cookies)

const AttendanceToday = ({ employeeId }) => {
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // ✅ use api.get — no need for BASE_URL or headers
        const response = await api.get(`/api/employee/${employeeId}/today-attendance`);

        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    if (employeeId) {
      fetchAttendanceData();
    }
  }, [employeeId]);

  return (
    <div>
      {attendanceData ? (
        <MyTodaysLoginData
          loginTime={attendanceData.loginTime}
          breakTime={attendanceData.breakTime}
          totalLoginTime={attendanceData.totalLoginTime}
          logoutTime={attendanceData.logoutTime}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AttendanceToday;
