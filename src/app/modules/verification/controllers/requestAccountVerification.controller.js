const axios = require("axios");
const { HTTP } = require("../../../../_constants/http");
const KEYS = require("../../../../_config/keys");
const { RESPONSE } = require("../../../../_constants/response");
const { TYPE } = require("../../../../_constants/record.type");
const createError = require("../../../../_helpers/createError");
const { CHANNELS } = require("../../../../_constants/channels");
const { generateTokenAndStore } = require("../../../../_helpers/generateOtp");
const { createResponse } = require("../../../../_helpers/createResponse");
const AuthService = require("../../auth/services/auth.services");
const logger = require("../../../../../logger.conf");

exports.requestAccountVerification = async (req, res, next) => {
  try {
    let user = null;
    switch (req.body.channel) {
      case CHANNELS.PHONE_NUMBER:
        {
          user = await new AuthService().findARecord(
            { phone_number: req.body.channel_value },
            TYPE.LOGIN
          );
        }
        break;
      case CHANNELS.EMAIL:
        {
          user = await new AuthService().findARecord(
            { email: req.body.channel_value },
            TYPE.LOGIN
          );
        }
        break;
    }

    if (!user) {
      return next(
        createError(HTTP.BAD_REQUEST, [
          {
            status: RESPONSE.ERROR,
            message: `This ${req.body.channel} does not exist`,
            statusCode: HTTP.BAD_REQUEST,
            data: null,
            code: HTTP.BAD_REQUEST,
          },
        ])
      );
    } else {
      if (user.is_verified) {
        return next(
          createError(HTTP.BAD_REQUEST, [
            {
              status: RESPONSE.ERROR,
              message: `This user has been verified`,
              statusCode: HTTP.BAD_REQUEST,
              data: null,
              code: HTTP.BAD_REQUEST,
            },
          ])
        );
      }
      const UserId = user.user_id;
      const token = String(generateTokenAndStore(UserId));
      console.log("OTP ============== ", token)
      // call notification service based on channel and user
      if (req.body.channel === "email" || req.body.channel === "phone_number") {
        // send mail or publish to queue TODO:::
        console.log("USER BEEN VERIFIED =================== ", user)
        const Data = {
          first_name: user.first_name ? user.first_name : user.username,
          email: user.email,
          token: token,
        };
        const mail = await axios.post(
          `${KEYS.NOTIFICATION_URI}/notifications/v1/user/request-account-verification`,
          Data,
          {
            headers: {
              Authorization: `Bearer ${req.token}`,
            },
          }
        );
        // Publish to Account verification queue TODO
        const resData = {
          channel: req.body.channel,
          channel_value: req.body.channel_value,
        };
        return createResponse(`A mail has been sent to ${user.email}`, resData)(
          res,
          HTTP.OK
        );
      }
    }
  } catch (err) {
    logger.error(err);
    return next(createError.InternalServerError(err));
  }
};
