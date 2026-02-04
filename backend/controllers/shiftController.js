const Shift = require("../models/ShiftModel");
const { Employee } = require("../models/employeeModel");
const { AttendanceModel } = require("../models/attendanceModel");
const mongoose = require("mongoose");
const Moment = require("moment");

// Helper: normalize numeric login/break values to minutes.
// Attendance data may store values in minutes, seconds, or milliseconds depending on source.
const toMinutes = (raw) => {
  if (raw === null || typeof raw === 'undefined') return 0;
  let n = Number(raw);
  if (!isFinite(n) || Number.isNaN(n)) return 0;
  // if already small (plausible minutes), return
  if (n <= 24 * 60 * 2) return Math.round(n); // up to ~2880 treated as minutes
  // if value seems like seconds (e.g., 8h = 28800), convert to minutes
  if (n > 24 * 60 * 2 && n <= 24 * 60 * 60 * 2) return Math.round(n / 60);
  // if value seems like milliseconds, convert to minutes
  if (n > 24 * 60 * 60 * 2) return Math.round(n / 1000 / 60);
  return Math.round(n);
};

// Get all shifts for a specific user
const getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shifts" });
  }
};

// Controller to get shift details by ID
const getShiftById = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate id is a valid ObjectId to avoid CastError when malformed strings are passed
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn('getShiftById called with invalid id:', id);
      return res.status(400).json({ message: 'Invalid id format' });
    }

    // Try to find shift by shiftId first
    let shift = await Shift.findById(id);
    if (!shift) {
      // If not found, try to find by employeeId
      const employee = await Employee.findById(id).populate("shifts");
      if (!employee || !employee.shifts || employee.shifts.length === 0) {
        return res.status(404).json({ message: "Shift not found" });
      }
      // Return the latest shift (or all if needed)
      shift = employee.shifts[employee.shifts.length - 1];
    }
    res.status(200).json(shift);
  } catch (error) {
    console.error("Error fetching shift details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a shift
const createShift = async (req, res) => {
  try {
    const { name, startTime, endTime, minLoginHours, minLoginMinutes, user } =
      req.body;

    // Check if a shift is being updated or created
    let shift;
    if (req.params.id) {
      // Update the shift if an ID is provided
      shift = await Shift.findByIdAndUpdate(
        req.params.id,
        { name, startTime, endTime, minLoginHours, minLoginMinutes, user },
        { new: true }
      );
    } else {
      // Create a new shift
      shift = new Shift({
        name,
        startTime,
        endTime,
        minLoginHours,
        minLoginMinutes,
        user,
      });
      await shift.save();
    }

    res.status(200).json({ shift });
  } catch (error) {
    res.status(500).json({ message: "Error creating/updating shift", error });
  }
};

// Update a shift
const updateShift = async (req, res) => {
  const { id } = req.params;
  const { name, startTime, endTime, user, minLoginHours, minLoginMinutes } = req.body;

  try {
    const shift = await Shift.findByIdAndUpdate(
      id,
      { name, startTime, endTime, user, minLoginHours, minLoginMinutes },
      { new: true, runValidators: true }
    );
    if (!shift) return res.status(404).json({ message: "Shift not found" });
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: "Error updating shift" });
  }
};

// Delete a shift
const deleteShift = async (req, res) => {
  const { id } = req.params;

  try {
    const shift = await Shift.findByIdAndDelete(id);
    if (!shift) return res.status(404).json({ message: "Shift not found" });
    res.status(200).json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shift" });
  }
};

