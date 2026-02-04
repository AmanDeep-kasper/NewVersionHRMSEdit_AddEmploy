import React, { useState } from "react";
import "./PasswordStrengthMeter.css"; // Create this CSS file for styling

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState("");

  const getStrength = (password) => {
    const lengthCondition = password.length >= 6;
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/g;
    const specialCharCount = (password.match(specialChars) || []).length;
    const numberCount = (password.match(/\d/g) || []).length;

    if (password.length < 6) return "Weak";

    if ((lengthCondition && specialCharCount > 2) || numberCount > 2) {
      return "Great";
    }

    if (lengthCondition && (specialCharCount > 0) & (numberCount > 0)) {
      return "Good";
    }

    return "Weak";
  };

  React.useEffect(() => {
    setStrength(getStrength(password));
  }, [password]);

  return (
    <>
      {strength && (
        <div
          className={`strength-meter ${strength.toLowerCase()}`}
          style={{ width: "100%" }}
        >
          <div className="d-flex align-items-center justify-content-between gap-5 w-100 ">
            {" "}
            <div className="d-flex align-items-center">
              <div style={{ width: "50px", height: ".3rem" }} className=" p-1">
                <div
                  className="rounded-4 shadow-sm"
                  style={{
                    height: ".3rem",
                    background:
                      strength === "Weak"
                        ? "#DE4E26"
                        : strength === "Good"
                        ? "#ffee57"
                        : strength === "Great"
                        ? "#2cab1e"
                        : "white",
                  }}
                ></div>
              </div>
              <div style={{ width: "50px", height: ".3rem" }} className=" p-1">
                <div
                  className="rounded-4 shadow-sm"
                  style={{
                    height: ".3rem",
                    background:
                      strength === "Good"
                        ? "#ffee57"
                        : strength === "Great"
                        ? "#2cab1e"
                        : "white",
                  }}
                ></div>
              </div>
              <div style={{ width: "50px", height: ".3rem" }} className=" p-1">
                <div
                  className="rounded-0 shadow-sm"
                  style={{
                    height: ".3rem",
                    background: strength === "Great" ? "#2cab1e" : "white",
                  }}
                ></div>
              </div>{" "}
              <p className="m-0 mx-3">{strength}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordStrengthMeter;
