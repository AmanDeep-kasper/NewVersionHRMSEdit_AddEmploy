import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../config/api";

const EmployeeLogCount = (props) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "donut",
    },
    labels: ["Logged In", "Logged Out", "Inactive"],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        donut: {
          size: "50%",
        },
      },
    },
    title: {
      text: "Loggedin Status Chart",
      style: {
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
        fontWeight: "normal",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "radial",
        shadeIntensity: 0.5,
        gradientToColors: [
          "var(--basecolor)",
          "var(--basecolor1)",
          "var(--basecolor2)",
        ],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      show: false,
    },
    colors: ["var(--basecolor)", "var(--basecolor1)", "var(--basecolor2)"],
    dataLabels: {
      enabled: true,
      style: {
        colors: ["white"],
        fontWeight: "normal",
      },
    },
    legend: {
      position: "top",
      labels: {
        colors: darkMode
          ? [
              "var(--primaryDashColorDark)",
              "var(--primaryDashColorDark)",
              "var(--primaryDashColorDark)",
            ]
          : [
              "var(--primaryDashMenuColor)",
              "var(--primaryDashMenuColor)",
              "var(--primaryDashMenuColor)",
            ],
      },
      markers: {
        fillColors: ["var(--basecolor)"],
      },
    },
  });

  const [chartSeries, setChartSeries] = useState([]);

  const loadEmployeeData = () => {
    api
      .get(`/api/employee`, {
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEmployeeData(response.data);
          setLoading(false);

          setRowData([]);

          response.data.forEach((data) => {
            let temp = {
              data,
              Email: data["Email"],
              Password: data["Password"],
              Account:
                data["Account"] === 1
                  ? "Admin"
                  : data["Account"] === 2
                  ? "HR"
                  : data["Account"] === 3
                  ? "Employee"
                  : data["Account"] === 4
                  ? "Manager"
                  : "",
              RoleName: data["role"][0] ? data["role"][0]["RoleName"] : "",
              FirstName: data["FirstName"],
              MiddleName: data["MiddleName"],
              LastName: data["LastName"],
              DOB: data["DOB"].slice(0, 10),
              ContactNo: data["ContactNo"],
              empID: data["empID"],
              DepartmentName: data["department"][0]
                ? data["department"][0]["DepartmentName"]
                : "",
              PositionName: data["position"][0]
                ? data["position"][0]["PositionName"]
                : "",
              DateOfJoining: data["DateOfJoining"].slice(0, 10),
              loginStatus: data["loginStatus"],
            };

            setRowData((prevData) => [...prevData, temp]);
          });
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

  useEffect(() => {
    const loggedInCount = rowData.filter(
      (data) => data.loginStatus === "loggedIn"
    ).length;
    const loggedOutCount = rowData.filter(
      (data) => data.loginStatus === "loggedOut"
    ).length;
    const inactiveCount = rowData.filter(
      (data) =>
        data.loginStatus !== "loggedOut" && data.loginStatus !== "loggedIn"
    ).length;

    setChartSeries([loggedInCount, loggedOutCount, inactiveCount]);
  }, [rowData]);

  useEffect(() => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      title: {
        ...prevOptions.title,
        style: {
          ...prevOptions.title.style,
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
        },
      },
      legend: {
        ...prevOptions.legend,
        labels: {
          ...prevOptions.legend.labels,
          colors: darkMode
            ? [
                "var(--primaryDashColorDark)",
                "var(--primaryDashColorDark)",
                "var(--primaryDashColorDark)",
              ]
            : [
                "var(--primaryDashMenuColor)",
                "var(--primaryDashMenuColor)",
                "var(--primaryDashMenuColor)",
              ],
        },
        markers: {
          ...prevOptions.legend.markers,
          fillColors: [
            "var(--basecolor)",
            "var(--basecolor2)",
            "var(--basecolor3)",
          ],
        },
      },
    }));
  }, [darkMode]);

  return (
    <div
      style={{
        height: "220px",
        background: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="ChartCard rounded-0 shadow p-2 "
    >
      <Chart
        width="100%"
        height="335px"
        options={chartOptions}
        series={chartSeries}
        type="donut"
      />
    </div>
  );
};

export default EmployeeLogCount;
