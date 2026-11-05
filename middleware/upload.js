const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) =>
        cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname).toLowerCase())
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (req, file, cb) =>
        cb(null, ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype))
});

module.exports = upload;