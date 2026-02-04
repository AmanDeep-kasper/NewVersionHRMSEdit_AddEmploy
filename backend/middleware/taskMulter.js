

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = "./empAttachment"; // Directory for task attachments
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});



const emptaskFileUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",        // JPEG images
      "image/png",         // PNG images
      "application/pdf",   // PDF files
      "application/msword",// MS Word files
      "application/zip",   // ZIP files
      "audio/mpeg",        // MP3 audio files
      "audio/wav",         // WAV audio files
      "video/mp4",         // MP4 video files
      "video/webm",        // WebM video files
      "video/ogg"          // OGG video files
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"), false);
    }
  },
}).array("attachments", 5); // Maximum 5 files

module.exports = { emptaskFileUpload };
