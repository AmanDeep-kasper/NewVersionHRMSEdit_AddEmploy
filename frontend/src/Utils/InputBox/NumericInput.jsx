import React from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const NumericInput = ({
  value,
  onChange,
  maxLength,
  placeholder,
  required,
}) => {
  const handleInputChange = (event) => {
    const { value } = event.target;
    // Allow only numbers and enforce max length
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, maxLength);
    onChange(numericValue);
  };

  const { darkMode } = useTheme();

  return (
    <div className="form-input">
      <input
        className={`form-control ms-0 ms-md-auto rounded-2 ${
          darkMode
            ? "bg-light text-dark border dark-placeholder"
            : "bg-dark text-light border-0 light-placeholder"
        }`}
        type="text"
        value={value}
        onChange={handleInputChange}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default NumericInput;
