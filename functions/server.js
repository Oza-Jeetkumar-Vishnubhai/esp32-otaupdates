const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
const { ref, getDownloadURL } = require("firebase/storage");
const { storage } = require("../firebaseConfig.js");
const stream = require('stream');

const app = express();
const PORT = 8000;

// Middleware to parse JSON body
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ es: 0 });
});

// Endpoint to check updates
app.get("/checkUpdates/:version", async (req, res) => {
  const { version } = req.params;
  console.log(version);
  try {
    const pathReference = ref(storage, "esp32Code/Final Code.txt");
    const url = await getDownloadURL(pathReference);
    console.log("url : ",url)
  } catch (error) {
    console.log(error)
  }

  if (!version) {
    return res
      .status(400)
      .json({ error: "Version is required in the request body." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
