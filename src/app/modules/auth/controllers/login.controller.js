const { HTTP } = require("../../../../_constants/http");
const { RESPONSE } = require("../../../../_constants/response");
const { TYPE } = require("../../../../_constants/record.type");
const createError = require("../../../../_helpers/createError");
const { createResponse } = require("../../../../_helpers/createResponse");
const { comparePassword } = require("../../../../_helpers/passwordHash");
const {
  jwtSign,
  jwtSignAccessLogsData,
  jwtDecode,
} = require("../../../../_helpers/jwtUtil");
const AuthService = require("../services/auth.services");
const AccessLogsService = require("../../accessLogs/services/accessLogs.services");
const { rollback } = require("../../../../_helpers/rollbackSave");
const logger = require("../../../../../logger.conf");
exports.login = async (req, res, next) => {
  try {
    //  verify user exist=====check the login model
    const user = await new AuthService().findARecord(
      { email: req.body.email },
      TYPE.LOGIN
    );
    if (!user) {
      return next(
        createError(HTTP.UNAUTHORIZED, [
          {
            status: RESPONSE.ERROR,
            message: "User does not exist",
            statusCode: HTTP.SERVER_ERROR,
            data: null,
            code: HTTP.UNAUTHORIZED,
          },
        ])
      );
    }

    if (user && user.user_type !== req.body.user_type) {
      return next(
        createError(HTTP.UNAUTHORIZED, [
          {
            status: RESPONSE.ERROR,
            message: "You are not authorized to login",
            statusCode: HTTP.SERVER_ERROR,
            data: null,
            code: HTTP.UNAUTHORIZED,
          },
        ])
      );
    }

    // if (user && user.is_verified === false) {
    //   return next(
    //     createError(HTTP.UNAUTHORIZED, [
    //       {
    //         status: RESPONSE.ERROR,
    //         message: "Your Account Has Not Been Verified",
    //         statusCode: HTTP.SERVER_ERROR,
    //         data: null,
    //         code: HTTP.UNAUTHORIZED,
    //       },
    //     ])
    //   );
    // }
    // create token and login
    if (req.body.password) {
      const passwordMatch = await comparePassword(
        user.password,
        req.body.password
      );
      if (!passwordMatch) {
        return next(
          createError(HTTP.UNAUTHORIZED, [
            {
              status: RESPONSE.ERROR,
              message: "Invalid password",
              statusCode: HTTP.SERVER_ERROR,
              data: null,
              code: HTTP.UNAUTHORIZED,
            },
          ])
        );
      }
    }
    // check so users can't login with just email
    if (!req.body.password && !req.body.auth_type) {
      return next(
        createError(HTTP.UNAUTHORIZED, [
          {
            status: RESPONSE.ERROR,
            message: "Invalid Authorization",
            statusCode: HTTP.SERVER_ERROR,
            data: null,
            code: HTTP.UNAUTHORIZED,
          },
        ])
      );
    }
    logger.debug("USER ============= :", user.user_id);
    const user_id = user.user_id;
    const accessToken = jwtSign(user_id);

    const { iat } = jwtDecode(accessToken) || {};
    // update referesh token model
    await new AuthService().updateARecord(
      { email: req.body.email },
      { token: accessToken, isActive: true },
      TYPE.TOKEN
    );
    const updateduser = await new AuthService().updateARecord(
      { email: req.body.email },
      { is_loggedIn: true, access_token: accessToken },
      TYPE.LOGIN
    );
    // generate session id
    const now = Date.now();
    const stringTime = `${req.body.email}-${now}`;
    console.log(now.toString());
    const session_id = jwtSignAccessLogsData(stringTime);
    // push login time to access logs
    // data to access logs
    let logsData = {
      session_id,
      user_id: String(user.user_id),
      email: String(user.email),
      is_active: true,
      lat: req.body.lat || null,
      long: req.body.long || null,
      logged_in_time: now,
      role: String(user.user_type),
    };
    const userAccessLogs = await new AccessLogsService().createUserLog(
      logsData
    );
    const resData = {
      session_id: userAccessLogs.session_id,
      ...updateduser,
    };
    return createResponse("User Logged In", resData)(res, HTTP.OK);
  } catch (err) {
    logger.error(err);
    return next(createError.InternalServerError(err));
  }
};
