import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import Moment from "moment";
import BASE_URL from "../../../Pages/config/config";
import toast from "react-hot-toast";
import { FaComputerMouse } from "react-icons/fa6";
import { PiCoffeeFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api";

function EmpAttendance(props) {
  const [empName, setEmpName] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const { userData} = useSelector((state)=> state.user);


  const {
    employees,
    setEmployees,
    selectedEmployee,
    setSelectedEmployee,
    attencenceID,
    setAttencenceID,
    message,
    setMessage,
  } = useContext(AttendanceContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(
          `/api/employee/` + userData?._id,
        );
          
        setEmployees(response.data);

        const attendanceResponse = await api.get(
          `/api/attendance/` + userData?._id,
        );
        const attendancePayload = attendanceResponse.data && (attendanceResponse.data.attendance || attendanceResponse.data);
        const lastDate = attendancePayload?.years?.[0]?.months?.[0]?.dates?.[0];
        if (lastDate && lastDate.status === "login") {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error("Error fetching employees or attendance data:", error);
      }
    };
    fetchUsers();
  }, [props.data]);

  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await api.get(
          `/api/personal-info/` + userData?._id,
        );
          
        setEmpName(response.data.FirstName);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadPersonalInfoData();
  }, [props.data]);

  const handleUserChange = (employeeID) => {
    const selectedEmployee = employees.find(
      (employee) => employee._id === employeeID
    );

    if (selectedEmployee) {
      setAttencenceID(selectedEmployee.attendanceObjID);
      setSelectedEmployee(employeeID);
      getMessage(employeeID);
    }
  };

 const getMessage = async (employeeID) => {
  try {
    const response = await api.get(
      `/api/attendance/${employeeID}`,
    );

    const attendance = response.data && (response.data.attendance || response.data);
    const lastDate = attendance?.years?.[attendance.years?.length - 1]?.months?.slice(-1)[0]?.dates?.slice(-1)[0];

    if (lastDate) {
      setMessage(`Status: ${lastDate.status}`);
    } else {
      setMessage("");
    }
  } catch (error) {
    console.error("Error fetching attendance data:", error);
  }
};

const handleLogin = async () => {
  if (!empName) {
    setMessage("Please select a user");
    return;
  }

  let data = employees.filter((val) => {
    return val.FirstName === empName;
  });

  if (data.length === 0) {
    setMessage("Employee not found");
    return;
  }

  let attencenceID = data[0].attendanceObjID;
  let selectedEmployee = data[0]._id;
  setLoggedIn(true);

  try {
    const currentTime = Moment().format("HH:mm:ss");
    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        loginTime: [currentTime],
        status: "login",
      },
    );

    setMessage("Login time recorded successfully");
    toast.success("Login time recorded successfully");
    setLoggedIn(true);
  } catch (error) {
    setMessage("Error recording login time");
    toast.error("Error recording login time");
  }
};

const handleLogout = async () => {
  setLoggedIn(false);

  if (!empName) {
    setMessage("Please select an employee");
    return;
  }

  let data = employees.filter((val) => val.FirstName === empName);

  if (data.length === 0) {
    setMessage("Employee not found");
    return;
  }

  let attencenceID = data[0].attendanceObjID;
  let selectedEmployee = data[0]._id;

  try {
    const currentTime = Moment().format("HH:mm:ss");

    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        logoutTime: [currentTime],
        status: "logout",
      },
    );

    setMessage("Logout time recorded successfully");
    toast.success("Logout time recorded successfully");
    setLoggedIn(false);
  } catch (error) {
    setMessage("Error recording logout time");
    toast.error("Error recording logout time");
  }
};




const handleResume = async () => {
  setOnBreak(false);

  if (!empName) {
    setMessage("Please select an employee");
    return;
  }

  let data = employees.filter((val) => val.FirstName === empName);

  if (data.length === 0) {
    setMessage("Employee not found");
    return;
  }

  let attencenceID = data[0].attendanceObjID;
  let selectedEmployee = data[0]._id;

  try {
    const currentTime = new Date().toLocaleTimeString();
    const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);

    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        ResumeTime: [currentTime],
        resumeTimeMS: [currentTimeMs],
        status: "resume",
      },
    );

    setMessage("Resumed time recorded successfully");
    toast.success("Resumed time recorded successfully");
    setOnBreak(false);
  } catch (error) {
    console.error("Error recording resume time:", error);
    setMessage("Error recording resume time");
    toast.error("Error recording resume time");
  }
};

