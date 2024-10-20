const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadSingleFile = (req, res, next) => {
  const fieldName = req.body.image ? "image" : "profileImage";
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (req.file) {
      req.file.firebaseFilename = `${
        req.file.fieldname
      }_${uuidv4()}${path.extname(req.file.originalname)}`;
    }
    next();
  });
};

module.exports = uploadSingleFile;
