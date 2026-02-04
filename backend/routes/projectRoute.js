const express = require("express");
const projectRoute = express.Router();

const { verifyAdmin } = require("../middleware/rbacMiddleware");
const {
  getAllProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// GET: Retrieve all project
projectRoute.get("/admin/project-bid", verifyAdmin, getAllProject);

// POST: Create a new project
projectRoute.post("/admin/project-bid", verifyAdmin, createProject);

// PUT: Update an existing project
projectRoute.put("/admin/project-bid/:id", verifyAdmin, updateProject);

// DELETE: Delete a project
// projectRoute.delete("admin/project-bid/:id", verifyAdmin, deleteProject);
projectRoute.delete("/admin/project-bid/:id", verifyAdmin, deleteProject);


module.exports = projectRoute;