const handleBreak = async () => {
  setOnBreak(true);

  if (!empName) {
    setMessage("Please select an employee");
    return;
  }

  let data = employees.filter((val) => val.FirstName === empName);

  if (data.length === 0) {
    setMessage("Employee not found");
    return;
  }

  let attencenceID = data[0].attendanceObjID;
  let selectedEmployee = data[0]._id;

  try {
    const currentTime = new Date().toLocaleTimeString();
    const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);

    await api.post(
      `/api/attendance/${attencenceID}`,
      {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        breakTime: [currentTime],
        breakTimeMs: [currentTimeMs],
        status: "break",
      },
    );

    setMessage("Break time recorded successfully");
    toast.success("Break time recorded successfully");
    setOnBreak(true);
  } catch (error) {
    setMessage("Error recording break time");
    toast.error("Error recording break time");
  }
};


  return (
    <div className="App row gap-2">
      <div style={{ alignItems: "center" }} className="d-flex gap-2">
        {/* {!loggedIn && (
          <button
            className="btn btn-success d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogin}
          >
            <RiLoginCircleFill className="my-auto fs-5" /> Login
          </button>
        )}
        {loggedIn && (
          <button
            className="btn btn-danger d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
          >
            <RiLogoutCircleFill className="my-auto fs-5" /> Logout
          </button>
        )} */}
        {!onBreak && (
          <button
            className="btn btn-warning d-flex align-items-center justify-content-center gap-2"
            onClick={handleBreak}
          >
            <PiCoffeeFill className="my-auto fs-5" /> Take a Break
          </button>
        )}
        {onBreak && (
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
            onClick={handleResume}
          >
            <FaComputerMouse className="my-auto fs-5" /> Break Over
          </button>
        )}
      </div>
    </div>
  );
}

export default EmpAttendance;

// import React, { useEffect, useContext, useState } from "react";
// import axios from "axios";
// import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
// import InnerDashContainer from "../../InnerDashContainer";
// import Moment from "moment";
// import BASE_URL from "../../../Pages/config/config";
// import { useTheme } from "../../../Context/TheamContext/ThemeContext";
// import toast from "react-hot-toast";
// import { RiLoginCircleFill, RiLogoutCircleFill } from "react-icons/ri";
// import { FaComputerMouse } from "react-icons/fa6";
// import { PiCoffeeFill } from "react-icons/pi";
// import { MdCoffee, MdMouse } from "react-icons/md";

// function EmpAttendance(props) {
//   const [empName, setEmpName] = useState(null);
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [onBreak, setOnBreak] = useState(false);
//   const { darkMode } = useTheme();
//   const id = localStorage.getItem("_id");

//   const {
//     employees,
//     setEmployees,
//     selectedEmployee,
//     setSelectedEmployee,
//     attencenceID,
//     setAttencenceID,
//     message,
//     setMessage
//   } = useContext(AttendanceContext);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/api/employee/` + localStorage.getItem("_id"),
//           {
//             headers: {
//               authorization: localStorage.getItem("token") || ""
//             }
//           }
//         );
//           
//         setEmployees(response.data);
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };
//     fetchUsers();
//   }, [props.data]);

//   useEffect(() => {
//     const loadPersonalInfoData = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/api/personal-info/` + localStorage.getItem("_id"),
//           {
//             headers: {
//               authorization: localStorage.getItem("token") || ""
//             }
//           }
//         );
//           
//         setEmpName(response.data.FirstName);
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };

//     loadPersonalInfoData();
//   }, [props.data]);

//   const handleUserChange = (employeeID) => {
//     const selectedEmployee = employees.find(
//       (employee) => employee._id === employeeID
//     );

//     if (selectedEmployee) {
//       setAttencenceID(selectedEmployee.attendanceObjID);
//       setSelectedEmployee(employeeID);
//       getMessage(employeeID);
//     }
//   };

//   const getMessage = async (employeeID) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/attendance/${employeeID}`
//       );
//       const lastEntry = response.data[response.data.length - 1];

//       if (lastEntry) {
//         setMessage(`Status: ${lastEntry.years[0].months[0].dates[0].status}`);
//       } else {
//         setMessage("");
//       }
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//     }
//   };

//   const handleLogin = async () => {
//     if (!empName) {
//       setMessage("Please select a user");
//       return;
//     }
//     let data = employees.filter((val) => {
//       return val.FirstName === empName;
//     });

//     if (data.length === 0) {
//       setMessage("Employee not found");
//       return;
//     }

//     let attencenceID = data[0].attendanceObjID;
//     let selectedEmployee = data[0]._id;
//     setLoggedIn(true);

