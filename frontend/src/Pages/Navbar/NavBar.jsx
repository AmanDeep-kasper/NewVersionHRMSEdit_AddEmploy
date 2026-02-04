import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import Logo from "../../img/logo.webp";
import { BsArrowRight } from "react-icons/bs";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import { useNavigate } from "react-router-dom";
import addNotification from "react-push-notification";
import { useLocation } from "react-router-dom";
import DarkModeToggle from "../TheamChanger/DarkModeToggle";
import { LuMenu } from "react-icons/lu";
import { useSidebar } from "../../Context/AttendanceContext/smallSidebarcontext";
import profile from "../../img/profile.jpg";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import SearchComponent from "../../Utils/SearchComponent/SearchComponent";
import { TbBell } from "react-icons/tb";
import GoBack from "../../Utils/GoBack/GoBack";
import { useSelector, useDispatch } from "react-redux";
import { persistStore } from "redux-persist";
import { store } from "../../redux/store";
import { jwtDecode } from "jwt-decode";
import { attendanceInfo } from "../../redux/slices/loginSlice";
import BreakIndicator from "../../Utils/BreakIndicator/BreakIndicator";
import { addDetails } from "../../redux/slices/messageSlice";
import api from "../config/api";
import ProfileDropdown from "./ProfileDropdown";

