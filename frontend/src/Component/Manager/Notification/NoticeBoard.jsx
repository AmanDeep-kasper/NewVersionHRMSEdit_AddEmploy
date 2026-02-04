import React, { useEffect, useState, useContext } from 'react'
import NoticeBadge from '../../../img/NoticeBadge.svg'
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import axios from 'axios';
import BASE_URL from '../../../Pages/config/config';
import { useSelector } from 'react-redux';
import api from '../../../Pages/config/api';
const NoticeBoard = () => {
  const [notice, setNotice] = useState([]);
  const { socket } = useContext(AttendanceContext);
  const { userData} = useSelector((state)=> state.user);

  const id = userData?._id;
  const loadEmployeeData = () => {
    api
      .get(`/api/particularEmployee/${id}`, {
        
      })
      .then((response) => {

          
        setNotice(response.data.Notice)

      })
      .catch((error) => {
          
      });
  };
  useEffect(() => {
    loadEmployeeData()
  }, []);
  useEffect(() => {
      
    if (socket) {
      socket.on("notice", (data) => {
        setNotice((prev) => [data, ...prev])
      });
      socket.on("noticeDelete", (data) => {
        if (data) {
          loadEmployeeData()
        }
      })
    }
  }, [socket]);
  const pdfHandler = (val) => {
      
    window.open(
      `${BASE_URL}/${val.attachments}`,
      "_blank",
      "noreferrer"
    );
    // window.open(path, "_blank")
  }

  return (
    <div className="container box-shadow: 0 4px 10px 0 rgb(137 137 137 / 25%); p-0 h-100">
      <div className="birthday shadow position-relative">
        <h5 style={{ position: "sticky", top: '0', backgroundColor: "var(--primaryDashColorDark)", color: "var(--primaryDashMenuColor)" }} className="fw-bolder pb-3 px-3 pt-3 d-flex justify-content-between gap-0 text-center">
          Notice Board{" "}
          <span className="text-primary">
            ({notice.length})
          </span>
        </h5>
        <div
          className="mainbirth"
          style={{ maxWidth: "100%", overflowX: "auto" }}
        >
          {notice.filter((val, i, ar) => ar.findIndex(item => item.noticeId === val.noticeId) === i).length > 0 ? (
             <div style={{
              // maxHeight: "68vh",
              overflow: "auto",
              position: "relative",
            }}
            className="table-responsive p-2 mb-3">  
           <table className="table table-striped mt-3">
              <thead>
                <tr>

                  <th className='cursor-pointer' style={{ width: "100%" }}>Notice</th>

                </tr>
              </thead>
              <tbody>
                {notice.filter((val, i, ar) => ar.findIndex(item => item.noticeId === val.noticeId) === i).map((val) => (
                  <tr key={val.noticeId} style={{ cursor: "pointer" }} >

                    <td onClick={() => pdfHandler(val)}>{`${val.notice}`}</td>

                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <div className="d-flex flex-column justify-content-center aline-items-center gap-3" style={{ height: '100%', width: '100%' }}><img style={{ height: '70%', width: '60%' }} className="mx-auto" src={NoticeBadge} alt="Happy Birthday" />
              <p style={{ opacity: '60%', fontSize: '13px' }} className="text-center w-75 mx-auto  fw-bold text-muted ">Notice Not Assigned</p></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NoticeBoard
