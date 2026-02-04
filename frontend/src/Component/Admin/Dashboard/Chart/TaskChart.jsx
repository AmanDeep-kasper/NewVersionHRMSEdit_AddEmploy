// EmployeeChart.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import "./chart.css";
import BASE_URL from "../../../../Pages/config/config";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import api from "../../../../Pages/config/api";

const TaskChart = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    setTasks(response.data);
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

  const countLateAndOnTimeTasks = () => {
    const lateTasksCount = tasks.filter(
      (task) =>
        task.status === "Pending" && calculateRemainingTime(task.endDate).delay
    ).length;

    const onTimeTasksCount = tasks.filter(
      (task) =>
        task.status === "Pending" && !calculateRemainingTime(task.endDate).delay
    ).length;

    return { lateTasksCount, onTimeTasksCount };
  };

  const departmentCounts = {};
  departmentData.forEach((department) => {
    departmentCounts[department] = (departmentCounts[department] || 0) + 1;
  });

  const taskStatusCounts = {
    Total: tasks.length,
    Assigned: tasks.filter((task) => task.status === "Assigned").length,
    ActiveTask: tasks.filter((task) => task.status === "Assigned").length,
    Canceled: tasks.filter((task) => task.status === "Cancelled").length,
    Completed: tasks.filter((task) => task.status === "Completed").length,
    Overdue: tasks.filter(
      (task) =>
        task.status === "Assigned" && calculateRemainingTime(task.endDate).delay
    ).length,
    OnTime: tasks.filter(
      (task) =>
        task.status === "Assigned" &&
        !calculateRemainingTime(task.endDate).delay
    ).length,
  };

  const chartData = {
    series: [
      {
        name: "Total Employee",
        data: Object.values(departmentCounts),
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
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
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: Object.keys(departmentCounts),
        title: {
          text: "Department Wise Employee",
        },
      },
      yaxis: {
        title: {
          text: "Number of Employee",
        },
      },
      fill: {
        opacity: 1,
        colors: ["rgb(100, 150, 200)"],
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return " " + val + "";
          },
        },
        markers: {
          colors: "yellow",
        },
      },
    },
    legend: {
      show: true,
      labels: {
        colors: darkMode ? "black" : "white",
      },
    },
  };

  const taskStatusChartData = {
    options: {
      chart: {
        id: "task-status-chart",
        type: "bar",
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
      title: {
        text: "Task Status Chart",
        style: {
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
          fontWeight: "normal",
        },
      },
      fill: {
        colors: darkMode ? ["#4078f194"] : ["#0af0dd"],
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
      },
    },

    series: [
      {
        name: "Task Status",
        data: Object.values(taskStatusCounts),
      },
    ],
    legend: {
      show: true,
      labels: {
        colors: darkMode ? "black" : "white",
      },
    },
  };

  return (
    <div
      style={{
        background: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="ChartCard shadow px-3 pt-3"
    >
      <div className="chartBody">
        <Chart
          options={taskStatusChartData.options}
          series={taskStatusChartData.series}
          type="bar"
          height="320px"
        />
      </div>
    </div>
  );
};

export default TaskChart;
