const express = require("express");
const {
  FindAllTask,
  CreateTask,
  UpdateTaskAdminEmployee,
  UpdateTaskAdminManager,
  CreateTaskEmployee,
  FindTasksByManager,
  getTaskCompletionData,
  FindAllTaskMyTask,
} = require("../controllers/taskController");
const { upload, checkFileSize, taskFileUpload } = require("../middleware/multer");
const { verifyAdmin, verifyAll, verifyManager, verifyAdminHREmployee, verifyAdminHRManager, } = require("../middleware/rbacMiddleware");
const { emptaskFileUpload } = require("../middleware/taskMulter");


const taskRoute = express.Router();

taskRoute.get("/tasks", verifyAll, FindAllTask); 
taskRoute.get("/tasksMyTask", verifyAll, FindAllTaskMyTask); 
taskRoute.get("/tasks/ui/completion", verifyAll, getTaskCompletionData);
taskRoute.get("/tasksbyManager", verifyAll, FindTasksByManager); //task view admin,hr,employee,manager
taskRoute.post(
  "/tasks",
  verifyAdminHRManager,
  taskFileUpload, // Multer middleware to handle multiple files
  checkFileSize,  // Middleware to check file size
  CreateTask
);
taskRoute.post("/tasks/:taskId/employees", verifyAdminHRManager, CreateTaskEmployee); //
taskRoute.put("/tasks/:taskId", verifyAll, UpdateTaskAdminManager); // update tsk admin and Manager
// taskRoute.put("/tasks/:taskId/employees/:empEmail", UpdateTaskAdminEmployee);
taskRoute.put(
  "/tasks/:taskId/employees/:empEmail",
  verifyAll,
  emptaskFileUpload, // Middleware for handling file uploads (attachments)
  UpdateTaskAdminEmployee // Controller to handle task update
);

module.exports = { taskRoute };
