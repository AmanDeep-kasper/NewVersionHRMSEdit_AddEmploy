const Joi = require("joi");
const moment = require("moment");
const moments = require("moment-timezone");
const { Employee } = require("../models/employeeModel");
const { AttendanceModel } = require("../models/attendanceModel");
const { LeaveApplication } = require("../models/leaveModel");
const { TotalLeave } = require("../models/totalLeave");
const {
  LeaveApplicationValidation,
  LeaveApplicationHRValidation,
} = require("../validations/leavelValidation");

// find  all LeaveApplication Employee

const getAllLeaveApplication = async (req, res) => {
  Employee.findOne({
    _id: req.params.id,
    isFullandFinal: { $ne: "Yes" },
  })
    .populate({
      path: "LeaveApplication",
    })
    .select("FirstName LastName MiddleName leaveDuration updatedBy Leavetype")
    .exec((err, employee) => {
      if (err) {
        res.status(500).send("Error fetching leave application");
      } else if (!employee) {
        res.status(404).send("Employee not found or marked Full and Final");
      } else {
        res.status(200).send(employee);
      }
    });
};

const getAllLeaves = async (req, res) => {
  try {
    // 1️⃣  Make sure the employee exists AND is not Full & Final
    const employee = await Employee.findOne({
      _id: req.params.employeeId,
      isFullandFinal: { $ne: "Yes" },
    });

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found or marked Full and Final" });
    }

    // 2️⃣  Fetch all leave applications for that employee
    const leaves = await LeaveApplication.find({
      employee: employee._id,
    }).populate("employee");

    if (!leaves || leaves.length === 0) {
      return res.status(404).json({ message: "No leave applications found" });
    }

    res.status(200).json(leaves);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching leave applications", error });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const employeeId = req.user._id;

    // 1️⃣ Validate employee (not Full & Final)
    const employee = await Employee.findOne({
      _id: employeeId,
      isFullandFinal: { $ne: "Yes" },
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found or marked Full & Final",
      });
    }

    // 2️⃣ Fetch leaves with only required fields
    const leaves = await LeaveApplication.find({ employee: employeeId })
      .select("Leavetype FromDate ToDate Status createdOn reasonOfRejection")
      .sort({ createdOn: -1 }); // latest first

    if (!leaves.length) {
      return res.status(200).json([]); // return empty array instead of 404
    }

    // 3️⃣ Format response
    const formattedLeaves = leaves.map((leave) => ({
      leaveId: leave._id,
      leaveType: leave.Leavetype,
      fromDate: leave.FromDate,
      toDate: leave.ToDate,
      appliedOn: leave.createdOn,
      status: leave.Status,
      rejectionReason: leave.reasonOfRejection || null,
    }));

    res.status(200).json(formattedLeaves);
  } catch (error) {
    console.error("Leave fetch error:", error);
    res.status(500).json({
      message: "Failed to fetch leave records",
    });
  }
};

const getAllLeaveApplicationHr = async (req, res) => {
  const { hr, manager } = req.body;

  if (!hr && !manager) return res.status(404).json({ error: "no data found" });

  let matchCondition = {};
  if (hr) {
    matchCondition = {
      $or: [{ "employeeDetails.reportHr": hr }, { aditionalManager: hr }],
    };
  } else if (manager) {
    matchCondition = {
      $or: [
        { "employeeDetails.reportManager": manager },
        { aditionalManager: manager },
      ],
    };
  }

  try {
    const leaveApplications = await LeaveApplication.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      {
        $unwind: "$employeeDetails",
      },
      // ✅ Filter out Full & Final employees
      {
        $match: {
          "employeeDetails.isFullandFinal": { $ne: "Yes" },
          ...matchCondition,
        },
      },
      {
        $project: {
          FirstName: "$employeeDetails.FirstName",
          LastName: "$employeeDetails.LastName",
          empID: "$employeeDetails.empID",
          Email: "$employeeDetails.Email",
          empObjID: "$employeeDetails._id",
          reportHr: "$employeeDetails.reportHr",
          reportManager: "$employeeDetails.reportManager",
          Leavetype: 1,
          FromDate: 1,
          ToDate: 1,
          dateRange: 1,
          Reasonforleave: 1,
          Status: 1,
          aditionalManager: 1,
          leaveDuration: 1,
          createdOn: 1,
          reasonOfRejection: 1,
          updatedBy: 1,
          profile: "$employeeDetails.profile.image_url",
        },
      },
    ]);

    res.send(leaveApplications);
  } catch (err) {
    console.error("Error fetching leave applications:", err);
    res.status(500).send("error");
  }
};

