const express = require('express');
const { NoticeBoard, getLastNotice, createNotice } = require('../controllers/noticeController.js');
const { verifyAll } = require('../middleware/rbacMiddleware');
const { checkFileSize, noticeFileUpload } = require('../middleware/multer.js');

const noticeRoute = express.Router();

// GET: Fetch the last notice
noticeRoute.get("/notice/last", verifyAll, getLastNotice);

// POST: Create a new notice with file upload and size check
noticeRoute.post(
  "/notice",
  checkFileSize,        // First: check file size (if needed before upload)
  noticeFileUpload,     // Second: handle file upload (multer middleware)
  createNotice          // Finally: call controller to save notice
);

// GET: Fetch a specific notice by ID
noticeRoute.get('/notice/:id', verifyAll, NoticeBoard);

module.exports = noticeRoute;