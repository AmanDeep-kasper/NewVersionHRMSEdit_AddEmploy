// // import React, { Component } from "react";
// // import "./Login.css";
// // import Logo from "../../img/logo.png";
// // import { css } from "@emotion/core";
// // // First way to import
// // import { ScaleLoader } from "react-spinners";
// // const override = css`
// //   display: block;
// //   margin: 0 auto;
// //   border-color: red;
// // `;

// // class Login extends Component {
// //   render() {
// //     // let value=(this.props.pass) ? undefined : "";
// //     return (
// //       <div
// //         className="login-bg"
// //         style={{
// //           height: "100vh",
// //           width: "100%",
// //           display: "flex",
// //           justifyContent: "center",
// //           alignItems: "center",
// //         }}
// //       >
// //         <div className="login-holder">
// //           <div>
// //             <div id="logo-div">
// //               <img id="logo-img" src={Logo} alt="" />
// //             </div>
// //             <div id="title-div">
// //               <h4 className="fw-bold text-primary">Sign in</h4>
// //             </div>

// //             <div id="outer-login-form-div">
// //               <form action="" method="" onSubmit={this.props.onSubmit}>
// //                 {/* <div className="form-group"> */}
// //                 <input
// //                   className="login-form-input"
// //                   type="text"
// //                   // className="form-control"
// //                   placeholder="Email"
// //                   required="required"
// //                   name="Username"
// //                 />
// //                 {/* </div> */}
// //                 {/* <div className="form-group"> */}
// //                 <input
// //                   className="login-form-input"
// //                   type="password"
// //                   // className="form-control"
// //                   placeholder="Password"
// //                   required="required"
// //                 />
// //                 {/* </div> */}
// //                 {/* <div className="form-group"> */}
// //                 <input
// //                   className="login-form-input text-white"
// //                   type="submit"
// //                   // className="btn btn-primary btn-block btn-lg btn-mystyle"
// //                   value="Sign in"
// //                   id="submitBtn"
// //                 />
// //                 {/* </div> */}
// //                 {!this.props.pass ? (
// //                   <p className="alert text-danger">
// //                     Invalid UserName or Password
// //                   </p>
// //                 ) : (
// //                   ""
// //                 )}
// //               </form>
// //             </div>

// //             <div className="loading">
// //               <ScaleLoader
// //                 css={override}
// //                 sizeUnit={"px"}
// //                 size={150}
// //                 color={"#123abc"}
// //                 loading={this.props.loading}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }
// // }

// // export default Login;



// import React from "react";
// import "./Login.css";
// import Logo from "../../img/logo.png";
// import { css } from "@emotion/core";
// import { ScaleLoader } from "react-spinners";

// const override = css`
//   display: block;
//   margin: 0 auto;
//   border-color: red;
// `;

// const Login = (props) => {
  
//   return (
//     <div
//       className="login-bg"
//       style={{
//         height: "100vh",
//         width: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div className="login-holder">
//         <div>
//           <div id="logo-div">
//             <img id="logo-img" src={Logo} alt="" />
//           </div>
//           <div id="title-div">
//             <h4 className="fw-bold text-primary">Sign in</h4>
//           </div>

//           <div id="outer-login-form-div">
//             <form action="" method="" onSubmit={props.onSubmit}>
//               <input
//                 className="login-form-input"
//                 type="text"
//                 placeholder="Email"
//                 required="required"
//                 name="Username"
//               />
//               <input
//                 className="login-form-input"
//                 type="password"
//                 placeholder="Password"
//                 required="required"
//               />
//               <input
//                 className="login-form-input text-white"
//                 type="submit"
//                 value="Sign in"
//                 id="submitBtn"
//               />
//               {!props.pass ? (
//                 <p className="alert text-danger">
//                   Invalid UserName or Password
//                 </p>
//               ) : (
//                 ""
//               )}
//             </form>
//           </div>

//           <div className="loading">
//             <ScaleLoader
//               css={override}
//               sizeUnit={"px"}
//               size={150}
//               color={"#123abc"}
//               loading={props.loading}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



// import React, { Component } from "react";
// import "./Login.css";
// import Logo from "../../img/logo.png";
// import { css } from "@emotion/core";
// // First way to import
// import { ScaleLoader } from "react-spinners";
// const override = css`
//   display: block;
//   margin: 0 auto;
//   border-color: red;
// `;

