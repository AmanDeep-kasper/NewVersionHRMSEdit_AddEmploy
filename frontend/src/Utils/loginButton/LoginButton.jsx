import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { attendanceInfo } from "../../redux/slices/loginSlice";
import toast from "react-hot-toast";
import api from "../../config/api";

const LoginButton = ({ status, styleName, name }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.login);
  const user = useSelector((state) => state.user);

  const loginHandler = async () => {
    try {
      if (status === "login") {
        // Check if clock-in is allowed for this employee
        try {
          const res = await api.get(`/api/attendance/${user.userData._id}/can-clock-in`);
          if (res?.data && res.data.canClockIn === false) {
            toast.error("Your shift has not started yet.");
            return;
          }
        } catch (e) {
          // If the check fails, allow login (fail-open) but log the error
          console.error("can-clock-in check failed:", e);
        }
      }

      dispatch(attendanceInfo({ employeeId: user.userData._id, status: status }));
      toast.success(`${status} marked Successfully`);
    } catch (err) {
      console.error("loginHandler error:", err);
      toast.error("Failed to mark attendance");
    }
  };

  useEffect(() => {
    if (success) {
      toast.success(success); 
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error]);

  return (
    <button
      style={{ textTransform: "capitalize" }}
      className={styleName}
      onClick={loginHandler}
      disabled={loading}
    >
      {loading ? "Processing..." : name}
    </button>
  );
};

export default LoginButton;
