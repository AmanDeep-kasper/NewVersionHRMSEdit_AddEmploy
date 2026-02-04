const myTodo = require("../models/myTodo");

// Get all to-dos
exports.getTodos = async (req, res) => {
  try {
    const todos = await myTodo.find();
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching to-dos:", error);
    res.status(500).json({ message: "Error fetching to-dos", error });
  }
};

exports.addTodo = async (req, res) => {
  try {
    const { todoTask, date } = req.body;

    // Validate request payload
    if (!todoTask || !date) {
      return res.status(400).json({ message: "Missing todoTask or date" });
    }

    // Create new todo
    const newTodo = new myTodo({ todoTask, date });
    await newTodo.save();

    res.status(201).json(newTodo); // Return the created todo in response
  } catch (error) {
    console.error("Error creating task:", error); // Log error for debugging
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};


// Update a to-do
exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { isChecked } = req.body;
  try {
    if (typeof isChecked !== "boolean") {
      return res.status(400).json({ message: "Invalid isChecked value" });
    }
    const updatedTodo = await myTodo.findByIdAndUpdate(
      id,
      { isChecked },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "To-do not found" });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("Error updating to-do:", error); // Add this log
    res.status(500).json({ message: "Error updating to-do", error });
  }
};

// Delete a to-do
exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await myTodo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "To-do not found" });
    }
    res.status(200).json({ message: "To-do deleted successfully" });
  } catch (error) {
    console.error("Error deleting to-do:", error); // Add this log
    res.status(500).json({ message: "Error deleting to-do", error });
  }
};
