//imports
const mcServer = require("../server");
const fs = require("fs");
const { game } = require("../server");
let servers = [];

const path = require("path");
const { getMaxListeners } = require("process");
const { json } = require("body-parser");
//UTILITY FUNCTIONS
const p = path.join(__dirname, "..", "server-list.json");
const readServerList = (cb) => {
     fs.readFile(p, (err, data) => {
          if (err) {
               return console.log(err);
          }
          const serverData = JSON.parse(data);

          return cb(serverData);
     });
};

//exports

exports.postSetOptions = (req, res, next) => {
     console.log(req.body);
     if (!req.body.action) {
          const err = new Error("No action was found. Invalid request");
          err.statusCode = 400;
          throw err;
     }
     const action = req.body.action;
     const serverName = req.body.serverName;
     let autoRestartValue;
     switch (action) {
          case "autoRestartOn":
               autoRestartValue = true;
               break;
          case "autoRestartOff":
               autoRestartValue = false;
               break;
          default:
               const err = new Error("No action was found. ");
               err.statusCode = 400;
               throw err;
     }

     readServerList((data) => {
          const serversList = data;

          serversList.forEach((server) => {
               if (server.name === serverName) {
                    server.autoRestart = autoRestartValue;
               }
          });

          fs.writeFile(p, JSON.stringify(serversList), (err) => {
               if (err) {
                    throw err;
               }
          });
     });

     return res.json({
          message: "Done",
     });
};

exports.getServerList = (req, res, next) => {
     //get serverlist from config file
     readServerList((data) => {
          servers = data;
          const richServers = servers.map((server) => {
               const starting = game[server.name].starting;
               const stopping = game[server.name].stopping;
               const running = game[server.name].running;
               let status;
               if (running && !stopping) {
                    status = "Online";
               } else if (running && stopping) {
                    status = "Stopping";
               } else if (starting && !running) {
                    status = "Starting";
               } else {
                    status = "Offline";
               }

               return (richServer = { ...server, status: status });
          });
          //pass the data and status to front end.
          res.render("server-list", {
               title: "Server List",
               username: req.username,
               isLoggedIn: req.isLoggedIn,
               servers: richServers,
          });
     });

     //status calculation
};
exports.postConsolePage = (req, res, next) => {
     //check incoming request for name of server
     const server = req.body.server;

     if (!server) {
          const error = new Error("No server was received");
          error.statusCode = 400;
          throw error;
     }

     return res.render("index", {
          username: req.username,
          server: server,
          running: game[server].running,
          starting: game[server].starting,
          stopping: game[server].stopping,

          memory: "--",
          cpu: "--",
          title: "CraftNepal Console",
     });
};

exports.postStartServer = (req, res, next) => {
     mcServer.startNepalServer();
     return res.redirect("/");
};
exports.postStopServer = (req, res, next) => {
     mcServer.startNepalServer();
     return res.redirect("/");
};
exports.postRestartServer = (req, res, next) => {
     mcServer.startNepalServer();
     return res.redirect("/");
};

exports.getLatestLogs = (req, res, next) => {
     const server = req.query.server;
     res.sendFile(path.join(__dirname, "..", game[server].options.world, "logs", "latest.log"));
};