//     try {
//       const currentTime = Moment().format("HH:mm:ss");
//       await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
//         employeeId: selectedEmployee,
//         year: new Date().getFullYear(),
//         month: new Date().getMonth() + 1,
//         date: new Date().getDate(),
//         loginTime: [currentTime],
//         status: "login"
//       });
//       setMessage("Login time recorded successfully");
//       toast.success("Login time recorded successfully");
//       setLoggedIn(true);
//     } catch (error) {
//       setMessage("Error recording login time");
//       toast.error("Error recording login time");
//     }
//   };

//   const handleLogout = async () => {
//     setLoggedIn(false);

//     if (!empName) {
//       setMessage("Please select an employee");
//       return;
//     }

//     let data = employees.filter((val) => {
//       return val.FirstName === empName;
//     });

//     if (data.length === 0) {
//       setMessage("Employee not found");
//       return;
//     }

//     let attencenceID = data[0].attendanceObjID;
//     let selectedEmployee = data[0]._id;

//     try {
//       const currentTime = Moment().format("HH:mm:ss");
//       await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
//         employeeId: selectedEmployee,
//         year: new Date().getFullYear(),
//         month: new Date().getMonth() + 1,
//         date: new Date().getDate(),
//         logoutTime: [currentTime],
//         status: "logout"
//       });
//       setMessage("Logout time recorded successfully");
//       toast.success("Logout time recorded successfully");
//       setLoggedIn(false);
//     } catch (error) {
//       setMessage("Error recording logout time");
//       toast.error("Error recording logout time");
//     }
//   };

//   const handleResume = async () => {
//     setOnBreak(false);

//     if (!empName) {
//       setMessage("Please select an employee");
//       return;
//     }

//     let data = employees.filter((val) => {
//       return val.FirstName === empName;
//     });

//     if (data.length === 0) {
//       setMessage("Employee not found");
//       return;
//     }

//     let attencenceID = data[0].attendanceObjID;
//     let selectedEmployee = data[0]._id;

//     try {
//       const currentTime = new Date().toLocaleTimeString();
//       const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);

//       await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
//         employeeId: selectedEmployee,
//         year: new Date().getFullYear(),
//         month: new Date().getMonth() + 1,
//         date: new Date().getDate(),
//         ResumeTime: [currentTime],
//         resumeTimeMS: [currentTimeMs],
//         status: "resume"
//       });

//       setMessage("Resumed time recorded successfully");
//       toast.success("Resumed time recorded successfully");
//       setOnBreak(false);
//     } catch (error) {
//       console.error("Error recording resume time:", error);
//       setMessage("Error recording resume time");
//       toast.error("Error recording resume time");
//     }
//   };

//   const handleBreak = async () => {
//     setOnBreak(true);

//     if (!empName) {
//       setMessage("Please select an employee");
//       return;
//     }

//     let data = employees.filter((val) => {
//       return val.FirstName === empName;
//     });

//     if (data.length === 0) {
//       setMessage("Employee not found");
//       return;
//     }

//     let attencenceID = data[0].attendanceObjID;
//     let selectedEmployee = data[0]._id;

//     try {
//       const currentTime = new Date().toLocaleTimeString();
//       const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);

//       await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
//         employeeId: selectedEmployee,
//         year: new Date().getFullYear(),
//         month: new Date().getMonth() + 1,
//         date: new Date().getDate(),
//         breakTime: [currentTime],
//         breakTimeMs: [currentTimeMs],
//         status: "break"
//       });
//       setMessage("Break time recorded successfully");
//       toast.success("Break time recorded successfully");
//       setOnBreak(true);
//     } catch (error) {
//       setMessage("Error recording break time");
//       toast.error("Error recording break time");
//     }
//   };

//   return (
//     <div className="App row gap-2">
//       <div style={{ alignItems: "center" }} className="d-flex gap-2">
//         {!loggedIn && (
//           <button
//             className="btn btn-success d-flex align-items-center justify-content-center gap-2"
//             onClick={handleLogin}
//           >
//             <RiLoginCircleFill className="my-auto fs-5" /> Login
//           </button>
//         )}
//         {loggedIn && (
//           <button
//             className="btn btn-danger d-flex align-items-center justify-content-center gap-2"
//             onClick={handleLogout}
//           >
//             <RiLogoutCircleFill className="my-auto fs-5" /> Logout
//           </button>
//         )}
//         {!onBreak && loggedIn && (
//           <button
//             className="btn btn-warning d-flex align-items-center justify-content-center gap-2"
//             onClick={handleBreak}
//           >
//             <PiCoffeeFill className="my-auto fs-5" /> Take a Break
//           </button>
//         )}
//         {onBreak && (
//           <button
//             className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
//             onClick={handleResume}
//           >
//             <FaComputerMouse className="my-auto fs-5" /> Resume
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default EmpAttendance;
