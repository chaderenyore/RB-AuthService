const axios = require("axios");
const { jwtSign, jwtDecode } = require("../../../../_helpers/jwtUtil");
const KEYS = require("../../../../_config/keys");
const { TYPE } = require("../../../../_constants/record.type");
const { HTTP } = require("../../../../_constants/http");
const { RESPONSE } = require("../../../../_constants/response");
const createError = require("../../../../_helpers/createError");
const { createResponse } = require("../../../../_helpers/createResponse");
const { hashPassword } = require("../../../../_helpers/passwordHash");
const AuthService = require("../services/auth.services");
const CreateUserPublisher = require('../../../../_queue/publishers/createUser.publisher');

const logger = require("../../../../../logger.conf");

exports.signUp = async (req, res, next) => {
  try {
    let refCodeSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2)
    let password;
    const email = req.body.email && req.body.email.toLowerCase();
    // check if usr exists
    const isUser = await new AuthService().findARecord({ email }, TYPE.LOGIN);
    const phoneNumberExists = await new AuthService().findARecord(
      { phone_number: req.body.phone_number },
      TYPE.LOGIN
    );
     console.log("PhoneNumber ", phoneNumberExists)
    if (isUser) {
      return next(
        createError(HTTP.BAD_REQUEST, [
          {
            status: RESPONSE.ERROR,
            message: "User Exists",
            statusCode: HTTP.BAD_REQUEST,
            data: {},
            code: HTTP.BAD_REQUEST,
          },
        ])
      );
    } else if (req.body.phone_number && phoneNumberExists) {
      return next(
        createError(HTTP.BAD_REQUEST, [
          {
            status: RESPONSE.ERROR,
            message: "phone Number In Use",
            statusCode: HTTP.BAD_REQUEST,
            data: {},
            code: HTTP.BAD_REQUEST,
          },
        ])
      );
    } else {
      // generate Username of 5 caharacters max
      
      let longUsername = email.split("@")[0];
      const username = `@${longUsername}`
      // hash passwords and generate token
      if (req.body.password) {
        password = hashPassword(req.body.password);
      }
      // check for google auth
      if (req.body.auth_type === "gg") {
        // take first part of google display name
        username = username.split(" ")[0];
      }
      // check for apple auth
      if (req.body.auth_type === "ap" && data.name) {
        let chunks = data.name.split(/\s+/);
        var arr = [chunks.shift(), chunks.join(" ")];
        req.body.first_name = arr[0];
        req.body.last_name = arr[1];
        req.body.username = arr[0];
      }

      // send data to user service for storage via http
      const dataToUserService = {
        username: username,
        phone_number: req.body.phone_number,
        imei: req.body.imei || " ",
        email: email,
        referral_code: `${refCodeSuffix}`,
        first_name: req.body.first_name || " ",
        last_name: req.body.last_name || " ",
        image_url: req.body.image_url,
        auth_type: req.body.auth_type || "lc",
        user_type: req.body.user_type,
      };
      console.log(">>>>>> dataToUserService", dataToUserService); 
      const user = await axios.post(
        `${KEYS.USER_SERVICE_URI}/users/v1/create?platform=web`,
        dataToUserService
      );
      // console.log("USER ================== ", user)
      console.log("USER ================== ", user.data)
      console.log("USER ================== ", user.data.data)
      console.log("USER ================== ", user.data.data._id)
      if(user && user.data && user.data.code === 200){     
        let user_id = user.data.data._id;
        // sign jwt
        const token = jwtSign(user_id);
        console.log("NEW SIGNED TOKEN ================= ". token)
        const { iat } = jwtDecode(token) || {};
        // create login record
        const loginData = {
          username: username,
          first_name: req.body.first_name,
          phone_number: req.body.phone_number,
          email: req.body.email,
          auth_type: req.body.auth_type,
          user_id: user.data.data._id,
          user_type: req.body.user_type,
          is_loggedIn: true,
          access_token: token,
          password,
          device_imei: req.body.imei,
        };
        logger.log(loginData);
        const loginRecord = await new AuthService().createRecord(
          loginData,
          TYPE.LOGIN
        );
        logger.debug(" LOGIN_RECORD USERID" + loginRecord.user_id);
        logger.debug("LOGIN RECORD:  " + loginRecord);
              // create security record and a token record
              const resData = {
                ...loginRecord._doc,
                access_token: token,
              };
              const tokenData = {
                user_id: loginRecord.user_id,
                token,
                isActive: true,
                iat,
              };
              const tokenRecord = await new AuthService().createRecord(
                { ...tokenData },
                TYPE.TOKEN
              );
              console.log("token:   ============ ", tokenRecord)
              return createResponse("User Created", resData)(res, HTTP.CREATED);
      } else{
        return next(
          createError(HTTP.BAD_REQUEST, [
            {
              status: RESPONSE.ERROR,
              message: "Cannot Create account at The moment",
              statusCode: HTTP.BAD_REQUEST,
              data: {},
              code: HTTP.BAD_REQUEST,
            },
          ])
        );
      }
    }
  } catch (err) {
    console.log(err)
    logger.info(err);
    return next(createError.InternalServerError(err));
  }
};
