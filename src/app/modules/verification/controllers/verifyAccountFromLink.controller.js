const axios = require("axios");
const { HTTP } = require("../../../../_constants/http");
const fs = require("fs");
const ejs = require("ejs");
const { filePaths } = require("../../../../_assets");
const KEYS = require("../../../../_config/keys");
const { RESPONSE } = require("../../../../_constants/response");
const { TYPE } = require("../../../../_constants/record.type");
const createError = require("../../../../_helpers/createError");
const { createResponse } = require("../../../../_helpers/createResponse");
const AuthService = require("../../auth/services/auth.services");
const VerfiyUserPublisher = require("../../../../_queue/publishers/verifyUser.publisher");
const logger = require("../../../../../logger.conf");
const { jwtVerify } = require("../../../../_helpers/jwtUtil");

exports.verifyLinkCallback = async (req, res, next) => {
  try {
    const failureData = {
      resend_link_page: req.query.resend_link_page,
    };
    const successData = {
      login_page: req.query.login_page,
    };
    // screens to render
    const failureTemplate = fs.readFileSync(
      process.cwd() + filePaths.FailureScreen,
      {
        encoding: "utf-8",
      }
    );
    const failureHtml = ejs.render(failureTemplate, failureData);
    const successTemplate = fs.readFileSync(
      process.cwd() + filePaths.SuccessScreen,
      {
        encoding: "utf-8",
      }
    );
    const successHtml = ejs.render(successTemplate, successData);
    // get user from token
    const Token = req.query.token;
    console.log(req.query.token);
    const UserExist = jwtVerify(Token);
    const user_id = UserExist._id;
    console.log(jwtVerify(Token));
    console.log("USER ID", user_id);

    // search if user is verified
    const isVerifed = await new AuthService().findARecord(
      { user_id },
      TYPE.LOGIN
    );
    if (isVerifed && isVerifed.is_verified === true) {
      return res.render("verified", successData);
    } else {
      const user = await new AuthService().updateARecord(
        { user_id },
        { is_verified: true },
        TYPE.LOGIN
      );
      if (!user) {
        // render verificatiomn a failure
        return res.render("failure", failureData);
      } else {
        const Data = {
          first_name: user.first_name ? user.first_name : user.username,
          email: user.email,
        };
        const mail = await axios.post(
          `${KEYS.NOTIFICATION_URI}/notifications/v1/user/welcome-mail`,
          Data,
          {
            headers: {
              Authorization: `Bearer ${req.token}`,
            },
          }
        );
        // publish to user queue
        const puiblishedMessage = await VerfiyUserPublisher.publishToVerifyUserQueue(req.user.user_id, {is_verified: true});
        // Send Account Verified Successful mail
        return res.render("success", successData);
      }
    }
  } catch (err) {
    logger.error(err);
    return next(createError.InternalServerError(err));
  }
};
