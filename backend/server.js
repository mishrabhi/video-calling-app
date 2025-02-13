const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server up and running on port: ${PORT}`);
});
