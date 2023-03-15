const { Router } = require("express");
const { authorize } = require("../../../middlewares/authorizeUser");
const { authorizeAdmin } = require("../../../middlewares/authorizeAdmin");
const validateRequest = require("../../../middlewares/vallidate");
const getUsersAccessLogsSchema = require("../../../vallidators/accessLogs/getUsersAccessLogs.validator");
const getAllAccessLogsSchema = require("../../../vallidators/accessLogs/getUsersAccessLogs.validator");
const getUsersAccessLogsController = require("../controllers/getUsersAccessLogs.controller");
const getAllAccessLogsController = require("../controllers/getAllAccessLogs.controller");

const router = Router();

router.get(
  "/my-logs",
  authorize(["user", "org"]),
  validateRequest(getAllAccessLogsSchema.getAllUsersAccessLogsSchema, "body"),
  getAllAccessLogsController.getAllAccesLogs
);

router.get(
  "/admin/all",
  authorizeAdmin(["super", "admin", "account-view", "account-edit"]),
  validateRequest(getAllAccessLogsSchema.getAllUsersAccessLogsSchema, "body"),
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

module.exports = router;
