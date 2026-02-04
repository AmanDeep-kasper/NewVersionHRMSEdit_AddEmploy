import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import BASE_URL from "../../config/config";
import TittleHeader from "../../TittleHeader/TittleHeader";
import OverLayToolTip from "../../../Utils/OverLayToolTip";
import { FiEdit2 } from "react-icons/fi";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import { convertToAmPm } from "../../../Utils/GetDayFormatted";
import api from "../../config/api";
import {Card} from "react-bootstrap"

const ShiftComponent = () => {
  const [shifts, setShifts] = useState([]);
  const [editingShift, setEditingShift] = useState(null);
  const [totalsByShift, setTotalsByShift] = useState({});
  const [period, setPeriod] = useState('monthly');
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  // Helper: compute expected minutes for a shift per period
  const computeExpectedFromShift = (shift, periodKey) => {
    if (!shift || !shift.startTime || !shift.endTime) return 0;
    // parse HH:mm or HH:mm:ss
    const parse = (t) => {
      if (!t) return null;
      const parts = t.split(":");
      if (parts.length < 2) return null;
      const hh = parseInt(parts[0], 10);
      const mm = parseInt(parts[1], 10) || 0;
      return hh * 60 + mm;
    };
    const s = parse(shift.startTime);
    const e = parse(shift.endTime);
    if (s === null || e === null) return 0;
    let daily = e - s;
    if (daily <= 0) daily += 24 * 60; // overnight
    const dailyNet = Math.max(0, daily - 60); // subtract 1 hour break
    // map period to days count (reasonable defaults)
    let days = 0;
    if (periodKey === 'today') days = 1;
    else if (periodKey === 'weekly' || periodKey === 'week') days = 6;
    else if (periodKey === 'monthly' || periodKey === 'month') days = 26;
    else if (periodKey === 'yearly' || periodKey === 'year') days = 26 * 12;
    else days = 1;
    return dailyNet * days;
  };

  const initialValues = {
    name: "",
    startTime: "",
    endTime: "",
    minLoginHours: "", // New field for minimum login hours
    minLoginMinutes: "", // New field for minimum login minutes
  };

  // Validation Schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Shift name is required")
      .max(50, "Shift name cannot exceed 50 characters"),
    startTime: Yup.string().required("Start time is required"),
    endTime: Yup.string().required("End time is required"),
    minLoginHours: Yup.number()
      .min(0, "Minimum hours must be greater than or equal to 0")
      .required("Minimum login hours are required"),
    minLoginMinutes: Yup.number()
      .min(0, "Minimum minutes must be greater than or equal to 0")
      .max(59, "Minutes must be between 0 and 59")
      .required("Minimum login minutes are required"),
  });

  // Fetch Shifts
const fetchShifts = async () => {
  try {

    const response = await api.get(`/api/shifts`, {
      params: { userId: userData._id },
    });

    setShifts(response.data);
  } catch (error) {
    console.error("Error fetching shifts:", error);
  }
};


  useEffect(() => {
    fetchShifts();
    fetchShiftTotals();
  }, []);

  const fetchShiftTotals = async (p = period) => {
    try {
      const res = await api.get(`/api/shifts/totals`, { params: { period: p } });
      // map by shiftId
      const map = {};
      (res.data.totals || []).forEach(t => {
        map[t.shiftId] = t;
      });
      setTotalsByShift(map);
    } catch (err) {
      console.error('Error fetching shift totals', err);
      setTotalsByShift({});
    }
  };

  // Create or Update Shift
const handleSubmit = async (values, { resetForm }) => {
  try {
    const payload = { ...values, user: userData._id };

    if (editingShift) {
      await api.put(`/api/shifts/${editingShift._id}`, payload, {
      });
    } else {
      await api.post(`/api/shifts`, payload, {
      });
    }

    fetchShifts();
    resetForm();
    setEditingShift(null);
  } catch (error) {
    console.error("Error saving shift:", error);
  }
};



  // Edit Shift
  const handleEdit = (shift) => {
    setEditingShift(shift);
  };

  // Delete Shift
 const handleDelete = async (id) => {
  try {

    await api.delete(`/api/shifts/${id}`, {
    });

    // toast.success("Shift deleted successfully!");
    fetchShifts(); // Refresh the shift list
  } catch (error) {
    console.error("Error deleting shift:", error);
    // toast.error("Failed to delete shift. Please try again.");
  }
};


