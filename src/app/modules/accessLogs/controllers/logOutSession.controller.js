const { HTTP } = require("../../../../_constants/http");
const { RESPONSE } = require("../../../../_constants/response");
const createError = require("../../../../_helpers/createError");
const { createResponse } = require("../../../../_helpers/createResponse");
const AccessLogsService = require("../services/accessLogs.services");

exports.logoutSession = async (req, res, next) => {
  try {
    const updateData = {
        is_active: false
    }
    const loggedOutSession = await new AccessLogsService().updateLogs(
      { user_id: req.user.user_id, session_id: req.query.session_id },
      updateData
    );
    if (!loggedOutSession) {
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
    } else {
      return createResponse("Session(s) Logged Out", loggedOutSession)(
        res,
        HTTP.OK
      );
    }
  } catch (error) {
    logger.error(err);
    return next(createError.InternalServerError(err));
  }
};
