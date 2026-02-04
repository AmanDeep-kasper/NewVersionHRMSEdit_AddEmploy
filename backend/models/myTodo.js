const mongoose = require("mongoose");

const myTodoSchema = new mongoose.Schema(
  {
    todoTask: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("myTodo", myTodoSchema);
