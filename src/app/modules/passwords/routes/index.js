const { Router } = require("express");
const { authorize } = require("../../../middlewares/authorizeUser");
const validateRequest = require("../../../middlewares/vallidate");
const changePassword = require("../../../vallidators/passwords/changePassword.vallidator");
const RequestResetPassword = require("../../../vallidators/passwords/requestResetPassword");
const ValidatePasswordToken = require("../../../vallidators/passwords/vallidatePasswordToken.vallidator");
const ResetPassword = require("../../../vallidators/passwords/resetPassword.vallidator");
const ChangePasswordController = require("../controllers/changePassword.controller");
const RequestResetPasswordController = require("../controllers/requestResetpassword.controller");
const ValidatePasswordTokenController = require("../controllers/validatePassWToken.controllers");
const ResetPasswordController = require("../controllers/resetPassword.controller");




const router = Router();

router.put(
    "/password/change",
    authorize(['user','minder', 'admin']),
    validateRequest(changePassword.changePasswordSchema, "body"),
    ChangePasswordController.changePasswordController
  );

router.post(
  "/password/request-reset",
  validateRequest(RequestResetPassword.requestResetSchema, "body"),
  RequestResetPasswordController.requestPasswordResetController
);

router.post(
  "/password/validate-token",
  validateRequest(ValidatePasswordToken.validateTokenSchema, "body"),
  ValidatePasswordTokenController.validatePasswordTokenController
);

router.post(
    "/password/reset",
    validateRequest(ResetPassword.resetUserPasswordSchema, "body"),
    ResetPasswordController.resetUserPasswordController
  );


module.exports = router;
