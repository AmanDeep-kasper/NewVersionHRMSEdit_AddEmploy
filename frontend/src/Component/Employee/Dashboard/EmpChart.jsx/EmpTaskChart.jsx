// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import Chart from "react-apexcharts";
// import BASE_URL from "../../../../Pages/config/config";
// import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
// import { AttendanceContext } from "../../../../Context/AttendanceContext/AttendanceContext";
// import "./chart.css";
// import { useSelector } from "react-redux";

// const EmpTaskChart = () => {
//   const { userData} = useSelector((state)=> state.user);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const email = userData?.Email;
//   const { darkMode } = useTheme();
//   const { socket } = useContext(AttendanceContext);

//   const loadTaskData = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/tasks`);
//       // Filter tasks related to the current user
//       const userTasks = response.data.filter(task => task.managerEmail === email);
//       setTasks(userTasks);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching tasks:", error.message);
//       setError("Error fetching tasks. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTaskData();
//   }, []);

//   useEffect(() => {
//     socket.on("taskNotificationReceived", loadTaskData);
//     return () => {
//       socket.off("taskNotificationReceived", loadTaskData);
//     };
//   }, [socket]);

//   const calculateRemainingTime = (endDate) => {
//     const now = new Date();
//     const endDateTime = new Date(endDate);
//     let remainingTime = endDateTime - now;

//     if (remainingTime < 0) {
//       remainingTime = Math.abs(remainingTime);
//       return { delay: true, days: 0, hours: 0, minutes: 0 };
//     } else {
//       const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
//       return { delay: false, days, hours, minutes };
//     }
//   };

//   const taskStatusCounts = {
//     Total: tasks.length,
//     New: tasks.filter(task => task.status === "Assigned").length,
//     Completed: tasks.filter(task => task.status === "Completed").length,
//     Rejected: tasks.filter(task => task.status === "Rejected").length,
//     Canceled: tasks.filter(task => task.status === "Cancelled").length,
//     Active: tasks.filter(task => task.status === "Pending").length,
//     Overdue: tasks.filter(task =>
//       task.status === "Pending" && calculateRemainingTime(task.endDate).delay
//     ).length,
//     Ontime: tasks.filter(task =>
//       task.status === "Pending" && !calculateRemainingTime(task.endDate).delay
//     ).length,
//   };

//   const taskStatusChartData = {
//     options: {
//       chart: {
//         id: "task-status-chart",
//         type: "bar",
//       },
//       xaxis: {
//         categories: Object.keys(taskStatusCounts),
//         title: {
//           text: "Number of Tasks",
//           style: {
//             color: darkMode
//               ? "var(--primaryDashColorDark)"
//               : "var(--secondaryDashMenuColor)",
//             fontWeight: "normal",
//           },
//         },
//         labels: {
//           style: {
//             colors: darkMode
//               ? "var(--primaryDashColorDark)"
//               : "var(--secondaryDashMenuColor)",
//           },
//         },
//       },
//       yaxis: {
//         title: {
//           text: "Task Status",
//           style: {
//             color: darkMode
//               ? "var(--primaryDashColorDark)"
//               : "var(--secondaryDashMenuColor)",
//             fontWeight: "normal",
//           },
//         },
//         labels: {
//           style: {
//             colors: darkMode
//               ? "var(--primaryDashColorDark)"
//               : "var(--secondaryDashMenuColor)",
//           },
//         },
//       },
//       title: {
//         text: "Task Status Chart",
//         style: {
//           color: darkMode
//             ? "var(--primaryDashColorDark)"
//             : "var(--secondaryDashMenuColor)",
//           fontWeight: "normal",
//         },
//       },
      
//       plotOptions: {
//         bar: {
//           horizontal: true,
//           columnWidth: "50%",
//           borderRadius: 5,
//           colors: {
//             ranges: [
//               {
//                 from: 0,
//                 to: 100,
//                 color: "var(--basecolor)",
//               },
//             ],
//             backgroundBarColors: ["var(--basecolorTransparent)"],
//           },
//         },
//       },
      
//       colors: darkMode
//         ? ["var(--primaryDashColorDark)"]
//         : ["var(--secondaryDashMenuColor)"],
//     },
//     series: [
//       {
//         name: "Task Status",
//         data: Object.values(taskStatusCounts),
//       },
//     ],
//   };

//   return (
//     <div
//       style={{
//         background: darkMode
//           ? "var(--primaryDashMenuColor)"
//           : "var(--primaryDashColorDark)",
//         color: darkMode
//           ? "var(--primaryDashColorDark)"
//           : "var(--primaryDashMenuColor)",
//           height:'fit-content'
//       }}
//       className=" rounded-0 shadow py-0 px-3 pt-3"
//     >
//       <div className="chartBody">
//         <Chart
//           options={taskStatusChartData.options}
//           series={taskStatusChartData.series}
//           type="bar"
//           height="308px"
//         />
//       </div>
//     </div>
//   );
// };

// export default EmpTaskChart;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import BASE_URL from "../../../../Pages/config/config";
import api from "../../../../Pages/config/api";

const TaskBarChart = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/tasks`, {
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
        setError("Error fetching tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Categorize tasks
  const totalTasks = tasks.length;
  const acceptedTasks = tasks.filter(task => task.status === "Accepted").length;
  const activeTasks = tasks.filter(task => task.status === "active").length;
  const rejectedTasks = tasks.filter(task => task.status === "Rejected").length;
  const completedTasks = tasks.filter(task => task.status === "Completed").length;
  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date()).length;
  const dueTasks = tasks.filter(
    task => task.status !== "Completed" && new Date(task.dueDate) >= new Date()
  ).length;

  // Data for the chart
  const chartData = {
    series: [
      {
        name: "Tasks",
        data: [
          totalTasks,
          acceptedTasks,
          activeTasks,
          rejectedTasks,
          completedTasks,
          overdueTasks,
          dueTasks,
        ],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          distributed: true,
        },
      },
      colors: [
        "#4caf50", // Green for accepted
        "#2196f3", // Blue for active
        "#f44336", // Red for rejected
        "#9c27b0", // Purple for completed
        "#ff9800", // Orange for overdue
        "#ffc107", // Yellow for due
      ],
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: [
          "Accepted",
          "Active",
          "Rejected",
          "Completed",
          "Overdue",
          "Due",
        ],
        labels: {
          rotate: -45,
        },
      },
      title: {
        text: "Task Distribution",
        align: "center",
        style: {
          fontSize: "16px",
        },
      },
    },
  };

  return (
    <div style={{ width: "600px", margin: "auto" }}>
      <h3>Task Distribution by Status</h3>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height="350"
      />
    </div>
  );
};

export default TaskBarChart;
