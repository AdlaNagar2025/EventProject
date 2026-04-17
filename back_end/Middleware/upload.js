// Middleware/upload.js
// הגדרת storage ל-Multer: קובע איפה נשמרים הקבצים ואיך נקבע השם שלהם
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png"];
//     if (!allowedTypes.includes(file.mimetype)) {
//       return cb(new Error("Invalid file type"), false);
//     }
//     cb(null, true);
//   },
// });

module.exports = upload;
