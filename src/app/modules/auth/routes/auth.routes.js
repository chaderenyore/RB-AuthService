const { Router } = require("express");
const { authorize } = require("../../../middlewares/authorizeUser");
const validateRequest = require("../../../middlewares/vallidate");
const loginSchema = require("../../../vallidators/auth/login.vallidator");
const validateTokenSchema = require("../../../vallidators/auth/validateToken.validator");
const signUpSchema = require("../../../vallidators/auth/signup.vallidator");
const logOutSchema = require("../../../vallidators/auth/logout.vallidator");
const loginController = require("../../auth/controllers/login.controller");
const validateTokenController = require("../../auth/controllers/vallidateToken.controllers");
const signUpController = require("../controllers/signup.controller");
const logOutController = require("../controllers/logout.controller");


const router = Router();
router.post(
  "/register",
  validateRequest(signUpSchema.registerUserSchema, "body"),
  validateRequest(signUpSchema.signupQuerySchema, "query"),
  signUpController.signUp
);

router.post(
  "/login",
  validateRequest(loginSchema.loginUserSchema, "body"),
  loginController.login
);

router.post(
  "/logout",
  authorize(['user','org']),
  validateRequest(logOutSchema.logoutSchema, "body"),
  logOutController.logOut
);

router.get(
  "/validate-token",
  authorize(['user','org']),
  validateTokenController.validate
);



module.exports = router;
