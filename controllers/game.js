const io = require("../socket").io();
const path = require("path");
const fs = require("fs");
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

exports.onStop = (serverName, game) => {
     console.log("=================");
     console.log("Server stopped: " + serverName);
     console.log("=================");
     io.to(serverName).emit("stopped", {
          serverName: serverName,
          running: game[serverName].running,
          starting: game[serverName].starting,
          stopping: game[serverName].stopping,
     });
     // stopDataEmit(serverName);

     readServerList((serversList) => {
          serversList.forEach((server) => {
               let autoRestart;
               if (server.name === serverName) {
                    autoRestart = server.autoRestart;
               }
               if (autoRestart) {
                    console.log("RESTARTING SERVER : " + serverName + " in 5 seconds . . . ");
                    setTimeout(() => {
                         game[serverName].start();
                    }, 4000);
               }
          });
     });
};

exports.onError = (serverName, game, err) => {
     io.to(serverName).emit("stopped", {
          serverName: serverName,
          running: game[serverName].running,
          starting: game[serverName].starting,
          stopping: game[serverName].stopping,
     });
     io.emit("chat", { message: "And Error Has occured. Server Couldn't start" });

     console.log("-------------------------------------------------------------------------------");
     console.log(
          `The ${serverName} Server Coudn't be started, please check server details in server-list.json file`
     );
     console.log("-------------------------------------------------------------------------------");
};

exports.onStart = (serverName, game) => {
     console.log(serverName + "Server is online!");
     // startDataEmit(serverName, game);
     io.to(serverName).emit("started", {
          serverName: serverName,
          running: game[serverName].running,
          starting: game[serverName].starting,
          stopping: game[serverName].stopping,
     });
};
exports.onMessage = (serverName, message) => {
     const filteredMessage = message.rawMessage.split("<").join("[").split(">").join("] : ");
     console.log(filteredMessage);
     io.to(serverName).emit("chat", { name: serverName, message: filteredMessage });
};

//REGULAR JOB FUNCTIONS

let intervalId = {};
const startDataEmit = (serverName, game) => {
     intervalId[serverName] = setInterval(() => {
          game[serverName]
               .memoryUsage()
               .then((data) => {
                    io.to(serverName).emit("resourcesUpdate", {
                         serverName: serverName,
                         ramUsage: (data.memory / 1024 / 1024).toFixed(0) + " MB",
                         cpuUsage: data.cpu.toFixed(0) + "%",
                    });
               })
               .catch((err) => {
                    console.log("Cannot fetch detail of resources of " + serverName);
                    console.log(intervalId);
                    io.to(serverName).emit("chat", { message: err });
               });
     }, 5000);
     console.log("In start data emit : ", intervalId);
};
const stopDataEmit = (serverName, game) => {
     console.log("Before clearing : " + serverName);
     console.log(intervalId);
     clearInterval(intervalId[serverName]);
     console.log("After clearing : " + serverName);
     console.log(intervalId);
};

exports.startDataEmit = startDataEmit;
