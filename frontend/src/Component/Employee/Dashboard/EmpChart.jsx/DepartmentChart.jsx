import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./chart.css";
import axios from "axios";
import BASE_URL from "../../../../Pages/config/config";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import api from "../../../../Pages/config/api";

const DepartmentChart = (props) => {
  const [departmentData, setDepartmentData] = useState([]);
  const { userData} = useSelector((state)=> state.user);

  const id = userData?._id;
  const { darkMode } = useTheme()
  const [chartOption, setChartOption] = useState({
    options: {
      labels: [],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true
              }
            }
          }
        }
      }
    },
    series: []
  });

  const loadEmployeeData = () => {
    api
      .get(`/api/employee/` + id, {
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setDepartmentData(
            response.data.map((data) =>
              data["department"][0]
                ? data["department"][0]["DepartmentName"]
                : ""
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

  // useEffect(() => {
  //   loadPersonalInfoData();
  // }, [props.data]);

  const updateChartOptions = () => {
    const departmentCounts = {};
    departmentData.forEach((department) => {
      departmentCounts[department] = (departmentCounts[department] || 0) + 1;
    });

    const labels = Object.keys(departmentCounts);
    const series = labels.map((label) => departmentCounts[label]);

    setChartOption({
      options: {
        labels: labels,
        legend: {
          position: 'bottom',
          labels: {
            colors: ["blue", "green", "orange", "red", "#775dd0"],
          },
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true
                }
              }

            }
          }
        }
      },
      series: series
    });
  };

  useEffect(() => {
    updateChartOptions();
  }, [departmentData]);

  return (
    <>
      <div style={{ height: '410px', background: darkMode ? "var(--primaryDashMenuColor)" : "var(--primaryDashColorDark)", color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)", }} className="ChartCard shadow p-2 py-4 pb-0">
        <h6
          style={{
            width: "fit-content",
            boxShadow: `0 0 10px 1px ${darkMode ? "rgba(0,0,0,.2)" : 'rgba(201, 196, 196, 0.2)'} inset`,
            color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)"
          }}
          className="fw-bolder d-flex px-3 rounded-5 py-2"
        >
          Employee By Department
        </h6>
        <Chart
          options={chartOption.options}
          series={chartOption.series}
          type="donut"
          height="340px"
        />
      </div>
    </>
  );
};

export default DepartmentChart;
