import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import { AttendanceContext } from "../../../../Context/AttendanceContext/AttendanceContext";
import BASE_URL from "../../../../Pages/config/config";
const TaskChart = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const { userData} = useSelector((state)=> state.user);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
//   const [error, setError] = useState(null);
  const [taskReceived, setTaskReceived] = useState(false);
  const email = userData?.Email;;
  const { socket } = useContext(AttendanceContext);

  const { tasks, loading, error } = useSelector((state) => state.tasks);


//   const loadEmployeeData = () => {
//     axios
//       .get(`${BASE_URL}/api/employee`, {
//         headers: {
//           authorization: localStorage.getItem("token") || "",
//         },
//       })
//       .then((response) => {
//         if (Array.isArray(response.data)) {
//           setDepartmentData(
//             response.data.map(
//               (data) => data["department"][0]?.DepartmentName || ""
//             )
//           );
//         } else {
//           console.error("Data received is not an array:", response.data);
//           setError("Error fetching employee data. Please try again later.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching employee data:", error);
//         setError("Error fetching employee data. Please try again later.");
//       });
//   };

//   const loadTaskData = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/tasks`);
//       //   
//       setTasks(response.data);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching tasks:", error.message);
//       setError("Error fetching tasks. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadEmployeeData();
//     loadTaskData();
//   }, []);

//   useEffect(() => {
//     socket.on("taskNotificationReceived", (data) => {
//       loadTaskData();
//     });
//   }, [socket]);

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const endDateTime = new Date(endDate);
    let remainingTime = endDateTime - now;

    if (remainingTime < 0) {
      // If remaining time is negative, consider it as delay
      remainingTime = Math.abs(remainingTime);
      return { delay: true, days: 0, hours: 0, minutes: 0 };
    } else {
      // Calculate remaining days, hours, minutes, and seconds
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      return { delay: false, days, hours, minutes };
    }
  };

  const departmentCounts = {};
  departmentData.forEach((department) => {
    departmentCounts[department] = (departmentCounts[department] || 0) + 1;
  });

  const taskStatusCounts = {
    // Total: tasks.filter((task) => task.managerEmail === email).length,
    Total:  tasks?.filter((task) =>task?.managerEmail?.Email === email ).length,

    // newTasks: tasks.filter(
    //   (task) => task.status === "Assigned" && task.managerEmail === email
    // ).length,

    newTasks:  tasks?.filter(
        (task) =>
          task.status === "Assigned" &&
          task?.managerEmail?.Email === email
      ).length,
      Completed:  tasks?.filter(
        (task) =>
          task.status === "Completed" &&
          task?.managerEmail?.Email === email
      ).length,
      Rejected:  tasks?.filter(
        (task) =>
          task.status === "Rejected" &&
          task?.managerEmail?.Email === email
      ).length,
      canceled:  tasks?.filter(
        (task) =>
          task.status === "Cancelled" &&
          task?.managerEmail?.Email === email
      ).length,

      Active:  tasks?.filter(
        (task) =>
          task.status === "Pending" &&
          task?.managerEmail?.Email === email
      ).length,

    // Completed: tasks.filter(
    //   (task) => task.status === "Completed" && task.managerEmail === email
    // ).length,
    // Rejected: tasks.filter(
    //   (task) => task.status === "Rejected" && task.managerEmail === email
    // ).length,
    // canceled: tasks.filter(
    //   (task) => task.status === "Cancelled" && task.managerEmail === email
    // ).length,
    // Active: tasks.filter(
    //   (task) => task.status === "Pending" && task.managerEmail === email
    // ).length,

    // Overdue: tasks.filter(
    //   (task) =>
    //     task.status === "Pending" &&
    //     task.managerEmail === email &&
    //     calculateRemainingTime(task.endDate).delay
    // ).length,

    Overdue:  tasks?.filter(
        (task) =>
          task.status === "Pending" &&
          task?.managerEmail?.Email === email && calculateRemainingTime(task.endDate).delay
      ).length,

    Ontime:  tasks?.filter(
        (task) =>
          task.status === "Pending" &&
          task?.managerEmail?.Email === email && !calculateRemainingTime(task.endDate).delay
      ).length,

    // Ontime: tasks.filter(
    //   (task) =>
    //     task.status === "Pending" &&
    //     task.managerEmail === email &&
    //     !calculateRemainingTime(task.endDate).delay
    // ).length,
  };

    

  const taskStatusChartData = {
    options: {
      chart: {
        id: "task-status-chart",
        type: "bar",
      },
      fill: {
        opacity: 1,
        colors: ["var(--primaryDashColorDark)"],
      },
      xaxis: {
        categories: Object.keys(taskStatusCounts),
        title: {
          text: "Task Status",
        },
      },
      yaxis: {
        title: {
          text: "Number of Tasks",
        },
      },
    },
    series: [
      {
        name: "Task Status",
        data: Object.values(taskStatusCounts),
      },
    ],
  };

  return (
    <div
      style={{
        height: "fit-content",
        background: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="ChartCard p-2 shadow"
    >
      <div className="ChartHeader">
        <h6
          style={{
            width: "fit-content",
            boxShadow: "0 0 10px 1px rgba(0,0,0,.2) inset",
          }}
          className="fw-bolder d-flex px-3 rounded-5 py-1"
        >
          Task Progress Report
        </h6>
      </div>
      <div className="chartBody">
        <Chart
          options={taskStatusChartData.options}
          series={taskStatusChartData.series}
          type="bar"
          height="340px"
          width="100%"
        />
      </div>
    </div>
  );
};

export default TaskChart;
