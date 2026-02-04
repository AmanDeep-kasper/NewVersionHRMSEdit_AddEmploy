import React, { useState, useEffect, useRef } from "react";
import "./forgot.css";
import { useNavigate, Link } from "react-router-dom";
import KASPLOGO from "../../img/MUNCLOGOLARGE.svg";
import { IoArrowBackOutline } from "react-icons/io5";
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
import { toast } from "react-hot-toast";
import api from "../config/api";

const ForgetPass = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState(1);
  const [countDown, setCountDown] = useState(0);
  const [loading, setLoading] = useState(false);

  const otpRequestRef = useRef(false);
  const resetRequestRef = useRef(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [data, setData] = useState({
    email: "",
    userId: "",
    otp: ["", "", "", ""],
    pass: "",
    confirm_pass: "",
  });

  const [formError, setFormError] = useState({
    password: "",
    confirmPassword: "",
  });

  /* ================= 1️⃣ VERIFY EMAIL ================= */
  const verifyEmail = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await api.post(
        "/api/verify_email",
        { email: data.email },
        { withCredentials: true }
      );

      if (!res?.data?.success) throw new Error(res?.data?.message);

      toast.success("Email verified");

      // Save userId for OTP
      setData((prev) => ({ ...prev, userId: res.data.userId }));
      setStage(2);

      // Send OTP
      sendOtp(res.data.userId);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= 2️⃣ SEND OTP ================= */
  const sendOtp = async (userId) => {
    try {
      const res = await api.post(`/api/send_otp/${userId}`, {}, { withCredentials: true });
      if (!res?.data?.success) throw new Error(res?.data?.message);

      toast.success(res.data.message);
      setCountDown(Number(res.data.expiresIn || 60));
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  /* ================= 3️⃣ OTP TIMER ================= */
  useEffect(() => {
    if (stage !== 2 || countDown <= 0) return;

    const timer = setInterval(() => {
      setCountDown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, countDown]);

  /* ================= 4️⃣ VERIFY OTP ================= */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otpRequestRef.current || countDown <= 0) return;

    otpRequestRef.current = true;

    const otpValue = data.otp.join("");
    if (otpValue.length !== 4) {
      otpRequestRef.current = false;
      return toast.error("Invalid OTP");
    }

    try {
      const res = await api.post(
        "/api/verify_otp",
        { userId: data.userId, otp: otpValue },
        { withCredentials: true }
      );

      if (!res?.data?.success) throw new Error(res?.data?.message);

      // Reset session check
      const sessionCheck = await api.get("/api/reset-session-check", { withCredentials: true });
      if (!sessionCheck?.data?.success) {
        setStage(1);
        throw new Error("Reset session expired");
      }

      toast.success("OTP verified");
      setStage(3);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      otpRequestRef.current = false;
    }
  };

  /* ================= 5️⃣ RESET PASSWORD ================= */
  const resetPassword = async (e) => {
    e.preventDefault();
    if (resetRequestRef.current) return;

    resetRequestRef.current = true;

    let passwordError = "";
    let confirmPasswordError = "";

    if (data.pass.length < 8) passwordError = "Minimum 8 characters required";
    else if (!/\d/.test(data.pass)) passwordError = "Must contain a number";
    else if (!/[!@#$%^&*]/.test(data.pass)) passwordError = "Must contain a special character";

    if (data.pass !== data.confirm_pass) confirmPasswordError = "Passwords do not match";

    setFormError({ password: passwordError, confirmPassword: confirmPasswordError });
    if (passwordError || confirmPasswordError) {
      resetRequestRef.current = false;
      return;
    }

    try {
      const res = await api.post(
        "/api/forgot_pass",
        { pass: data.pass, confirm_pass: data.confirm_pass },
        { withCredentials: true }
      );

      if (!res?.data?.success) throw new Error(res?.data?.message);

      toast.success("Password updated successfully");

      setStage(1);
      setData({ email: "", userId: "", otp: ["", "", "", ""], pass: "", confirm_pass: "" });
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      resetRequestRef.current = false;
    }
  };

  /* ================= OTP INPUT HANDLERS ================= */
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    setData((prev) => {
      const otp = [...prev.otp];
      otp[index] = value;
      return { ...prev, otp };
    });

    if (value && index < 3) document.getElementById(`otp-input-${index + 1}`)?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !data.otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  /* ================= UI ================= */
  return (
  <div className="forgot-wrapper">
    <div className="forgot-card">
      <div className="text-center mb-4">
        <img src={KASPLOGO} alt="logo" className="logo" />
      </div>

      {/* ========= STAGE 1 ========= */}
      {stage === 1 && (
        <form onSubmit={verifyEmail}>
          <label className="form-label">Registered Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            required
            value={data.email}
            onChange={(e) =>
              setData((p) => ({ ...p, email: e.target.value }))
            }
          />

          <button
            className="btn btn-primary w-100 mt-4"
            disabled={loading}
          >
            {loading ? "Processing..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* ========= STAGE 2 ========= */}
      {stage === 2 && (
        <form onSubmit={handleOtpSubmit}>
          <p className="text-center mb-2">
            OTP expires in <b>{countDown}s</b>
          </p>

          <div className="otp-box">
            {data.otp.map((d, i) => (
              <input
                key={i}
                id={`otp-input-${i}`}
                maxLength={1}
                value={d}
                disabled={countDown <= 0}
                onChange={(e) => handleOtpChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            ))}
          </div>

          <button
            className="btn btn-primary w-100 mt-3"
            disabled={countDown <= 0}
          >
            Verify OTP
          </button>

          {countDown <= 0 && (
            <button
              type="button"
              className="btn btn-outline-secondary w-100 mt-2"
              onClick={() => sendOtp(data.userId)}
            >
              Resend OTP
            </button>
          )}
        </form>
      )}

      {/* ========= STAGE 3 ========= */}
      {stage === 3 && (
        <form onSubmit={resetPassword}>
          <label className="form-label">New Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="New password"
              value={data.pass}
              onChange={(e) =>
                setData((p) => ({ ...p, pass: e.target.value }))
              }
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <RxEyeOpen /> : <GoEyeClosed />}
            </span>
          </div>
          {formError.password && (
            <small className="text-danger">{formError.password}</small>
          )}

          <label className="form-label mt-3">Confirm Password</label>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              placeholder="Confirm password"
              value={data.confirm_pass}
              onChange={(e) =>
                setData((p) => ({ ...p, confirm_pass: e.target.value }))
              }
            />
            <span onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }>
              {showConfirmPassword ? <RxEyeOpen /> : <GoEyeClosed />}
            </span>
          </div>

          {formError.confirmPassword && (
            <small className="text-danger">
              {formError.confirmPassword}
            </small>
          )}

          <button className="btn btn-primary w-100 mt-4">
            Reset Password
          </button>
        </form>
      )}

      <Link to="/" className="back-link">
        <IoArrowBackOutline /> Back to Login
      </Link>
    </div>
  </div>
);

};

export default ForgetPass;