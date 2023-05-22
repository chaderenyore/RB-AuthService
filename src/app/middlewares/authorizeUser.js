const { HTTP } = require("../../_constants/http");
const { TYPE } = require("../../_constants/record.type");
const { RESPONSE } = require("../../_constants/response");
const createError = require("../../_helpers/createError");
const { jwtVerify } = require("../../_helpers/jwtUtil");
const AuthService = require("../modules/auth/services/auth.services");
const SessionLogsService = require("../modules/accessLogs/services/accessLogs.services");
const logger = require("../../../logger.conf");

exports.authorize = (role = []) => {
  return async (req, res, next) => {
    console.log("HEADRERS :", req.headers);
    const message = "Unauthorized";
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1];
    if (!token) {
      return next(
        createError(HTTP.UNAUTHORIZED, [
          {
            status: RESPONSE.ERROR,
            message,
            statusCode: HTTP.UNAUTHORIZED,
          },
        ])
      );
    }
    try {
      const user = jwtVerify(token);
      if(user){
        const LoginRecord = await new AuthService().findARecord(
          { user_id: user._id },
          TYPE.LOGIN
        );
        if(!LoginRecord){
          return next(
            createError(HTTP.UNAUTHORIZED, [
              {
                status: RESPONSE.ERROR,
                message,
                statusCode: HTTP.UNAUTHORIZED,
              },
            ])
          );
          ``;
        } else {
          // check if session is still active
          const session = await new SessionLogsService().findAUserLogs({
            session_token: token,
          });
          console.log("SESSION ======= ", session)
          if (session && !session.is_active) {
            return next(
              createError(HTTP.UNAUTHORIZED, [
                {
                  status: RESPONSE.ERROR,
                  message: "This Session Has Been Logged Out",
                  statusCode: HTTP.UNAUTHORIZED,
                  data: {},
                  code: HTTP.UNAUTHORIZED,
                },
              ])
            );
          } else {
            if(role.includes(String(LoginRecord.user_type))){
              logger.info(LoginRecord);
              req.user = LoginRecord;
              req.token = token;
              next();
            } else {
              return next(
                createError(HTTP.UNAUTHORIZED, [
                  {
                    status: RESPONSE.ERROR,
                    message: "Unauthorized",
                    statusCode: HTTP.UNAUTHORIZED,
                    data: {},
                    code: HTTP.UNAUTHORIZED,
                  },
                ])
              );
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      return next(createError.InternalServerError());
    }
  };
};
