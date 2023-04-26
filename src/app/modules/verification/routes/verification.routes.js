const { Router } = require("express");
const { authorize } = require("../../../middlewares/authorizeUser");
const validateRequest = require("../../../middlewares/vallidate");
const RequestVerification = require("../../../vallidators/verification/requestAccountVerification.validator");
const VerifyAccount = require("../../../vallidators/verification/verifyAccount.validator");
const VerifyLink = require("../../../vallidators/verification/verifyWIthLink.validator");
const RequestVerificationController = require("../controllers/requestAccountVerification.controller");
const VerifyAccountController = require("../controllers/verifyAccount.controllers");
const VerifyLinkController = require("../controllers/verifyAccountFromLink.controller");


const router = Router();
router.post(
  "/request-verification",
  authorize(['user','org']),
  validateRequest(RequestVerification.requestAccountVerificationSchema, "body"),
  validateRequest(RequestVerification.requestAccountVerificationQuerySchema, "query"),
  RequestVerificationController.requestAccountVerification
);

router.post(
  "/verify",
  authorize(['user','org']),
  validateRequest(VerifyAccount.verifyAccountSchema, "body"),
  VerifyAccountController.verifyUserAccount
);

router.get(
  "/verify-link",
  validateRequest(VerifyLink.verifyAccountQuerySchema, "query"),
  VerifyLinkController.verifyLinkCallback
);



module.exports = router;
