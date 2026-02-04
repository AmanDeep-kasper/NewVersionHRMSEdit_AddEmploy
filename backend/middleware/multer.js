const multer = require("multer");
const fs = require("fs");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;

    switch (file.fieldname) {
      case "profile":
        folder = "./employee_profile";
        break;
      case "attachments":
        folder = "./taskAttachment";
        break;
      case "empattachments":
        folder = "./empAttachment";
        break;
      case "noticeAttachment": 
        folder = "./noticeAttachments"; 
        break;
      default:
        return cb(new Error(`Unsupported file field: ${file.fieldname}`), null);
    }

    // Optional: create folder if it doesn't exist (good practice)
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// File filter for specific types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

// Multer configuration with a limit of 10 MB per file
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// const fileUploadMiddleware = upload.single("profile");
const fileUploadMiddleware = upload.any();
const noticeFileUpload = upload.single("file");


const taskFileUpload = upload.array("attachments", 5); // Max 5 files for attachments
const emptaskFileUpload = upload.array("empattachments", 5); // Max 5 files for attachments

// Middleware to validate file size for all uploaded files
const checkFileSize = async (req, res, next) => {
  const files = req.files || (req.file ? [req.file] : []);
  const invalidFiles = files.filter(
    (file) => file.size < 1024 || file.size > 10 * 1024 * 1024
  );

  if (invalidFiles.length > 0) {
    // Remove invalid files
    for (const file of invalidFiles) {
      await fs.unlinkSync(file.path);
    }
    return res
      .status(400)
      .send("Each file size must be between 1 KB and 10 MB.");
  }

  next();
};

module.exports = {
  fileUploadMiddleware,
  taskFileUpload,
  checkFileSize,
  emptaskFileUpload,
  noticeFileUpload
};