// Get totals (gross, break, net) grouped by shift for a given period
const getShiftTotals = async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    console.log('getShiftTotals called with period:', period);

    // compute start and end moments based on period
    let startMoment, endMoment;
    const now = Moment();
    if (period === 'today') {
      startMoment = now.clone().startOf('day');
      endMoment = now.clone().endOf('day');
    } else if (period === 'week' || period === 'weekly') {
      startMoment = now.clone().startOf('isoWeek').startOf('day');
      endMoment = now.clone().endOf('isoWeek').endOf('day');
    } else if (period === 'month' || period === 'monthly') {
      startMoment = now.clone().startOf('month').startOf('day');
      endMoment = now.clone().endOf('month').endOf('day');
    } else if (period === 'year' || period === 'yearly') {
      startMoment = now.clone().startOf('year').startOf('day');
      endMoment = now.clone().endOf('year').endOf('day');
    } else if (period === 'custom' && startDate && endDate) {
      startMoment = Moment(startDate).startOf('day');
      endMoment = Moment(endDate).endOf('day');
    } else {
      // default to month
      startMoment = now.clone().startOf('month').startOf('day');
      endMoment = now.clone().endOf('month').endOf('day');
    }

    console.log('Date range:', startMoment.format('YYYY-MM-DD'), 'to', endMoment.format('YYYY-MM-DD'));

    // iterate attendance collection and accumulate by shift id
    const totalsMap = {}; // shiftId -> { gross: minutes, break: minutes, dates: Set }

    const allAttendance = await AttendanceModel.find({}).lean();
    console.log('Found attendance records:', allAttendance?.length || 0);

    if (!allAttendance || allAttendance.length === 0) {
      console.log('No attendance records found');
      return res.status(200).json({ totals: [], period: { start: startMoment.toISOString(), end: endMoment.toISOString() } });
    }

    for (const att of allAttendance) {
      if (!att.years || !Array.isArray(att.years)) {
        console.log('Skipping attendance record: no years array');
        continue;
      }

      for (const y of att.years) {
        const yearNum = y.year;
        if (!y.months || !Array.isArray(y.months)) continue;

        for (const m of y.months) {
          const monthNum = m.month; // number 1-12
          if (!m.dates || !Array.isArray(m.dates)) continue;

          for (const d of m.dates) {
            // determine dateMoment
            let dateMoment = null;
            if (typeof d.date === 'number' || (typeof d.date === 'string' && /^\d+$/.test(String(d.date)))) {
              const day = String(d.date).padStart(2, '0');
              const month = String(monthNum).padStart(2, '0');
              dateMoment = Moment(`${yearNum}-${month}-${day}`, 'YYYY-MM-DD', true);
            } else if (typeof d.date === 'string' && d.date.includes('-')) {
              dateMoment = Moment(d.date, 'YYYY-MM-DD', true);
            }

            if (!dateMoment || !dateMoment.isValid()) {
              console.log('Invalid date:', d.date);
              continue;
            }

            if (!dateMoment.isBetween(startMoment, endMoment, null, '[]')) continue;

            // Normalize shift id from different shapes: array, object or plain id
            let shiftId = 'unknown';
            try {
              if (d.shifts) {
                if (Array.isArray(d.shifts) && d.shifts[0]) {
                  // item may be an object or an id
                  shiftId = String(d.shifts[0]._id || d.shifts[0]);
                } else if (typeof d.shifts === 'object' && d.shifts._id) {
                  shiftId = String(d.shifts._id);
                } else {
                  shiftId = String(d.shifts);
                }
              } else if (d.shift) {
                if (Array.isArray(d.shift) && d.shift[0]) {
                  shiftId = String(d.shift[0]._id || d.shift[0]);
                } else if (typeof d.shift === 'object' && d.shift._id) {
                  shiftId = String(d.shift._id);
                } else {
                  shiftId = String(d.shift);
                }
              }
            } catch (err) {
              shiftId = 'unknown';
            }
            if (!totalsMap[shiftId]) {
              totalsMap[shiftId] = { gross: 0, brake: 0, net: 0, dates: new Set() };
            }

            // Normalize unit-agnostic login/break values using toMinutes helper
            const totalLoginRaw = (typeof d.TotalLogin !== 'undefined') ? d.TotalLogin : (typeof d.totalLogin !== 'undefined' ? d.totalLogin : 0);
            const brakeRaw = (typeof d.totalBrake !== 'undefined') ? d.totalBrake : (typeof d.brake !== 'undefined' ? d.brake : 0);
            const totalLogin = toMinutes(totalLoginRaw);
            const brakeVal = toMinutes(brakeRaw);

            // accumulate gross and break per date
            totalsMap[shiftId].gross += totalLogin;
            totalsMap[shiftId].brake += brakeVal;
            // track unique date for this shift (YYYY-MM-DD)
            totalsMap[shiftId].dates.add(dateMoment.format('YYYY-MM-DD'));
          }
        }
      }
    }

    // console.log('Totals map:', Object.keys(totalsMap).length, 'shifts');

    // After accumulating gross and break minutes, compute net = gross - break for each shift
    for (const sid of Object.keys(totalsMap)) {
      const vals = totalsMap[sid];
      vals.net = Number(vals.gross) - Number(vals.brake);
      // convert Set -> count for serialization later
      vals.dateCount = vals.dates ? vals.dates.size : 0;
    }
    // fetch shift names for ids
    const shiftIds = Object.keys(totalsMap).filter(id => id && id !== 'unknown');
    console.log('Shift IDs to lookup:', shiftIds);

    let shifts = [];
    if (shiftIds.length > 0) {
      try {
        shifts = await Shift.find({ _id: { $in: shiftIds } }).lean();
        console.log('Found shifts:', shifts?.length || 0);
      } catch (err) {
        console.error('Error fetching shifts:', err.message);
        shifts = [];
      }
    }

    const shiftNameMap = {};
    if (shifts && Array.isArray(shifts)) {
      shifts.forEach(s => {
        if (s && s._id && s.name) {
          shiftNameMap[String(s._id)] = s.name;
        }
      });
    }

    // helper: count calendar days between two moments inclusive, excluding Sundays
    const countCalendarDaysExcludingSundays = (startM, endM) => {
      const s = startM.clone().startOf('day');
      const e = endM.clone().startOf('day');
      let count = 0;
      for (let m = s.clone(); m.isSameOrBefore(e); m.add(1, 'day')) {
        // 0 = Sunday in moment.js
        if (m.day() === 0) continue;
        count += 1;
      }
      return count;
    };

    const result = Object.entries(totalsMap).map(([sid, vals]) => {
      const shiftName = sid === 'unknown' ? 'Unassigned' : (shiftNameMap[sid] || 'Unknown Shift');
      // find shift doc if exists
      const shiftDoc = shifts.find(s => String(s._id) === sid);
      let expectedMinutes = 0;
      try {
        if (shiftDoc && shiftDoc.startTime && shiftDoc.endTime) {
          // compute daily minutes for the shift, handle overnight
          let s = Moment(`2025-01-01 ${shiftDoc.startTime}`, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD hh:mm A']);
          let e = Moment(`2025-01-01 ${shiftDoc.endTime}`, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD hh:mm A']);
          if (s.isValid() && e.isValid()) {
            if (!e.isAfter(s)) e.add(1, 'day');
            const dailyMinutes = e.diff(s, 'minutes');
            const dailyNet = Math.max(0, dailyMinutes - 60); // subtract 1 hour break per day
            // Determine days count based on requested period so expected matches shift-based rules
            // Map normalized period to fixed working days: today=1, weekly=6, monthly=26, yearly=26*12
            const normalize = (p) => {
              if (!p) return 'monthly';
              const key = String(p).toLowerCase();
              if (key === 'today') return 'today';
              if (key === 'week' || key === 'weekly') return 'weekly';
              if (key === 'month' || key === 'monthly') return 'monthly';
              if (key === 'year' || key === 'yearly') return 'yearly';
              if (key === 'custom') return 'custom';
              return 'monthly';
            };
            const periodKey = normalize(period);
            const periodDaysMap = { today: 1, weekly: 6, monthly: 26, yearly: 26 * 12 };
            let daysCount = periodDaysMap[periodKey] || 0;
            // If period is custom or no mapping, fall back to recorded unique dates or calendar days
            if (daysCount === 0) {
              daysCount = vals.dateCount && vals.dateCount > 0 ? vals.dateCount : countCalendarDaysExcludingSundays(startMoment, endMoment);
            }
            expectedMinutes = dailyNet * daysCount;
          }
        }
      } catch (err) {
        expectedMinutes = 0;
      }

      return {
        shiftId: sid,
        shiftName,
        grossMinutes: vals.gross,
        breakMinutes: vals.brake,
        netMinutes: vals.net,
        expectedMinutes,
        grossHours: (vals.gross / 60).toFixed(2),
        breakHours: (vals.brake / 60).toFixed(2),
        netHours: (vals.net / 60).toFixed(2),
        expectedHours: (expectedMinutes / 60).toFixed(2),
        recordedDays: vals.dateCount || 0,
      };
    });

    res.status(200).json({ totals: result, period: { start: startMoment.toISOString(), end: endMoment.toISOString() } });
  } catch (error) {
    console.error('Error computing shift totals:', error.message || error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error computing shift totals', error: error.message || error });
  }
};

module.exports = {
  getShifts,
  createShift,
  updateShift,
  deleteShift,
  getShiftById,
  getShiftTotals,
};
