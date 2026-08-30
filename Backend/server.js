const express = require("express");
const connectDB = require("./congfig/db");
const app = express();
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const translateRoutes = require("./Routes/transalteRoutes");
const { notFound, errorHandlers } = require("./middlewares/errorMiddleware");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

connectDB();
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/translate", translateRoutes);

//-----------------------------------DEPLOYMENT------------------------

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is Running Succesfully!");
  });
}

//-----------------------------------DEPLOYMENT------------------------

app.use(notFound);
app.use(errorHandlers);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["https://chitchat-hsxm.onrender.com", "http://localhost:5173", "http://localhost:5174"],
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join room", (room) => {
    socket.join(room);
    console.log("User joined room" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("Stop typing", (room) => socket.in(room).emit("Stop typing"));
  
  socket.on("change background", ({ chatId, background }) => {
    socket.in(chatId).emit("background updated", { chatId, background });
  });

  socket.on("new message", async (newMessageRecived) => {
    var chat = newMessageRecived.chat;
    console.log(newMessageRecived);
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecived);
    });

    socket.off("setup", () => {
      console.log("User Disconnected!");
      socket.leave(userData._id);
    });
  });
});
