import React, { useState, useMemo } from "react";
import { AttendanceContext } from "./AttendanceContext";
import { io } from "socket.io-client";
import BASE_URL from "../../Pages/config/config";

const AttendanceContextProvider = ({ children }) => {
  const socket = useMemo(() => {
    return io(`${BASE_URL}`);
  }, []);
  const [employees, setEmployees] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [attencenceID, setAttencenceID] = useState("");
  const [message, setMessage] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [profile, setProfile] = useState("");
  const [managerMail, setManagerMail] = useState(null);
  const [messageData, setMessageData] = useState({
    taskId: "",
    to: "",
  });
  const [personalData, setPersonalData] = useState(null);
  const [chat, setChat] = useState([]);

  return (
    <AttendanceContext.Provider
      value={{
        socket,
        personalData,
        setPersonalData,
        setIsLogin,
        isLogin,
        emailInput,
        setEmailInput,
        employees,
        setEmployees,
        selectedEmployee,
        setManagerMail,
        managerMail,
        setSelectedEmployee,
        attencenceID,
        setAttencenceID,
        message,
        setMessage,
        messageData,
        setMessageData,
        setChat,
        chat,
        setProfile,
        profile,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContextProvider;

// import React, { useState, useMemo } from "react";
// import { AttendanceContext } from "./AttendanceContext";
// import { io } from "socket.io-client";
// import BASE_URL from "../../Pages/config/config";

// const AttendanceContextProvider = ({ children }) => {
//   const socket = useMemo(() => {
//     return io("http://localhost:4000");
//   }, []);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [attencenceID, setAttencenceID] = useState("");
//   const [message, setMessage] = useState("");
//   const [emailInput, setEmailInput] = useState("");

//   return (
//     <AttendanceContext.Provider
//       value={{
//         socket,
//         emailInput,
//         setEmailInput,
//         employees,
//         setEmployees,
//         selectedEmployee,
//         setSelectedEmployee,
//         attencenceID,
//         setAttencenceID,
//         message,
//         setMessage
//       }}
//     >
//       {children}
//     </AttendanceContext.Provider>
//   );
// };

// export default AttendanceContextProvider;
