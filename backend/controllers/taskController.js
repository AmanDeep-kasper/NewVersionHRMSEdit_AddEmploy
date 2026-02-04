

const mongoose = require("mongoose");
const { Task } = require("../models/taskModel");
const { Employee } = require("../models/employeeModel");
const {
  cloudinaryFileUploder,
  removeCloudinaryImage,
  uplodeImagesCloudinary
} = require("../cloudinary/cloudinaryFileUpload");// find all task


const FindAllTask = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate({
        path: "managerEmail", // Populate the managerEmail field
        select: "Email FirstName LastName Account profile -_id", // Fields to include from the Employee model
      })
      .populate({
        path: "adminMail", // Populate the adminMail field
        select: "Email FirstName LastName Account profile -_id", // Fields to include from the Employee model
      })
      .populate({
        path: "employees.employee", // Populate the employee field inside the employees array
        select: "Email  FirstName LastName profile -_id",
        populate: {
          path: "position",
          select: "PositionName -_id",
        }, // Fields to include from the Employee model
      }); // Converts the result to plain JavaScript objects, not Mongoose documents

    res.status(200).json(tasks);
  } catch (error) {
    console.error("eroro", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const FindAllTaskMyTask = async (req, res) => {
  try {
    // 1️⃣ Get logged-in user id from token
    const userId = req.user._id;

    // 2️⃣ Find employee to get Email (optional but as you requested)
    const employee = await Employee.findById(userId).select("Email");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 3️⃣ Fetch only tasks where this employee is assigned
    const tasks = await Task.find({
      "employees.employee": userId,
    })
      .populate({
        path: "managerEmail",
        select: "Email FirstName LastName Account profile -_id",
      })
      .populate({
        path: "adminMail",
        select: "Email FirstName LastName Account profile -_id",
      })
      .populate({
        path: "employees.employee",
        select: "Email FirstName LastName profile -_id",
        populate: {
          path: "position",
          select: "PositionName -_id",
        },
      });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("FindAllTask error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const getTaskCompletionData = async (req, res) => {
  try {
    const { department } = req.query;

    const filter = {};

    // Apply filter only if department is provided and not "All"
    if (department && department !== "All") {
      filter.department = department;
    }

    const tasks = await Task.find(
      filter,
      {
        department: 1,
        status: 1,
        _id: 0,
      }
    ).lean();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("TASK UI ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const FindTasksByManager = async (req, res) => {
  try {
    const managerId = req.user._id; 
    const tasks = await Task.find({ managerEmail: managerId })
      .select(
        "taskID Taskname status startDate endDate duration Priority employees"
      )
      .sort({ updatedAt: -1 }); 

    res.status(200).json(tasks);
  } catch (error) {
    console.error("FindAllTask error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// find the task
const findTask = async (req, res) => {
  try {
    Task.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) { }
};

const day = new Date();
const date = day.getDate();
const month = day.getMonth() + 1;
const year = day.getFullYear();

const CreateTask = async (req, res) => {
  const {
    Taskname,
    Priority,
    description,
    department,
    managerEmail,
    comment = "Task Assigned",
    startDate,
    endDate,
    adminMail,
  } = req.body;

  // Calculate the date difference
  const dateDifference = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );

  try {
    // Find manager by email
    const manager = await Employee.findOne({ Email: managerEmail }).select(
      "_id"
    );
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Collect file paths for uploaded files
    const filePaths = req.files ? req.files.map((file) => file.path) : [];

    const latestTask = await Task.findOne({ taskID: /^TASK-\d{3}$/ }).sort({
      taskID: -1,
    });
    let newTaskID;
    if (latestTask) {
      const currentNumber = parseInt(latestTask.taskID.substring(5)); // Adjust index to start after "TASK-"
      const nextNumber = currentNumber + 1;
      newTaskID = `TASK-${nextNumber.toString().padStart(3, "0")}`;
    } else {
      newTaskID = "TASK-101"; // Start from TASK-101 if no task exists
    }

    // Create new task data
    const newTaskData = {
      taskID: newTaskID,
      Taskname,
      Priority,
      description,
      department,
      managerEmail: manager._id,
      comment,
      duration: dateDifference,
      adminMail,
      status: "Assigned",
      startDate,
      endDate,
      pdf: filePaths, // Store all uploaded file paths
      employees: [],
    };

    // Save the task to the database
    const newTask = new Task(newTaskData);
    await newTask.save();

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const CreateTaskEmployee = async (req, res) => {
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
      const { empname, empemail, empdesignation, empTaskStatus } = employeeData;

      // Check if empemail already exists in the task's employees array
      const existingEmployee = task.employees.find(
        (employee) => employee.empemail === empemail
      );

      if (existingEmployee) {
        // If the employee already exists, throw an error or handle it accordingly
        throw new Error(`Duplicate empemail: ${empemail}`);
      } else {
        // Create a new employee object and add it to the array
        const empId = await Employee.find({ Email: empemail }).select("_id");
        const newEmployee = {
          employee: empId[0],
          empTaskStatus: empTaskStatus,
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
};


const UpdateTaskAdminManager = async (req, res) => {
  try {
    const { Taskname, comment, duration, description, startDate, endDate, status, acceptedAt } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status || task.status;
    task.comment = comment || task.comment;
    task.Taskname = Taskname || task.Taskname;
    task.description = description || task.description;
    task.duration = duration || task.duration;
    task.startDate = startDate || task.startDate;
    task.endDate = endDate || task.endDate;

    // Convert acceptedAt to DD/MM/YYYY format
    if (acceptedAt) {
      const dateObj = new Date(acceptedAt);
      const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${dateObj.getFullYear()}`;
      task.acceptedAt = formattedDate;
    }
    // task.acceptedAt = acceptedAt ? new Date(acceptedAt).toISOString().split("T")[0] : task.acceptedAt;


    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const UpdateTaskAdminEmployee = async (req, res) => {
  const { empTaskStatus, empTaskComment } = req.body;
  const { empEmail, taskId } = req.params;
  try {
    // Find the task with populated employee details
    const task = await Task.findOne({ _id: taskId }).populate({
      path: "employees.employee",
      select: "Email",
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Locate the specific employee within the task
    const employee = task.employees.find(
      (emp) => emp.employee.Email === empEmail
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found in the task" });
    }

    // Update task status and comments
    employee.empTaskStatus = empTaskStatus;
    employee.empTaskComment = empTaskComment;

    // Handle file uploads to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadedFiles = await Promise.all(
        req.files.map(async (file) => {
          try {
            // Use the updated Cloudinary upload function
            const uploadResult = await uplodeImagesCloudinary(file.path);
            if (uploadResult) {
              return {
                fileName: file.originalname,
                fileType: file.mimetype,
                fileUrl: uploadResult.image_url, // Cloudinary URL
              };
            }
          } catch (error) {
            console.error("Error uploading file to Cloudinary:", error);
            throw new Error("File upload failed");
          }
        })
      );

      // If attachments already exist, append the new ones
      if (employee.attachments) {
        employee.attachments = [...employee.attachments, ...uploadedFiles];
      } else {
        employee.attachments = uploadedFiles;
      }
    }

    // Save the updated task
    await task.save();

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

module.exports = {
  FindAllTask,
  FindTasksByManager,
  findTask,
  CreateTask,
  CreateTaskEmployee,
  UpdateTaskAdminManager,
  UpdateTaskAdminEmployee,
  getTaskCompletionData,
  FindAllTaskMyTask,
};