const NavBar = (props, data) => {
  const persistor = persistStore(store);
  const isonBreak = localStorage.getItem("breakStartTime");
  const [activeProfile, setActiveProfile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const location = useLocation().pathname.split("/")[1];
  const pathname = useLocation().pathname;
  const goBackToggle = useLocation().pathname.split("/")[2];

  const { userData } = useSelector((state) => state.user);
  const decodeToken = (token) => {
    const parts = token.split(".");
    if (parts.length !== 3) {
      localStorage.clear();
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      localStorage.clear();
      navigate("/");
      return null;
    }
  };

 useEffect(() => {
  const verifyAccount = async () => {
    try {
      // ✅ No need to fetch token manually — it’s automatically sent via cookie
      if (!userData?._id || !userData?.Account) {
        navigate("/");
        return;
      }

      // Prepare request body
      const body = {
        _id: userData._id,
        Account: userData.Account,
      };

      // ✅ API request to verify account (cookie is automatically sent)
      await api.post("/api/verifyAccount", body);

    } catch (error) {
      console.error("Error during verification:", error);

      // Handle Unauthorized Access or other errors
      if (error.response?.data?.error === "Unauthorized Access" || error.response?.status === 401) {
        await persistor.purge(); // ✅ Clear Redux persisted data
        navigate("/"); // Redirect to login
      } else {
        console.error("Account verification failed:", error);
      }
    }
  };

  verifyAccount(); // Call the async function
}, [pathname, userData]);



const handleLogout = async () => {
  try {
    // 1️⃣ Optional: Update attendance before logout
    if (userData?._id) {
      await dispatch(
        attendanceInfo({
          employeeId: userData._id,
          status: "logout",
        })
      );
    }

    // 2️⃣ Call backend logout endpoint to clear cookies & revoke refresh token
    await api.post("/api/logout", {}, { withCredentials: true });

    // 3️⃣ Notify socket (if applicable)
    if (userData?.Email) {
      socket.emit("logoutUser", {
        manager: userData.reportHr || userData.reportManager,
        user: userData.Email,
      });
    }

    // 4️⃣ Clear Redux persist storage (optional)
    await persistor.purge();

    // 5️⃣ Feedback + redirect
    toast.success("Logout successful");
    window.location.href = "/";
  } catch (error) {
    console.error("Error during logout:", error);
    toast.error(error?.response?.data?.message || "Logout failed. Please try again.");
  }
};



  const [notification, setNotification] = useState([]);
  const [employeeData, setEmployeeData] = useState("");
  const [notiToggle, setNotiToggle] = useState(false);
  const { socket } = useContext(AttendanceContext);
  const { toggleSidebar } = useSidebar();
  const [loginNoti, setLoginNoti] = useState(true);

  const id = userData?._id;

  const email = userData?.Email;
  const pushNotification = (taskName) => {
    addNotification({
      title: "Kasper",
      subtitle: taskName,
      duration: 4000,
      icon: Logo,
      native: true,
    });
  };
const loadEmployeeData = () => {
  if (!userData?._id) return; 

  api
    .get(`/api/empNavParticulars`, {
    })
    .then((response) => {
      setEmployeeData(response.data);
      setNotification(response.data.Notification);
    })
    .catch((error) => {
      console.error("Error loading employee data:", error);
    });
};



  useEffect(() => {
  if (userData?._id) {
    loadEmployeeData();
  }
}, [userData]); // ✅ runs only when userData is loaded

  const notificationDeleteHandler = (id) => {
    api
      .post(
        `/api/notificationDeleteHandler/${id}`,
        { email },
        
      )
      .then((response) => {
        setEmployeeData(response.data.result);
        setNotification(response.data.result.Notification);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const notificationHandler = (id, path, val) => {
    axios
      .post(
        `${BASE_URL}/api/notificationStatusUpdate/${id}`,
        { email },{ withCredentials: true },
       
      )
      .then((response) => {
        setEmployeeData(response.data.result);
        setNotification(response.data.result.Notification);
        if (path === "emp_manager" || path === "admin_manager") {
          dispatch(
            addDetails({
              taskId: val.taskIden,
              to: val.to,
              profile: employeeData.profile,
              name: `${employeeData.FirstName} ${employeeData.LastName}`,
            })
          );
        }
        navigate(`/${location}/${path}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };




  const handleNotificationRequest = () => {
    // Check if the browser supports notifications
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Permission granted, you can now trigger notifications
        }
      });
    }
  };
  useEffect(() => {
    // console.log('Socket:', socket.id);
    socket.emit("userConnected", { email });
    handleNotificationRequest();
    if (socket) {
      socket.on("taskNotificationReceived", (data) => {
        if (data.Account === 4) {
          if (data.managerEmail === email) {
            setNotification((prev) => [data, ...prev]);
            pushNotification(data.message);
          }
        } else if (data.Account === 2 || data.Account === 3) {
          let emp = data.employeesEmail.filter((val) => {
            return val === email && val !== data.senderMail;
          });
          if (emp.length > 0) {
            setNotification((prev) => [data, ...prev]);
            pushNotification(data.message);
          }
        } else if (data.Account === 1) {
          if (data.adminMail === email) {
            setNotification((prev) => [data, ...prev]);
            pushNotification(data.message);
          }
        }
      });
      socket.on("notificationPageUpdate", (data) => {
        if (data) {
          loadEmployeeData();
        }
      });
      socket.on("leaveNotificationReceived", (data) => {
        const {
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        } = data;

        const data1 = {
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        };
        setNotification((prev) => [data1, ...prev]);
        pushNotification(data1.message);
      });
      socket.on("leaveManagerStatusNotificationReceived", (data) => {
        const {
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          managerEmail,
          messageBy,
          profile,
        } = data;
        if (location === "employee") {
          const data1 = {
            message,
            status,
            path,
            taskId,
            employeeEmail,
            hrEmail,
            messageBy,
            profile,
          };
          setNotification((prev) => [data1, ...prev]);
          pushNotification(data1.message);
        } else if (location === "hr") {
          const data1 = {
            message,
            status,
            path,
            taskId,
            employeeEmail,
            hrEmail,
            messageBy,
            profile,
          };
          setNotification((prev) => [data1, ...prev]);
          pushNotification(data1.message);
        } else if (location === "manager") {
          const data1 = {
            message,
            status,
            path,
            taskId,
            employeeEmail,
            managerEmail,
            messageBy,
            profile,
          };
          setNotification((prev) => [data1, ...prev]);
          pushNotification(data1.message);
        }
      });
      socket.on("updateNoitification", (data) => {
        const {
          message,
          status,
          path,
          taskId,
          taskIden,
          to,
          messageBy,
          profile,
        } = data;

        const data1 = {
          message,
          status,
          path,
          taskId,
          taskIden,
          to,
          messageBy,
          profile,
        };
        setNotification((prev) => [data1, ...prev]);
        pushNotification(data1.message);
      });
    }
  }, [socket]);


  const clearAllHandler = () => {
    if (notification.length > 0) {
      api
        .post(
          `/api/selectedNotificationDelete`,
          { email },
        )
        .then((response) => {
          setNotification(response.data.result.Notification);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  let uniqueNotification = notification.filter((val, index, arr) => {
    return (
      val.status === "unseen" &&
      arr.findIndex((item) => item.taskId === val.taskId) === index
    );
  });

  const handleClick = () => {
    toggleSidebar();
  };

  const handleUserLogin = (data) => {
    const showNotification = (data) => {
      if (data) {
        const { message } = data;

        toast.success(message, {
          duration: 2000,
          position: "top-right",
          style: {
            color: "green",
            backgroundColor: "white",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            zIndex: "9999",
          },
          toastClassName: "custom-toast",
        });
      }
    };
    if (loginNoti) {
      showNotification(data);
    }
  };
  const handleUserLogout = (data) => {
    const showNotification = (data) => {
      if (data) {
        const { message } = data;

        toast.error(message, {
          duration: 2000,
          position: "top-right",
          style: {
            color: "white",
            backgroundColor: "red",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            zIndex: "9999",
          },
          toastClassName: "custom-toast",
        });
      }
    };

    if (loginNoti) {
      showNotification(data);
    }
  };
  const navigationHandler = (path, data) => {
    console.log(data);
    if (data.path === "emp_manager" || data.path === "admin_manager") {
      dispatch(
        addDetails({
          taskId: data.taskIden,
          to: data.to,
          profile: employeeData.profile,
          name: `${employeeData.FirstName} ${employeeData.LastName}`,
        })
      );
    }

    navigate(path);
  };
  useEffect(() => {
    socket.on("userLogin", handleUserLogin);
    socket.on("userLogout", handleUserLogout);
    return () => {
      socket.off("userLogin", handleUserLogin);
      socket.off("userLogout", handleUserLogout);
    };
  }, []);

  const renderInfoButton = (params) => {
    if (params.data && params.data.data) {
      return (
        <div>
          <FontAwesomeIcon
            icon={faInfoCircle}
            onClick={() => props.onEmpInfo(params.data.data)}
          />
        </div>
      );
    }
    return null;
  };

  function truncateMessage(message) {
    if (message?.length > 15) {
      return message.substring(0, 15) + "...";
    }
    return message;
  }

  const UserType = (Account) => {
    switch (Account) {
      case 1:
        return "Admin";
      case 2:
        return "Hr";
      case 4:
        return "Manager";

      default:
        return "Employee";
    }
  };
const ShortedText = (text) => {
  if (!text) return "";
  const safeText = text.toString();
  return safeText.length > 20 ? safeText.slice(0, 20) + "..." : safeText;
};


  const routeBasedOnUserType = () => {
    const userType = userData?.Account;
    switch (userType) {
      case 3:
        return "/employee/notification";
      case 4:
        return "/manager/notification";
      case 1:
        return "/admin/notification";
      case 2:
        return "/hr/notification";
      default:
        return "/employee/notification";
    }
  };
  return (
    <nav
      style={{
        height: "100%",
        background: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
      }}
      className="d-flex align-items-center justify-content-between"
    >
      <button
        onClick={handleClick}
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)",

          fontSize: "2.2rem",
        }}
        className="btn d-flex d-sm-none align-iems-center"
      >
        <LuMenu />
      </button>
      <div className="d-flex align-items-center justify-content-between w-100">
        {goBackToggle !== "dashboard" ? <GoBack /> : <></>}
        <div className="ms-auto gap-2 d-flex align-items-center ">
          <BreakIndicator isonBreak={isonBreak} />
          <SearchComponent />
          <DarkModeToggle />
          <div
            className="position-relative"
            onMouseEnter={() => setNotiToggle("name")}
            onMouseLeave={() => setNotiToggle(false)}
          >
            {notification?.length > 0 && (
              <div
                className="notilenghth text-muted"
                style={{
                  display: uniqueNotification.length <= 0 ? "none" : "flex",
                  height: "fit-content",
                  width: "fit-content",
                  minWidth: "19px",
                  minHeight: "19px",
                  position: "absolute",
                  top: "-10%",
                  right: "-20%",
                  borderRadius: "50% 50% 50% 0",
                  objectFit: "cover",
                  fontSize: ".8rem",
                  padding: "0 .1rem",
                  background: "#e2cd12f1",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <span className="m-auto">
                  {uniqueNotification?.length > 99 ? (
                    <span>
                      99<sup>+</sup>
                    </span>
                  ) : (
                    uniqueNotification?.length
                  )}
                </span>
              </div>
            )}
            <TbBell
              style={{
                fontSize: "28px",
                color: !darkMode ? "white" : "black",
                padding: ".2rem",
                cursor: "pointer",
              }}
              className=""
            />{" "}
            {notification?.length > 0 ? (
              <div className="position-relative">
                <div
                  style={{
                    position: "absolute",
                    zIndex: "2001",
                    right: ".5rem",
                    top: "100%",
                    minWidth: "230px",
                    maxWidth: "250px",
                    display: notiToggle == "name" ? "flex" : "none",
                  }}
                  className="border border-muted border-1 flex-column w-100 bg-white align-items-center gap-1 justify-content-between  p-1 rounded-2  shadow"
                >
                  {notiToggle &&
                    notification?.length > 0 &&
                    notification
                      .filter(
                        (val, i, ar) =>
                          ar.findIndex((item) => item.taskId === val.taskId) ===
                          i,
                      )
                      .slice(0, 10)
                      .map((val, i) => {
                        return (
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={
                              val.status === "unseen"
                                ? () =>
                                    notificationHandler(
                                      val.taskId,
                                      val.path,
                                      val,
                                    )
                                : () =>
                                    navigationHandler(
                                      `/${location}/${val.path}`,
                                      val,
                                    )
                            }
                            className={
                              val.status === "unseen"
                                ? "d-flex align-items-center justify-content-between p-1 w-100 back"
                                : "d-flex align-items-center justify-content-between p-1 w-100"
                            }
                          >
                            <div className="d-flex align-items-center gap-2 cursor-pointer ">
                              <div
                                style={{
                                  height: "25px",
                                  width: "25px",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "cover",
                                    overflow: "hidden",
                                    borderRadius: "50%",
                                  }}
                                  src={val.profile ? val.profile : profile}
                                  alt=""
                                />
                              </div>
                              <div>
                                <p
                                  style={{ fontSize: ".75rem" }}
                                  className="p-0 m-0 w-100 text-muted"
                                >
                                  {truncateMessage(val.message)}
                                </p>
                                <p
                                  style={{ fontSize: ".80rem" }}
                                  className="p-0 m-0 w-100"
                                >
                                  {val.messageBy}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <span
                                style={{
                                  fontSize: "1rem",
                                  height: "1.2rem",
                                  width: "1.2rem",
                                  borderRadius: "50%",
                                }}
                                className="d-flex align-items-center text-danger  fw-bold justify-content-center"
                                onClick={(e) => (
                                  notificationDeleteHandler(val.taskId),
                                  e.stopPropagation()
                                )}
                              >
                                x
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  {notiToggle && notification.length > 2 && (
                    <button
                      className="text-decoration-none btn text-black"
                      onClick={() => navigate(routeBasedOnUserType())}
                    >
                      View All <BsArrowRight />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="position-relative">
                <div
                  style={{
                    position: "absolute",
                    zIndex: "2001",
                    right: ".5rem",
                    top: "100%",
                    minWidth: "230px",
                    maxWidth: "250px",
                    display: notiToggle == "name" ? "flex" : "none",
                  }}
                  className="border border-muted border-1 flex-column w-100 bg-white align-items-center gap-1 justify-content-between  p-1 rounded-2  shadow"
                >
                  No New Notification
                </div>
              </div>
            )}
          </div>
          <span className="navbar-right-content d-flex align-items-center">
            <ProfileDropdown
              userData={userData}
              employeeData={employeeData}
              profile={profile}
              id={id}
              location={location}
              handleLogout={handleLogout}
              UserType={UserType}
              ShortedText={ShortedText}
            />
          </span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;