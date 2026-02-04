import { useEffect, useState, useContext } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import NoticeBadge from "../../../img/NoticeBadge.svg";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api";
const NoticeBoard = () => {
  const [notice, setNotice] = useState([]);
  const { userData} = useSelector((state)=> state.user);
  const { socket } = useContext(AttendanceContext);
  const id = userData?._id;
  const loadEmployeeData = () => {
    api
      .get(`/api/particularEmployee/${id}`, {
      })
      .then((response) => {
        setNotice(response.data.Notice);
      })
      .catch((error) => {
      });
  };
  useEffect(() => {
    loadEmployeeData();
  }, []);



  const pdfHandler = async (path) => {
  try {
    // const token = localStorage.getItem("token") || "";
    const response = await api.get(`/${path}`, {
      responseType: "blob",
      headers: {
        authorization: token,
      },
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    window.open(fileURL, "_blank");
  } catch (error) {
    console.error("Error opening PDF:", error);
  }
};




 const deleteHandler = (id) => {
  api
    .post(
      `/api/noticeDelete`,
      { noticeId: id },
     
    )
    .then((res) => {
      alert("Notice deleted");
    })
    .catch((err) => {
      console.log(err);
    });
};



  return (
    <div className="container box-shadow: 0 4px 10px 0 rgb(137 137 137 / 25%); p-0 h-100 ">
      <div className="birthday">
        <h5
          style={{
            position: "sticky",
            top: "0",
            backgroundColor: "var(--primaryDashColorDark)",
            color: "var(--primaryDashMenuColor)",
          }}
          className="fw-bolder pb-3 px-3 pt-3 d-flex justify-content-between gap-0 text-center"
        >
          Notice Board{" "}
          {notice && <span className="text-primary">({notice.length})</span>}
        </h5>
        <div
          className="mainbirth"
          style={{ maxWidth: "100%", overflowX: "auto" }}
        >
          {notice && notice.length > 0 ? (
              <div style={{
                // maxHeight: "68vh",
                overflow: "auto",
                position: "relative",
              }}
              className="table-responsive p-2 mb-3">  
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th className="cursor-pointer" style={{ width: "80%" }}>
                    Notice
                  </th>
                  <th style={{ width: "80%" }}>Action</th>
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
                    <tr key={val.noticeId} style={{ cursor: "pointer" }}>
                      <td
                        onClick={() => pdfHandler(val.attachments)}
                      >{`${val.notice}`}</td>
                      <td
                        style={{
                          fontSize: "22px",
                          color: "red",
                          textAlign: "center",
                        }}
                      >
                        <TiDeleteOutline
                          onClick={() => deleteHandler(val.noticeId)}
                        />
                      </td>
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
                style={{ opacity: "60%", fontSize: "13px" }}
                className="text-center w-75 mx-auto  fw-bold text-muted "
              >
                Notice Not Assigned
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
