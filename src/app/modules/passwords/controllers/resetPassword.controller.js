const { HTTP } = require("../../../../_constants/http");
const { RESPONSE } = require("../../../../_constants/response");
const createError = require("../../../../_helpers/createError");
const { createResponse } = require("../../../../_helpers/createResponse");
const PasswordService = require('../service/password.services');
const logger = require("../../../../../logger.conf");

exports.resetUserPasswordController = async (req, res, next) => {

  try {
    const { error, message, data } = await new PasswordService().resetPassword(
      // req.query.platform,
      req.body
    );

    if (error) {
      return next(
        createError(HTTP.OK, [
          {
            status: RESPONSE.ERROR,
            message,
            statusCode:
              data instanceof Error ? HTTP.SERVER_ERROR : HTTP.BAD_REQUEST,
            data,
            code: HTTP.BAD_REQUEST,
          },
        ])
      );
    }
    return createResponse(message, data)(res, HTTP.OK);
  } catch (err) {
    logger.error(err);

    return next(createError.InternalServerError(err));
  }
};