const getAllLeaveApplicationHrDash = async (req, res) => {
  try {
    const { Email, Account } = req.user;

    let roleMatchCondition = {};

    // 🔐 Role-based access
    if (Account === 2) {
      // HR
      roleMatchCondition = {
        $or: [
          { "employeeDetails.reportHr": Email },
          { aditionalManager: Email },
        ],
      };
    } else if (Account === 3) {
      // Manager
      roleMatchCondition = {
        $or: [
          { "employeeDetails.reportManager": Email },
          { aditionalManager: Email },
        ],
      };
    } else if (Account !== 1) {
      // Admin allowed, others blocked
      return res.status(403).json({ message: "Unauthorized role" });
    }

    // 📅 Date helpers
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const result = await LeaveApplication.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      {
        $unwind: "$employeeDetails",
      },
      {
        $match: {
          "employeeDetails.isFullandFinal": { $ne: "Yes" },
          ...roleMatchCondition,
        },
      },
      {
        // 🔥 Multiple dashboards data in ONE query
        $facet: {
          // 🔹 Latest 2 leaves (pending / upcoming)
          latestLeaves: [
            {
              $match: {
                $or: [
                  { Status: "1" },
                  { Status: "2", ToDate: { $gte: today } },
                ],
              },
            },
            {
              $project: {
                _id: 1,
                Leavetype: 1,
                FromDate: 1,
                ToDate: 1,
                leaveDuration: 1,
                Status: 1,
                createdOn: 1,
                employeeName: {
                  $concat: [
                    "$employeeDetails.FirstName",
                    " ",
                    "$employeeDetails.LastName",
                  ],
                },
                empID: "$employeeDetails.empID",
              },
            },
            { $sort: { createdOn: -1 } },
            { $limit: 2 },
          ],

          // 🔹 Pending count
          pendingCount: [{ $match: { Status: "1" } }, { $count: "count" }],

          // 🔹 Upcoming count
          upcomingCount: [
            {
              $match: {
                Status: "2",
                ToDate: { $gte: today },
              },
            },
            { $count: "count" },
          ],

          // 🔹 This week count
          weeklyCount: [
            {
              $match: {
                FromDate: {
                  $gte: startOfWeek,
                  $lte: endOfWeek,
                },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const data = result[0];

    res.status(200).json({
      latestLeaves: data.latestLeaves,
      pendingLeaves: data.pendingCount[0]?.count || 0,
      upcomingLeaves: data.upcomingCount[0]?.count || 0,
      weeklyLeaves: data.weeklyCount[0]?.count || 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard leaves:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const createLeaveApplication = async (req, res) => {
  try {
    const { error } = LeaveApplicationValidation.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    const newLeaveApplication = {
      Leavetype: req.body.Leavetype,
      FromDate: req.body.FromDate,
      ToDate: req.body.ToDate,
      Reasonforleave: req.body.Reasonforleave,
      Status: req.body.Status,
      employee: req.params.id,
      aditionalManager: req.body.aditionalManager,
      managerEmail: req.body.managerEmail,
      leaveDuration: req.body.leaveDuration,
    };

    const { Leavetype, totalLeaveRequired, leaveDuration } = req.body;

    let totalLeave = await TotalLeave.findOne({ empID: req.params.id });

    if (!totalLeave) {
      return res
        .status(404)
        .json({ error: "No leave record found for this employee" });
    }

    const numericLeaveRequired =
      leaveDuration === "Half Day" ? 0.5 : parseInt(totalLeaveRequired, 10);

    if (Leavetype === "Sick Leave") {
      totalLeave.sickLeave = Math.max(
        0,
        totalLeave.sickLeave - numericLeaveRequired,
      );
    } else if (Leavetype === "Casual Leave") {
      totalLeave.casualLeave = Math.max(
        0,
        totalLeave.casualLeave - numericLeaveRequired,
      );
    } else if (Leavetype === "Paid Leave") {
      totalLeave.paidLeave = Math.max(
        0,
        totalLeave.paidLeave - numericLeaveRequired,
      );
    } else if (Leavetype === "Paternity Leave") {
      totalLeave.paternityLeave = Math.max(
        0,
        totalLeave.paternityLeave - numericLeaveRequired,
      );
    } else if (Leavetype === "Maternity Leave") {
      totalLeave.maternityLeave = Math.max(
        0,
        totalLeave.maternityLeave - numericLeaveRequired,
      );
    } else if (Leavetype === "unPaid Leave") {
    } else {
      return res.status(400).json({ message: "Invalid leave type" });
    }

    // Step 7: Save the updated leave record
    const leaveApplication = await LeaveApplication.create(newLeaveApplication);
    employee.leaveApplication.push(leaveApplication);
    await totalLeave.save();
    await employee.save();
    // Step 8: Respond with success message
    res.status(201).json({
      message: "Leave application created successfully",
      leaveApplication,
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// find and update the LeaveApplication
const updateLeaveApplication = async (req, res) => {
  Joi.validate(req.body, LeaveApplicationValidation, (err, result) => {
    if (err) {
      res.status(400).send(err.details[0].message);
    } else {
      let newLeaveApplication;

      newLeaveApplication = {
        Leavetype: req.body.Leavetype,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate,
        Reasonforleave: req.body.Reasonforleave,
        Status: req.body.Status,
        employee: req.params.id,
      };

      LeaveApplication.findByIdAndUpdate(
        req.params.id,
        newLeaveApplication,
        function (err, leaveApplication) {
          if (err) {
            res.send("error");
          } else {
            res.send(newLeaveApplication);
          }
        },
      );
    }
  });
};

const leaveApplicationSchema = Joi.object({
  Status: Joi.string().required(),
  updatedBy: Joi.string().required(),
  leaveType: Joi.string().required(),
  reasonOfRejection: Joi.string().optional(),
  totalLeaveRequired: Joi.number().required(),
  id: Joi.string().required(),
});

const updateLeaveApplicationHr = async (req, res) => {
  const { error, value } = leaveApplicationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const {
    Status,
    updatedBy,
    reasonOfRejection,
    id,
    leaveType,
    totalLeaveRequired,
  } = value;

  try {
    const newLeaveApplication = {
      Status,
      updatedBy,
      reasonOfRejection: Status === "3" ? reasonOfRejection : undefined,
    };

    if (Status === "3") {
      let totalLeave = await TotalLeave.findOne({ empID: id });
      if (!totalLeave) {
        return res
          .status(404)
          .json({ error: "No leave record found for this employee" });
      }

      const numericLeave =
        totalLeaveRequired === 0.5 ? 0.5 : parseInt(totalLeaveRequired, 10);

      switch (leaveType) {
        case "Sick Leave":
          totalLeave.sickLeave = Math.max(
            0,
            totalLeave.sickLeave + numericLeave,
          );
          break;
        case "Casual Leave":
          totalLeave.casualLeave = Math.max(
            0,
            totalLeave.casualLeave + numericLeave,
          );
          break;
        case "Paid Leave":
          totalLeave.paidLeave = Math.max(
            0,
            totalLeave.paidLeave + numericLeave,
          );
          break;
        case "Paternity Leave":
          totalLeave.paternityLeave = Math.max(
            0,
            totalLeave.paternityLeave + numericLeave,
          );
          break;
        case "Maternity Leave":
          totalLeave.maternityLeave = Math.max(
            0,
            totalLeave.maternityLeave + numericLeave,
          );
          break;
        case "unPaid Leave":
          break;
        default:
          return res.status(500).json({ message: "Invalid leave type" });
      }
      await LeaveApplication.findByIdAndUpdate(req.params.id, {
        $set: newLeaveApplication,
      });
      await totalLeave.save();
    } else if (Status === "2") {
      // Retrieve the leave application
      const approvedLeave = await LeaveApplication.findById(req.params.id);
      if (!approvedLeave) {
        return res.status(404).json({ error: "Leave application not found" });
      }

      await LeaveApplication.findByIdAndUpdate(req.params.id, {
        $set: newLeaveApplication,
      });

      console.log("Updating attendance for employee ID:", id);

      const employee = await Employee.findById(id)
        .populate("attendanceObjID")
        .populate("shifts");

      if (!employee) {
        console.log("Employee not found.");
        return res.status(404).json({ error: "Employee not found" });
      }

      if (!employee.attendanceObjID) {
        console.log("No attendanceObjID for this employee.");
        return res.status(400).json({ error: "Attendance object not found" });
      }

      const attendanceRecord = await AttendanceModel.findById(
        employee.attendanceObjID,
      );
      if (!attendanceRecord) {
        console.log("Attendance record not found in the database.");
        return res.status(404).json({ error: "Attendance record not found" });
      }

      console.log("Attendance record retrieved:", attendanceRecord);

      const leaveDates = approvedLeave.dateRange.map((date) => {
        const [day, month, year] = date.split("-");
        return `${year}-${month}-${day}`;
      });

      console.log("Processing leave dates:", leaveDates);

      const currentYear = new Date().getFullYear();
      let yearObject = attendanceRecord.years.find(
        (y) => y.year === currentYear,
      );
      if (!yearObject) {
        console.log("Creating new year object for attendance:", currentYear);
        yearObject = { year: currentYear, months: [] };
        attendanceRecord.years.push(yearObject);
      }

      for (const leaveDate of leaveDates) {
        const dateObj = new Date(leaveDate); // This should now be a valid date object
        if (isNaN(dateObj.getTime())) {
          console.warn("Invalid leave date:", leaveDate);
          continue;
        }

        const holidayMonth = dateObj.getMonth() + 1;
        const holidayDate = dateObj.getDate();
        const holidayDay = dateObj.getDay();

        let monthObject = yearObject.months.find(
          (m) => m.month === holidayMonth,
        );
        if (!monthObject) {
          console.log("Creating new month object:", holidayMonth);
          monthObject = { month: holidayMonth, dates: [] };
          yearObject.months.push(monthObject);
        }

        let dateObject = monthObject.dates.find((d) => d.date === holidayDate);
        if (!dateObject) {
          dateObject = {
            date: holidayDate,
            day: holidayDay,
            loginTime: ["LV"],
            logoutTime: [],
            loginTimeMs: [],
            logoutTimeMs: [],
            breakTime: [],
            resumeTime: [],
            breakTimeMs: [],
            resumeTimeMS: [],
            BreakReasion: [],
            BreakData: [],
            status: "LV",
            totalBrake: 0,
            totalLogAfterBreak: 0,
            shifts: employee.shifts.length ? employee.shifts[0]._id : null,
            LeaveApplication: approvedLeave._id,
            isOnLeave: true,
            leaveAttendanceData: {
              leaveType: approvedLeave.Leavetype,
              leaveDuration: approvedLeave.leaveDuration,
            },
          };
          monthObject.dates.push(dateObject);
        } else {
          dateObject.LeaveApplication = approvedLeave._id;
          dateObject.status = "LV";
          dateObject.loginTime = ["LV"];
          dateObject.logoutTime = [];
          dateObject.isOnLeave = true;
          dateObject.leaveAttendanceData = {
            leaveType: approvedLeave.Leavetype,
            leaveDuration: approvedLeave.leaveDuration,
          };
        }
      }

      await attendanceRecord.save();
    }
    res
      .status(200)
      .json({ message: "Leave updated successfully", newLeaveApplication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // find and delete the LeaveApplication Employee
const deleteLeaveApplication = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
    if (err) {
      res.send("error");
    } else {
      LeaveApplication.findByIdAndRemove(
        { _id: req.params.id2 },
        function (err, leaveApplication) {
          if (!err) {
            Employee.update(
              { _id: req.params.id },
              { $pull: { leaveApplication: req.params.id2 } },
              function (err, numberAffected) {
                res.send(leaveApplication);
              },
            );
          } else {
            res.send("error");
          }
        },
      );
    }
  });
};

// // find and delete the LeaveApplication AdminHr
const deleteLeaveApplicationHr = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
    if (err) {
      res.send("error");
    } else {
      LeaveApplication.findByIdAndRemove(
        { _id: req.params.id2 },
        function (err, leaveApplication) {
          if (!err) {
            Employee.update(
              { _id: req.params.id },
              { $pull: { leaveApplication: req.params.id2 } },
              function (err, numberAffected) {
                res.send(leaveApplication);
              },
            );
          } else {
            res.send("error");
          }
        },
      );
    }
  });
};
// Ensure moment is required for date comparison

const getLeaveApplicationNo = async (req, res) => {
  try {
    const { email } = req.body;

    // Fetch only active employees who are not Full and Final
    const listOfEmployees = await Employee.find({
      isFullandFinal: { $ne: "Yes" },
    }).select("_id");

    const today = moments().tz("Asia/Kolkata").format("YYYY-MM-DD");

    const leaveRequestPromises = listOfEmployees.map((val) => {
      const query = {
        employee: val._id,
        Status: "2",
        $expr: {
          $and: [
            {
              $gte: [
                { $dateToString: { format: "%Y-%m-%d", date: "$FromDate" } },
                today,
              ],
            },
            {
              $lte: [
                { $dateToString: { format: "%Y-%m-%d", date: "$ToDate" } },
                today,
              ],
            },
          ],
        },
      };

      return LeaveApplication.find(query);
    });

    const leaveRequests = await Promise.all(leaveRequestPromises);
    const flattenedLeaveRequests = leaveRequests.flat();

    const obj = {
      totalEmployee: listOfEmployees.length,
      onLeave: flattenedLeaveRequests.length,
    };

    res.status(200).json(obj);
  } catch (error) {
    console.error("Error fetching leave applications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLeaveApplicationsByMonthYear = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ error: "Month and year are required" });
  }

  if (
    isNaN(month) ||
    isNaN(year) ||
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > new Date().getFullYear()
  ) {
    return res.status(400).json({ error: "Invalid month or year" });
  }

  try {
    const startDate = moment(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = moment(startDate).endOf("month").toDate();

    // Fetch leave applications within date range and exclude Full and Final employees
    const leaveApplications = await LeaveApplication.find({
      FromDate: { $gte: startDate },
      ToDate: { $lte: endDate },
    })
      .populate({
        path: "employee",
        match: { isFullandFinal: { $ne: "Yes" } },
      })
      .then((results) => results.filter((app) => app.employee)); // Remove null employees

    res.status(200).json(leaveApplications);
  } catch (error) {
    console.error("Error fetching leave applications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllLeaveApplication,
  getAllLeaveApplicationHr,
  getLeaveApplicationNo,
  createLeaveApplication,
  getAllLeaves,
  getMyLeaves,
  updateLeaveApplication,
  updateLeaveApplicationHr,
  getAllLeaveApplicationHrDash,
  deleteLeaveApplication,
  deleteLeaveApplicationHr,
  getLeaveApplicationsByMonthYear,
};
