const { HTTP } = require("../../../../_constants/http");
const { RESPONSE } = require("../../../../_constants/response");
const { TYPE } = require("../../../../_constants/record.type");
const createError = require("../../../../_helpers/createError");
const { createResponse } = require("../../../../_helpers/createResponse");
const AuthService = require("../../auth/services/auth.services");

const logger = require("../../../../../logger.conf");

exports.getAllBlockedUsers = async (req, res, next) => {
  try {
    // query
    const queryData = {
      is_blocked: true
  }
    // search for posts
    const userRecords = await new AuthService().GetAllRecords(req.query.limit, req.query.page, queryData, {}, TYPE.LOGIN);
    if (userRecords.data.length === 0) {
      return next(
        createError(HTTP.OK, [
          {
            status: RESPONSE.ERROR,
            message: "No Blocked Users At The Moment",
            statusCode: HTTP.OK,
            data: {},
            code: HTTP.OK,
          },
        ])
      );
    }
      return createResponse("All Blocked Users Fetched", userRecords)(res, HTTP.OK);
    
  } catch (err) {
    logger.error(err);
    return next(createError.InternalServerError(err));
  }
};
