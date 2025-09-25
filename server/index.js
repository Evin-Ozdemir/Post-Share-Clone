const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const database = require("./config/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

dotenv.config();
database();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("like", (data) => {
    socket.to(data.userId).emit("notification", {
      type: "like",
      from: data.from,
      postId: data.postId,
    });
  });

  socket.on("comment", (data) => {
    socket.to(data.userId).emit("notification", {
      type: "comment",
      from: data.from,
      postId: data.postId,
    });
  });

  socket.on("follow", (data) => {
    socket.to(data.userId).emit("notification", {
      type: "follow",
      from: data.from,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const port = 3001;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