// class Login extends Component {
//   render() {
//     // let value=(this.props.pass) ? undefined : "";
//     return (
//       <div
//         className="login-bg"
//         style={{
//           height: "100vh",
//           width: "100%",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <div className="login-holder">
//           <div>
//             <div id="logo-div">
//               <img id="logo-img" src={Logo} alt="" />
//             </div>
//             <div id="title-div">
//               <h4 className="fw-bold text-primary">Sign in</h4>
//             </div>

//             <div id="outer-login-form-div">
//               <form action="" method="" onSubmit={this.props.onSubmit}>
//                 {/* <div className="form-group"> */}
//                 <input
//                   className="login-form-input"
//                   type="text"
//                   // className="form-control"
//                   placeholder="Email"
//                   required="required"
//                   name="Username"
//                 />
//                 {/* </div> */}
//                 {/* <div className="form-group"> */}
//                 <input
//                   className="login-form-input"
//                   type="password"
//                   // className="form-control"
//                   placeholder="Password"
//                   required="required"
//                 />
//                 {/* </div> */}
//                 {/* <div className="form-group"> */}
//                 <input
//                   className="login-form-input text-white"
//                   type="submit"
//                   // className="btn btn-primary btn-block btn-lg btn-mystyle"
//                   value="Sign in"
//                   id="submitBtn"
//                 />
//                 {/* </div> */}
//                 {!this.props.pass ? (
//                   <p className="alert text-danger">
//                     Invalid UserName or Password
//                   </p>
//                 ) : (
//                   ""
//                 )}
//               </form>
//             </div>

//             <div className="loading">
//               <ScaleLoader
//                 css={override}
//                 sizeUnit={"px"}
//                 size={150}
//                 color={"#123abc"}
//                 loading={this.props.loading}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Login;



// import React, { useContext, useEffect,useState } from "react";
// import "./Login.css";
// import Logo from "../../img/logo.png";
// import { css } from "@emotion/core";
// import { ScaleLoader } from "react-spinners";
// import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
// import axios from "axios";


// const override = css`
//   display: block;
//   margin: 0 auto;
//   border-color: red;
// `;

// const Login = (props) => {

//   const {
//     employees,
//     setEmployees,
//     selectedEmployee,
//     setSelectedEmployee,
//     attencenceID,
//     setAttencenceID,
//     message,
//     setMessage,
//   } = useContext(AttendanceContext);

//   const [emailInput, setEmailInput] = useState("");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://localhost:4000/api/employee", {
//           headers: {
//             authorization: localStorage.getItem("token") || "",
//           },
//         });
//         setEmployees(response.data);
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

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

//   const handleEmailChange = (event) => {
//     setEmailInput(event.target.value);
//   };

