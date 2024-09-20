import admin from "firebase-admin";
import { createRequire } from "module";
import { v4 as uuidv4 } from "uuid";
import config from "../config.js";

const require = createRequire(import.meta.url);
export const upload = async (req, res) => {
  console.log(config.firebaseConfig.storageBucket);
  admin.initializeApp({
    credential: admin.credential.cert(require(config.admin)),
    storageBucket: config.firebaseConfig.storageBucket,
  });
  try {
    const file = req.file;
    const bucket = admin.storage().bucket();

    if (!file) {
      return res.status(400).send({ message: "No file uploaded." });
    }

    const fileName = `${uuidv4()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.error(error);
      res
        .status(500)
        .send({ message: "Something went wrong with the upload." });
    });

    blobStream.on("finish", async () => {
      await fileUpload.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      res
        .status(200)
        .send({ message: "File uploaded successfully.", url: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error." });
  }
};
