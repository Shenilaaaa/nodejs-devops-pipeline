const express = require('express');
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
    <head>
      <title>DevOps Case Study</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          color: #2c3e50;
          text-align: center;
        }
        .container {
          background: #ffffff;
          padding: 40px 60px;
          border-radius: 15px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }
        .container:hover {
          transform: translateY(-5px);
        }
        h1 {
          font-size: 3em;
          margin: 0;
          color: #8e44ad;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        h2 {
          font-size: 1.5em;
          margin: 5px 0;
          color: #34495e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Capgemini</h1>
        <h2>DevOps case study 2</h2>
        <h2>by shenila</h2>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ App is running at http://0.0.0.0:${port}`);
});
