import React from "react";
import MyTodaysLoginData from "./MyTodaysLoginData";
import BASE_URL from "../../config/config";
import api from "../../config/api";
const AttendanceToday = () => {
  const [attendanceData, setAttendanceData] = useState(null);

 useEffect(() => {
  const fetchAttendanceData = async () => {
    try {

      // Fetch today's attendance data for the employee with token
      const response = await api.get(
        `/api/employee/${employeeId}/today-attendance`,
      );

      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  fetchAttendanceData();
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
