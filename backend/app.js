const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("mongo-sanitize");
const sanitizeHtml = require("sanitize-html");
const Shift = require("./models/shiftModel");
const Task = require("./models/taskModel");
const Update = require("./models/updateModel");
const cloudinary = require("cloudinary").v2;


require("dotenv").config();

const PORT = process.env.PORT || 5000;


// ================== App Setup ==================
const app = express();
const server = http.createServer(app);
app.set("trust proxy", 1);

// ================== ENV ==================
const isDev = process.env.NODE_ENV !== "production";

const FRONTEND_URL = isDev
  ? "http://localhost:3000"
  : process.env.PROD_FRONTEND;

const BACKEND_URL = isDev
  ? "http://localhost:4000"
  : process.env.PROD_BACKEND;

const SOCKET_HOST = FRONTEND_URL.replace(/^https?:\/\//, "");

console.log("🔵 MODE:", isDev ? "Development" : "Production");


// ================= SECURITY (FINAL & CORRECT) =================

app.disable("x-powered-by");

app.use(
  helmet({
    // Needed for Socket.io
    crossOriginEmbedderPolicy: false,

    // Clickjacking protection
    // frameguard: { action: "deny" },

    // 🔐 STRICT CONTENT SECURITY POLICY
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // No inline , no eval (XSS safe)
        // ❌ No inline, no eval (XSS safe)
        // scriptSrc: ["'self'"],
        // React production build works without unsafe-inline
        styleSrc: ["'self'"],

        // Cloudinary + local images
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
        ],

        fontSrc: ["'self'"],

        // API + Socket.io
        connectSrc: [
          "'self'",
          "https:",
          "wss:",
        ],

        // Clickjacking protection
        frameAncestors: ["'none'"],

        // Block plugins & embeds
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],

        baseUri: ["'self'"],
        formAction: ["'self'"],

        // Service workers (safe)
        workerSrc: ["'self'"],

        // Disable mixed content
        upgradeInsecureRequests: [],
      },
    },

    // Other security headers
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    noSniff: true,
    hidePoweredBy: true,
  })
);

// 🔐 Permissions Policy (Helmet v7+)
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=()"
  );
  next();
});






// =================================================
// ================= BODY ==========================
// =================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// =================================================
// ================= XSS ===========================
// =================================================
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);

  const textFields = ["comment", "description", "note", "reason", "message"];
  textFields.forEach((field) => {
    if (req.body?.[field]) {
      req.body[field] = sanitizeHtml(req.body[field], {
        allowedTags: [],
        allowedAttributes: {},
      });
    }
  });

  next();
});

// =================================================
// ================= CORS ==========================
// =================================================
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-reset-token"],
  })
);

// =================================================
// ================= SOCKET ========================
// =================================================
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  allowEIO3: true,
});

const socketRateLimits = new Map();
io.use((socket, next) => {
  const ip = socket.handshake.address;
  const now = Date.now();
  const data = socketRateLimits.get(ip) || { count: 0, last: now };

  if (now - data.last > 15 * 60 * 1000) {
    data.count = 0;
    data.last = now;
  }

  data.count++;
  socketRateLimits.set(ip, data);

  if (data.count > 100) {
    return next(new Error("Too many socket requests"));
  }

  next();
});


// ================== DB Connection ==================
const connection = require("./dbConnection/dbconnect");
connection();

// ================== Schedulers ==================
const { scheduler } = require("./schedule/schedule");
const { logoutScheduler } = require("./schedule/logoutScheduler");
const scheduleShiftUpdates = require("./schedule/scheduleShiftUpdates");
require("./schedule/autoRejectLeave");

scheduler();
logoutScheduler();
scheduleShiftUpdates();
// ================== Static File Folders ==================
app.use("/employee_profile", express.static(path.join(__dirname, "employee_profile")));
app.use("/taskAttachment", express.static(path.join(__dirname, "taskAttachment")));
app.use("/empAttachment", express.static(path.join(__dirname, "empAttachment")));

// ================== CORS Setup ==================

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-reset-token"],
  })
);

