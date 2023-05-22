const { HTTP } = require('../../../../_constants/http');
const { RESPONSE } = require('../../../../_constants/response');
const createError = require('../../../../_helpers/createError');
const { createResponse } = require('../../../../_helpers/createResponse');
const VallidateService  = require('../services/vallidate.service');

exports.validate = async (req, res, next) => {
  try {
    // check for token record
    const { error, message, data} = await new VallidateService().vallidateToken(req.user, req.token)
    if (error) {
        return next(
          createError(HTTP.BAD_REQUEST, [
            {
              status: RESPONSE.ERROR,
              message,
              statusCode: HTTP.BAD_REQUEST,
              data,
              code: HTTP.BAD_REQUEST,
            },
          ])
        );
      } else{
          
       return createResponse(message, data)(res, HTTP.CREATED);

    }
  } catch (err) {
    logger.error(err);

    return next(createError.InternalServerError(err));
  }
};