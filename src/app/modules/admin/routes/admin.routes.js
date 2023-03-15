const { Router } = require("express");

// middlewares
const { authorizeAdmin } = require("../../../middlewares/authorizeAdmin");
const validateRequest = require("../../../middlewares/vallidate");

// validators
const BlockUsersSchema = require("../../../vallidators/admin/blockUsers.validator");
const UnblockUsersSchema = require("../../../vallidators/admin/unblockUsers.validator");
const AllBlockedUsersSchema = require("../../../vallidators/admin/getAllBlockedUsers.validator");

// controllers
const BlockUsersController = require("../controllers/blockUser.controller");
const UnblockUsersController = require("../controllers/unblockUser.controller");
const AllBlockedUsersController = require("../controllers/getAllBlockedUser.controller");

const router = Router();

router.post(
  "/block",
  authorizeAdmin(["super", "admin", "account-edit"]),
  validateRequest(BlockUsersSchema.blockUsersSchema, "body"),
  BlockUsersController.blockUser
);

router.post(
  "/unblock",
  authorizeAdmin(["super", "admin", "account-edit"]),
  validateRequest(UnblockUsersSchema.unblockUsersSchema, "body"),
  UnblockUsersController.unBlockUser
);

router.get(
  "/all-blocked",
  authorizeAdmin(["super", "admin", "account-edit", "account-view", "support"]),
  validateRequest(AllBlockedUsersSchema.getAllBlockedUsersSchema, "query"),
  AllBlockedUsersController.getAllBlockedUsers
);

module.exports = router;
