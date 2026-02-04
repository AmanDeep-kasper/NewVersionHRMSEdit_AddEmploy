// EmployeeChart.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import BASE_URL from "../../../../Pages/config/config";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import api from "../../../../Pages/config/api";
const TaskChart = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const { userData} = useSelector((state)=> state.user);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = userData?.Email;;
  const { darkMode } = useTheme();

  const loadEmployeeData = () => {
    api
      .get(`/api/employee`, {
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setDepartmentData(
            response.data.map(
              (data) => data["department"][0]?.DepartmentName || ""
            )
          );
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {
          
      });
  };

 const loadTaskData = async () => {
  try {
    const response = await api.get(`/api/tasks`, {
      
    });

    // Set tasks and clear previous errors
    setTasks(response.data);
    setError(null);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    setError("Error fetching tasks. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadEmployeeData();
    loadTaskData();
  }, []);

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
    Total: tasks.filter((task) => task.managerEmail === email).length,

    newTasks: tasks.filter(
      (task) => task.status === "Assigned" && task.managerEmail === email
    ).length,

    Completed: tasks.filter(
      (task) => task.status === "Completed" && task.managerEmail === email
    ).length,
    Rejected: tasks.filter(
      (task) => task.status === "Rejected" && task.managerEmail === email
    ).length,
    canceled: tasks.filter(
      (task) => task.status === "Cancelled" && task.managerEmail === email
    ).length,
    Active: tasks.filter(
      (task) => task.status === "Pending" && task.managerEmail === email
    ).length,
    Overdue: tasks.filter(
      (task) =>
        task.status === "Pending" &&
        task.managerEmail === email &&
        calculateRemainingTime(task.endDate).delay
    ).length,
    Ontime: tasks.filter(
      (task) =>
        task.status === "Pending" &&
        task.managerEmail === email &&
        !calculateRemainingTime(task.endDate).delay
    ).length,
  };

  const taskStatusChartData = {
    options: {
      chart: {
        id: "task-status-chart",
        type: "bar",
      },
      xaxis: {
        categories: Object.keys(taskStatusCounts),
        title: {
          text: "Number of Tasks",
          style: {
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "normal",
          },
        },
        labels: {
          style: {
            colors: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          },
        },
      },
      yaxis: {
        title: {
          text: "Task Status",
          style: {
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "normal",
          },
        },
        labels: {
          style: {
            colors: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          },
        },
      },
      title: {
        text: "Task Status Chart",
        style: {
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
          fontWeight: "normal",
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "50%",
          borderRadius: 5,
          colors: {
            ranges: [
              {
                from: 0,
                to: 100,
                color: "var(--basecolor)",
              },
            ],
            backgroundBarColors: ["var(--basecolorTransparent)"],
          },
        },
      },
      colors: darkMode
        ? ["var(--primaryDashColorDark)"]
        : ["var(--secondaryDashMenuColor)"],
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
      className="ChartCard p-2 shadow rounded-0"
    >
      <Chart
        options={taskStatusChartData.options}
        series={taskStatusChartData.series}
        type="bar"
        height="305px"
      />
    </div>
  );
};

export default TaskChart;