const formatMinutes = (min) => {
  const totalSeconds = min * 60;      // because 1 minute = 60 seconds
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${h}h ${m}m ${s}s`;
};

const formatShiftTimes = (grossMin, breakMin = 0) => {
  const net = grossMin - breakMin;
  return {
    gross: formatMinutesFull(grossMin),
    break: formatMinutesFull(breakMin),
    net: formatMinutesFull(net > 0 ? net : 0)
  };
};

const formatMinutesFull = (min) => {
  const totalSeconds = min * 60;

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${h}h ${m}m ${s}s`;
};


  return (
    <div className="container-fluid">
      <div className="my-2 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <TittleHeader
          title={"Shift Management"}
          message={"You can create and view all shifts here."}
        />
        <div className="d-flex gap-2 mt-2 mt-md-0">
          <select className="form-select form-select-sm" style={{ width: 140 }} value={period} onChange={(e) => { setPeriod(e.target.value); fetchShiftTotals(e.target.value); }}>
            <option value="today">Today</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => fetchShiftTotals()}>Refresh Totals</button>
        </div>
      </div>

      <Formik
        initialValues={editingShift || initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form
            className={`p-3 my-2 rounded-2 ${
              darkMode ? "text-black" : "text-light"
            }`}
            style={{
              background: darkMode
                ? "var(--primaryDashMenuColor)"
                : "var(--primaryDashColorDark)",
            }}
          >
            <div className="form-group">
              <label htmlFor="name">Shift Name</label>
              <Field
                type="text"
                name="name"
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}
                placeholder="Enter shift name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="row">
              <div className="form-group col-12 col-md-6">
                <label htmlFor="startTime">Start Time</label>
                <Field
                  type="time"
                  name="startTime"
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                />
                <ErrorMessage
                  name="startTime"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="form-group col-12 col-md-6">
                <label htmlFor="endTime">End Time</label>
                <Field
                  type="time"
                  name="endTime"
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                />
                <ErrorMessage
                  name="endTime"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-12 col-md-6">
                <label htmlFor="minLoginHours">Minimum Login Hours</label>
                <Field
                  type="number"
                  name="minLoginHours"
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  placeholder="Enter minimum login hours"
                />
                <ErrorMessage
                  name="minLoginHours"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="form-group col-12 col-md-6">
                <label htmlFor="minLoginMinutes">Minimum Login Minutes</label>
                <Field
                  type="number"
                  name="minLoginMinutes"
                  className={`form-control ms-0 ms-md-auto rounded-2 ${
                    darkMode
                      ? "bg-light text-dark border dark-placeholder"
                      : "bg-dark text-light border-0 light-placeholder"
                  }`}
                  placeholder="Enter minimum login minutes"
                />
                <ErrorMessage
                  name="minLoginMinutes"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-3"
              disabled={isSubmitting}
            >
              {editingShift ? "Update Shift" : "Create Shift"}
            </button>
            {editingShift && (
              <button
                type="button"
                className="btn btn-secondary mt-3 ml-2"
                onClick={() => setEditingShift(null)}
              >
                Cancel
              </button>
            )}
          </Form>
        )}
      </Formik>
      <div>
        <div
          style={{
            height: "fit-content",
            maxHeight: "50vh",
            overflow: "auto",
            position: "relative",
            border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
          }}
          className="scroller mb-2 rounded-2"
        >
          <table className="table mb-0 table-hover">
            <thead>
                  <tr>
                    <th style={rowHeadStyle(darkMode)}>#</th>
                    <th style={rowHeadStyle(darkMode)}>Shift Name</th>
                    <th style={rowHeadStyle(darkMode)}>Start Time</th>
                    <th style={rowHeadStyle(darkMode)}>End Time</th>
                    <th style={rowHeadStyle(darkMode)}>Total Login</th>
                    <th style={rowHeadStyle(darkMode)}>Total Break</th>
                    <th style={rowHeadStyle(darkMode)}>Expected</th>
                    <th style={rowHeadStyle(darkMode)}>Min Login Hours</th>
                    <th style={rowHeadStyle(darkMode)} className="text-end">
                      Actions
                    </th>
                  </tr>
            </thead>
            <tbody>
              {shifts.map((shift, index) => (
                <tr key={shift._id}>
                  <td className="py-1" style={rowBodyStyle(darkMode)}>
                    {index + 1}
                  </td>
                  <td className="py-1" style={rowBodyStyle(darkMode)}>
                    {shift.name}
                  </td>
                  <td className="py-1" style={rowBodyStyle(darkMode)}>
                    {convertToAmPm(shift.startTime)}
                  </td>
                  <td className="py-1" style={rowBodyStyle(darkMode)}>
                    {convertToAmPm(shift.endTime)}
                  </td>

                  {/* month */}
                  <td className="py-1" style={rowBodyStyle(darkMode)}>
                    {totalsByShift[shift._id] && typeof totalsByShift[shift._id].grossMinutes === 'number' ? `${Math.floor(totalsByShift[shift._id].grossMinutes/60)}h ${totalsByShift[shift._id].grossMinutes%60}m` : (
                      // fallback: compute from shift timings
                      (() => {
                        const expected = computeExpectedFromShift(shift, period);
                        return expected > 0 ? `${Math.floor(expected/60)}h ${expected%60}m` : '--';
                      })()
                    )}
                  </td>

                  {/* break */}
                  <td className="py-1" style={rowBodyStyle(darkMode)}>
                    {totalsByShift[shift._id] && typeof totalsByShift[shift._id].breakMinutes === 'number' ? `${Math.floor(totalsByShift[shift._id].breakMinutes/60)}h ${totalsByShift[shift._id].breakMinutes%60}m` : (
                      (() => {
                        // fallback break = 60 minutes per day * days
                        const days = (period === 'today') ? 1 : (period === 'weekly' ? 6 : (period === 'monthly' ? 26 : (period === 'yearly' ? 26*12 : 1)));
                        const brk = 60 * days;
                        return `${Math.floor(brk/60)}h ${brk%60}m`;
                      })()
                    )}
                  </td>

                  {/* expected */}
                  <td className="py-1" style={rowBodyStyle(darkMode)}>
                    {totalsByShift[shift._id] ? (typeof totalsByShift[shift._id].expectedMinutes === 'number' ? `${Math.floor(totalsByShift[shift._id].expectedMinutes/60)}h ${totalsByShift[shift._id].expectedMinutes%60}m` : '--') : '--'}
                  </td>

                  {/* working */}
                  <td className="py-1" style={rowBodyStyle(darkMode)}>
                    {shift.minLoginHours} hours {shift.minLoginMinutes} minutes
                  </td>

                  
                  <td style={rowBodyStyle(darkMode)} className="text-end py-1">
                    <OverLayToolTip
                      style={{ color: darkMode ? "black" : "white" }}
                      icon={<FiEdit2 className="text-primary" />}
                      onClick={() => handleEdit(shift)}
                      tooltip={"Edit Shift"}
                    />
                    {/* <OverLayToolTip
                      style={{ color: darkMode ? "black" : "white" }}
                      icon={<AiOutlineDelete className="fs-5 text-danger" />}
                      onClick={() => handleDelete(shift._id)}
                      tooltip={"Delete Shift"}
                    />  */}
                  </td>


         {/* TODAY Gross */}
  <td>
    {totalsByShift.today?.[shift._id]?.grossMinutes
      ? formatMinutesFull(totalsByShift.today[shift._id].grossMinutes)
      : formatMinutesFull(computeExpectedFromShift(shift, "today"))
    }
  </td>

  {/* TODAY Break */}
  <td>
    {totalsByShift.today?.[shift._id]?.breakMinutes
      ? formatMinutesFull(totalsByShift.today[shift._id].breakMinutes)
      : formatMinutesFull(60 * 1)  // fallback: 1 day = 60 min break
    }
  </td>

  {/* WEEKLY Gross */}
  <td>
    {totalsByShift.weekly?.[shift._id]?.grossMinutes
      ? formatMinutesFull(totalsByShift.weekly[shift._id].grossMinutes)
      : formatMinutesFull(computeExpectedFromShift(shift, "weekly"))
    }
  </td>

  {/* WEEKLY Break */}
  <td>
    {totalsByShift.weekly?.[shift._id]?.breakMinutes
      ? formatMinutesFull(totalsByShift.weekly[shift._id].breakMinutes)
      : formatMinutesFull(60 * 6)  // fallback weekly break
    }
  </td>

  {/* MONTHLY Gross */}
  <td>
    {totalsByShift.monthly?.[shift._id]?.grossMinutes
      ? formatMinutesFull(totalsByShift.monthly[shift._id].grossMinutes)
      : formatMinutesFull(computeExpectedFromShift(shift, "monthly"))
    }
  </td>

  {/* MONTHLY Break */}
  <td>
    {totalsByShift.monthly?.[shift._id]?.breakMinutes
      ? formatMinutesFull(totalsByShift.monthly[shift._id].breakMinutes)
      : formatMinutesFull(60 * 26) // fallback monthly break
    }
  </td>

  {/* YEARLY Gross */}
  <td>
    {totalsByShift.yearly?.[shift._id]?.grossMinutes
      ? formatMinutesFull(totalsByShift.yearly[shift._id].grossMinutes)
      : formatMinutesFull(computeExpectedFromShift(shift, "yearly"))
    }
  </td>

  {/* YEARLY Break */}
  <td>
    {totalsByShift.yearly?.[shift._id]?.breakMinutes
      ? formatMinutesFull(totalsByShift.yearly[shift._id].breakMinutes)
      : formatMinutesFull(60 * (26 * 12)) // fallback yearly break
    }
  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Card className="mb-3 shadow-sm">
  <Card.Header className="d-flex justify-content-between align-items-center">
    <h5 className="mb-0">Shift Summary</h5>
    <button 
      type="button" 
      className="btn btn-sm btn-outline-primary"
      onClick={fetchShiftTotals}
    >
      Refresh Totals
    </button>
  </Card.Header>

  <Card.Body>
    <div className="table-responsive">
      <table className="table table-bordered table-hover table-sm mb-0">
        <thead className="table-light">
          <tr>
            <th rowSpan={2}>Shift</th>

            {/* Today */}
            <th colSpan={2} className="text-center">Today</th>

            {/* Weekly */}
            <th colSpan={2} className="text-center">Weekly</th>

            {/* Monthly */}
            <th colSpan={2} className="text-center">Monthly</th>

            {/* Yearly */}
            <th colSpan={2} className="text-center">Yearly</th>
          </tr>

          <tr>
            <th>Gross</th>
            <th>Break</th>

            <th>Gross</th>
            <th>Break</th>

            <th>Gross</th>
            <th>Break</th>

            <th>Gross</th>
            <th>Break</th>
          </tr>
        </thead>

        <tbody>
          {shifts.map(shift => (
            <tr key={shift._id}>
              <td className="fw-semibold">{shift.shiftName}</td>

              {/* TODAY Gross */}
              <td>
                {totalsByShift.today?.[shift._id]?.grossMinutes
                  ? formatMinutesFull(totalsByShift.today[shift._id].grossMinutes)
                  : formatMinutesFull(computeExpectedFromShift(shift, "today"))
                }
              </td>

              {/* TODAY Break */}
              <td>
                {totalsByShift.today?.[shift._id]?.breakMinutes
                  ? formatMinutesFull(totalsByShift.today[shift._id].breakMinutes)
                  : formatMinutesFull(60)
                }
              </td>

              {/* WEEKLY Gross */}
              <td>
                {totalsByShift.weekly?.[shift._id]?.grossMinutes
                  ? formatMinutesFull(totalsByShift.weekly[shift._id].grossMinutes)
                  : formatMinutesFull(computeExpectedFromShift(shift, "weekly"))
                }
              </td>

              {/* WEEKLY Break */}
              <td>
                {totalsByShift.weekly?.[shift._id]?.breakMinutes
                  ? formatMinutesFull(totalsByShift.weekly[shift._id].breakMinutes)
                  : formatMinutesFull(60 * 6)
                }
              </td>

              {/* MONTHLY Gross */}
              <td>
                {totalsByShift.monthly?.[shift._id]?.grossMinutes
                  ? formatMinutesFull(totalsByShift.monthly[shift._id].grossMinutes)
                  : formatMinutesFull(computeExpectedFromShift(shift, "monthly"))
                }
              </td>

              {/* MONTHLY Break */}
              <td>
                {totalsByShift.monthly?.[shift._id]?.breakMinutes
                  ? formatMinutesFull(totalsByShift.monthly[shift._id].breakMinutes)
                  : formatMinutesFull(60 * 26)
                }
              </td>

              {/* YEARLY Gross */}
              <td>
                {totalsByShift.yearly?.[shift._id]?.grossMinutes
                  ? formatMinutesFull(totalsByShift.yearly[shift._id].grossMinutes)
                  : formatMinutesFull(computeExpectedFromShift(shift, "yearly"))
                }
              </td>

              {/* YEARLY Break */}
              <td>
                {totalsByShift.yearly?.[shift._id]?.breakMinutes
                  ? formatMinutesFull(totalsByShift.yearly[shift._id].breakMinutes)
                  : formatMinutesFull(60 * 26 * 12)
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card.Body>
</Card>

        </div>
      </div>
    </div>
  );
};

export default ShiftComponent;
