const { HTTP } = require("../../../../_constants/http");
const { RESPONSE } = require("../../../../_constants/response");
const { TYPE } = require("../../../../_constants/record.type");
const createError = require("../../../../_helpers/createError");
const { createResponse } = require("../../../../_helpers/createResponse");
const AuthService = require("../../auth/services/auth.services");

const logger = require("../../../../../logger.conf");

exports.unBlockUser = async (req, res, next) => {
  try {
    let unBlockedUsers = [];
    const updateData = {
      is_blocked: false,
    };
    // get the array of ids from the body
    const { user_ids } = req.body;
    for (let i = 0; i < user_ids.length; i++) {
      console.log("IDS ============ ", user_ids[i]);
      const user = await new AuthService().findARecord(
        { user_id: user_ids[i] },
        TYPE.LOGIN
      );
      if (!user) {
        return next(
          createError(HTTP.OK, [
            {
              status: RESPONSE.SUCCESS,
              message: `Id At Position ${i} is Invalid`,
              statusCode: HTTP.Ok,
              data: {},
              code: HTTP.Ok,
            },
          ])
        );
      } else {
        if (user.is_blocked === false) {
          return next(
            createError(HTTP.OK, [
              {
                status: RESPONSE.SUCCESS,
                message: `User At Position ${i} Not In Blocked List`,
                statusCode: HTTP.Ok,
                data: {},
                code: HTTP.Ok,
              },
            ])
          );
        } else {
          const blockedUser = await new AuthService().updateARecord(
            { user_id: user_ids[i] },
            updateData,
            TYPE.LOGIN
          );
          unBlockedUsers.push(blockedUser);
        }
      }
    }
    return createResponse(`User(s) UnBlocked`, unBlockedUsers)(res, HTTP.OK);
  } catch (err) {
    logger.error(err);
    return next(createError.InternalServerError(err));
  }
};
