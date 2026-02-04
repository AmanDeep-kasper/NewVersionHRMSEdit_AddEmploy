import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ImBin } from "react-icons/im";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import "./notification.css";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import api from "../../../Pages/config/api";

const Notification = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState([]);
  const [notification, setNotification] = useState(null);
  const { userData } = useSelector((state) => state.user);

  const { socket } = useContext(AttendanceContext);
  const id = userData?._id;
  const email = userData?.Email;
  const { darkMode } = useTheme();

  const loadEmployeeData = () => {
    api
      .get(`/api/particularEmployee/${id}`, {
        
      })
      .then((response) => {
        setNotification(response.data.Notification);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    loadEmployeeData();
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("taskNotificationReceived", () => {
        loadEmployeeData();
      });
    }
  }, [socket]);

  useEffect(() => {
    // Check if all notifications are selected and update the "Select All" checkbox accordingly
    setSelectAll(
      notification && selectedNotification.length === notification.length
    );
  }, [selectedNotification, notification]);

  const addSelectedNotification = (val) => {
    const isChecked = selectedNotification.some(
      (noti) => noti.taskId === val.taskId
    );

    if (isChecked) {
      setSelectedNotification((prevNotification) =>
        prevNotification.filter((noti) => noti.taskId !== val.taskId)
      );
    } else {
      setSelectedNotification([...selectedNotification, val]);
    }
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedNotification(selectAll ? [] : [...notification]);
  };
  const clearAllHandler = () => {
    if (notification.length > 0) {
      api
        .post(
          `/api/selectedNotificationDelete`,
          { email },
         
        )
        .then((response) => {
          setNotification(response.data.result.Notification);
          socket.emit("notificationPageUpdate", true);
        })
        .catch((error) => {});
    }
  };
  const multiNotificationDeleteHandler = () => {
    if (selectedNotification.length > 0) {
      const taskIDArray = selectedNotification.map((val) => val.taskId);
      const data = {
        employeeMail: email,
        tasks: taskIDArray,
      };
      if (selectAll) {
        clearAllHandler();
      } else {
        api
          .post(`/api/multiSelectedNotificationDelete`, data, {
          })
          .then((response) => {
            setNotification(response.data.result.Notification);
            setSelectedNotification([]);

            socket.emit("notificationPageUpdate", true);
          })
          .catch((error) => {});
      }
    }
  };
  const notificationDeleteHandler = (id) => {
    api
      .post(
        `/api/notificationDeleteHandler/${id}`,
        { email },
      )
      .then((response) => {
        setNotification(response.data.result.Notification);
        setSelectedNotification([]);

        socket.emit("notificationPageUpdate", true);
      })
      .catch((error) => {});
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <div className="row w-100">
        <form className="d-flex flex-column gap-3">
          <div>
            <div className="p-2 d-flex align-items-center gap-2">
              <input
                type="checkbox"
                name=""
                id=""
                onChange={toggleSelectAll}
                checked={selectAll}
              />{" "}
              <span className={`${darkMode ? "text-black" : "text-white"}`}>
                Select All
              </span>
            </div>
            <div
              style={{
                // maxHeight: "68vh",
                overflow: "auto",
                position: "relative",
              }}
              className="table-responsive p-2 mb-3"
            >
              <table className="table">
                <thead>
                  <tr>
                    <th style={rowHeadStyle(darkMode)}>Select</th>
                    <th style={rowHeadStyle(darkMode)}>Task Name</th>
                    <th style={rowHeadStyle(darkMode)}>Sender</th>
                    <th style={rowHeadStyle(darkMode)}>Status</th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {notification &&
                    notification.map((val, index) => (
                      <tr key={index}>
                        <th style={rowBodyStyle(darkMode)}>
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onChange={() => addSelectedNotification(val)}
                            checked={selectedNotification.some(
                              (noti) => noti.taskId === val.taskId
                            )}
                          />
                        </th>
                        <td style={rowBodyStyle(darkMode)}>{val.message}</td>
                        <td style={rowBodyStyle(darkMode)}>{val.messageBy}</td>
                        {val.status === "unseen" ? (
                          <td style={rowBodyStyle(darkMode)}>Unread</td>
                        ) : (
                          <td style={rowBodyStyle(darkMode)}>Read</td>
                        )}
                        <td style={rowBodyStyle(darkMode)}>
                          <button
                            onClick={() =>
                              notificationDeleteHandler(val.taskId)
                            }
                            className="btn ms-auto btn-danger d-flex align-items-center gap-2 justify-content-center"
                          >
                            <ImBin />{" "}
                            <span className="d-none d-md-flex">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>

      <button
        className="btn btn-danger"
        onClick={multiNotificationDeleteHandler}
      >
        Delete Selected
      </button>
    </div>
  );
};

export default Notification;
