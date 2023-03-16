import express from "express";
import path from "path";
import { config } from "dotenv";

import { createServer } from "http";
import Server from "socket.io";
import { socketOrderDelivery } from "./Sockets/SocketOrderDelivery";

import routeAuth from "./Router/Auth.routes";
import routerUser from "./Router/User.routes";
import routerProduct from "./Router/Product.routes";
import routerOrder from "./Router/Order.routes";
import routerlocaiton from "./Router/Location.routes";
import routerbilling from "./Router/Bill.routes";
import routeruserservices from "./Router/UserServices.routes";
import routerstory from "./Router/Stories.routes";
import payroute from "./Router/Payments.routes";

config();

const app = express();

// CONFIG SOCKET
const httpServer = createServer(app);
// const io = new Server(httpServer);

const socketIO = require("socket.io")(httpServer, {
  cors: {
    origin: "<http://localhost:7070>",
  },
});

//👇🏻 Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("setup", (userData) => {
    console.log("setup funciton hai chalega to", userData);
    socket.join(userData);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chatroom = newMessageRecieved.chatroom;
    var chats = newMessageRecieved;

    if (!chats.receiver) return console.log("chat.receiver not defined");

    // chat.users.forEach((user) => {
    // if (user._id == newMessageRecieved.sender._id) return;

    socket.in(chats.receiver).emit("message recieved", newMessageRecieved);
    // });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routeAuth);
app.use("/api", routerUser);
app.use("/api", routerProduct);
app.use("/api", routerOrder);
app.use("/api", routerlocaiton);
app.use("/api", routerbilling);
app.use("/api", routeruserservices);
app.use("/api", routerstory);
app.use("/api", payroute);

app.use(express.static(path.join(__dirname, "Uploads/Profile")));
app.use(express.static(path.join(__dirname, "Uploads/Products")));

export default httpServer;
