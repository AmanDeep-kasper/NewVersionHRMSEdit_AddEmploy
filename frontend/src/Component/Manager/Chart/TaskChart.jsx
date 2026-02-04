import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import BASE_URL from "../../../Pages/config/config";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import api from "../../../Pages/config/api";
const TaskChart = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useContext(AttendanceContext);
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
  useEffect(() => {
    socket.on("taskNotificationReceived", (data) => {
      loadTaskData();
    });
    return () => {
      socket.off("taskNotificationReceived", (data) => {
        loadTaskData();
      });
    };
  }, [socket]);
  const departmentCounts = {};
  departmentData.forEach((department) => {
    departmentCounts[department] = (departmentCounts[department] || 0) + 1;
  });

  const taskStatusCounts = {
    Total: tasks.length,
    Completed: tasks.filter((task) => task.status === "Completed").length,
    Rejected: tasks.filter((task) => task.status === "Rejected").length,
    Canceled: tasks.filter((task) => task.status === "Canceled").length,
    Active: tasks.filter((task) => task.status === "Active").length,
    Pending: tasks.filter((task) => task.status === "Pending").length,
    Overdue: tasks.filter((task) => task.status === "Overdue").length,
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
          horizontal: false,
          columnWidth: "40%",
          endingShape: "rounded",
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
        colors: ["var(--basecolor)"],
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
  };
  const taskStatusChartData = {
    options: {
      chart: {
        id: "task-status-chart",
        type: "bar",
      },
      fill: {
        colors: ["var(--basecolor)"],
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
    <div style={{ height: "fit-content" }} className="ChartCard p-2 pb-0 ">
      <div className="ChartHeader">
        <h6
          style={{
            width: "fit-content",
            color: "var(--primaryDashColorDark)",
          }}
          className="d-flex px-3 rounded-5 py-1"
        >
          Task Progress Report
        </h6>
      </div>
      <Chart
        options={taskStatusChartData.options}
        series={taskStatusChartData.series}
        type="bar"
        height="310px"
      />
    </div>
  );
};

export default TaskChart;
