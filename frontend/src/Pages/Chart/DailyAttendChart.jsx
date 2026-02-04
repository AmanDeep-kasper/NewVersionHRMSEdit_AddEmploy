import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import api from "../config/api";

const DailyAttendChart = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const { darkMode } = useTheme();
  const [statusCounts, setStatusCounts] = useState({
    Present: 0,
    Late: 0,
    "Half Day": 0,
    Absent: 0,
  });

  const [chartOption, setChartOption] = useState({
    options: {
      labels: ["Late", "Present", "Half Day", "Absent"],
      colors: [
        "var(--basecolor)",
        "var(--basecolor1)",
        "var(--basecolor2)",
        "var(--basecolor3)",
      ],
      title: {
        text: "Today's Attendance Chart",
        style: {
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
          fontWeight: "normal",
        },
      },
      legend: {
        show: true,
        position: "bottom",
        labels: {
          colors: darkMode
            ? [
                "var(--primaryDashColorDark)",
                "var(--primaryDashColorDark)",
                "var(--primaryDashColorDark)",
                "var(--primaryDashColorDark)",
              ]
            : [
                "var(--primaryDashMenuColor)",
                "var(--primaryDashMenuColor)",
                "var(--primaryDashMenuColor)",
                "var(--primaryDashMenuColor)",
              ],
        },
        markers: {
          fillColors: ["#9ba9ff", "#a5adff", "#afb1ff", "#b9b5ff"],
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: "Total",
                color: "gray",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                },
                style: {
                  color: "white",
                },
              },
            },
          },
        },
      },
    },
    series: [
      statusCounts.Late,
      statusCounts.Present,
      statusCounts["Half Day"],
      statusCounts.Absent,
    ],
  });

useEffect(() => {
  const fetchAttendanceData = async () => {
    try {
      // const token = localStorage.getItem("token") || "";
      const response = await api.get(`/api/todays-attendance`, {
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching today's attendance data:", error);
    }
  };

  fetchAttendanceData();
}, []);


  useEffect(() => {
    const counts = attendanceData.reduce(
      (acc, user) => {
        const mark = getAttendanceMark(user);
        acc[mark]++;
        return acc;
      },
      { Late: 0, Present: 0, "Half Day": 0, Absent: 0 }
    );

    setStatusCounts(counts);
  }, [attendanceData]);

  useEffect(() => {
    setChartOption((prevOptions) => ({
      ...prevOptions,
      series: [
        statusCounts.Late,
        statusCounts.Present,
        statusCounts["Half Day"],
        statusCounts.Absent,
      ],
      options: {
        ...prevOptions.options,
        title: {
          ...prevOptions.options.title,
          style: {
            ...prevOptions.options.title.style,
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
          },
        },
        legend: {
          ...prevOptions.options.legend,
          labels: {
            colors: darkMode
              ? [
                  "var(--primaryDashColorDark)",
                  "var(--primaryDashColorDark)",
                  "var(--primaryDashColorDark)",
                  "var(--primaryDashColorDark)",
                ]
              : [
                  "var(--primaryDashMenuColor)",
                  "var(--primaryDashMenuColor)",
                  "var(--primaryDashMenuColor)",
                  "var(--primaryDashMenuColor)",
                ],
          },
          markers: {
            fillColors: [
              "var(--basecolor)",
              "var(--basecolor)",
              "var(--basecolor)",
              "var(--basecolor)",
              "var(--basecolor)",
              "var(--basecolor)",
            ],
          },
        },
      },
    }));
  }, [statusCounts, darkMode]);

  const getAttendanceMark = (user) => {
    const loginTime = user.attendance && user.attendance.loginTime[0];
    if (loginTime) {
      const [loginHour, loginMinute] = loginTime.split(":").map(Number);
      if (loginHour > 9 || (loginHour === 9 && loginMinute >= 45)) {
        return "Half Day";
      } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
        return "Late";
      }
    }
    return loginTime ? "Present" : "Absent";
  };

  return (
    <div>
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
        <Chart
          options={chartOption.options}
          series={chartOption.series}
          type="donut"
          width="100%"
          height="354px"
        />
      </div>
    </div>
  );
};

export default DailyAttendChart;
