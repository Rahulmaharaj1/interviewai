const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 3 * 1024 * 1024, // 3 MB
    },

    fileFilter: (req, file, cb) => {
        console.log("Uploaded file:", {
            originalname: file.originalname,
            mimetype: file.mimetype,
        });

        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed."));
        }
    },
});

module.exports = upload;