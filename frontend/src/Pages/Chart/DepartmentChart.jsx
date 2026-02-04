import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./chart.css";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../config/api";

const DepartmentChart = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const { darkMode } = useTheme();

  const [chartOption, setChartOption] = useState({
    options: {
      labels: [],
      colors: [
        "var(--basecolor)",
        "var(--basecolor1)",
        "var(--basecolor2)",
        "var(--basecolor3)",
        "var(--basecolor4)",
        "var(--basecolor5)",
      ],
      title: {
        text: "Departments Chart",
        style: {
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
          fontWeight: "normal",
        },
      },
      legend: {
        position: "bottom",
        labels: {
          colors: darkMode
            ? [
                "var(--primaryDashMenuColor)",
                "var(--primaryDashMenuColor)",
                "var(--primaryDashMenuColor)",
                "var(--primaryDashMenuColor)",
                "var(--primaryDashMenuColor)",
                "var(--primaryDashMenuColor)",
              ]
            : [
                "var(--primaryDashColorDark)",
                "var(--primaryDashColorDark)",
                "var(--primaryDashColorDark)",
                "var(--primaryDashColorDark)",
                "var(--primaryDashColorDark)",
                "var(--primaryDashColorDark)",
              ],
        },
        markers: {
          fillColors: [
            "var(--basecolor)",
            "var(--basecolor1)",
            "var(--basecolor2)",
            "var(--basecolor3)",
            "var(--basecolor4)",
            "var(--basecolor5)",
          ],
        },
      },
      fill: {
        colors: [
          "var(--basecolor)",
          "var(--basecolor1)",
          "var(--basecolor2)",
          "var(--basecolor3)",
          "var(--basecolor4)",
          "var(--basecolor5)",
        ],
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: false,
              total: {
                show: false,
                color: "white",
              },
            },
          },
        },
      },
    },
    series: [],
  });

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

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const updateChartOptions = () => {
    const departmentCounts = {};
    departmentData.forEach((department) => {
      departmentCounts[department] = (departmentCounts[department] || 0) + 1;
    });

    const labels = Object.keys(departmentCounts);
    const series = labels.map((label) => departmentCounts[label]);

    setChartOption({
      options: {
        ...chartOption.options,
        labels: labels,
      },
      series: series,
    });
  };

  useEffect(() => {
    updateChartOptions();
  }, [departmentData]);

  useEffect(() => {
    setChartOption((prevOptions) => ({
      ...prevOptions,
      options: {
        ...prevOptions.options,
        title: {
          text: "Departments Chart",
          style: {
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
            fontWeight: "normal",
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
                  "var(--primaryDashColorDark)",
                  "var(--primaryDashColorDark)",
                ]
              : [
                  "var(--primaryDashMenuColor)",
                  "var(--primaryDashMenuColor)",
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
  }, [darkMode]);

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
        options={chartOption.options}
        series={chartOption.series}
        type="pie"
        width="100%"
        height="352px"
      />
    </div>
  );
};

export default DepartmentChart;
