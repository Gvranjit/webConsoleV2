//database related imports
const sequelize = require("./utils/database");
const User = require("./models/user");
const Post = require("./models/post");
const Message = require("./models/message");
const uuid = require("uuid");

//website  related imports
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const socket = require("./socket");
socket.init(http);
const io = socket.io();

const { Game } = require("minecraft-control");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cookie = require("cookie-parser");
const cors = require("cors");

//MINECRAFT SERVER RELATED imports.
const mcServer = require("./server.js");
mcServer.init();
const { game } = mcServer; //initializing game server
const { startDataEmit } = require("./controllers/game");

//app settings
app.set("views", "views");
app.set("view engine", "ejs");

//APP IMPORTS LIKE MODELS, ROUTES AND UTILITES
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const { Console } = require("console");

//essential Middlewares==============
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());
// app.use(
//      cors({
//           origin: "",
//           credentials: true,
//      })
// );

// REQ Locals
app.use((req, res, next) => {
     res.locals.isLoggedIn = false;
     res.locals.profilePicUrl = "/images/placeholder-profile.jpg";
     res.set("Cache-Control", "no-store");
     next();
});

//MAIN MIDDLEWARES``````````
// app.use("/", async (req, res, next) => {
//      file = fs.createReadStream("./data/song.mp3");
//      file.pipe(res);
// });

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use(adminRoutes);
app.use((req, res, next) => {
     res.redirect("/");
});
app.use((error, req, res, next) => {
     if (!error.statusCode) {
          error.statusCode = 500;
     }
     if (error.statusCode == 401) {
          return res.status(401).render("./auth/login.ejs", { title: "Login" });
     }
     console.log(error);
     res.status(error.statusCode).redirect("/");
});

/////////////////////////////////////

sequelize.sync({ force: false }).then(() => {});

http.listen(process.env.port || 8080);
//SOCKET IO

io.on("connection", socketController);

function socketController(socket) {
     console.log("A user is connected");
     socket.on("joinRoom", (payload) => {
          const server = payload.server;
          socket.join(server);
          console.log("Joined the room : " + server);
     });

     socket.on("disconnect", () => {
          console.log("user disconnected");
     });
     socket.on("chat message", (payload) => {
          console.log(payload);
          if (game[payload.server] && game[payload.server].running) {
               game[payload.server].sendCommand(payload.message);
          }
          io.to(payload.server).emit("chat", { message: payload.message });
     });
     socket.on("stopServer", (msg) => {
          console.log(msg);
          if (!game[msg.server].running) {
               return;
          } else {
               game[msg.server].stop();
          }
     });
     socket.on("forceStopServer", (msg) => {
          console.log("FORCING SHUTDOWN");
          game[msg.server].forceStop();
     });
     socket.on("startServer", (msg) => {
          console.log(msg);
          if (
               mcServer.game[msg.server].running ||
               mcServer.game[msg.server].starting ||
               mcServer.game[msg.server].stopping
          ) {
               return console.log("game is already running. ");
          }
          mcServer.game[msg.server].start();
          io.to(msg.server).emit("chat", { message: msg.username + " issued a START command" });
          // startDataEmit(msg.server, game);
     });
}
