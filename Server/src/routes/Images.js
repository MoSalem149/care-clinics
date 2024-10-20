const express = require("express");
const upload = require("../middleWares/Images");
const doctorModel = require("../models/Doctor");

const router = express.Router();

// router.post("/uploadImage", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }
//   doctorModel
//     .create({ ProfileImage: req.file.filename })
//     .then((result) => res.json(result))
//     .catch((error) => res.status(500).json({ error: "Error uploading file" }));
// });

router.get("/GetImage", (req, res) => {
  doctorModel
    .find()
    .then((doctors) => res.json(doctors))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
