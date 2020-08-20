const floatingEmail = document.querySelector(".floating-email");
const floatingPassword = document.querySelector(".floating-password");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const cancelButton = document.getElementById("cancel");

console.log(floatingEmail, floatingPassword, emailInput, passwordInput);

//email field
floatingEmail.addEventListener("click", () => {
     floatingEmail.setAttribute("class", "floating-email--selected");
     emailInput.focus();
});
emailInput.addEventListener("focusin", () => {
     floatingEmail.setAttribute("class", "floating-email--selected");
});
emailInput.addEventListener("focusout", () => {
     if (!emailInput.value) {
          floatingEmail.setAttribute("class", "floating-email");
     }
});
emailInput.addEventListener("input", () => {
     if (!emailInput.value) {
          floatingEmail.setAttribute("class", "floating-email");
     }
});
if (emailInput.value) {
     floatingEmail.setAttribute("class", "floating-email--selected");
}

//password field

floatingPassword.addEventListener("click", () => {
     floatingPassword.setAttribute("class", "floating-password--selected");
     passwordInput.focus();
});
passwordInput.addEventListener("focusin", () => {
     floatingPassword.setAttribute("class", "floating-password--selected");
});
passwordInput.addEventListener("focusout", () => {
     if (!passwordInput.value) {
          floatingPassword.setAttribute("class", "floating-email");
     }
});
passwordInput.addEventListener("input", () => {
     if (!passwordInput.value) {
          floatingPassword.setAttribute("class", "floating-email");
     }
});
if (emailInput.value) {
     floatingPassword.setAttribute("class", "floating-password--selected");
}

//REGISTER MODAL
const register = document.getElementById("register");
const registrationModal = document.querySelector(".registration-form");
register.addEventListener("click", openRegistrationModal);
cancelButton.addEventListener("click", closeRegistrationModal);

//functions

function openRegistrationModal() {
     console.log("clicked");
     registrationModal.style.display = "block";
     backdrop.style.display = "block";
}
function closeRegistrationModal() {
     registrationModal.style.display = "none";
     backdrop.style.display = "none";
}
