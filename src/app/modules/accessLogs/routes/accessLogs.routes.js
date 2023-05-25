const { Router } = require("express");
const { authorize } = require("../../../middlewares/authorizeUser");
const { authorizeAdmin } = require("../../../middlewares/authorizeAdmin");
const validateRequest = require("../../../middlewares/vallidate");

// validators
const getUsersAccessLogsSchema = require("../../../vallidators/accessLogs/getUsersAccessLogs.validator");
const getAllAccessLogsSchema = require("../../../vallidators/accessLogs/getAllAccessLogs.validator");
const logoutSessionSchema = require("../../../vallidators/accessLogs/logOutSession.validator");


// controllers
const getUsersAccessLogsController = require("../controllers/getUsersAccessLogs.controller");
const getAllAccessLogsController = require("../controllers/getAllAccessLogs.controller");
const logOutSessionController = require("../controllers/logOutSession.controller");


const router = Router();

router.get(
  "/my-logs",
  authorize(["user", "org"]),
  validateRequest(getAllAccessLogsSchema.getAllUsersAccessLogsSchema, "body"),
  getAllAccessLogsController.getAllAccesLogs
);

router.get(
  "/all-userlogs",
  authorizeAdmin(["super", "admin", "account-view", "account-edit"]),
  validateRequest(getAllAccessLogsSchema.getAllAccessLogsSchema, "query"),
  getAllAccessLogsController.getAllAccesLogs
);

router.get(
  "/admin",
  authorizeAdmin([
    "super",
    "admin",
    "account-view",
    "account-edit",
  ]),
  validateRequest(
    getUsersAccessLogsSchema.getAllUsersAccessLogsSchema,
    "query"
  ),
  getUsersAccessLogsController.getAllAccesLogs
);

router.post(
  "/session/log-out",
  authorize(["user", "org"]),
  validateRequest(logoutSessionSchema.logOutSessionSchema, "query"),
  logOutSessionController.logoutSession
);

module.exports = router;
