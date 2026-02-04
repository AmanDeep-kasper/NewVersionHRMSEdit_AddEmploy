const Joi = require("joi");
const { Project } = require("../models/projectModel");
const { ProjectValidation } = require("../validations/projectValidation");

// fint all project
const getAllProject = async (req, res) => {
  Project.find()
    .populate("portals")
    .exec(function (err, project) {
      if (err) {
        res.send("err");
      } else {
        res.send(project);
      }
    });
};

// create a project
const createProject = async (req, res) => {
  Joi.validate(req.body, ProjectValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let project;
      project = {
        ProjectTitle: req.body.ProjectTitle,
        ProjectURL: req.body.ProjectURL,
        ProjectDesc: req.body.ProjectDesc,
        portals: req.body.Portal_ID,
        EstimatedTime: req.body.EstimatedTime,
        EstimatedCost: req.body.EstimatedCost,
        ResourceID: req.body.ResourceID,
        Status: req.body.Status,
        Remark: req.body.Remark,
        Currency: req.body.Currency,
        TimePeriod: req.body.TimePeriod,
      };
      Project.create(project, function (err, project) {
        if (err) {
          res.send("error");
        } else {
          res.send(project);
        }
      });
    }
  });
};

// find and update the project
const updateProject = async (req, res) => {
  Joi.validate(req.body, ProjectValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let updateProject;
      updateProject = {
        ProjectTitle: req.body.ProjectTitle,
        ProjectURL: req.body.ProjectURL,
        ProjectDesc: req.body.ProjectDesc,
        portals: req.body.Portal_ID,
        EstimatedTime: req.body.EstimatedTime,
        EstimatedCost: req.body.EstimatedCost,
        ResourceID: req.body.ResourceID,
        Status: req.body.Status,
        Remark: req.body.Remark,
        Currency: req.body.Currency,
        TimePeriod: req.body.TimePeriod,
      };

      Project.findByIdAndUpdate(
        req.params.id,
        updateProject,
        function (err, Project) {
          if (err) {
            res.send("error");
          } else {
            res.send(updateProject);
          }
        }
      );
    }
  });
};

// find and delete the project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndRemove(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully", project });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Server error while deleting project" });
  }
};

module.exports = {
  getAllProject,
  createProject,
  updateProject,
  deleteProject,
};
