const express = require("express");
const {
  getNotesByUser,
  addNote,
  deleteNote,
  updateNotePosition,
} = require("../controllers/stickyNoteController");

const router = express.Router();
const { verifyAll } = require("../middleware/rbacMiddleware");


// Define the routes without authentication
router.get("/sticky-note/:id", verifyAll, getNotesByUser); // This was dependent on req.user, now will return all notes
router.post("/sticky-notes", verifyAll, addNote); // No user authentication needed
router.delete("/sticky-notes/:id", verifyAll, deleteNote); // No user authentication needed
router.put("/sticky-notes/:id/position", verifyAll, updateNotePosition);

module.exports = router;
