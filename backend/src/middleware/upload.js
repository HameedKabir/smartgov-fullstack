import fs from "fs";
import path from "path";

import multer from "multer";

const uploadDirectory = path.resolve("uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const imageFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
    return;
  }

  cb(new Error("Only image uploads are allowed"));
};

export const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
