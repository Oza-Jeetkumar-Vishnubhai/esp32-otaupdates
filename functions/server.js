const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const ServerlessHttp = require("serverless-http");


const app = express();
const PORT = 8000;

// Middleware to parse JSON body
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
  res.status(200).json({es:0});
})

// Endpoint to check updates
app.get('/checkUpdates/:version', (req, res) => {
  const { version } = req.params;
  console.log(version)

  if (!version) {
    return res.status(400).json({ error: 'Version is required in the request body.' });
  }

  const publicDir = path.join(__dirname, 'public');

  // Read all files in the public folder
  fs.readdir(publicDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading files from the public folder.' });
    }

    // Find a file that matches the version
    console.log(files)
    if (files[0].split(".ino")[0]!==version) {
      // Serve the matching file
      res.setHeader('Content-Type', 'application/octet-stream');
      res.status(200); 
      res.sendFile(path.join(publicDir, files[0]));
    } else {
      res.status(200).json({update:false});
    }
  });
});

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const handler = ServerlessHttp(app);

module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
