const StickyNote = require("../models/StickyNoteModel");

// Get all notes for a specific user
exports.getNotesByUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const notes = await StickyNote.find({ user: userId });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new note
exports.addNote = async (req, res) => {
  try {
    const { user, text, color, isStarred, x, y, width, height } = req.body;

    // Default values for new notes
    const newNote = new StickyNote({
      text: text || "New Note",
      color: color || "#ff7eb9",
      isStarred: isStarred || false,
      user,
      x: x || 0, // Default x position
      y: y || 0, // Default y position
      width: width || 260, // Default width
      height: height || 240, // Default height
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a note's position and size
exports.updateNotePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { x, y, width, height } = req.body;

    // Find the note by ID and update only the position and size fields
    const updatedNote = await StickyNote.findByIdAndUpdate(
      id,
      { x, y, width, height },
      { new: true } // Return the updated note
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNote = await StickyNote.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
