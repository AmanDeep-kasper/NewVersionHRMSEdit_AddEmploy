const mongoose = require("mongoose");
const { Employee } = require("../models/employeeModel");
const Shift = require("../models/ShiftModel");
const { success, error } = require("../utils/CustomError");

const bcript = require("bcrypt");

const {
  cloudinaryFileUploder,
  removeCloudinaryImage,
  uplodeImagesCloudinary,
} = require("../cloudinary/cloudinaryFileUpload");
const { AttendanceModel } = require("../models/attendanceModel");

const SALT_FECTOUR = 10;
  

const getAllEmployee = async (req, res) => {
  try {
    const employees = await Employee.find(
      { isFullandFinal: { $ne: "Yes" } },
      {
        _id: 1,
        allowMobileLogin: 1,
        isFullandFinal: 1,
        empID: 1,
        Email: 1,
        Account: 1,
        Gender: 1,
        FirstName: 1,
        LastName: 1,
        reportManager: 1,
        reportHr: 1,
        DOB: 1,
        ContactNo: 1,
        DateOfJoining: 1,
        createdAt: 1,
        updatedAt: 1,
        status: 1,
        loginStatus: 1,
        role: 1,
        position: 1,
        department: 1,
      }
    )
      .populate({ path: "role", select: "RoleName" })
      .populate({ path: "position", select: "PositionName" })
      .populate({ path: "department", select: "DepartmentName" });

    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Basic validation
    if (!id || id.length !== 24) {
      // typical MongoDB ObjectId length
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await Employee.findOne(
      {
        _id: id,
      },
      {
        _id: 1,
        allowMobileLogin: 1,
        isFullandFinal: 1,
        empID: 1,
        Email: 1,
        Account: 1,
        Gender: 1,
        FirstName: 1,
        LastName: 1,
        reportManager: 1,
        reportHr: 1,
        DOB: 1,
        ContactNo: 1,
        DateOfJoining: 1,
        createdAt: 1,
        updatedAt: 1,
        status: 1,
        loginStatus: 1,
        role: 1,
        position: 1,
        department: 1,
      },
    )
      .populate({ path: "role", select: "RoleName" })
      .populate({ path: "position", select: "PositionName" })
      .populate({ path: "department", select: "DepartmentName" });

    if (!employee) {
      return res
        .status(404)
        .json({
          message: "Employee not found or already in full & final settlement",
        });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.error("Error fetching employee by ID:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllEmployeeTable = async (req, res) => {
  try {
    const user = req.user; // {_id, Account}
    console.log("Logged-in User:", user);

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const includeFNF = (req.query.includeFNF || false); 

    const search = (req.query.search || "").trim();

    /* ───────── BASE FILTER ───────── */
    const baseFilter = [];

    /* ───────── EMPLOYEE → NO ACCESS ───────── */
    if (user.Account === 3) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view employees",
      });
    }

    /* ───────── GET LOGGED-IN EMPLOYEE (EMAIL) ───────── */
    const loggedInEmployee = await Employee.findById(user._id)
      .select("Email")
      .lean();

    if (!loggedInEmployee) {
      return res.status(404).json({
        success: false,
        message: "User record not found",
      });
    }

    const loggedInEmail = loggedInEmployee.Email;

    /* ───────── ROLE-BASED FILTERS ───────── */

    // 🧑‍💼 ADMIN → all except self
    if (user.Account === 1) {
      baseFilter.push({ _id: { $ne: user._id } });
    }

    // 🧑‍💼 HR → all except Admin & self
    if (user.Account === 2) {
      baseFilter.push(
        { Account: { $ne: 1 } }, // exclude admin
        { _id: { $ne: user._id } }, // exclude self
      );
    }

    // 👨‍💼 MANAGER → only reporting employees
    if (user.Account === 4) {
      baseFilter.push({
        reportManager: loggedInEmail,
      });
    }

    /* ───────── FNF FILTER ───────── */
    if (includeFNF !== "true") {
      baseFilter.push({ isFullandFinal: { $ne: "Yes" } });
    }

    /* ───────── SEARCH FILTER ───────── */
    if (search) {
      const regex = new RegExp(search, "i");
      const parts = search.split(" ");

      const searchConditions = [
        { empID: regex },
        { Email: regex },
        { ContactNo: regex },
        { FirstName: regex },
        { LastName: regex },
      ];

      // Full name search
      if (parts.length === 2) {
        searchConditions.push({
          $and: [
            { FirstName: new RegExp(parts[0], "i") },
            { LastName: new RegExp(parts[1], "i") },
          ],
        });
      }

      baseFilter.push({ $or: searchConditions });
    }

    const finalFilter = baseFilter.length ? { $and: baseFilter } : {};

    /* ───────── SORTING ───────── */
    const allowedSortFields = [
      "createdAt",
      "empID",
      "FirstName",
      "Email",
      "status",
    ];

    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : "createdAt";

    const sort = { [sortBy]: req.query.order === "asc" ? 1 : -1 };

    /* ───────── QUERY ───────── */
    const employees = await Employee.find(finalFilter)
      .select(
        "empID FirstName LastName Email ContactNo status Account position department role profile.image_url createdAt reportManager",
      )
      .populate("position", "PositionName")
      .populate("department", "DepartmentName")
      .populate("role", "RoleName")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Employee.countDocuments(finalFilter);

    return res.json({
      success: true,
      data: employees,
      pagination: {
        totalRecords: total,
        currentPage: page,
        perPage: limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};

const exportAllEmployees = async (req, res) => {
  try {
    const user = req.user;

    const { search = "", status, account, includeFNF = "false" } = req.query;

    /* ───────── BASE FILTER ───────── */
    const baseFilter = [];

    /* ───────── EMPLOYEE → NO ACCESS ───────── */
    if (user.Account === 3) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to export employees",
      });
    }

    /* ───────── GET LOGGED-IN EMPLOYEE EMAIL ───────── */
    const loggedInEmployee = await Employee.findById(user._id)
      .select("Email")
      .lean();

    if (!loggedInEmployee) {
      return res.status(404).json({
        success: false,
        message: "User record not found",
      });
    }

    const loggedInEmail = loggedInEmployee.Email;

    /* ───────── ROLE-BASED FILTERS ───────── */

    // 👑 ADMIN → all except self
    if (user.Account === 1) {
      baseFilter.push({ _id: { $ne: user._id } });
    }

    // 🧑‍💼 HR → all except Admin & self
    if (user.Account === 2) {
      baseFilter.push(
        { Account: { $ne: 1 } }, // exclude Admin
        { _id: { $ne: user._id } }, // exclude self
      );
    }

    // 👨‍💼 MANAGER → only reporting employees
    if (user.Account === 4) {
      baseFilter.push({
        reportManager: loggedInEmail,
      });
    }

    /* ───────── FNF FILTER ───────── */
    if (includeFNF !== "true") {
      baseFilter.push({ isFullandFinal: { $ne: "Yes" } });
    }

    /* ───────── STATUS FILTER ───────── */
    if (status) {
      baseFilter.push({ status });
    }

    /* ───────── ACCOUNT FILTER ───────── */
    if (account) {
      const acc = Number(account);
      if (!isNaN(acc)) {
        baseFilter.push({ Account: acc });
      }
    }

    /* ───────── SEARCH FILTER ───────── */
    if (search) {
      const regex = new RegExp(search, "i");
      const parts = search.split(" ");

      const searchConditions = [
        { FirstName: regex },
        { LastName: regex },
        { Email: regex },
        { empID: regex },
        { ContactNo: regex },
      ];

      // Full name search
      if (parts.length === 2) {
        searchConditions.push({
          $and: [
            { FirstName: new RegExp(parts[0], "i") },
            { LastName: new RegExp(parts[1], "i") },
          ],
        });
      }

      baseFilter.push({ $or: searchConditions });
    }

    const finalFilter = baseFilter.length ? { $and: baseFilter } : {};

    /* ───────── QUERY ───────── */
    const employees = await Employee.find(finalFilter)
      .select(
        "empID FirstName LastName Email ContactNo status Account reportManager role position department createdAt",
      )
      .populate("role", "RoleName")
      .populate("position", "PositionName")
      .populate("department", "DepartmentName")
      .sort({ empID: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: employees,
      total: employees.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Export failed",
    });
  }
};



const getAllEmployeeBasic = async (req, res) => {
  try {
    const employees = await Employee.find(
      {
        isFullandFinal: "No",
        Deleted: false,
        status: "active",
      },
      {
        _id: 1,
        empID: 1,
        FirstName: 1,
        LastName: 1,
        Email: 1,
        Account: 1,
        department: 1 
      }
    )
      .populate({
        path: "department",
        select: "DepartmentName"
      })
      .sort({ FirstName: 1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch employees" });
  }
};




const getFnFEmployee = async (req, res) => {
  try {
    const employees = await Employee.find({ isFullandFinal: "Yes" })
      .populate({ path: "role", select: "roleName" })
      .populate({ path: "position", select: "positionName" })
      .populate({ path: "department", select: "departmentName" })
      .lean();

    // Only include safe fields
    const updatedEmployees = employees.map(emp => ({
      allowMobileLogin: emp.allowMobileLogin || "Allowed",
      isFullandFinal: emp.isFullandFinal || "Yes",
      _id: emp._id,
      empID: emp.empID,
      Email: emp.Email,
      Account: emp.Account,
      Gender: emp.Gender,
      FirstName: emp.FirstName,
      LastName: emp.LastName,
      reportManager: emp.reportManager || "",
      reportHr: emp.reportHr || "",
      DOB: emp.DOB,
      ContactNo: emp.ContactNo,
      DateOfJoining: emp.DateOfJoining,
      createdAt: emp.createdAt,
      updatedAt: emp.updatedAt,
      status: emp.status || "",
      loginStatus: emp.loginStatus || "",
      role: emp.role || [],
      position: emp.position || [],
      department: emp.department || []
    }));

    return res.status(200).json(updatedEmployees);
  } catch (err) {
    console.error("Error fetching FnF employees:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const getAllEmployeeID = async (req, res) => {
  Employee.find()
    .select("_id FirstName LastName empID") // Selecting only required fields
    .exec((err, employees) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }
      res.json(employees);
    });
};



const createEmployee = async (req, res) => {
  try {
    // 1️⃣ GENERATE EMPLOYEE ID
    const latestUser = await Employee.findOne({ empID: /^KASP\d{4}$/ })
      .sort({ empID: -1 });

    const newUserID = latestUser
      ? `KASP${(parseInt(latestUser.empID.substring(4)) + 1)
          .toString()
          .padStart(4, "0")}`
      : "KASP0001";

    const { file } = req;

    let {
      Email,
      Password,
      RoleID,
      Account,
      Gender,
      FirstName,
      LastName,
      DOB,
      ContactNo,
      EmployeeCode,
      DepartmentID,
      PositionID,
      DateOfJoining,
      reportManager,
      reportHr,
      status,
      loginStatus,
      shifts,
      BankName,
      BankAccount,
      BankIFSC,
      UANNumber,
      PANcardNo,
      LocationType,
    } = req.body;

    // 2️⃣ CLEAN OPTIONAL FIELDS
    const cleanOptional = (val) => {
      if (!val) return null;
      if (typeof val !== "string") return val;
      if (val.trim() === "" || val === "N/A") return null;
      return val.trim();
    };

    BankAccount = cleanOptional(BankAccount);
    BankIFSC = cleanOptional(BankIFSC);
    UANNumber = cleanOptional(UANNumber);
    PANcardNo = cleanOptional(PANcardNo);

    // 3️⃣ DUPLICATE CHECK
    const existingEmployee = await Employee.findOne({
      $or: [{ Email }, { ContactNo }],
    });

    if (existingEmployee) {
      const duplicate = [];
      if (existingEmployee.Email === Email) duplicate.push("Email");
      if (existingEmployee.ContactNo === ContactNo)
        duplicate.push("Contact Number");

      return error(res, 400, `${duplicate.join(", ")} already exists`);
    }

    // 4️⃣ REQUIRED FIELD CHECK (SAFE)
    const required = [
      ["Email", Email],
      ["Password", Password],
      ["Role", RoleID],
      ["Account", Account],
      ["Gender", Gender],
      ["First Name", FirstName],
      ["DOB", DOB],
      ["Contact Number", ContactNo],
      ["Department", DepartmentID],
      ["Position", PositionID],
      ["Date Of Joining", DateOfJoining],
      ["Shift", shifts],
      ["Location Type", LocationType],
    ];

    const missing = required
      .filter(([_, value]) => {
        if (value === undefined || value === null) return true;
        if (typeof value === "string" && value.trim() === "") return true;
        return false;
      })
      .map(([label]) => label);

    if (missing.length)
      return error(
        res,
        400,
        `Please fill required fields: ${missing.join(", ")}`
      );

    // 5️⃣ CONTACT VALIDATION
    if (String(ContactNo).length !== 10)
      return error(res, 400, "Enter a valid 10-digit Contact Number");

    // 6️⃣ CHECK SHIFT EXISTS
    const shiftExists = await Shift.findById(shifts);
    if (!shiftExists) return error(res, 400, "Invalid Shift ID");

    // 7️⃣ CREATE EMPLOYEE OBJECT
    const newEmployee = new Employee({
      empID: newUserID,
      Email,
      Password,
      role: RoleID,
      Account,
      Gender,
      FirstName,
      LastName,
      DOB,
      ContactNo,
      EmployeeCode,
      department: DepartmentID,
      position: PositionID,
      DateOfJoining,
      reportManager,
      reportHr,
      status,
      loginStatus,
      shifts,
      BankName,
      BankAccount,
      BankIFSC,
      UANNumber,
      PANcardNo,
      LocationType,
      profile: null,
    });

    // 8️⃣ IMAGE UPLOAD (Cloudinary)
    if (file) {
      const uploaded = await cloudinaryFileUploder(file.path);
      if (uploaded) newEmployee.profile = uploaded;
    }

    // 9️⃣ PASSWORD HASH
    newEmployee.Password = await bcript.hash(Password, SALT_FECTOUR);

    // 🔟 SAVE EMPLOYEE
    const savedEmployee = await newEmployee.save();

    // 1️⃣1️⃣ CREATE ATTENDANCE SKELETON
    const date = new Date();
    const newAttendance = new AttendanceModel({
      employeeObjID: savedEmployee._id,
      years: [
        {
          year: date.getFullYear(),
          months: [
            {
              month: date.getMonth() + 1,
              dates: [
                {
                  date: date.getDate(),
                  day: date.getDay(),
                  shifts: shifts,
                },
              ],
            },
          ],
        },
      ],
    });

    const savedAttendance = await newAttendance.save();

    savedEmployee.attendanceObjID = savedAttendance._id;
    await savedEmployee.save();

    // 1️⃣2️⃣ CLEAN RESPONSE
    return res.status(201).json({
      status: true,
      message: "Employee created successfully",
      data: {
        _id: savedEmployee._id,
        empID: savedEmployee.empID,
        Email: savedEmployee.Email,
        // FirstName: savedEmployee.FirstName,
        // LastName: savedEmployee.LastName,
        // ContactNo: savedEmployee.ContactNo,
        // department: savedEmployee.department,
        // position: savedEmployee.position,
        // role: savedEmployee.role,
        // DateOfJoining: savedEmployee.DateOfJoining,
        // shifts: savedEmployee.shifts,
        // status: savedEmployee.status,
        // LocationType: savedEmployee.LocationType,
      },
    });
  } catch (err) {
    console.log("Create Employee Error:", err);
    return error(res, 500, "Internal Server Error");
  }
};

const updateEmployee = async (req, res) => {
  try {
    const {
      Email,
      RoleID,
      Account,
      Gender,
      FirstName,
      LastName,
      DOB,
      ContactNo,
      EmployeeCode,
      DepartmentID,
      PositionID,
      DateOfJoining,
      reportManager,
      status,
      BankName,
      BankAccount,
      BankIFSC,
      UANNumber,
      PANcardNo,
      LocationType,
      allowMobileLogin,
      isFullandFinal,
    } = req.body;

    const empId = req.params.id;

    // ============================
    // 1️⃣ Find employee
    // ============================
    const findEmployee = await Employee.findById(empId);
    if (!findEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // ============================
    // 2️⃣ Email validation
    // ============================
    if (!Email || Email.trim() === "") {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailExists = await Employee.findOne({
      Email: Email.toLowerCase(),
      _id: { $ne: empId },
    });

    if (emailExists) {
      return res.status(409).json({
        message: "Email is already registered by another employee",
      });
    }

    // ============================
    // 3️⃣ Contact validation
    // ============================
    if (ContactNo && ContactNo.length !== 10) {
      return res.status(400).json({
        message: "Enter a valid 10-digit Contact Number",
      });
    }

    if (ContactNo) {
      const findContact = await Employee.findOne({
        ContactNo,
        _id: { $ne: empId },
      });

      if (findContact) {
        return res.status(409).json({
          message: "Contact Number is already registered",
        });
      }
    }

    // ============================
    // 4️⃣ Enum Normalizer
    // ============================
    const normalizeEnum = (value, fallback, validValues) => {
      if (!value || value.trim() === "") return fallback;
      return validValues.includes(value) ? value : fallback;
    };

    // ============================
    // 5️⃣ Prepare update object
    // ============================
    const updatedEmployees = {
      Email: Email.toLowerCase(),
      Account,
      role: RoleID,
      Gender,
      FirstName,
      LastName,
      DOB,
      ContactNo,
      EmployeeCode,
      department: DepartmentID,
      position: PositionID,
      DateOfJoining,
      reportManager,
      status,
      LocationType,
      BankName,
      BankAccount,
      BankIFSC,
      UANNumber,
      PANcardNo,

      allowMobileLogin: normalizeEnum(
        allowMobileLogin,
        findEmployee.allowMobileLogin,
        ["Allowed", "Not Allowed"],
      ),

      isFullandFinal: normalizeEnum(
        isFullandFinal,
        findEmployee.isFullandFinal,
        ["Yes", "No"],
      ),

      profile: findEmployee.profile,
    };

    // ============================
    // 6️⃣ Profile Image Update
    // ============================
    const profileFile = req.files?.find((file) => file.fieldname === "profile");

    if (profileFile) {
      if (findEmployee.profile?.publicId) {
        await removeCloudinaryImage(findEmployee.profile.publicId);
      }

      const uploadedProfile = await uplodeImagesCloudinary(profileFile.path);
      if (uploadedProfile) {
        updatedEmployees.profile = uploadedProfile;
      }
    }

    // ============================
    // 7️⃣ Update Employee
    // ============================
    const updatedEmployee = await Employee.findByIdAndUpdate(
      empId,
      { $set: updatedEmployees },
      { new: true, runValidators: true },
    ).select(
      "empID Email FirstName LastName Gender ContactNo DateOfJoining Account allowMobileLogin isFullandFinal profile",
    );

    // ============================
    // 8️⃣ Response
    // ============================
    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Update error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate value not allowed",
        field: error.keyValue,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ✅ GET SINGLE EMPLOYEE FOR EDIT FORM
const getEmployeeByIdEditForm = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id)
      .populate("role", "RoleName")
      .populate("department", "DepartmentName")
      .populate("position", "PositionName")
      .select("-Password"); // 🔐 never send password

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Get Employee By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};





const updateEmployeeShift = async (req, res) => {
  try {
    const { employeeId, shiftId, updatedDate, updatedBy } = req.body; //  `updatedBy` added

    if (!employeeId || !shiftId || !updatedDate) {
      return res.status(400).json({
        message: "Employee ID, Shift ID, and Updated Date are required",
      });
    }

    //  Validate Employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    //  Validate Shift
    const shift = await Shift.findById(shiftId);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    //  Parse the date & validate
    const effectiveDate = new Date(updatedDate);
    if (isNaN(effectiveDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    //  Prevent duplicate scheduling (Only check if `scheduledShiftChange` exists)
    if (employee.scheduledShiftChange?.effectiveDate &&
      new Date(employee.scheduledShiftChange.effectiveDate).getTime() === effectiveDate.getTime()) {
      return res.status(400).json({ message: "Shift update is already scheduled for this date" });
    }

    //  Store Shift Change in History
    employee.shiftHistory.push({
      shift: shiftId,
      updatedOn: new Date(),
      updatedBy, //  Store the user who updated
    });

    //  Schedule the shift change instead of applying immediately
    employee.scheduledShiftChange = {
      shift: shiftId,
      effectiveDate,
    };

    await employee.save();
    console.log(`Shift scheduled for update on ${updatedDate} for Employee ${employeeId}`);

    return res.status(200).json({
      message: "Shift update scheduled successfully",
      scheduledShift: employee.scheduledShiftChange,
    });
  } catch (error) {
    console.error(" Error scheduling shift update:", error);
    return res.status(500).json({
      message: "Error scheduling shift update",
      error: error.message,
    });
  }
};

//  Get Upcoming Scheduled Shifts
const getUpcomingScheduledShifts = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    //  Fetch employees with scheduled shifts
    const scheduledShifts = await Employee.find(
      { "scheduledShiftChange.effectiveDate": { $gte: today } }
    )
      .populate("scheduledShiftChange.shift") //  Populate shift details
      .select("FirstName LastName scheduledShiftChange"); //  Fetch only required fields

    res.status(200).json(scheduledShifts);
  } catch (error) {
    console.error("❌ Error fetching scheduled shifts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get Shift History for All Employees
const getAllEmployeesShiftHistory = async (req, res) => {
  try {
    const { department, startDate, endDate, employeeName } = req.query;
    let query = { shiftHistory: { $exists: true, $not: { $size: 0 } } };

    // 🔹 Filter by Department
    if (department) {
      query.Department = department;
    }

    // 🔹 Filter by Name (Case Insensitive)
    if (employeeName) {
      query.$or = [
        { FirstName: { $regex: employeeName, $options: "i" } },
        { LastName: { $regex: employeeName, $options: "i" } },
      ];
    }

    // 🔹 Filter by Date Range (Shift Updates)
    if (startDate && endDate) {
      query["shiftHistory.updatedOn"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // 🔹 Fetch & Populate Data
    const employees = await Employee.find(query)
      .populate("shiftHistory.shift") // Load shift details
      .select("empID FirstName LastName Department shiftHistory")
      .sort({ "shiftHistory.updatedOn": -1 }); // Sort by latest shift update

    if (!employees.length) {
      return res.status(404).json({ message: "No shift history found for the given filters." });
    }

    res.status(200).json(employees);
  } catch (error) {
    console.error("❌ Error fetching all employees' shift history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// find and delete the city
const deleteEmployee = async (req, res) => { };


const upcomingBirthDay = async (req, res) => {
  const employee = await Employee.find();

  employee.forEach((data) => {
    let temp = {
      data,
      FirstName: data["FirstName"],
      LastName: data["LastName"],
      DOB: data["DOB"],
    };

    // Use set function to update state
  });
};

const findParticularEmployee = async (req, res) => {
  const id = req.params.id;

  try {
    const findEmployee = await Employee.findById({ _id: id });
    if (findEmployee) {
      return res.status(200).send(findEmployee);
    } else {
      return res.status(400).send("Employee not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};


const findParticularEmployeeNavbar = async (req, res) => {
  try {
    const id = req.user._id;

    // 1️⃣ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    // 2️⃣ Fetch only required fields
    const employee = await Employee.findOne(
      {
        _id: id,
        Deleted: false,
        // isFullandFinal: false,
      },
      {
        FirstName: 1,
        LastName: 1,
        Notification: 1,
        profile: 1, // important
      }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 3️⃣ Force profile object (if DB has null)
    if (!employee.profile || typeof employee.profile !== "object") {
      employee.profile = {
        image_url: "",
        publicId: "",
      };
    }

    // 4️⃣ Ensure image_url always exists
    if (!employee.profile.image_url) {
      employee.profile.image_url = "";
    }

    return res.status(200).json(employee);
  } catch (error) {
    console.error("findParticularEmployee:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const userData = async (req, res) => {
  const id = req.params.id;

  try {
    const findEmployee = await Employee.findById(
      { _id: id },
      "Email Account FirstName LastName Notification department"
    ).populate("department", "DepartmentName");

    if (findEmployee) {
      return res.status(200).send(findEmployee);
    } else {
      return res.status(400).send("Employee not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};



const notificationStatusUpdate = async (req, res) => {
  const id = req.params.id;
  const { email } = req.body;

  try {
    const findEmployee = await Employee.findOne({ Email: email });

    if (findEmployee) {
      const notificationIndex = findEmployee.Notification.findIndex(
        (notification) => notification.taskId === id
      );

      if (notificationIndex !== -1) {
        findEmployee.Notification[notificationIndex].status = "seen";
        findEmployee.markModified("Notification");
        await findEmployee.save();
        res.status(200).json({
          message: "Notification status updated to seen",
          result: findEmployee,
        });
      } else {
        res.status(404).json({
          message: "Notification not found with the specified id",
        });
      }
    } else {
      res.status(404).json({
        message: "User not found with the specified email",
      });
    }
  } catch (error) {
    console.error(error);
  }
};



const employeeLoginStatusUpdate = async (req, res) => {
  const { email } = req.body;
  try {
    const findEmployee = await Employee.findOne({ Email: email });

    if (findEmployee) {
      findEmployee.loginStatus = "loggedIn";
      findEmployee.markModified("loginStatus");
      await findEmployee.save();
      res.status(200).json({
        message: "Notification status updated to LoggedIn",
      });
    } else {
      res.status(404).json({
        message: "User not found with the specified email",
      });
    }
  } catch (error) {
    console.error(error);
  }
};




const employeeLogoutStatusUpdate = async (req, res) => {
  const { email } = req.body;
  try {
    const findEmployee = await Employee.findOne({ Email: email });

    if (findEmployee) {
      findEmployee.loginStatus = "loggedOut";
      findEmployee.markModified("loginStatus");
      await findEmployee.save();
      res.status(200).json({
        message: "Notification status updated to loggedOut",
      });
    } else {
      res.status(404).json({
        message: "User not found with the specified email",
      });
    }
  } catch (error) {
    console.error(error);
  }
};





const deleteNotification = async (req, res) => {
  const id = req.params.id;
  const { email } = req.body;
  try {
    const findEmployee = await Employee.findOne({ Email: email });

    if (findEmployee) {
      const notificationIndex = findEmployee.Notification.findIndex(
        (notification) => notification.taskId === id
      );

      if (notificationIndex !== -1) {
        findEmployee.Notification.splice(notificationIndex, 1);
        findEmployee.markModified("Notification");
        await findEmployee.save();
        res.status(200).json({
          message: "Notification status updated to seen",
          result: findEmployee,
        });
      } else {
        res.status(404).json({
          message: "Notification not found with the specified id",
        });
      }
    } else {
      res.status(404).json({
        message: "User not found with the specified email",
      });
    }
  } catch (error) {
    console.error(error);
  }
};




const multiSelectedDeleteNotification = async (req, res) => {
  const { employeeMail, tasks } = req.body;

  try {
    const findEmployee = await Employee.findOne({ Email: employeeMail });

    if (findEmployee) {
      const filteredObjectsArray = findEmployee.Notification.filter(
        (obj) => !tasks.includes(obj.taskId)
      );

      findEmployee.Notification = filteredObjectsArray;
      findEmployee.markModified("Notification");
      await findEmployee.save();
      res.status(200).json({
        message: "Notification status updated to seen",
        result: findEmployee,
      });
    } else {
      res.status(404).json({
        message: "User not found with the specified email",
      });
    }
  } catch (error) {
    console.error(error);
  }
};
const selectedDeleteNotification = async (req, res) => {
  const { email } = req.body;
  try {
    const findEmployee = await Employee.findOne({ Email: email });
    if (findEmployee) {
      findEmployee.Notification = [];
      findEmployee.markModified("Notification");
      await findEmployee.save();
      res.status(200).json({
        message: "Notification status updated to seen",
        result: findEmployee,
      });
    } else {
      res.status(404).json({
        message: "User not found with the specified email",
      });
    }
  } catch (error) {
    console.error(error);
  }
};


const getEmployeeByStatus = async (req, res) => {
  try {
    const { status, email } = req.body;

    if (!status || !email) {
      return res.status(400).json({
        success: false,
        message: "Status and email are required.",
      });
    }

    // 🔹 Find the logged-in employee
    const employee = await Employee.findOne({ Email: email }).select("reportManager reportHr");

    if (!employee) {
      // 🔸 Employee not found — safely return
      return res.status(404).json({
        success: false,
        message: `Employee with email ${email} not found.`,
      });
    }

    let managerQuery = {};

    // 🔹 Build query based on status
    if (status === "employee") {
      managerQuery = { $or: [{ Account: 4 }, { Account: 1 }, { Account: 2 }] }; // Manager, Admin, HR
    } else if (status === "manager" || status === "hr") {
      managerQuery = { $or: [{ Account: 1 }] }; // Admin
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    // 🔹 Find users with matching roles
    const managers = await Employee.find(managerQuery).select("Email");

    if (!managers.length) {
      return res.status(200).json({
        success: true,
        mails: [],
        message: "No matching managers found.",
      });
    }

    // 🔹 Filter out reportManager and reportHr safely
    const mails = managers.filter(
      (val) =>
        val.Email !== employee.reportManager &&
        val.Email !== employee.reportHr
    );

    return res.status(200).json({
      success: true,
      mails,
    });

  } catch (error) {
    console.error("Error in getEmployeeByStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching employee data.",
      error: error.message,
    });
  }
};




const getAllEmployeeByStatus = async (req, res) => {
  const { status, email } = req.body;

  if (status === "employee") {
    const employee = await Employee.find({ Email: email }).select(
      "reportManager"
    );
    const reportManager = employee[0].reportManager;
    let managers = await Employee.find({
      $or: [{ Account: 4 }, { Account: 1 }, { Account: 2 }],
    }).select("Email");

    // Remove the reportManager email from the managers list
    managers = managers.filter((manager) => manager.Email !== reportManager);

    res.status(200).send({ reportManager, managers });
  } else if (status === "manager" || status === "hr") {
    const employee = await Employee.find({ Email: email }).select(
      "reportManager"
    );
    let managers = await Employee.find({
      $or: [{ Account: 1 }],
    }).select("Email");

    // Remove the reportManager email from the managers list
    const reportManager = employee[0].reportManager;
    managers = managers.filter((manager) => manager.Email !== reportManager);

    res.status(200).send({ reportManager, managers });
  }
};

const employeeByDepartment = async (req, res) => {
  try {
    const allEmp = await Employee.find({
      status: "active",
      Account: { $in: [2, 4] }, // cleaner
    })
      .select("department Email FirstName LastName Account position profile")
      .populate("department position")
      .lean(); // IMPORTANT for performance & safety

    const departmentWise = {};

    allEmp.forEach((emp) => {
      const deptName = emp.department?.[0]?.DepartmentName || "Unassigned";

      if (!departmentWise[deptName]) {
        departmentWise[deptName] = [];
      }

      departmentWise[deptName].push(emp);
    });

    res.status(200).json(departmentWise);
  } catch (error) {
    console.error("employeeByDepartment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const employeeByDepartmentLight = async (req, res) => {
  try {
    const employees = await Employee.find({
      status: "active",
      Account: { $in: [2, 4] },
    })
      .select("department FirstName LastName")
      .populate({
        path: "department",
        select: "DepartmentName",
      })
      .lean();

    const departmentWise = {};

    for (const emp of employees) {
      const deptName = emp.department?.[0]?.DepartmentName || "Unassigned";

      if (!departmentWise[deptName]) {
        departmentWise[deptName] = {
          department: deptName,
          count: 0,
          members: [],
        };
      }

      departmentWise[deptName].count++;

      departmentWise[deptName].members.push({
        FirstName: emp.FirstName,
        LastName: emp.LastName,
      });
    }

    res.status(200).json(departmentWise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const employeesByDepartmentDetail = async (req, res) => {
  try {
    const { departmentName } = req.params;

    const employees = await Employee.find({
      status: "active",
    })
      .populate({
        path: "department",
        select: "DepartmentName",
      })
      .populate("position")
      .select("FirstName LastName Email Account position profile department")
      .lean();

    let result = [];

    if (departmentName === "Unassigned") {
      // ✅ Users with NO valid department
      result = employees.filter(
        (emp) =>
          !emp.department ||
          !Array.isArray(emp.department) ||
          emp.department.length === 0
      );
    } else {
      // ✅ Users with matching department
      result = employees.filter(
        (emp) =>
          Array.isArray(emp.department) &&
          emp.department.some((d) => d.DepartmentName === departmentName)
      );
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("employeesByDepartmentDetail error:", error);
    res.status(500).json({ message: "Server error" });
  }
};





const EmployeeTeam = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res
        .status(400)
        .json({ error: "Reporting manager email is required" });
    }

    // Query to find employees whose reportingManager email matches the provided email
    const employees = await Employee.find({
      $or: [{ reportManager: email }, { reportHr: email }],
    }) // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
      .populate({
        path: "position department",
      })

      .select(
        "profile FirstName LastName empID Account status Email ContactNo loginStatus"
      );

    // Check if employees were found
    if (employees.length === 0) {
      return res.status(404).json({
        message: "No employees found with the provided reporting manager email",
      });
    }

    // Send the found employees as response
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const EmployeeAllForAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    // If an email is provided, return employees reporting to that manager/HR.
    // Otherwise return all employees (this endpoint is intended for admins).
    let query = {};
    if (email) {
      query = { $or: [{ reportManager: email }, { reportHr: email }] };
    }

    // Query employees based on constructed query
    const employees = await Employee.find(query)
      .populate({
        path: "position department",
      })

      .select(
        "profile FirstName LastName empID Account status Email ContactNo loginStatus"
      );

    // Return array (may be empty) so callers (frontend) can handle no-results gracefully
    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { _id, Account } = req.body;

    // console.log("REQUEST BODY =", req.body);

    if (!_id || Account === undefined) {
      return res.status(400).json({ error: "Invalid request — Missing _id or Account" });
    }

    const emp = await Employee.findById(_id).lean();

    if (!emp) {
      return res.status(404).json({ error: "Employee not found", _id });
    }

    // console.log("DB ACCOUNT =", emp.Account, "TYPE =", typeof emp.Account);
    // console.log("BODY ACCOUNT =", Account, "TYPE =", typeof Account);

    // Convert both sides to string
    if (String(emp.Account) !== String(Account)) {
      return res.status(401).json({
        error: "Unauthorized Access — Account mismatch",
        expected: emp.Account,
        got: Account
      });
    }

    return res.status(200).json({ message: "Authorized Access" });

  } catch (error) {
    console.error("verifyAccount error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};



const getMobileLoginStatusByEmpId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Employee _id is required" });
    }

    const employee = await Employee.findOne({
      _id: id
    }).select("allowMobileLogin");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      allowMobileLogin: employee.allowMobileLogin,
    });
  } catch (error) {
    console.error("Error fetching mobile login status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// Shashi Changes 
const getBirthdayBoardEmployees = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employees = await Employee.find(
      {
        Deleted: false,
        DOB: { $ne: null },
        status: { $regex: /^active$/i },
      },
      {
        FirstName: 1,
        LastName: 1,
        DOB: 1,
        empID: 1,
        profile: 1,
        position: 1,
      }
    )
      .populate("position", "PositionName")
      .lean();

    const upcoming = employees
      .map((emp) => {
        const dobISO = emp.DOB.toISOString().split("T")[0];
        const [y, m, d] = dobISO.split("-");
        const dob = new Date(Number(y), Number(m) - 1, Number(d));

        let nextBirthday = new Date(
          today.getFullYear(),
          dob.getMonth(),
          dob.getDate()
        );

        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        const days = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

        if (days < 0 || days > 30) return null;

        return {
          empID: emp.empID,
          FirstName: emp.FirstName,
          LastName: emp.LastName,
          DOB: dobISO,
          PositionName: emp.position?.[0]?.PositionName || "",
          image_url: emp.profile?.image_url || "",
          days,
          isToday: days === 0,
          label:
            days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.days - b.days)
      .slice(0, 10); // 👈 only top 10 upcoming birthdays

    res.status(200).json(upcoming);
  } catch (error) {
    console.error("Birthday Board Error:", error);
    res.status(500).json({ message: "Failed to load birthday board data" });
  }
};





module.exports = {
  employeeByDepartment,
  getEmployeeById,
  getEmployeeByStatus,
  verifyAccount,
  EmployeeTeam,
  EmployeeAllForAdmin,
  getAllEmployeeByStatus,
  getAllEmployee,
  upcomingBirthDay,
  createEmployee,
  updateEmployee,
  updateEmployeeShift,
  deleteEmployee,
  findParticularEmployee,
  selectedDeleteNotification,
  deleteNotification,
  userData,
  notificationStatusUpdate,
  multiSelectedDeleteNotification,
  employeeLogoutStatusUpdate,
  employeeLoginStatusUpdate,
  getAllEmployeeID,
  getUpcomingScheduledShifts,
  getAllEmployeesShiftHistory,
  getMobileLoginStatusByEmpId,
  getFnFEmployee,
  getBirthdayBoardEmployees,
  getAllEmployeeBasic,
  findParticularEmployeeNavbar,
  employeeByDepartmentLight,
  employeesByDepartmentDetail,
  getAllEmployeeTable,
  exportAllEmployees,
  getEmployeeByIdEditForm,
};
