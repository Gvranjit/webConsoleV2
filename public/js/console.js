//nothing here
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
