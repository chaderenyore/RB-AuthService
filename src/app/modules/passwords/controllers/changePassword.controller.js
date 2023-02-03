const { HTTP } = require('../../../../_constants/http');
const { RESPONSE } = require('../../../../_constants/response');
const createError = require('../../../../_helpers/createError');
const { createResponse } = require('../../../../_helpers/createResponse');
const PasswordService = require('../service/password.services');
const logger = require("../../../../../logger.conf");

exports.changePasswordController = async (req, res, next) => {
    try {
      console.log("REQ USER ID", req.user.user_id)
      const { error, message, data } = await new PasswordService().changePassword(req.user.user_id, req.body);
  
      if (error) {
        return next(
          createError(HTTP.BAD_REQUEST, [
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
      // logger.error(err);
  
      return next(createError.InternalServerError(err));
    }
  };