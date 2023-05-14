import express from "express";
import path from "path";
import { config } from "dotenv";

import { createServer } from "http";
import { socketOrderDelivery } from "./Sockets/SocketOrderDelivery.js";

import routeAuth from "./Router/Auth.routes.js";
import routerUser from "./Router/User.routes.js";
import routerProduct from "./Router/Product.routes.js";
import routerOrder from "./Router/Order.routes.js";
import routerlocaiton from "./Router/Location.routes.js";
import routerbilling from "./Router/Bill.routes.js";
import routeruserservices from "./Router/UserServices.routes.js";
import routerstory from "./Router/Stories.routes.js";
import payroute from "./Router/Payments.routes.js";
import { Server } from "socket.io";

import { fileURLToPath } from "url";
config();

const app = express();
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// CONFIG SOCKET
const httpServer = createServer(app);
// const io = new Server(httpServer);

const socketIO = new Server(httpServer, {
  cors: {
    origin: "https://justdun-backend.vercel.app",
  },
});

//👇🏻 Add this before the app.get() block
console.log("A new client connected to the server");

socketIO.on("error", (error) => {
  console.log("Socket connection error:", error);
});

socketIO.on("connection", (socket) => {
  socketIO.on("error", (error) => {
    console.log("Socket connection error:", error);
  });

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
    console.log("new message function", chats.receiver);

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
app.use(express.static(path.join(__dirname, "Uploads/Chats")));
app.use(express.static(path.join(__dirname, "Uploads/Stories")));

app.get("/", function (req, res) {
  res.send("<h1>Hey It's Working!</h1>");
});

export default httpServer;
