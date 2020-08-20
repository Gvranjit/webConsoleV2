const Socket = require("socket.io");
let io;
module.exports = {
     init: (http) => {
          io = Socket(http);
     },
     io: () => {
          if (!io) {
               throw new Error("NOT READY");
          }
          return io;
     },
};
