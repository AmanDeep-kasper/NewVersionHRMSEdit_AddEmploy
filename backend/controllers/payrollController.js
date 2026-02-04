const { Employee } = require('../models/employeeModel');
const { LeaveApplication } = require('../models/leaveModel');
const { Payroll } = require('../models/payrollModel');
const moment = require('moment');

// Generate payroll based on employee leave and attendance
const generatePayroll = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ error: "Month and year are required" });
  }

  const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
  const endDate = moment(startDate).endOf('month').toDate();

  try {
    // Fetch all employees
    const employees = await Employee.find();

    const payrollList = await Promise.all(
      employees.map(async (employee) => {
        const leaves = await LeaveApplication.find({
          employee: employee._id,
          FromDate: { $gte: startDate },
          ToDate: { $lte: endDate },
        });

        // Example Payroll Calculation Logic
        let baseSalary = employee.baseSalary;
        let deductions = 0;

        leaves.forEach((leave) => {
          if (leave.Leavetype !== 'Paid Leave') {
            deductions += leave.leaveDuration === 'Half Day' ? baseSalary / 2 : baseSalary / 30;
          }
        });

        const finalSalary = baseSalary - deductions;

        // Save the generated payroll in the Payroll model
        const payroll = new Payroll({
          employee: employee._id,
          month,
          year,
          baseSalary,
          deductions,
          finalSalary,
          leavesTaken: leaves.map((leave) => leave._id), // Store leave references
        });

        await payroll.save();  // Save to the database

        return {
          employee,
          baseSalary,
          deductions,
          finalSalary,
        };
      })
    );

    res.status(200).json({ payrollList });
  } catch (error) {
    console.error('Error generating payroll:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Fetch payroll for a specific employee or period
const getEmployeePayroll = async (req, res) => {
    const { employeeId, month, year } = req.query;
  
    try {
      // Build the query object dynamically
      const query = {};
      if (employeeId) query.employee = employeeId;
      if (month) query.month = month;
      if (year) query.year = year;
  
      const payrolls = await Payroll.find(query)
        .populate('employee', 'FirstName LastName')  // Populate employee data
        .populate('leavesTaken', 'Leavetype FromDate ToDate');  // Populate leave details
  
      if (!payrolls.length) {
        return res.status(404).json({ message: 'No payroll records found' });
      }
  
      res.status(200).json(payrolls);
    } catch (error) {
      console.error('Error fetching payroll:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

module.exports = {
  generatePayroll,
  getEmployeePayroll,
};




// const { Employee } = require('../models/employeeModel');
// const { LeaveApplication } = require('../models/leaveModel');
// const moment = require('moment');

// // Generate payroll based on employee leave and attendance
// const generatePayroll = async (req, res) => {
//   const { month, year } = req.query;

//   if (!month || !year) {
//     return res.status(400).json({ error: "Month and year are required" });
//   }

//   const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
//   const endDate = moment(startDate).endOf('month').toDate();

//   try {
//     // Fetch all employees
//     const employees = await Employee.find();

//     const payrollList = await Promise.all(
//       employees.map(async (employee) => {
//         const leaves = await LeaveApplication.find({
//           employee: employee._id,
//           FromDate: { $gte: startDate },
//           ToDate: { $lte: endDate },
//         });

//         // Example Payroll Calculation Logic
//         let baseSalary = employee.baseSalary;
//         let deductions = 0;

//         leaves.forEach((leave) => {
//           if (leave.Leavetype !== 'Paid Leave') {
//             deductions += leave.leaveDuration === 'Half Day' ? baseSalary / 2 : baseSalary / 30;
//           }
//         });

//         const finalSalary = baseSalary - deductions;

//         return {
//           employee,
//           baseSalary,
//           deductions,
//           finalSalary,
//         };
//       })
//     );

//     res.status(200).json({ payrollList });
//   } catch (error) {
//     console.error('Error generating payroll:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = {
//   generatePayroll,
// };
