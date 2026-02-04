// controllers/reimbursementExpenseController.js
const ReimbursementExpense = require("../models/reimbursementExpense");

// Create a new reimbursement expense
const createReimbursementExpense = async (req, res) => {
  try {
    const newExpense = new ReimbursementExpense(req.body);
    await newExpense.save();
    res.status(201).json({
      message: "Reimbursement expense created successfully",
      newExpense,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating reimbursement expense", error });
  }
};

// Get all reimbursement expenses
const getAllReimbursementExpenses = async (req, res) => {
  try {
    const expenses = await ReimbursementExpense.find().populate({
      path: "user",
      select: "FirstName LastName Account profile", // Only fetch required fields
    });
    res.status(200).json(expenses);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching reimbursement expenses", error });
  }
};

// Get all reimbursement expenses by EmployeeId
const getAllReimbursementExpensesByEmployee = async (req, res) => {
  try {
    const employee = req.params.employeeId; // Get the employeeId from the route parameter
    const expenses = await ReimbursementExpense.find({
      user: employee,
    }).populate({
      path: "user",
      select: "FirstName LastName Account profile", // Only fetch required fields
    }); // Filter expenses by employeeId

    if (!expenses || expenses.length === 0) {
      return res
        .status(404)
        .json({ message: "No expenses found for this employee" });
    }

    res.status(200).json(expenses); // Return the filtered expenses
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching reimbursement expenses", error });
  }
};

// Get reimbursement expense by ID
const getReimbursementExpenseById = async (req, res) => {
  try {
    const expense = await ReimbursementExpense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching reimbursement expense", error });
  }
};

// Update reimbursement expense by ID
const updateReimbursementExpenseById = async (req, res) => {
  try {
    const updatedExpense = await ReimbursementExpense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res
      .status(200)
      .json({ message: "Expense updated successfully", updatedExpense });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating reimbursement expense", error });
  }
};

// Delete reimbursement expense by ID
const deleteReimbursementExpenseById = async (req, res) => {
  try {
    const deletedExpense = await ReimbursementExpense.findByIdAndDelete(
      req.params.id
    );
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting reimbursement expense", error });
  }
};

module.exports = {
  createReimbursementExpense,
  getAllReimbursementExpenses,
  getReimbursementExpenseById,
  updateReimbursementExpenseById,
  deleteReimbursementExpenseById,
  getAllReimbursementExpensesByEmployee,
};
