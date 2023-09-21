const axios = require("axios");
const { HTTP } = require("../../../../_constants/http");
const { RESPONSE } = require("../../../../_constants/response");
const { TYPE } = require("../../../../_constants/record.type");
const createError = require("../../../../_helpers/createError");
const { createResponse } = require("../../../../_helpers/createResponse");
const AuthService = require("../../auth/services/auth.services");
const SessionService = require("../../accessLogs/services/accessLogs.services");
const BlockUnblockQueue = require("../../../../_queue/publishers/blockUnblockUser.publisher");
const logger = require("../../../../../logger.conf");

exports.blockUser = async (req, res, next) => {
  try {
    let blockedUsers = [];
    const updateData = {
      is_blocked: "true",
    };
    // get the array of ids from the body
    const { user_ids } = req.body;
    console.log(user_ids);
    console.log(user_ids.length);
    for (let i = 0; i < user_ids.length; i++) {
      const user = await new AuthService().findARecord(
        { user_id: user_ids[i] },
        TYPE.LOGIN
      );
      console.log("USER ", user);
      console.log("USER ID ", String(user_ids[i]));
      if (!user) {
        return next(
          createError(HTTP.OK, [
            {
              status: RESPONSE.SUCCESS,
              message: `Id At Position ${i} is Invalid`,
              statusCode: HTTP.OK,
              data: {},
              code: HTTP.OK,
            },
          ])
        );
      } else {
        if (user.is_blocked === "true") {
          return next(
            createError(HTTP.OK, [
              {
                status: RESPONSE.SUCCESS,
                message: `User At Position ${i} is Already Blocked`,
                statusCode: HTTP.OK,
                data: {},
                code: HTTP.OK,
              },
            ])
          );
        } else {
          const blockedUser = await new AuthService().updateARecord(
            { user_id: user_ids[i] },
            updateData,
            TYPE.LOGIN
          );
          blockedUsers.push(blockedUser);
          // log pout all user session
          const invalidateSessions = await new SessionService().deleteAllLogs({
            user_id: user_ids[i],
          });
          // log user out
          const userLoggedOut = await new AuthService().updateARecord(
            { user_id: user_ids[i] },
            { is_loggedIn: false }
          );
          // publish to following and follower queues TODO
          const publishToBlockUserQueue =
            await BlockUnblockQueue.publishToBlockUnblockUserQueue({
              id: user_ids[i],
              ...updateData,
            });
        }
      }
    }
    return createResponse(`User(s) Blocked`, blockedUsers)(res, HTTP.OK);
  } catch (err) {
    console.error(err);
    return next(createError.InternalServerError(err));
  }
};
