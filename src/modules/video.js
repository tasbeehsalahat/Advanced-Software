const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Set up storage using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/videos'); // Specify the directory where video files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Set the file name to be unique
    }
});

// Create the Multer instance
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 100 } // Limit file size to 100MB
});

// Route to handle video upload
app.post('/upload', upload.single('video'), (req, res) => {
    // Handle the file upload
    res.json({ message: 'Video uploaded successfully' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
