const { HTTP } = require("../../../../_constants/http");
const { RESPONSE } = require("../../../../_constants/response");
const createError = require("../../../../_helpers/createError");
const { createResponse } = require("../../../../_helpers/createResponse");
const AccessLogsService = require("../services/accessLogs.services");

exports.getAllAccesLogs = async (req, res, next) => {
  try {
    const AccessLogs = await new AccessLogsService().allLogs(
      req.query.limit,
      req.query.page,
      {}
    );
    if (AccessLogs.data.length === 0) {
      return next(
        createError(HTTP.UNAUTHORIZED, [
          {
            status: RESPONSE.ERROR,
            message: "No Access Logs Found",
            statusCode: HTTP.BAD_REQUEST,
            data: null,
            code: HTTP.BAD_REQUEST,
          },
        ])
      );
    } else {
      return createResponse("Access Logs Fetched", AccessLogs)(res, HTTP.OK);
    }
  } catch (error) {
    logger.error(err);
    return next(createError.InternalServerError(err));
  }
};
