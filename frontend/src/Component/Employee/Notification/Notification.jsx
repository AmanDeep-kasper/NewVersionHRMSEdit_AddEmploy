import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ImBin } from "react-icons/im";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import "./notification.css";
import BASE_URL from "../../../Pages/config/config.js";
import { useSelector } from "react-redux";
import { useTheme } from "../../../Context/TheamContext/ThemeContext.js";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle.js";
import api from "../../../Pages/config/api.js";

const Notification = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState([]);
  const [notification, setNotification] = useState(null);
  const { socket } = useContext(AttendanceContext);
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();
  const id = userData?._id;
  const email = userData?.Email;

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
      notification &&
        notification.length > 0 &&
        selectedNotification.length === notification.length
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

  console.log(notification);

  return (
    <>
      <div className="container-fluid row">
        <form className="d-flex col-8 flex-column gap-3 w-100">
          <div>
            <div className="p-2 d-flex align-items-center gap-3">
              {" "}
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
                    <th style={rowHeadStyle(darkMode)}>task Name</th>
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
                        <td style={rowBodyStyle(darkMode)}>
                          {val?.messageBy || ""}{" "}
                          <span className="text-lowercase">
                            ( {val.senderMail || val.hrEmail} )
                          </span>
                        </td>
                        {val.status === "unseen" ? (
                          <td style={rowBodyStyle(darkMode)}>Unread</td>
                        ) : (
                          <td style={rowBodyStyle(darkMode)}>read</td>
                        )}
                        <td className="" style={rowBodyStyle(darkMode)}>
                          <button
                            onClick={() =>
                              notificationDeleteHandler(val.taskId)
                            }
                            className="d-flex ms-auto btn btn-danger py-1 align-items-center gap-3"
                          >
                            <ImBin />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
        {selectedNotification.length > 0 && (
          <button
            className="btn ml-3 btn-danger "
            style={{ width: "fit-content" }}
            onClick={multiNotificationDeleteHandler}
          >
            Delete Selected
          </button>
        )}
      </div>
    </>
  );
};

export default Notification;
