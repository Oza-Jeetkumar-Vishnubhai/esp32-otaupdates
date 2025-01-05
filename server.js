const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ref, getDownloadURL,listAll } = require("firebase/storage");
const { storage } = require("./firebaseConfig.js");

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
    const folderRef = ref(storage, "esp32Code/");
    const files = await listAll(folderRef)
    console.log(files)
    const fileRef = files.items[0];
    if(version==fileRef.name.split('.ino')[0]){
      return res.status(200).json({ update:false,message: "No updates available." });
    }
    const url = await getDownloadURL(fileRef);
    console.log("url : ",url)
    res.status(200).json({ message: "Update available.", firmwareUrl: url });
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
