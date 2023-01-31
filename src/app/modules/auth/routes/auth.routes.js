const { Router } = require("express");
const validateRequest = require("../../../middlewares/vallidate");
const loginSchema = require("../../../vallidators/auth/login.vallidator");
const signUpSchema = require("../../../vallidators/auth/signup.vallidator");
const logOutSchema = require("../../../vallidators/auth/logout.vallidator");
const loginController = require("../../auth/controllers/login.controller");
const signUpController = require("../controllers/signup.controller");
const logOutController = require("../controllers/logout.controller");


const router = Router();
router.post(
  "/register",
  validateRequest(signUpSchema.registerUserSchema, "body"),
  signUpController.signUp
);

router.post(
  "/login",
  validateRequest(loginSchema.loginUserSchema, "body"),
  loginController.login
);

router.post(
  "/logout",
  validateRequest(logOutSchema.logoutSchema, "body"),
  logOutController.logOut
);


module.exports = router;
