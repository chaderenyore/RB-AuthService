const { HTTP } = require("../../../../_constants/http");
const { RESPONSE } = require("../../../../_constants/response");
const createError = require("../../../../_helpers/createError");
const { jwtDecode } = require("../../../../_helpers/jwtUtil");
const { TYPE } = require("../../../../_constants/record.type");
const { createResponse } = require("../../../../_helpers/createResponse");
const AuthService = require("../services/auth.services");
const AccessLogService = require("../../accessLogs/services/accessLogs.services");
const logger = require("../../../../../logger.conf");

exports.logOut = async (req, res, next) => {
  try {
    const session = await new AccessLogService().findAUserLogs(
      { session_id: req.body.session_id, session_token: req.token }
    );
    if (!session) {
      return next(
        createError(HTTP.OK, [
          {
            status: RESPONSE.SUCCESS,
            message: "Invalid Session",
            statusCode: HTTP.OK,
            data: null,
            code: HTTP.OK,
          },
        ])
      );
    } 
    if (session && !session.is_active) {
      return next(
        createError(HTTP.UNAUTHORIZED, [
          {
            status: RESPONSE.ERROR,
            message: "This Session Has been Logged Out Already",
            statusCode: HTTP.SERVER_ERROR,
            data: null,
            code: HTTP.UNAUTHORIZED,
          },
        ])
      );
    }  else {
          // data to access logs
          let now = Date.now();
          const logsData = {
            lat: req.body.lat || "",
            long: req.body.long || "",
            is_active: false,
            logged_out_time: now,
            login_duration: now - session.logged_in_time,
          };
          const accessLogs = await new AccessLogService().updateLogs(
            { session_id: req.body.session_id, session_token: req.token  },
            logsData
          );
          const resdata = {
            session_id: accessLogs.session_id,
            ...accessLogs,
          };
          return createResponse("Logged Out", resdata)(res, HTTP.OK);

      
    }
  } catch (err) {
    logger.error(err);

    return next(createError.InternalServerError(err));
  }
};
