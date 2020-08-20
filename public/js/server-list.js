//imports
const socket = io();

//collecting elements
const username = document.getElementById("username").value;
const serverStatus = document.getElementsByClassName("server-option--status");
const serverNames = document.getElementsByName("server");
const serverControl = document.getElementsByName("checkbox");
const backdrop = document.getElementById("backdrop");
const autoRestartSliders = document.getElementsByName("auto-restart");
//adding first runtime scripts
for (let i = 0; i < serverStatus.length; i++) {
     const status = serverStatus.item(i);
     const slider = serverControl.item(i);
     const serverName = serverNames.item(i).value;
     const autoRestart = autoRestartSliders.item(i);
     socket.emit("joinRoom", { server: serverName });

     if (status.innerHTML == "Offline") {
          status.style.borderColor = "red";
          status.style.color = "red";
          slider.disabled = false;
          slider.checked = false;
     }
     if (status.innerHTML == "Starting") {
          status.style.borderColor = "orange";
          status.style.color = "orange";
          slider.disabled = true;
          slider.checked = true;
     }
     if (status.innerHTML == "Stopping") {
          status.style.borderColor = "orange";
          status.style.color = "orange";
          slider.disabled = true;
          slider.checked = false;
     }
     if (status.innerHTML == "Online") {
          status.style.borderColor = "#4AFF0C";
          status.style.color = "#4AFF0C";
          slider.disabled = false;
          slider.checked = true;
     }

     slider.addEventListener("click", () => {
          console.log("THE SERVER CLICKED ON WAS: " + serverName);
          sliderAction(serverName, slider, status);
     });

     autoRestart.addEventListener("click", () => {
          autoRestartAction(serverName, autoRestart);
          console.log("Auto Restart Toggled ! ");
     });

     socket.on("started", (payload) => {
          if (payload.serverName === serverName) {
               slider.disabled = false;
               slider.checked = true;
               status.innerHTML = "Online";
               status.style.color = "#4AFF0C";
               status.style.borderColor = "#4AFF0C";
          }
     });
     socket.on("stopped", (payload) => {
          console.log(payload);
          if (payload.serverName === serverName) {
               setTimeout(() => {
                    slider.disabled = false;
                    slider.checked = false;
                    status.innerHTML = "Offline";
                    status.style.color = "red";
                    status.style.borderColor = "red";
               }, 1000);
          }
     });
}

//some canvas stuff

// const chart = new CanvasJS.Chart("resources-usage-graph--canvas", {
//      title: {
//           text: "RAM usage",
//      },
//      data: [
//           {
//                type: "column",
//                name: "TESTING",
//                showInLegend: false,
//                dataPoints: [{ label: "banana", y: 58 }],
//           },
//      ],
// });

//SOCKET IO EVENT LISTENERS

function autoRestartAction(serverName, autoRestart) {
     if (autoRestart.checked) {
          payload = {
               action: "autoRestartOn",
               serverName: serverName,
          };

          fetch("/admin/options", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
               },
               body: JSON.stringify(payload),
          }).then((res) => {
               console.log(res);
               if (res.status != 200 && res.status != 201) {
                    setTimeout(() => {
                         autoRestart.checked = false;
                    }, 1000);
               }
          });
     }
     if (!autoRestart.checked) {
          payload = {
               action: "autoRestartOff",
               serverName: serverName,
          };

          fetch("/admin/options", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
               },
               body: JSON.stringify(payload),
          }).then((res) => {
               console.log(res);
               if (res.status != 200 && res.status != 201) {
                    setTimeout(() => {
                         autoRestart.checked = true;
                    }, 1000);
               }
          });
     }
}
function sliderAction(serverName, slider, status) {
     if (slider.checked) {
          slider.disabled = true;
          status.innerHTML = "Starting";
          status.style.color = "orange";
          status.style.borderColor = "orange";
          socket.emit("startServer", {
               username: username,
               server: serverName,
          });
     }
     if (!slider.checked) {
          confirm((yes) => {
               if (yes) {
                    slider.disabled = true;
                    status.innerHTML = "Stopping";
                    status.style.color = "orange";
                    status.style.borderColor = "orange";
                    socket.emit("stopServer", {
                         username: username,
                         server: serverName,
                    });
               } else {
                    slider.checked = true;
               }
          });
     }
}

function confirm(cb) {
     backdrop.style.display = "block";
     confirmation.style.display = "block";
     const yes = document.getElementById("yes");
     const no = document.getElementById("no");
     no.addEventListener("click", () => {
          backdrop.style.display = "none";
          confirmation.style.display = "none";
          cb(false);
     });
     yes.addEventListener("click", () => {
          backdrop.style.display = "none";
          confirmation.style.display = "none";
          cb(true);
     });
}