// ================== Routes ==================
const loginRoute = require("./routes/loginRoute");
const shiftRoutes = require("./routes/shiftRoutes");
const contery = require("./routes/countryRoutes");
const stateRoute = require("./routes/stateRoute");
const cityRoute = require("./routes/cityRoute");
const companyRoute = require("./routes/companyRoute");
const departmentRoute = require("./routes/departmentRoute");
const roleRoute = require("./routes/roleRoute");
const positionRoute = require("./routes/positionRoute");
const familyRoute = require("./routes/familyRoute");
const employeeRoute = require("./routes/employeeRoute");
const workExperienceRoute = require("./routes/workExperienceRoute");
const portalRoute = require("./routes/portalRoute");
const projectRoute = require("./routes/projectRoute");
const salaryRoute = require("./routes/salaryRoute");
const leaveRoute = require("./routes/leaveRoute");
const noticeRoute = require("./routes/noticeRoute");
const requestRoute = require("./routes/requestRoute");
const educationRoute = require("./routes/educationRoute");
const personalInfoRoute = require("./routes/personalInfoRoute");
const { totalLeaveRoute } = require("./routes/totalLeaveRoute");
const forgotePassRoute = require("./routes/forgotePassRoute");
const locationRoutes = require("./routes/locationRoutes");
const { taskRoute } = require("./routes/taskRoute");
const { attendanceRoute } = require("./routes/attendanceRoute");
const marketingReportRoutes = require("./routes/marketingReportRoutes");
const dailyReportRoutes = require("./routes/dailyReportRoutes");
const stickyNoteRoutes = require("./routes/stickyNoteRoutes");
const todoRoutes = require("./routes/todoRoutes");
const myTodoRoutes = require("./routes/myTodoRoutes");
const WeekendSettingsRoute = require("./routes/Settings/WeekendSettingsRoute");
const reimbursementExpenseRoutes = require("./routes/reimbursementExpenseRoutes");
const payrollRecordsRoute = require("./routes/PayrollRecordsRoutes");
const CustomAgendaRoute = require("./routes/customAgendaRoutes");
const brandlogoRoute = require("./routes/Settings/brandlogoRoute");

// ================== Static Build (React) ==================

// const buildPath = path.join(__dirname, "../frontend/build");
// app.use(express.static(buildPath));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(buildPath, "index.html"));
// });


// ================== Error Handler ==================
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);



// create a custom  route
app.use("/api", forgotePassRoute);
app.use("/api", contery);
app.use("/api", stateRoute);
app.use("/api", cityRoute);
app.use("/api", companyRoute);
app.use("/api", roleRoute);
app.use("/api", positionRoute);
app.use("/api", departmentRoute);
app.use("/api", employeeRoute);
app.use("/api", familyRoute);
app.use("/api", educationRoute);
app.use("/api", workExperienceRoute);
app.use("/api", projectRoute);
app.use("/api", portalRoute);
app.use("/api", salaryRoute);
app.use("/api", leaveRoute);
app.use("/api", personalInfoRoute);
app.use("/api", loginRoute);
app.use("/api", taskRoute);
app.use("/api", attendanceRoute);
app.use("/api", locationRoutes);
app.use("/api", totalLeaveRoute);
app.use("/api", noticeRoute);
app.use("/api", requestRoute);
app.use("/api", marketingReportRoutes);
app.use("/api", dailyReportRoutes);
app.use("/api", stickyNoteRoutes);
app.use("/api", todoRoutes);
app.use("/api", myTodoRoutes);
app.use("/api", shiftRoutes);
app.use("/api", reimbursementExpenseRoutes);
app.use("/api", WeekendSettingsRoute);
app.use("/api", payrollRecordsRoute);
app.use("/api", CustomAgendaRoute);
app.use("/api", brandlogoRoute);
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the console
  res.status(err.status || 500).send(err.message || "Something went wrong!"); // Send error message
});


// ================== Dynamic Content Security Policy ==================



