const axios = require("axios");
const { HTTP } = require('../../../../_constants/http');
const KEYS = require("../../../../_config/keys");
const { RESPONSE } = require('../../../../_constants/response');
const {TYPE} = require ('../../../../_constants/record.type');
const createError = require('../../../../_helpers/createError');
const { createResponse } = require('../../../../_helpers/createResponse');
const AuthService = require("../../auth/services/auth.services");
const logger = require("../../../../../logger.conf");
const { jwtVerify } = require("../../../../_helpers/jwtUtil");

exports.verifyLinkCallback = async (req, res, next) => {
    try {
      // get user from token 
      const Token = req.query.token
      console.log(req.query.token)
      const UserExist = jwtVerify(Token);
      const user_id = UserExist._id;
      console.log(jwtVerify(Token))
      console.log("USER ID", user_id)
  const user = await new AuthService().updateARecord({user_id}, {is_verified: true}, TYPE.LOGIN);
  if (!user) {
    return next(
      createError(HTTP.UNAUTHORIZED, [
        {
          status: RESPONSE.ERROR,
          message: "UnAuthporized",
          statusCode: HTTP.UNAUTHORIZED,
        },
      ])
    );``
  } else {
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
    
  }catch (err) {
        logger.error(err);
        return next(createError.InternalServerError(err));
    }
  };