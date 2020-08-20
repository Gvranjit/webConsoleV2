const { Game } = require("minecraft-control");
const serverList = require("./server-list.json");
const gameController = require("./controllers/game");

//UTILITY FUNCTIONS
const path = require("path");
const fs = require("fs");
const p = path.join(__dirname, "server-list.json");
const readServerList = (cb) => {
     fs.readFile(p, (err, data) => {
          if (err) {
               return console.log(err);
          }
          const serverData = JSON.parse(data);

          return cb(serverData);
     });
};

let game = {},
     restarting;

const initialize = (servers) => {
     console.log("Initializing all game servers . . .");
     servers.forEach((server) => {
          game[server.name] = new Game({
               server: server.jar,
               world: "./servers/" + server.folder,
          });
          game[server.name].defaultOptions.javaOpts = ["-Xmx1024M", "-Xms1024M"];
          game[server.name].name = server.name;
          // console.log(game[server.name].options.world);
          console.log(game[server.name].name);
     });
};

//scheduler

const CronJob = require("cron").CronJob;

const job = new CronJob(
     "0 0 6 * * *",
     () => {
          readServerList((serversList) => {
               serversList.forEach((server) => {
                    if (server.autoRestart) {
                         console.log("Scheduled Restart : " + server.name + " in 5 seconds . . . ");
                         if (game[server.name].running) {
                              setTimeout(() => {
                                   game[server.name].stop();
                              }, 4000);
                         } else {
                              setTimeout(() => {
                                   game[server.name].start();
                              }, 4000);
                         }
                    }
               });
          });
     },
     null,
     true,
     "Asia/Kathmandu"
);

job.start();

exports.init = async () => {
     initialize(serverList);
     initializeListeners();
};
const startAllServers = (servers) => {
     servers.forEach((server) => {
          console.log(`Starting ${server.name} server . . .`);
          game[server.name].start((loadingTime) => {
               console.log(`${server.name} successfully started in ${loadingTime} seconds`);
          });
     });
};

const initializeListners = (servers) => {
     servers.forEach((server) => {
          game[server.name].on("error", () => {
               gameController.onError(server.name, game);
          });

          game[server.name].on("stop", () => {
               gameController.onStop(server.name, game);
          });

          game[server.name].on("error", () => {
               gameController.onError(server.name, game);
          });

          game[server.name].on("start", () => {
               gameController.onStart(server.name, game);
          });
          game[server.name].on("message", (message) => {
               gameController.onMessage(server.name, message);
          });
     });
};
//MC SERVER LISTNERS

function initializeListeners() {
     console.log("initializing listners now. ");

     initializeListners(serverList);
}

exports.control = {
     startServer: (serverName) => {
          game[serverName].start();
     },
     stopServer: (serverName) => {
          game[serverName].stop();
     },
     restartServer: (serverName) => {
          restarting = true;
          game[serverName].stop();
     },
};

exports.game = game;
