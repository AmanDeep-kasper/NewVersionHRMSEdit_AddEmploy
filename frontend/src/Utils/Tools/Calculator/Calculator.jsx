import React, { useState, useEffect } from "react";
import "./Calculator.css";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { MdHistory } from "react-icons/md";
import { IoClose, IoReturnDownBack } from "react-icons/io5";
import { IoIosBackspace } from "react-icons/io";
import { useShowHide } from "../../../Context/ShowHideContext/ShowHideContext";
import { TbSwitchHorizontal } from "react-icons/tb";
import Cookies from "js-cookie";
const Calculator = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [historySlide, setHistorySlide] = useState(false);
  const { darkMode } = useTheme();
  const { isVisible, toggleVisibility } = useShowHide();

  // State for drag functionality
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [CalculatorType, setCalculatorType] = useState("1");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [timeResult, setTimeResult] = useState("");
  const [temperatureInput, setTemperatureInput] = useState("");
  const [temperatureResult, setTemperatureResult] = useState("");
  const [currencyInput, setCurrencyInput] = useState("");
  const [currencyResult, setCurrencyResult] = useState("");
  const [addDayChecked, isAddDayChecked] = useState(false);
  const [unitInput, setUnitInput] = useState("");
  const [unitResult, setUnitResult] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [conversionMode, setConversionMode] = useState("CtoF");

  // Example currency rates (hardcoded for now)
  const exchangeRates = {
    USD_TO_INR: 83,
    INR_TO_USD: 0.012,
    EUR_TO_INR: 90,
  };

