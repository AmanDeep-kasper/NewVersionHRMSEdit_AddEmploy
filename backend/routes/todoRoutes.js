// routes/todoRoutes.js
const express = require("express");
const {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const { verifyAll } = require("../middleware/rbacMiddleware");

const router = express.Router();

router.get("/todos", verifyAll,getTodos);
router.post("/todos",verifyAll, addTodo);
router.put("/todos/:id",verifyAll, updateTodo);
router.delete("/todos/:id",verifyAll, deleteTodo);

module.exports = router;
