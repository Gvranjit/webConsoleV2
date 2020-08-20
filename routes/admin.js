//imports
const router = require("express").Router();
const Message = require("../models/message");
const adminController = require("../controllers/admin");
const sequelize = require("../utils/database");
const Sequelize = sequelize.Sequelize;
const auth = require("../middlewares/auth");
const uuid = require("uuid");

//ROUTES
router.post("/options", auth, adminController.postSetOptions);

router.post("/start-server", auth, adminController.postStartServer);

router.post("/stop-server", auth, adminController.postStopServer);

router.post("/restart-server", auth, adminController.postRestartServer);

router.get("/", auth, adminController.getServerList);

router.post("/console", auth, adminController.postConsolePage);
//exports

module.exports = router;
