import React, { useEffect, useState, useMemo } from "react";
import Moment from "moment";
import toast from "react-hot-toast";
import { FaComputerMouse } from "react-icons/fa6";
import { PiCoffeeFill } from "react-icons/pi";
import { IoPlay, IoStop } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { attendanceInfo } from "../../redux/slices/loginSlice";
import { useApiRefresh } from "../../Context/ApiRefreshContext/ApiRefreshContext";
import useIsMobileOrTablet from "../../hooks/hooks/useIsMobileOrTablet";
import api from "../config/api";
import Cookies from "js-cookie";

function TakeBreakLogs({ data, treatOnLeaveAsWorkable = true }) {
  /* -------------------- LOCAL STATE -------------------- */
  const [todayData, setTodayData] = useState(null);
  const [breakTimer, setBreakTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [allowMobileLogin, setAllowMobileLogin] = useState(false);

  /* -------------------- REDUX ------------------------- */
  const { userData } = useSelector((state) => state.user);
  const { loading, success, error } = useSelector((state) => state.login);
  const id = userData?._id;
  const dispatch = useDispatch();
  const { setRefresh } = useApiRefresh();

  /* -------------------- FETCHERS ---------------------- */
  const fetchMobileLoginStatus = async () => {
    if (!id) return;
    try {
      const { data } = await api.get(`/api/employee/${id}/mobile-login-status`);
      setAllowMobileLogin(data.allowMobileLogin);
    } catch (err) {
      console.error("Mobile login flag error:", err);
    }
  };

  const loadDashboardLogData = async () => {
    if (!id) return;
    try {
      const { data } = await api.get(`/api/dashboard-log-button/${id}`);
      setTodayData(data);
    } catch (err) {
      console.error("Dashboard log fetch failed:", err);
    }
  };

  /* -------------------- EFFECTS ----------------------- */
  useEffect(() => {
    loadDashboardLogData();
    fetchMobileLoginStatus();

    const storedBreakStart = Cookies.get("breakStartTime");
    if (storedBreakStart) {
      const elapsedSeconds = Math.floor(
        (Date.now() - Number(storedBreakStart)) / 1000
      );
      startTimer(elapsedSeconds);
    }
  }, [data, id]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, [success, error]);

  /* -------------------- STATUS ------------------------ */
  const rawStatus = todayData?.today?.status || "";
  const isMobileOrTablet = useIsMobileOrTablet();
  const isRestricted = isMobileOrTablet && allowMobileLogin !== "Allowed";

  const effectiveStatus = useMemo(() => {
    if (!treatOnLeaveAsWorkable) return rawStatus;
    if (rawStatus === "LV" || rawStatus === "HD") return "logout";
    return rawStatus;
  }, [rawStatus, treatOnLeaveAsWorkable]);

  const actionDisabled = loading || isRestricted;

  /* -------------------- API POST ---------------------- */
  const postAttendanceAction = async (attendanceID, payload) => {
    return api.post(`/api/attendance/${attendanceID}`, payload);
  };

  /* -------------------- ACTION HANDLER ---------------- */
  const handleAction = async (action) => {
    if (isRestricted) {
      toast.error("Mobile login is not allowed on this device.");
      return;
    }

    const attendanceID = todayData?.attendanceID;
    if (!attendanceID) {
      toast.error("No attendance record found.");
      return;
    }

    const currentTime = Moment().format("HH:mm:ss");
    const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);

    const statusMapping = {
      break: {
        status: "break",
        breakTime: [currentTime],
        breakTimeMs: [currentTimeMs],
      },
      resume: {
        status: "login",
        ResumeTime: [currentTime],
        resumeTimeMS: [currentTimeMs],
      },
    };

    try {
      await postAttendanceAction(attendanceID, {
        employeeId: id,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        ...statusMapping[action],
      });

      if (action === "break") {
        Cookies.set("breakStartTime", Date.now().toString(), { expires: 1 });
        startTimer();
      }

      if (action === "resume") {
        stopTimer();
        Cookies.remove("breakStartTime");
      }

      await loadDashboardLogData();
      setRefresh((p) => !p);
      toast.success(`${action} recorded`);
    } catch (err) {
      console.error(action, err);
      toast.error(`Failed to ${action}`);
    }
  };

  /* -------------------- LOGIN / LOGOUT ---------------- */
  const loginHandler = async (status) => {
    if (isRestricted) {
      toast.error("Mobile login is not allowed.");
      return;
    }
    try {
      await dispatch(attendanceInfo({ employeeId: id, status }));
      await loadDashboardLogData();
      setRefresh((p) => !p);
      toast.success(`${status} marked`);
    } catch {
      toast.error("Action failed");
    }
  };

  /* -------------------- TIMER ------------------------- */
  const startTimer = (initial = 0) => {
    setBreakTimer(initial);
    const id = setInterval(() => setBreakTimer((t) => t + 1), 1000);
    setIntervalId((old) => {
      if (old) clearInterval(old);
      return id;
    });
  };

  const stopTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setBreakTimer(0);
    setIntervalId(null);
  };

  const formatTime = (s) =>
    [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");

  /* -------------------- RENDER ------------------------ */
  return (
    <div className="row gap-2">
      {isRestricted ? (
        <div className="bg-warning text-center py-2 rounded">
          Mobile login is not allowed
        </div>
      ) : (
        <>
          {effectiveStatus === "login" && (
            <div className="d-flex gap-2 w-100">
              <button
                style={{ whiteSpace: "pre" }}
                className="btn btn-warning w-100"
                onClick={() => handleAction("break")}
              >
                <PiCoffeeFill /> Break
              </button>
              <button
                style={{ whiteSpace: "pre" }}
                className="btn btn-danger w-100"
                onClick={() => loginHandler("logout")}
              >
                <IoStop /> Logout
              </button>
            </div>
          )}

          {["logout", "WO", ""].includes(effectiveStatus) && (
            <button
              style={{ whiteSpace: "pre" }}
              className="btn  btn-success w-100"
              onClick={() => loginHandler("login")}
            >
              <IoPlay /> Login
            </button>
          )}

          {effectiveStatus === "break" && (
            <button
              style={{ whiteSpace: "pre" }}
              className="btn  text-center btn-dark w-100"
              onClick={() => handleAction("resume")}
            >
              <FaComputerMouse /> Resume ({formatTime(breakTimer)})
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default TakeBreakLogs;
