const Joi = require("joi");
const { Employee } = require("../models/employeeModel");
const { Salary } = require("../models/salaryModel");
const { SalaryValidation } = require("../validations/salaryValidation");

const getAllSalary = async (req, res) => {
  try {
    const employees = await Employee.find({ isFullandFinal: { $ne: "Yes" } })
      .populate("salary")
      .select("FirstName LastName empID profile salary isFullandFinal")
      .populate("position") 
      .exec();

    if (!employees) {
      return res.status(404).json({ message: "No employees found" });
    }

    // Ensure salary is defined before using filter
    const filteredEmployees = employees.filter(
      (data) => Array.isArray(data.salary) && data.salary.length === 1
    );

    res.status(200).json(filteredEmployees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


// create a Salary

const createSalary = async (req, res) => {
  try {
    await Joi.validate(req.body, SalaryValidation);

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    if (employee.salary.length > 0) {
      return res
        .status(403)
        .send("Salary information about this employee already exists");
    }

    const totalSalary =
      Number(req.body.BasicSalary) +
      Number(req.body.HRASalary) +
      Number(req.body.ConvenyanceAllowance) +
      Number(req.body.otherAllowance);

    const newSalary = {
      BasicSalary: Number(req.body.BasicSalary),
      HRASalary: Number(req.body.HRASalary),
      ConvenyanceAllowance: Number(req.body.ConvenyanceAllowance),
      otherAllowance: Number(req.body.otherAllowance),
      totalSalary: totalSalary,
    };

    const salary = await Salary.create(newSalary);
    employee.salary.push(salary);
    await employee.save();

    res.send(salary);
  } catch (err) {
    
    res.status(400).send(err.message || "An error occurred");
  }
};

const updateSalary = async (req, res) => {
  Joi.validate(req.body, SalaryValidation, (err, result) => {
    if (err) {
      
      res.status(400).send(err.details[0].message);
    } else {
      // Calculate total salary
      const totalSalary =
        Number(req.body.BasicSalary) +
        Number(req.body.HRASalary) +
        Number(req.body.ConvenyanceAllowance) +
        Number(req.body.otherAllowance);

      const newSalary = {
        BasicSalary: Number(req.body.BasicSalary),
        HRASalary: Number(req.body.HRASalary),
        ConvenyanceAllowance: Number(req.body.ConvenyanceAllowance),
        otherAllowance: Number(req.body.otherAllowance),
        totalSalary: totalSalary,
      };

      Salary.findByIdAndUpdate(
        req.params.id,
        newSalary,
        { new: true },
        (err, salary) => {
          if (err) {
            res.status(500).send("An error occurred while updating the salary");
          } else {
            res.send(newSalary);
          }
        }
      );
    }
  });
};

const deleteSalary = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
    if (err) {
      res.send("error");
      
    } else {
      Salary.findByIdAndRemove(
        { _id: employee.salary[0] },
        function (err, salary) {
          if (!err) {
            Employee.update(
              { _id: req.params.id },
              { $pull: { salary: employee.salary[0] } },
              function (err, numberAffected) {
                res.send(salary);
              }
            );
          } else {
            
            res.send("error");
          }
        }
      );
    }
  });
};

module.exports = {
  getAllSalary,
  createSalary,
  updateSalary,
  deleteSalary,
};