useEffect(() => {
  // ✅ Get history from cookies
  const storedHistory = Cookies.get("calculatorHistory")
    ? JSON.parse(Cookies.get("calculatorHistory"))
    : [];

  setHistory(storedHistory);

  const handleKeyDown = (event) => {
    if (!isInputFocused) return;

    const { key } = event;
    if (!isNaN(key) || ["/", "*", "-", "+", ".", "%"].includes(key)) {
      handleInput(key);
    } else if (key === "Enter") {
      event.preventDefault();
      calculateResult();
    } else if (key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
    } else if (key === "Escape") {
      clearInput();
    }
  };

  // ✅ Add and clean up keydown event listener
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [isInputFocused]);

  const handleInput = (value) => {
    setInput((prev) => (prev === "0" ? value : prev + value));
  };

  const clearInput = () => {
    setInput("0");
  };

const calculateResult = () => {
  try {
    const normalizedInput = input.replace(/\b0+(\d)/g, "$1");

    if (/^[\/*+\-.]/.test(normalizedInput)) {
      alert("Invalid calculation!");
      setInput("0");
      return;
    }

    const result = eval(normalizedInput);
    const newEntry = `${normalizedInput} = ${result}`;
    const updatedHistory = [newEntry, ...history.slice(0, 4)];

    setInput(result.toString());
    setHistory(updatedHistory);

    // ✅ Save history to cookies instead of localStorage
    Cookies.set("calculatorHistory", JSON.stringify(updatedHistory), { expires: 7 }); 
    // expires: 7 means cookie lasts 7 days
  } catch (error) {
    alert("Invalid calculation!");
    setInput("0");
  }
};

  // Handle drag start
  const handleDragStart = (e) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  // Date & Time Calculator Functions
  const calculateDateDifference = () => {
    if (date1 && date2) {
      const diffTime = Math.abs(new Date(date2) - new Date(date1));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTimeResult(`${diffDays} days`);
    } else {
      setTimeResult("Invalid dates");
    }
  };

  const addDaysToDate = () => {
    if (date1 && input) {
      const newDate = new Date(date1);
      newDate.setDate(newDate.getDate() + parseInt(input, 10));
      setTimeResult(newDate.toDateString());
    } else {
      setTimeResult("Invalid input");
    }
  };

  const convertUnitDynamic = (from, to) => {
    const value = parseFloat(unitInput);
    if (isNaN(value)) {
      setUnitResult("Invalid input");
      return;
    }

    // Conversion rates relative to 1 meter
    const conversionRates = {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      millimeter: 1000,
      micrometer: 1e6,
      nanometer: 1e9,
      mile: 0.000621371,
      yard: 1.09361,
      foot: 3.28084,
      inch: 39.3701,
      nauticalmile: 0.000539957,
    };

    if (!conversionRates[from] || !conversionRates[to]) {
      setUnitResult("Invalid units selected");
      return;
    }

    // Convert to base unit (meter) and then to target unit
    const result = (value / conversionRates[from]) * conversionRates[to];
    setUnitResult(result.toFixed(2) + " " + to);
  };

  // Temperature Converter Functions
  const convertTemperature = (mode) => {
    if (!temperatureInput) {
      alert("Please enter a valid temperature.");
      return;
    }

    const input = parseFloat(temperatureInput);
    let result;

    if (mode === "CtoF") {
      result = (input * 9) / 5 + 32;
    } else if (mode === "FtoC") {
      result = ((input - 32) * 5) / 9;
    }

    setTemperatureResult(result.toFixed(0));
  };

  // Currency Converter Functions
  const convertCurrency = (from, to) => {
    const value = parseFloat(currencyInput);
    if (isNaN(value)) {
      setCurrencyResult("Invalid input");
      return;
    }
    const rate = exchangeRates[`${from}_TO_${to}`];
    setCurrencyResult(value * rate + " " + to);
  };

  return (
    <>
      {isVisible && (
        <div
          className="shadow d-flex flex-column rounded-2 gap-3"
          style={{
            width: "18rem",
            margin: "auto",
            padding: "15px 10px",
            color: !darkMode ? "white" : "black",
            background: !darkMode ? "#28282B" : "#EDEADE",
            overflow: "hidden",
            position: "absolute",
            top: `${position.y}px`,
            left: `${position.x}px`,
            cursor: dragging ? "grabbing" : "grab",
            zIndex: "100000",
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div
            style={{
              height: "95%",
              width: "95%",
              position: "absolute",
              right: !historySlide ? "-100%" : "2.5%",
              top: "2.5%",
              color: darkMode ? "#28282B" : "#EDEADE",
              background: !darkMode ? "#28282B" : "#EDEADE",
            }}
            className="rounded-2 p-3"
          >
            <div className="d-flex align-items-center justify-content-between gap-2">
              <span
                onClick={() => setHistorySlide(false)}
                style={{
                  height: "2.5rem",
                  width: "2.5rem",
                  cursor: "pointer",
                  color: darkMode ? "#28282B" : "#EDEADE",
                }}
                className="d-flex align-items-center justify-content-center"
              >
                <IoReturnDownBack className="fs-3" />
              </span>
              <h5>History</h5>
            </div>
            <hr />
            <div className="">
              <p style={{ opacity: "60%" }} className="fw-normal my-2">
                Last 5 Entries:
              </p>
              <div className="py-1 rounded-2">
                <ul className="d-flex flex-column gap-4">
                  {history.map((entry, index) => {
                    const [expression, result] = entry.split(" = ");
                    return (
                      <li key={index}>
                        {expression} ={" "}
                        <span style={{ color: "green" }}>{result}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column">
            <h5
              style={{ color: darkMode ? "#28282B" : "#EDEADE" }}
              className="my-auto"
            >
              Calculator
            </h5>
            <div className="d-flex align-items-center justify-content-between">
              <select
                onChange={(e) => setCalculatorType(e.target.value)}
                style={{ width: "fit-content", outline: "none" }}
                className="form-select my-2 py-1"
                name=""
                id=""
              >
                <option value="1">Standard</option>
                <option value="2">Date</option>
                <option value="3">Unit</option>
                <option value="4">Temperature </option>
                {/* <option value="5">Currency</option> */}
              </select>
              <div className="d-flex align-items-center gap-2">
                <span
                  onClick={() => setHistorySlide(true)}
                  style={{
                    height: "2.5rem",
                    width: "2.5rem",
                    cursor: "pointer",
                    color: darkMode ? "#28282B" : "#EDEADE",
                  }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <MdHistory className="fs-3" />
                </span>
                <span
                  onClick={toggleVisibility}
                  style={{
                    height: "2.5rem",
                    width: "2.5rem",
                    cursor: "pointer",
                    color: darkMode ? "#28282B" : "#EDEADE",
                  }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <IoClose className="fs-3" />
                </span>
              </div>
            </div>
          </div>
          {CalculatorType === "1" && (
            <>
              <input
                type="text"
                className="form-control py-4 px-2"
                value={input}
                readOnly
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                style={{
                  width: "100%",
                  border: "1px solid rgba(0,0,0,.2)",
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  textAlign: "right",
                  background: darkMode ? "white" : "rgba(0,0,0,.5)",
                  color: !darkMode ? "white" : "rgba(0,0,0,.8)",
                }}
              />
              {[
                ["7", "8", "9", "/"],
                ["4", "5", "6", "*"],
                ["1", "2", "3", "-"],
                ["0", ".", "=", "+"],
                ["AC", "%", "Back"],
              ].map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="d-flex align-items-center justify-content-between"
                >
                  {row.map((item) => (
                    <button
                      key={item}
                      onClick={
                        item === "="
                          ? calculateResult
                          : item === "Back"
                          ? () => setInput((prev) => prev.slice(0, -1))
                          : item === "%"
                          ? () =>
                              setInput((prev) =>
                                prev ? `${eval(prev) / 100}` : ""
                              )
                          : item === "AC"
                          ? clearInput
                          : () => handleInput(item)
                      }
                      style={{
                        height: "3rem",
                        width: item === "AC" ? "7.5rem" : "3rem",
                        fontWeight: "400",
                        background:
                          item === "AC"
                            ? "red"
                            : darkMode
                            ? "white"
                            : "rgba(0,0,0,.5)",
                        color:
                          item === "AC"
                            ? "white"
                            : darkMode
                            ? "rgba(0,0,0,.5)"
                            : "white",
                        fontSize: "1.6rem",
                        border: "none",
                        cursor: "pointer",
                      }}
                      className="rounded-3 shadow-sm"
                    >
                      {item === "Back" ? <IoIosBackspace /> : item}
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}
          {/* Date & Time Calculator */}
          {CalculatorType === "2" && (
            <div className="d-flex flex-column gap-2">
              <div
                style={{ width: "fit-content" }}
                className="d-flex align-items-center gap-2 bg-light p-1 px-2 rounded-2 text-muted"
              >
                <input
                  checked={addDayChecked}
                  onChange={() => isAddDayChecked((prev) => !prev)}
                  type="checkbox"
                  name=""
                  id=""
                />{" "}
                <span>view as day</span>
              </div>
              <input
                className="form-control"
                type="date"
                onChange={(e) => setDate1(e.target.value)}
              />
              {!addDayChecked && (
                <>
                  <input
                    className="form-control"
                    type="date"
                    onChange={(e) => setDate2(e.target.value)}
                  />
                  <button
                    className="btn btn-primary w-100"
                    onClick={calculateDateDifference}
                  >
                    Calculate Difference
                  </button>
                </>
              )}

              {addDayChecked && (
                <div className="d-flex flex-column gap-3">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Add days"
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={addDaysToDate}>
                    Add Days
                  </button>
                </div>
              )}

              <h6 className="badge-primary p-2">Result: {timeResult}</h6>
            </div>
          )}
          {/* Unit Converter */}
          {CalculatorType === "3" && (
            <div className="d-flex flex-column gap-2">
              <input
                type="number"
                className="form-control"
                placeholder="Enter value"
                onChange={(e) => setUnitInput(e.target.value)}
              />

              <select
                className="form-select"
                onChange={(e) => setFromUnit(e.target.value)}
              >
                <option value="">Select From Unit</option>
                <option value="kilometer">Kilometre</option>
                <option value="meter">Metre</option>
                <option value="centimeter">Centimetre</option>
                <option value="millimeter">Millimetre</option>
                <option value="micrometer">Micrometre</option>
                <option value="nanometer">Nanometre</option>
                <option value="mile">Mile</option>
                <option value="yard">Yard</option>
                <option value="foot">Foot</option>
                <option value="inch">Inch</option>
                <option value="nauticalmile">Nautical Mile</option>
              </select>

              <select
                className="form-select"
                onChange={(e) => setToUnit(e.target.value)}
              >
                <option value="">Select To Unit</option>
                <option value="kilometer">Kilometre</option>
                <option value="meter">Metre</option>
                <option value="centimeter">Centimetre</option>
                <option value="millimeter">Millimetre</option>
                <option value="micrometer">Micrometre</option>
                <option value="nanometer">Nanometre</option>
                <option value="mile">Mile</option>
                <option value="yard">Yard</option>
                <option value="foot">Foot</option>
                <option value="inch">Inch</option>
                <option value="nauticalmile">Nautical Mile</option>
              </select>

              <button
                className="btn btn-primary"
                onClick={() => convertUnitDynamic(fromUnit, toUnit)}
              >
                Convert
              </button>

              <h6 className="badge-primary p-2">Result: {unitResult}</h6>
            </div>
          )}
          {/* Temperature Converter */}
          {CalculatorType === "4" && (
            <div>
              <input
                className="form-control mb-3"
                type="number"
                placeholder="Enter temperature"
                value={temperatureInput}
                onChange={(e) => setTemperatureInput(e.target.value)}
              />

              <div className="d-flex align-items-center gap-3 justify-content-between">
                <span className="bg-light  py-2 border px-4 fw-bold rounded-2">
                  {conversionMode === "CtoF" ? "°C" : "°F"}
                </span>
                <button
                  className="btn btn-light  py-2 border px-4 rounded-2"
                  onClick={() =>
                    setConversionMode((prev) =>
                      prev === "CtoF" ? "FtoC" : "CtoF"
                    )
                  }
                >
                  <TbSwitchHorizontal />
                </button>
                <span className="bg-light  py-2 border px-4 fw-bold rounded-2">
                  {conversionMode === "CtoF" ? "°F" : "°C"}
                </span>
              </div>

              <button
                className="btn btn-primary mt-3 w-100"
                onClick={() => convertTemperature(conversionMode)}
              >
                Convert
              </button>

              <h6 className="badge-primary p-2 my-2 mt-3">
                Result: {temperatureResult}{" "}
                {conversionMode === "CtoF" ? "°F" : "°C"}
              </h6>
            </div>
          )}
          {/* Currency Converter
          {CalculatorType === "5" && (
            <div>
              <input
                type="number"
                placeholder="Enter amount"
                onChange={(e) => setCurrencyInput(e.target.value)}
              />
              <button onClick={() => convertCurrency("USD", "INR")}>
                USD to INR
              </button>
              <button onClick={() => convertCurrency("INR", "USD")}>
                INR to USD
              </button>
              <h6 className="badge-primary p-2">Result: {currencyResult}</h6>
            </div>
          )} */}
        </div>
      )}
    </>
  );
};

export default Calculator;
