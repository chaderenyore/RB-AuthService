const { Router } = require("express");
const Auth = require("./modules/auth/routes/auth.routes");
const AccessLogs = require("./modules/accessLogs/routes/accessLogs.routes");
const Password = require("./modules/passwords/routes/passwords.routes");
const AccountVerification = require("./modules/verification/routes/verification.routes");




module.exports = () => {
  
  const router = Router();

  router.use("/user", Auth);
  router.use("/user-logs", AccessLogs);
//   router.use("/password", Password);
//   router.use("/account", AccountVerification);

  return router;
};
