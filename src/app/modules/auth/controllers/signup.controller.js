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
const { generateTokenAndStore } = require("../../../../_helpers/generateOtp");

const InviteCodeService = require("../../inviteCodes/services/inviteCode.services");
const { generateRandomChar } = require("../../../../_helpers/inviteCode/generateRandomChar");
const { calculateAge } = require("../../../../_helpers/inviteCode/ageCalculator");
const logger = require("../../../../../logger.conf");

exports.signUp = async (req, res, next) => {
  try {
    let refCodeSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2)
    let password;
    const email = req.body.email && req.body.email.toLowerCase();
    const username = req.body.username;
    // check if usr exists
    const isUser = await new AuthService().findARecord({ email }, TYPE.LOGIN);
    const usernameExists = await new AuthService().findARecord({ username }, TYPE.LOGIN);
    if(usernameExists && usernameExists.username === req.body.username){
      return next(
        createError(HTTP.OK, [
          {
            status: RESPONSE.SUCCESS,
            message: "Username Taken",
            statusCode: HTTP.OK,
            data: usernameExists,
            code: HTTP.OK,
          },
        ])
      );
    }
    if (isUser) {
      return next(
        createError(HTTP.OK, [
          {
            status: RESPONSE.SUCCESS,
            message: "User Exists",
            statusCode: HTTP.OK,
            data: isUser,
            code: HTTP.OK,
          },
        ])
      );
    } else if (req.body.phone_number && phoneNumberExists) {
      return next(
        createError(HTTP.OK, [
          {
            status: RESPONSE.SUCCESS,
            message: "phone Number In Use",
            statusCode: HTTP.OK,
            data: phoneNumberExists,
            code: HTTP.OK,
          },
        ])
      );
    } else {
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
        username = arr[0];
      }
  // generate Invite Code
  const invite_code = await generateRandomChar(Math.floor(Math.random() * 10));
      // send data to user service for storage via http
      const dataToUserService = {
        username,
        phone_number: req.body.phone_number,
        imei: req.body.imei || " ",
        email: email,
        invite_code,
        referral_code: `${refCodeSuffix}`,
        first_name: req.body.first_name || " ",
        last_name: req.body.last_name || " ",
        image_url: req.body.image_url,
        auth_type: req.body.auth_type || "lc",
        user_type: req.body.user_type,
      };
      const user = await axios.post(
        `${KEYS.USER_SERVICE_URI}/users/v1/create?platform=web`,
        dataToUserService
      );
      // console.log("USER ================== ", user)
      if(user && user.data && user.data.code === 200){     
        let user_id = user.data.data._id;
        // genearate otp
        const otp = String(generateTokenAndStore(user_id));
        // sign jwt
        const token = jwtSign(user_id);
        const decodeToken = jwtDecode(token);
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
          invite_code,
        };
        logger.log(loginData);
        const loginRecord = await new AuthService().createRecord(
          loginData,
          TYPE.LOGIN
        );
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
        // send request account verification mail
        const Data = {
          first_name: username,
          email: email,
          token: otp,
          link:`${KEYS.BASE_URL}/auth/v1/account/verify-link?token=${token}&platform=web&login_page=${req.query.login_page}&to_verify=true&resend_link_page=${req.query.resend_link_page}`
        };
        const mail = await axios.post(
          `${KEYS.NOTIFICATION_URI}/notifications/v1/user/request-account-verification`,
          Data
        );
      // save Users Invite Code: todo
      
              return createResponse(`User Created and verification mail sent to ${email}`, resData)(res, HTTP.CREATED);
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
