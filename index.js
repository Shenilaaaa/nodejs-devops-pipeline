const express = require('express');
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
    <head>
      <title>DevOps Project Status</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 40px;
          color: #333;
        }
        h1 {
          color: #2c3e50;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin: 10px 0;
          padding: 10px;
          background: #dff0d8;
          border-left: 5px solid #3c763d;
        }
        .status {
          margin-top: 30px;
          font-weight: bold;
          color: #27ae60;
        }
      </style>
    </head>
    <body>
      <h1>🚀 DevOps Case Study Progress</h1>
      <ul>
        <li>✅ Created AWS EC2 instance using Terraform</li>
        <li>✅ Generated and used SSH key pair</li>
        <li>✅ Deployed Ubuntu 22.04 server</li>
        <li>✅ Installed Node.js on EC2</li>
        <li>✅ Set up security group & port 3000</li>
        <li>✅ Connected via SSH and ran Node app</li>
      </ul>
      <p class="status">App is running successfully 🎉</p>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`✅ App is running at http://localhost:${port}`);
});
