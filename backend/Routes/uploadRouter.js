const express = require('express');
const router = express.Router();
const upload = require('../Middleware/uploadmiddleware');
const protect = require('../Middleware/authmiddleware');

router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  // Construct URL (In production this would include full domain)
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

module.exports = router;
