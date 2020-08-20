//imports
const router = require("express").Router();
const authController = require("../controllers/auth");
const auth = require("../middlewares/auth");
//ROUTES
router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/logout", authController.getLogout);

router.post("/register", authController.postRegister);

//exports

module.exports = router;
