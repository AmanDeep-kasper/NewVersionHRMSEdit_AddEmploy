import React, { useEffect, useState } from "react";
import { MdCoffee } from "react-icons/md";
import { RiLoginCircleFill, RiLogoutCircleFill } from "react-icons/ri";
import { BsFillBriefcaseFill } from "react-icons/bs";
import BASE_URL from "../../config/config";
import axios from "axios";
import { useSelector } from "react-redux";
import api from "../../config/api";

const MyTodaysLoginData = (props) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [empName, setEmpName] = useState(null);
  const { userData} = useSelector((state)=> state.user);
  const employeeId = userData?._id;

  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await api.get(
          `/api/personal-info/` + props.data["_id"],
        );
          
        setEmpName(response.data.FirstName);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadPersonalInfoData();
  }, []);

   useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // ✅ Use api.get — it automatically includes cookies
        const response = await api.get(`/api/employee/${employeeId}/today-attendance`);

        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    if (employeeId) {
      fetchAttendanceData();
    }
  }, [employeeId]);


  if (!attendanceData) {
    return <div>Loading...</div>; // or any other loading indicator
  }

  return (
    <div className="row justify-content-between row-gap-3 container-fluid my-3 mx-auto">
      <div
        className="col-6 col-lg-3  row bg-primary rounded-2 py-2"
        style={{ height: "5rem" }}
      >
        <div className="col-md-8 col-12">
          <span className="fs-5 text-white">Login </span>
          <p className="text-white fs-5 m-0">{attendanceData.loginTime}</p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center text-white fs-1">
          <RiLoginCircleFill />
        </div>
      </div>
      <div
        className="col-6 col-lg-3 row bg-secondary rounded-2 py-2"
        style={{ height: "5rem" }}
      >
        <div className="col-md-8 col-12">
          <span className="fs-5 text-white">Total Break</span>
          <p className="text-white fs-5 m-0">{attendanceData.totalBrake}</p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center text-white fs-1">
          <MdCoffee />
        </div>
      </div>
      <div
        className="col-6 col-lg-3 row bg-success rounded-2 py-2"
        style={{ height: "5rem" }}
      >
        <div className="col-md-8 col-12">
          <span className="fs-5 text-white">Total Login</span>
          <p className="text-white fs-5 m-0">{attendanceData.totalLoginTime}</p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center text-white fs-1">
          <BsFillBriefcaseFill />
        </div>
      </div>
      <div
        className="col-6 col-lg-3 row bg-info rounded-2 py-2"
        style={{ height: "5rem" }}
      >
        <div className="col-md-8 col-12">
          <span className="fs-5 text-white">Logout</span>
          <p className="text-white fs-5 m-0">{attendanceData.logoutTime}</p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center text-white fs-1">
          <RiLogoutCircleFill />
        </div>
      </div>
    </div>
  );
};

export default MyTodaysLoginData;
