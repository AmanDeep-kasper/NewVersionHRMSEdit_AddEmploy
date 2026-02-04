import React, { useEffect, useState, useContext } from "react";
import NoticeBadge from "../../../img/NoticeBadge.svg";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import axios from "axios";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config";
import { TiDeleteOutline } from "react-icons/ti";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api";

const NoticeBoard = () => {
  const location = useLocation();
  const { userData} = useSelector((state)=> state.user);

  const route = location.pathname.split("/")[1];
  const email = userData?.Email;
  const [notice, setNotice] = useState([]);
  const { darkMode } = useTheme();
  const { socket } = useContext(AttendanceContext);
  const id = userData?._id;

  const loadEmployeeData = () => {
    api
      .get(`/api/notice/${id}`, {
      })
      .then((response) => {
         
        setNotice(response.data);
      })
      .catch((error) => {
          console.log(error)
      });
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  useEffect(() => {
      
    if (socket) {
      socket.on("notice", (data) => {
        setNotice((prev) => [data, ...prev]);
      });
      socket.on("noticeDelete", (data) => {
        if (data) {
          loadEmployeeData();
        }
      });
    }
  }, [socket]);

  const pdfHandler = (path) => {
    window.open(`${BASE_URL}/${path}`, "_blank", "noreferrer");
  };

 const deleteHandler = (id, creator) => {
  api
    .post(
      `/api/noticeDelete`,
      { noticeId: id },
    )
    .then((res) => {
      alert("Notice deleted");
    })
    .catch((err) => {
      console.error("Error deleting notice:", err);
    });
};


  return (
    <div className="container box-shadow: 0 4px 10px 0 rgb(137 137 137 / 25%); p-0 h-100">
      <div
        style={{
          backgroundColor: darkMode
            ? "var(--primaryDashMenuColor)"
            : "var(--primaryDashColorDark)",
        }}
        className="rounded-0 shadow-sm border  position-relative"
      >
        <h6
          style={{
            position: "sticky",
            top: "0",
            backgroundColor: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
            color: darkMode
              ? "var(--primaryDashMenuColor)"
              : "var(--primaryDashColorDark)",
          }}
          className="p-2 px-3 d-flex justify-content-between gap-0 text-center"
        >
          Notice Board <span>({notice.length})</span>
        </h6>
        <div className=" py-2" style={{ maxWidth: "100%", overflowX: "auto" }}>
          {notice.filter(
            (val, i, ar) =>
              ar.findIndex((item) => item.noticeId === val.noticeId) === i
          ).length > 0 ? (
            <div style={{
              // maxHeight: "68vh",
              overflow: "auto",
              position: "relative",
            }}
            className="table-responsive p-2 mb-3">  
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="cursor-pointer" style={{ width: "100%" }}>
                    Notice
                  </th>
                  {route === "hr" || route === "admin" ? <th>Action</th> : null}
                </tr>
              </thead>
              <tbody>
                {notice
                  .filter(
                    (val, i, ar) =>
                      ar.findIndex((item) => item.noticeId === val.noticeId) ===
                      i
                  )
                  .map((val) => (
                    <tr key={val._id} style={{ cursor: "pointer" }}>
                      <td onClick={() => pdfHandler(val.attachments)}>
                        {val.notice}
                      </td>
                      {(route === "hr" || route === "manager") &&
                      val.creator === email ? (
                        <td>
                          <TiDeleteOutline
                            onClick={() =>
                              deleteHandler(val._id, val.creator)
                            }
                          />
                        </td>
                      ) : route === "admin" ? (
                        <td>
                          <TiDeleteOutline
                            onClick={() =>
                              deleteHandler(val._id, val.creator)
                            }
                          />
                        </td>
                      ) : (
                        <></>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
            </div>
          ) : (
            <div
              className="d-flex flex-column justify-content-center aline-items-center gap-3"
              style={{ height: "100%", width: "100%" }}
            >
              <img
                style={{ height: "70%", width: "60%" }}
                className="mx-auto"
                src={NoticeBadge}
                alt="Happy Birthday"
              />
              <p
                style={{
                  opacity: "60%",
                  fontSize: "13px",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                }}
                className="text-center w-75 mx-auto "
              >
                Notice not available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
