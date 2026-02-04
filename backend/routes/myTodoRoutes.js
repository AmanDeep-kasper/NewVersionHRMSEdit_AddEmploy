const express = require("express");
const {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/myTodoController");
const { verifyAll } = require("../middleware/rbacMiddleware");
const router = express.Router();

router.get("/mytodos",verifyAll, getTodos);
router.post("/mytodos",verifyAll, addTodo);
router.put("/mytodos/:id",verifyAll, updateTodo);
router.delete("/mytodos/:id",verifyAll, deleteTodo);

module.exports = router;
