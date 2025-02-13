const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//Handling user connection
io.on("connection", (socket) => {
  console.log("New user connected", socket.id);

  //Join room
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    //Handle user disconnect
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });

  //Relay WebRTC offer
  socket.on("offer", (data) => {
    socket.to(data.room).emit("answer", data);
  });

  //Relay ICE candidates
  socket.on("ice-candidates", (data) => {
    socket.to(data.room).emit("ice-candiate", data);
  });
});

// Basic route for server check
app.get("/", (req, res) => {
  res.send("WebRTC Signaling Server is Running!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server up and running on port: ${PORT}`);
});
