const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { bucket } = require("../Config/FireBaseConfig"); // Adjust the path as necessary
const path = require("path");

const upload = multer({ storage: multer.memoryStorage() });

const uploadToFirebase = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const file = req.file;
    const fileName = `profileImage_${uuidv4()}${path.extname(
      file.originalname
    )}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    blobStream.on("error", (error) => {
      console.error("Blob Stream Error:", error);
      return res.status(500).json({ error: "Failed to upload to Firebase." });
    });
    blobStream.on("finish", () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${
        fileUpload.metadata.metadata.firebaseStorageDownloadTokens
      }`;

      req.body.ProfileImage = publicUrl;
      next();
    });
    blobStream.end(file.buffer);
  } catch (error) {
    // console.error("Upload Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error during file upload." });
  }
};

module.exports = { upload, uploadToFirebase };
