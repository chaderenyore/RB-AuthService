const { Router } = require("express");
const validateRequest = require("../../../middlewares/vallidate");
const RequestVerification = require("../../../vallidators/verification/requestAccountVerification.validator");
const VerifyAccount = require("../../../vallidators/verification/verifyAccount.validator");
const RequestVerificationController = require("../controllers/requestAccountVerification.controller");
const VerifyAccountController = require("../controllers/verifyAccount.controllers");


const router = Router();
router.post(
  "/request-verification",
  validateRequest(RequestVerification.requestAccountVerificationSchema, "body"),
  RequestVerificationController.requestAccountVerification
);

router.post(
  "/verify",
  validateRequest(VerifyAccount.verifyAccountSchema, "body"),
  VerifyAccountController.verifyUserAccount
);



module.exports = router;
