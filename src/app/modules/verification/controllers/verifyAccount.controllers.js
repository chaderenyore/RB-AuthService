const axios = require("axios");
const { HTTP } = require('../../../../_constants/http');
const KEYS = require("../../../../_config/keys");
const { RESPONSE } = require('../../../../_constants/response');
const {TYPE} = require ('../../../../_constants/record.type');
const createError = require('../../../../_helpers/createError');
const { CHANNELS } = require('../../../../_constants/channels');
const { createResponse } = require('../../../../_helpers/createResponse');
const AuthService = require("../../auth/services/auth.services");
const logger = require("../../../../../logger.conf");
const { redisGetAsync } = require("../../../../_helpers/promisifyRedis");

exports.verifyUserAccount = async (req, res, next) => {
    try {

            // search if user is verified
  const isVerifed = await new AuthService().findARecord({user_id: req.user.user_id}, TYPE.LOGIN);
  if(isVerifed && isVerifed.is_verified === true){
    return next(
      createError(HTTP.UNAUTHORIZED, [
        {
          status: RESPONSE.ERROR,
          message: "Account ALready Verified",
          statusCode: HTTP.UNAUTHORIZED,
        },
      ])
    );
  } else {
    console.log("USER_ID : ", req.user)
    const token = await redisGetAsync(req.user.user_id);
    if (!token) {
      return next(
          createError(HTTP.UNAUTHORIZED, [
            {
              status: RESPONSE.ERROR,
              message:"UnAuthorized",
              statusCode: HTTP.SERVER_ERROR,
              data: null,
              code: HTTP.UNAUTHORIZED,
            },
          ])
        );
    }

    if (token !== req.body.token) {
      return next(
          createError(HTTP.OK, [
            {
              status: RESPONSE.SUCCESS,
              message: `Invalid Otp`,
              statusCode: HTTP.OK,
              data: null,
              code: HTTP.Ok,
            },
          ])
        );
    }

    let user = null;

    switch (req.body.channel) {
      case CHANNELS.PHONE_NUMBER:
        {
          user = await new AuthService().updateARecord({phone_number: req.body.channel_value}, {is_verified: true}, TYPE.LOGIN);
        }
        break;
      case CHANNELS.EMAIL:
          user = await new AuthService().updateARecord({email: req.body.channel_value}, {is_verified: true}, TYPE.LOGIN);
        break;
    }

    // Send Account Verified successful mail
    const Data = {
      first_name: user.first_name ? user.first_name : user.username,
      email: user.email,
    };
   const mail = await axios.post(
      `${KEYS.NOTIFICATION_URI}/notifications/v1/user/welcome-mail`,
      Data,
      {
        headers: {
          Authorization: `Bearer ${req.token}`,
        },
      }
    );
  return createResponse("Account Verified Successfully", {})(res, HTTP.OK);
  }
 
    } catch (err) {
        logger.error(err);
        return next(createError.InternalServerError(err));
    }
  };