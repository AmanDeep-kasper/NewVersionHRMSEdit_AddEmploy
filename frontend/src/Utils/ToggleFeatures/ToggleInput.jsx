import React, { useState } from "react";
import { formatIndianCurrency } from "../CurrencySymbol/formatIndianCurrency";

const ToggleInput = ({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  isReadOnly = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(inputValue);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <label className="d-flex flex-column gap-1">
      {isEditing && !isReadOnly ? (
        <input
          type={type}
          className={`form-control ${className}`}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          style={{
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
          }}
        />
      ) : (
        <div>
          {typeof inputValue === "number" ? (
            <span style={{ whiteSpace: "pre" }} onClick={handleClick}>
              {formatIndianCurrency(inputValue)}
            </span>
          ) : (
            <span style={{ whiteSpace: "pre" }}>{inputValue}</span>
          )}
        </div>
      )}
    </label>
  );
};

export default ToggleInput;
