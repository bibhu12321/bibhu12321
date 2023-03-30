const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const http = require("http").Server(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

mongoose.connect(process.env.MONGO_URI, (err) => {
  console.log("connected to database");
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", messageRoutes);

app.use(cors());

const PORT = 8000;

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

//socket code ----------------------------

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //new user connected
  console.log("a user connected");

  //added new user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send typing status
  socket.on("typing", ({typingState,chatUserId,chatUser}) => {
    console.log("type----", typingState);
     //const user = getUser(receiverId);
    if(typingState === true){
    io.emit("displayTypingStatus", {typingState,chatUserId,
      chatUser})
    }
    
  })

  //send and get message
  socket.on("sendMessage", ({ senderId, senderName, receiverId, text }) => {
    const user = getUser(receiverId);
    io.emit("getMessage", {
      senderID: senderId,
      senderName,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