//   const getMessage = async (employeeID) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:4000/api/attendance/${employeeID}`
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
//   const getUserIdByEmail = (email) => {
//     const user = employees.find((employee) => employee.email === email);
//     return user ? user._id : null;
//   };

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     try {
//       if (!emailInput) {
//         setMessage("Please enter an email");
//         return;
//       }

//       const userId = getUserIdByEmail(emailInput);

//       if (!userId) {
//         setMessage("User not found");
//         return;
//       }

//       const currentTime = new Date().toLocaleTimeString();
//       await axios.post(`http://localhost:4000/api/attendance/${attencenceID}`, {
//         employeeId: userId, // Add the user ID to the request
//         email: emailInput,
//         year: new Date().getFullYear(),
//         month: new Date().getMonth() + 1,
//         date: new Date().getDate(),
//         loginTime: [currentTime],
//         status: "login",
//       });
//       setMessage("Login time recorded successfully");
//     } catch (error) {
//       console.error("Error recording login time:", error);
//       setMessage("Error recording login time");
//     }
//   };

  
//   return (
//     <div
//       className="login-bg"
//       style={{
//         height: "100vh",
//         width: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div className="login-holder">
//         <div>
//           <div id="logo-div">
//             <img id="logo-img" src={Logo} alt="" />
//           </div>
//           <div id="title-div">
//             <h4 className="fw-bold text-primary">Sign in</h4>
//           </div>

//           <div id="outer-login-form-div">
//             <form action="" method="" onSubmit={props.onSubmit}>
//               <input
//                 className="login-form-input"
//                 type="text"
//                 placeholder="Email"
//                 required="required"
//                 name="Username"
//                 onChange={handleEmailChange}
//               />
//               <input
//                 className="login-form-input"
//                 type="password"
//                 placeholder="Password"
//                 required="required"
//               />
//               <input
//                 className="login-form-input text-white"
//                 type="submit"
//                 value="Sign in"
//                 id="submitBtn"
//                 onSubmit={handleLogin}
//               />
//               {!props.pass ? (
//                 <p className="alert text-danger">
//                   Invalid UserName or Password
//                 </p>
//               ) : (
//                 ""
//               )}
//             </form>
//           </div>

//           <div className="loading">
//             <ScaleLoader
//               css={override}
//               sizeUnit={"px"}
//               size={150}
//               color={"#123abc"}
//               loading={props.loading}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import Logo from "../../img/logo.png";
import { css } from "@emotion/core";
import { ScaleLoader } from "react-spinners";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import axios from "axios";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Login = (props) => {
  const {
    employees,
    setEmployees,
    selectedEmployee,
    setSelectedEmployee,
    attencenceID,
    setAttencenceID,
    message,
    setMessage,
    emailInput, setEmailInput
  } = useContext(AttendanceContext);


  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:4000/api/employee", {
  //         headers: {
  //           authorization: localStorage.getItem("token") || "",
  //         },
  //       });
  //       setEmployees(response.data);
  //     } catch (error) {
  //       console.error("Error fetching employees:", error);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

  // const handleUserChange = (employeeID) => {
  //   const selectedEmployee = employees.find(
  //     (employee) => employee._id === employeeID
  //   );

  //   if (selectedEmployee) {
  //     setAttencenceID(selectedEmployee.attendanceObjID);
  //     setSelectedEmployee(employeeID);
  //     getMessage(employeeID);
  //   }
  // };

  // const handleEmailChange = (event) => {
  //   setEmailInput(event.target.value);
  // };

  // const getMessage = async (employeeID) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:4000/api/attendance/${employeeID}`
  //     );
  //     const lastEntry = response.data[response.data.length - 1];

  //     if (lastEntry) {
  //       setMessage(`Status: ${lastEntry.years[0].months[0].dates[0].status}`);
  //     } else {
  //       setMessage("");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching attendance data:", error);
  //   }
  // };

  // const handleLogin = async (event) => {
  //   event.preventDefault();

  //   try {
  //     if (!emailInput) {
  //       setMessage("Please enter an email");
  //       return;
  //     }

  //     const currentTime = new Date().toLocaleTimeString();
  //     await axios.post(`http://localhost:4000/api/attendance/${attencenceID}`, {
  //       email: emailInput,
  //       year: new Date().getFullYear(),
  //       month: new Date().getMonth() + 1,
  //       date: new Date().getDate(),
  //       loginTime: [currentTime],
  //       status: "login",
  //     });
  //     setMessage("Login time recorded successfully");
  //   } catch (error) {
  //     console.error("Error recording login time:", error);
  //     setMessage("Error recording login time");
  //   }
  // };

  return (
    <div
      className="login-bg"
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="login-holder">
        <div>
          <div id="logo-div">
            <img id="logo-img" src={Logo} alt="" />
          </div>
          <div id="title-div">
            <h4 className="fw-bold text-primary">Sign in</h4>
          </div>

          <div id="outer-login-form-div">
            <form onSubmit={props.onSubmit}>
              <input
                className="login-form-input"
                type="text"
                placeholder="Email"
                required="required"
                name="Username"
                onChange={(e)=>setEmailInput(e.target.value)}
              />
              <input
                className="login-form-input"
                type="password"
                placeholder="Password"
                required="required"
              />
              <input
                className="login-form-input text-white"
                type="submit"
                value="Sign in"
                id="submitBtn"
              />
              {!props.pass ? (
                <p className="alert text-danger">
                  Invalid UserName or Password
                </p>
              ) : (
                ""
              )}
            </form>
          </div>

          <div className="loading">
            <ScaleLoader
              css={override}
              sizeUnit={"px"}
              size={150}
              color={"#123abc"}
              loading={props.loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