const multer = require("multer");
const { Employee } = require("./models/employeeModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/api/getTask", async (req, res) => {
  try {
    Task.find({}).then((data) => {
      res.send({ status: "ok........", data: data });
    });
  } catch (error) { }
});


app.post("/api/tasks/:taskId/employees", async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const employeesArray = req.body.employees;

    if (!Array.isArray(employeesArray)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const newEmployees = [];

    for (const employeeData of employeesArray) {
      const { empname, empemail, empdesignation, emptaskStatus } = employeeData;

      // Check if empemail already exists in the task's employees array
      const existingEmployee = task.employees.find(
        (employee) => employee.empemail === empemail
      );

      if (existingEmployee) {
        // If the employee already exists, throw an error or handle it accordingly
        throw new Error(`Duplicate empemail: ${empemail}`);
      } else {
        // Create a new employee object and add it to the array
        const newEmployee = {
          empname,
          empemail,
          empdesignation,
          emptaskStatus,
        };
        newEmployees.push(newEmployee);
      }
    }



    // Add the new employees to the task's employees array
    task.employees.push(...newEmployees);

    // Save the updated task
    await task.save();

    // Respond with the updated task
    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);

    // Check if the error is due to a duplicate empemail
    if (error.message.includes("Duplicate empemail")) {
      return res
        .status(400)
        .json({ error: "Duplicate empemail found in the request" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const users = {};
io.on("connection", (socket) => {
  //abhay:- here user is connecting and we are storing socket id and Mail
  socket.on("userConnected", (userData) => {
    // Check if the email is already present, and update the socket ID
    if (users[userData.email]) {
      users[userData.email].socketId = socket.id;
    } else {
      // If the email is not present, add a new entry
      users[userData.email] = { email: userData.email, socketId: socket.id };
    }
  });

  socket.on("disconnect", () => {
    // Find the user by socket ID and remove them
    for (const email in users) {
      if (users[email].socketId === socket.id) {
        delete users[email];
        break;
      }
    }
  });



  app.post("/api/notice", upload.single("file"), async (req, res) => {
    const { notice, creator, creatorMail } = req.body;

    try {
      let attachmentUrl = null;

      // Check if a file was uploaded
      if (req.file) {
        const { path } = req.file; // The file path from Multer

        // Upload the file to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(path, {
          folder: "notices", // Optional: specify folder in Cloudinary
        });


        // Store the Cloudinary file URL
        attachmentUrl = cloudinaryResult.secure_url;
      }

      // Create a new notice document, with or without attachments
      const newNotice = await Notice.create({
        notice,
        attachments: attachmentUrl, // This can be null if no attachment was uploaded
        creator,
        creatorMail,
      });

      // Update all employees with the new notice ID
      await Employee.updateMany(
        {},
        { $push: { Notice: newNotice._id } },
        { new: true }
      );

      // Emit the notice data through the socket
      io.emit("notice", newNotice);

      res
        .status(201)
        .json({ message: "Notice created and added to all employees." });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });


  app.post("/api/noticeDelete", async (req, res) => {
    const { noticeId } = req.body;
    try {
      // Step 1: Delete the notice from the Notice collection
      await Notice.findByIdAndDelete({ _id: noticeId });

      // Step 2: Remove the noticeId from the Notice array in the Employee documents
      await Employee.updateMany(
        {},
        {
          $pull: {
            Notice: noticeId, // Removes the noticeId from the Notice array
          },
        }
      );
      // Emit a socket event to notify clients of the deletion
      io.emit("noticeDelete", true);
      // Send a success response
      res.status(201).json({
        message: "Notice deleted successfully",
      });
    } catch (error) {
      // Handle errors
      console.error("Error deleting notice:", error);
      res.status(400).send(error);
    }
  });
  //abhay:- task is assigned to manager by Admin
  socket.on("managerTaskNotification", async (data) => {
    try {
      const { managerEmail } = data;
      const employee = await Employee.findOne({ Email: managerEmail });

      let targetUser = Object.values(users).find(
        (user) => user.email === managerEmail
      );
      if (employee && targetUser) {
        const {
          taskId,
          taskName,
          senderMail,
          status,
          path,
          message,
          messageBy,
          profile,
        } = data;

        employee.Notification.unshift({
          path,
          taskId,
          taskName,
          senderMail,
          status,
          managerEmail,
          message,
          messageBy,
          profile,
        });

        await employee.save();
        io.to(targetUser.socketId).emit("taskNotificationReceived", data);
      } else if (employee) {
        const {
          taskId,
          taskName,
          senderMail,
          status,
          path,
          message,
          messageBy,
          profile,
        } = data;

        employee.Notification.unshift({
          path,
          message,
          taskId,
          taskName,
          senderMail,
          status,
          managerEmail,
          messageBy,
          profile,
        });

        await employee.save();
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  //abhay:- task is assigned to employee by manager
  socket.on("employeeTaskNotification", async (data) => {
    try {
      data.employeesEmail.forEach(async (val) => {
        const employee = await Employee.findOne({ Email: val });
        let targetUser = Object.values(users).find(
          (user) => user.email === val
        );

        if (employee && targetUser) {
          const {
            senderMail,
            taskId,
            taskName,
            message,
            status,
            path,
            messageBy,
            profile,
          } = data;
          employee.Notification.unshift({
            path,
            taskId,
            message,
            taskName,
            status,
            senderMail,
            EmployeeMail: val,
            messageBy,
            profile,
          });

          await employee.save();
          io.to(targetUser.socketId).emit("taskNotificationReceived", data);
        } else if (employee) {
          const {
            senderMail,
            taskId,
            taskName,
            status,
            message,
            path,
            messageBy,
            profile,
          } = data;
          employee.Notification.unshift({
            path,
            taskId,
            message,
            taskName,
            status,
            senderMail,
            EmployeeMail: val,
            messageBy,
            profile,
          });

          await employee.save();
        }
      });
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  //abhay:- when manager accept the task admin will get notification
  socket.on("adminTaskNotification", async (data) => {
    try {
      const { adminMail } = data;

      const employee = await Employee.findOne({ Email: adminMail });
      let targetUser = Object.values(users).find(
        (user) => user.email === adminMail
      );

      if (employee && targetUser) {
        const {
          senderMail,
          taskName,
          Account,
          status,
          adminMail,
          taskId,
          path,
          taskStatus,
          message,
          messageBy,
          profile,
        } = data;

        employee.Notification.unshift({
          senderMail,
          taskName,
          Account,
          status,
          adminMail,
          taskId,
          path,
          taskStatus,
          message,
          messageBy,
          profile,
        });

        await employee.save();
        io.to(targetUser.socketId).emit("taskNotificationReceived", data);
      } else if (employee) {
        const {
          senderMail,
          taskName,
          Account,
          status,
          adminMail,
          taskId,
          path,
          taskStatus,
          message,
          messageBy,
          profile,
        } = data;

        employee.Notification.unshift({
          senderMail,
          taskName,
          Account,
          status,
          adminMail,
          taskId,
          path,
          taskStatus,
          message,
          messageBy,
          profile,
        });

        await employee.save();
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  //abhay:-when employee apply leave
  socket.on("leaveNotification", async (data) => {
    try {
      //
      const { managerEmail, hrEmail, aditionalManager } = data;

      const manager = await Employee.findOne({ Email: managerEmail });
      const hr = await Employee.findOne({ Email: hrEmail });
      const aditionManager = await Employee.findOne({
        Email: aditionalManager,
      });
      let targetManager = Object.values(users).find(
        (user) => user.email === managerEmail
      );
      let targetAddManager = Object.values(users).find(
        (user) => user.email === aditionalManager
      );
      let targetHr = Object.values(users).find(
        (user) => user.email === hrEmail
      );
      if (manager && targetManager) {
        const { message, status, path, taskId, messageBy, profile } = data;
        manager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        });

        await manager.save();
        io.to(targetManager.socketId).emit("leaveNotificationReceived", data);
      } else if (manager) {
        const { message, status, path, taskId, messageBy, profile } = data;

        manager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        });
        await manager.save();
      }
      if (aditionManager && targetAddManager) {
        const { message, status, path, taskId, messageBy, profile } = data;

        aditionManager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        });

        await aditionManager.save();
        io.to(targetAddManager.socketId).emit(
          "leaveNotificationReceived",
          data
        );
      } else if (aditionManager) {
        const { message, status, path, taskId, messageBy, profile } = data;

        aditionManager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        });

        await aditionManager.save();
      }
      if (hr && targetHr) {
        const { message, status, path, taskId, messageBy, profile } = data;

        hr.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        });

        await hr.save();
        io.to(targetHr.socketId).emit("leaveNotificationReceived", data);
      } else if (hr) {
        const { message, status, path, taskId, messageBy, profile } = data;

        hr.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        });

        await hr.save();
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  socket.on("leaveManagerStatusNotification", async (data) => {
    try {
      //
      const { employeeEmail, hrEmail, reportManager } = data;

      const employee = await Employee.findOne({ Email: employeeEmail });
      const hr = await Employee.findOne({ Email: hrEmail });
      const manager = await Employee.findOne({ Email: reportManager });
      let targetEmployee = Object.values(users).find(
        (user) => user.email === employeeEmail
      );
      let targetHr = Object.values(users).find(
        (user) => user.email === hrEmail
      );
      let targetManager = Object.values(users).find(
        (user) => user.email === reportManager
      );
      if (employee && targetEmployee) {
        const { message, status, path, taskId, messageBy, profile } = data;

        employee.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          messageBy,
          profile,
        });

        await employee.save();
        io.to(targetEmployee.socketId).emit(
          "leaveManagerStatusNotificationReceived",
          data
        );
      } else if (employee) {
        const { message, status, path, taskId, messageBy, profile } = data;

        employee.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          messageBy,
          profile,
        });

        await employee.save();
      }
      if (hr && targetHr) {
        const { message, status, path, taskId, messageBy, profile } = data;

        hr.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          messageBy,
          profile,
        });

        await hr.save();
        io.to(targetHr.socketId).emit(
          "leaveManagerStatusNotificationReceived",
          data
        );
      } else if (hr) {
        const { message, status, path, taskId, messageBy, profile } = data;

        hr.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          profile,
          messageBy,
        });

        await hr.save();
      }
      if (manager && targetManager) {
        const { message, status, path, taskId, messageBy, profile } = data;

        manager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          messageBy,
          profile,
        });

        await manager.save();
        io.to(targetManager.socketId).emit(
          "leaveManagerStatusNotificationReceived",
          data
        );
      } else if (manager) {
        const { message, status, path, taskId, messageBy, profile } = data;

        manager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          profile,
          messageBy,
        });

        await manager.save();
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  socket.on("leaveHrStatusNotification", async (data) => {
    try {
      //
      const { employeeEmail, managerEmail, aditionalManager } = data;

      const employee = await Employee.findOne({ Email: employeeEmail });
      const manager = await Employee.findOne({ Email: managerEmail });
      const aditionManager = await Employee.findOne({
        Email: aditionalManager,
      });
      let targetAddManager = Object.values(users).find(
        (user) => user.email === aditionalManager
      );
      let targetEmployee = Object.values(users).find(
        (user) => user.email === employeeEmail
      );
      let targetManager = Object.values(users).find(
        (user) => user.email === managerEmail
      );
      if (employee && targetEmployee) {
        const { message, status, path, taskId, messageBy, profile } = data;

        employee.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          managerEmail,
          messageBy,
          profile,
        });

        await employee.save();
        io.to(targetEmployee.socketId).emit(
          "leaveManagerStatusNotificationReceived",
          data
        );
      } else if (employee) {
        const { message, status, path, taskId, profile, messageBy } = data;

        employee.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          managerEmail,
          profile,
          messageBy,
        });

        await employee.save();
      }
      if (manager && targetManager) {
        const { message, status, path, taskId, messageBy, profile } = data;

        manager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          managerEmail,
          messageBy,
          profile,
        });

        await manager.save();
        io.to(targetManager.socketId).emit(
          "leaveManagerStatusNotificationReceived",
          data
        );
      } else if (manager) {
        const { message, status, path, taskId, messageBy, profile } = data;

        manager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          employeeEmail,
          managerEmail,
          messageBy,
          profile,
        });

        await manager.save();
      }
      if (aditionManager && targetAddManager) {
        const { message, status, path, taskId, messageBy, profile } = data;

        aditionManager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          employeeEmail,
          messageBy,
          profile,
        });

        await aditionManager.save();
        io.to(targetAddManager.socketId).emit(
          "leaveNotificationReceived",
          data
        );
      } else if (aditionManager) {
        const { message, status, path, taskId, messageBy, profile } = data;

        aditionManager.Notification.unshift({
          message,
          status,
          path,
          taskId,
          managerEmail,
          employeeEmail,
          messageBy,
          profile,
        });

        await aditionManager.save();
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  //abhay:- when employee accept the task manager and his team will get update
  socket.on("employeeTaskUpdateNotification", async (data) => {
    try {
      console.log(data);

      data.employeesEmail.forEach(async (val) => {
        const employee = await Employee.findOne({ Email: val });
        let targetUser = Object.values(users).find(
          (user) => user.email === val
        );

        if (employee && targetUser) {
          const {
            senderMail,
            taskId,
            taskName,
            status,
            path,
            taskStatus,
            Account,
            message,
            profile,
            messageBy,
          } = data;
          employee.Notification.unshift({
            path,
            taskId,
            taskName,
            taskStatus,
            Account,
            message,
            messageBy,
            status,
            senderMail,
            EmployeeMail: val,
            profile,
          });

          await employee.save();
          io.to(targetUser.socketId).emit("taskNotificationReceived", data);
        } else if (employee) {
          const {
            senderMail,
            taskId,
            taskName,
            status,
            path,
            Account,
            messageBy,
            taskStatus,
            message,
            profile,
          } = data;
          employee.Notification.unshift({
            path,
            taskId,
            taskName,
            Account,
            taskStatus,
            messageBy,
            message,
            status,
            senderMail,
            EmployeeMail: val,
            profile,
          });

          await employee.save();
        }
      });
      const { taskId, employeesEmail, senderMail } = data;

      const existingTask = await Update.findOne({
        taskId: taskId,
        participants: { $all: [...employeesEmail] },
        bwt: "emp-manager",
      });

      if (existingTask) {
        existingTask.participants.push(senderMail);
        await existingTask.save();
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  socket.on("notificationPageUpdate", (data) => {
    socket.emit("notificationPageUpdate", data);
  });
  //abhay:- when employee create a request to manager and cc peoples
  socket.on("employeeRequestNotification", async (data) => {
    try {
      data.to.forEach(async (val) => {
        const employee = await Employee.findOne({ Email: val });
        let targetUser = Object.values(users).find(
          (user) => user.email === val
        );

        if (employee && targetUser) {
          const {
            taskId,

            message,
            status,
            path,
            messageBy,
            profile,
          } = data;
          employee.Notification.unshift({
            taskId,

            message,
            status,
            path,
            messageBy,
            profile,
          });

          await employee.save();
          io.to(targetUser.socketId).emit("requestNotificationReceived", data);
        } else if (employee) {
          const {
            taskId,

            message,
            status,
            path,
            messageBy,
            profile,
          } = data;
          employee.Notification.unshift({
            taskId,

            message,
            status,
            path,
            messageBy,
            profile,
          });

          await employee.save();
        }
      });
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  socket.on("managerRequestNotification", async (data) => {
    try {
      data.to.forEach(async (val) => {
        const employee = await Employee.findOne({ Email: val });
        let targetUser = Object.values(users).find(
          (user) => user.email === val
        );

        if (employee && targetUser) {
          const {
            taskId,

            message,
            status,
            path,
            messageBy,
            profile,
          } = data;
          employee.Notification.unshift({
            taskId,

            message,
            status,
            path,
            messageBy,
            profile,
          });

          await employee.save();
          io.to(targetUser.socketId).emit("requestNotificationReceived", data);
        } else if (employee) {
          const {
            taskId,

            message,
            status,
            path,
            messageBy,
            profile,
          } = data;
          employee.Notification.unshift({
            taskId,

            message,
            status,
            path,
            messageBy,
            profile,
          });

          await employee.save();
        }
      });
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  socket.on("loginUser", async (data) => {
    try {
      const { manager, user } = data;

      let options = {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      let currentTime = new Date().toLocaleTimeString("en-US", options);
      let data1 = {
        message: `${user} login at ${currentTime}`,
      };
      let targetUser = Object.values(users).find(
        (user) => user.email === manager
      );

      if (targetUser) {
        io.to(targetUser.socketId).emit("userLogin", data1);
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  socket.on("logoutUser", async (data) => {
    try {
      const { manager, user } = data;
      let options = {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      let currentTime = new Date().toLocaleTimeString("en-US", options);
      let data1 = {
        message: `${user} logout at ${currentTime}`,
      };
      let targetUser = Object.values(users).find(
        (user) => user.email === manager
      );

      if (targetUser) {
        io.to(targetUser.socketId).emit("userLogout", data1);
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });
  socket.on("getMessages", async (data, callback) => {
    const { from, to, taskId, text, bwt } = data;

    try {
      if (bwt === "admin-manager") {
        // Find a task with all participants matching
        const existingTask = await Update.findOne({
          taskId: taskId,
          bwt: bwt,
          participants: { $all: [from, ...to] },
        });

        if (existingTask) {
          callback(existingTask.message);
        } else {
          callback([]);
        }
      } else if (bwt === "emp-manager") {
        // Find a task with at least one matching participant

        const existingTask = await Update.findOne({
          taskId: taskId,
          bwt: bwt,
          participants: { $in: [from, ...to] },
          $expr: { $gte: [{ $size: "$participants" }, 2] }, // Ensure at least 2 participants
        });

        if (existingTask) {
          callback(existingTask.message);
        } else {
          callback([]);
        }
      }
    } catch (error) {
      console.error("Error handling message:", error);
      callback([]);
    }
  });

  socket.on("sendMessage", async (data) => {
    const { from, to, taskId, text, bwt, name, profile, notiId, taskName } =
      data;

    const timestamp = new Date().toISOString();

    if (taskId === "" || to === "" || to === null || from === null) return;

    try {
      // Find a task with at least two matching participants
      const existingTask = await Update.findOne({
        taskId: taskId,
        participants: { $all: [from, ...to] },
      });

      // Check if there are at least two matching participants
      const matchingParticipants = existingTask
        ? existingTask.participants.filter((participant) =>
          [from, ...to].includes(participant)
        ).length
        : 0;

      if (!existingTask || matchingParticipants < 2) {
        // Create a new task if fewer than two participants match
        const newTask = new Update({
          taskId: taskId,
          participants: [from, ...to],
          bwt: bwt,
          message: [
            {
              text: text,
              from: from,
              to: to,
              fromName: name,
              createAt: timestamp,
              status: "unseen",
            },
          ],
        });

        await newTask.save();
      } else {
        // Add the message to the existing task
        existingTask.message.push({
          text: text,
          from: from,
          fromName: name,
          to: to,
          createAt: timestamp,
          status: "unseen",
        });

        await existingTask.save();
      }

      // Emit the new message to the target user(s)
      if (bwt === "admin-manager") {
        const employee = await Employee.findOne({ Email: to[0] });

        const targetUser = Object.values(users).find(
          (user) => user.email === to[0]
        );

        if (targetUser) {
          io.to(targetUser.socketId).emit("newMessage", {
            from,
            text,
            taskIden: taskId,
            path: "admin_manager",
            createAt: timestamp,
            fromName: name,
            taskName,
          });

          if (employee) {
            //     const { taskId, taskName, senderMail,  status,} = data;
            io.to(targetUser.socketId).emit("updateNoitification", {
              message: text,
              status: "unseen",
              path: "admin_manager",
              taskId: notiId,
              taskIden: taskId,
              profile,
              to: [from],
              messageBy: name,
              taskName,
            });
            employee.Notification.unshift({
              taskId: notiId,
              to: [from],
              message: text,
              taskIden: taskId,
              profile,
              messageBy: name,
              path: "admin_manager",
              status: "unseen",
              taskName,
            });

            await employee.save();
          }
        }
      } else if (bwt === "emp-manager") {
        to.forEach(async (val) => {
          const targetUser = Object.values(users).find(
            (user) => user.email === val
          );
          const employee = await Employee.findOne({ Email: val });
          if (targetUser) {
            io.to(targetUser.socketId).emit("newMessage", {
              from,
              text,
              path: "emp_manager",
              createAt: timestamp,
              taskIden: taskId,
              fromName: name,
              taskName,
            });
            if (employee) {
              let allto = to.filter((em) => em !== val);

              io.to(targetUser.socketId).emit("updateNoitification", {
                message: text,
                status: "unseen",
                path: "emp_manager",
                taskId: notiId,
                taskIden: taskId,
                profile,
                to: [from, ...allto],
                messageBy: name,
                taskName,
              });

              employee.Notification.unshift({
                taskId: notiId,
                taskIden: taskId,
                message: text,
                to: [from, ...allto],
                profile,
                messageBy: name,
                path: "emp_manager",
                status: "unseen",
                taskName,
              });
              await employee.save();
            }
          }
        });
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });
});

const documentSchema = new mongoose.Schema(
  {
    title: String,
    email: String,
    files: [String],
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;

app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const { title, number, email } = req.body;

    // Upload files to Cloudinary
    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url; // Return the secure URL of the uploaded file
      })
    );

    // Create a new document instance with the Cloudinary URLs
    const newDocument = new Document({
      title,
      email,
      files: uploadedFiles,
    });

    // Save the document to MongoDB
    await newDocument.save();

    // Respond with success message
    res.status(201).send("Document uploaded successfully.");
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).send("Error uploading document.");
  }
});


app.post("/documents", async (req, res) => {
  try {
    const { email } = req.body;

    // Fetch all documents from MongoDB
    const documents = await Document.find({ email });

    // Respond with the fetched documents

    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).send("Error fetching documents.");
  }
});

app.delete("/delete-document/:id", async (req, res) => {
  try {
    const documentId = req.params.id;

    // Find the document by its ID
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).send("Document not found.");
    }

    // Delete the document from MongoDB
    await Document.findByIdAndDelete(documentId);

    // Respond with success message
    res.status(200).send("Document deleted successfully.");
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).send("Error deleting document.");
  }
});


const assignShiftToUsersWithoutShift = async (shiftId) => {
  try {
    // Ensure the shift exists
    const shiftExists = await Shift.findById(shiftId);
    if (!shiftExists) {
      console.error("Shift not found");
      return { success: false, message: "Shift not found" };
    }

    // Update employees who don't have any shift assigned
    const result = await Employee.updateMany(
      { shifts: { $exists: true, $size: 0 } }, // Find employees with empty shifts array
      { $push: { shifts: shiftId } } // Push the new shift
    );

    console.log(
      `${result.modifiedCount} employees were updated with the new shift.`
    );

    return {
      success: true,
      message: `${result.modifiedCount} employees were assigned the shift.`,
    };
  } catch (error) {
    console.error("Error assigning shifts:", error.message);
    return { success: false, message: error.message };
  }
};

// Example usage
(async () => {
  const shiftId = "6763beb4a7a6fd1f58ceb5ab";
  const result = await assignShiftToUsersWithoutShift(shiftId);
  console.log(result);
})();


// const buildPath = path.join(__dirname, '../frontend/build');

// // Serve static files from the build directory
// app.use(express.static(buildPath));

// // Fallback route to serve index.html for any GET request that doesn't match a static file
// app.get('*', (req, res) => {
//     res.sendFile(path.join(buildPath, 'index.html'));
// });


server.listen(PORT, () =>
  console.log(`MUNC APP is listening on port ${PORT}!`)
);
