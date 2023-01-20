const { HTTP } = require("../../_constants/http");
const {TYPE} = require ('../../_constants/record.type');
const { RESPONSE } = require("../../_constants/response");
const createError = require("../../_helpers/createError");
const { jwtVerify } = require("../../_helpers/jwtUtil");
const AuthService = require('../modules/main/services/auth.services');
const logger = require("../../../logger.conf");

exports.authorize = (role = []) => {
return async (req, res, next) => {
  const message = "Unauthorized";
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
    console.log("TOKEN :", token)
  if (!token) {
    return next(
      createError(HTTP.UNAUTHORIZED, [
        {
          status: RESPONSE.ERROR,
          message,
          statusCode: HTTP.UNAUTHORIZED,
        },
      ])
    );
  } 
  try {
    const user = jwtVerify(token);
    // console.log("ID :", _id)
    console.log(jwtVerify(token))
    console.log("USER ID", user._id)

  if(user){
    const LoginRecord = await new AuthService().findARecord({user_id: user._id}, TYPE.LOGIN);
    console.log("LOGIN RECORD", LoginRecord)
    if (!LoginRecord) {
      return next(
        createError(HTTP.UNAUTHORIZED, [
          {
            status: RESPONSE.ERROR,
            message,
            statusCode: HTTP.UNAUTHORIZED,
          },
        ])
      );``
    } else {
      if (
        role.includes(String(LoginRecord.user_type))
      ) {
        logger.info(LoginRecord)
        req.user = LoginRecord;
        console.log("REQ USER AFTER ASSIGNING : ", req.user)
        req.token = token;
        next();
      } else{
        return next(
          createError(HTTP.UNAUTHORIZED, [
            {
              status: RESPONSE.ERROR,
              message:"Unauthorized",
              statusCode: HTTP.UNAUTHORIZED,
              data: {},
              code: HTTP.UNAUTHORIZED,
            },
          ])
        );
      }
  
    }
  }

  } catch (err) {
    console.log(err);
    return next(createError.InternalServerError());
  }
};
}