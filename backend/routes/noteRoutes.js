const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get Notes
router.get("/", authMiddleware, async (req, res) => {
  const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(notes);
});

// Create Note
router.post("/", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const newNote = new Note({ userId: req.user.id, content });
  await newNote.save();
  res.status(201).json(newNote);
});

module.exports = router;
