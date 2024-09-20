import cors from "cors";
import express from "express";
import multer from "multer";
import config from "./config.js";
import { upload as controllerFn } from "./controller/upload_media.js";
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send(" hello user ");
});
app.post("/api/upload", upload.single("file"), controllerFn);
app.listen(config.port, () => {
  console.log("File Manager is running on the port " + config.port);
});
