import React, { useState, useEffect } from "react";
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../../img/AuthPage/LoginPage.jpeg";
import KASPLOGO from "../../img/munclogotm.svg";
import toast from "react-hot-toast";
import OnboardLoader from "../../Utils/OnboardLoader/OnboardLoader.jsx";
import api from "../config/api";

const Login = () => {
  const [seePass, setSeePass] = useState(false);
  const [onboardLoading, setOnboardLoading] = useState(true);

  const navigate = useNavigate();

  // Splash screen
  useEffect(() => {
    const timer = setTimeout(() => setOnboardLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Redirect based on user role
  const redirectByRole = (role) => {
    switch (role) {
      case 1:
        navigate("/admin/dashboard", { replace: true });
        break;
      case 2:
        navigate("/hr/dashboard", { replace: true });
        break;
      case 3:
        navigate("/employee/dashboard", { replace: true });
        break;
      case 4:
        navigate("/manager/dashboard", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    const bodyLogin = {
      email: event.target.email.value.trim().toLowerCase(),
      password: event.target.password.value,
    };

    try {
      const res = await api.post("/api/login", bodyLogin);

      if (res.data?.user) {
        toast.success("Login Successful!");
        redirectByRole(res.data.user.Account);
      } else {
        toast.error("Login failed!");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid login credentials"
      );
    }

    event.target.password.value = "";
  };

  return (
    <>
      {onboardLoading ? (
        <OnboardLoader />
      ) : (
        <div className="d-flex flex-column min-vh-100 bg-light">
          <div className="row flex-grow-1 g-0">
            {/* Left Side - Login Form */}
            <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center bg-white">
              <div className="p-4 p-md-5" style={{ maxWidth: "450px", width: "100%" }}>
                <div className="text-center mb-5">
                  <img
                    src={KASPLOGO}
                    alt="Company Logo"
                    className="img-fluid"
                    style={{ maxHeight: "80px" }}
                  />
                </div>

                <h3 className="text-center mb-4 fw-bold">Welcome Back</h3>
                <p className="text-center text-muted mb-4">
                  Sign in to continue to your dashboard
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Email / Phone / ID */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-medium">
                      Email / Phone / Employee ID
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email or ID"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4 position-relative">
                    <label htmlFor="password" className="form-label fw-medium">
                      Password
                    </label>
                    <input
                      type={seePass ? "text" : "password"}
                      name="password"
                      id="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      required
                    />
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y pe-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSeePass(!seePass)}
                    >
                      {seePass ? <GoEyeClosed size={20} /> : <RxEyeOpen size={20} />}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3"
                  >
                    Sign In
                  </button>

                  {/* Forgot Password */}
                  <div className="text-center">
                    <Link to="/forgetPassword" className="text-primary text-decoration-none">
                      Forgot your password?
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side - Image (hidden on mobile) */}
            <div
              className="col-lg-7 d-none d-lg-flex align-items-center justify-content-center"
              style={{
                backgroundImage: `url(${LoginImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Optional: Add overlay or content here if needed */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;