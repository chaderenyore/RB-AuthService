const { HTTP } = require('../../../../_constants/http');
const { RESPONSE } = require('../../../../_constants/response');
const createError = require('../../../../_helpers/createError');
const { jwtDecode } = require("../../../../_helpers/jwtUtil");
const {TYPE} = require ('../../../../_constants/record.type');
const { createResponse } = require('../../../../_helpers/createResponse');
const AuthService = require('../services/auth.services');
const AccessLogService = require('../../accessLogs/services/accessLogs.services');
const logger = require("../../../../../logger.conf");


exports.logOut = async (req, res, next) => {
  try {
    const isUser = await new AuthService().findARecord(
      { email: req.body.email },
      TYPE.LOGIN
    )
    if(!isUser){
      return next(
        createError(HTTP.UNAUTHORIZED, [
          {
            status: RESPONSE.ERROR,
            message:"Unknown User",
            statusCode: HTTP.SERVER_ERROR,
            data: null,
            code: HTTP.UNAUTHORIZED,
          },
        ])
      );
    } else if (isUser.is_loggedIn === false) {
        return next(
          createError(HTTP.BAD_REQUEST, [
            {
              status: RESPONSE.ERROR,
              message:"User Already Logged Out",
              statusCode: HTTP.BAD_REQUEST,
              data: null,
              code: HTTP.BAD_REQUEST,
            },
          ])
        );
      } else {
                // check if session is valid or outdated
            const  currentSession = jwtDecode(req.body.session_id);
            console.log("SessionPayload =========== : ", currentSession);
            // get session 
            const session = await new AccessLogService().findAUserLogs({ session_id: req.body.session_id });
            console.log("SEssion ======= ;", session);
  
              // check if the session_id entered is same with the session that is beenn termninated
              if(!currentSession || !session){
                return next(
                  createError(HTTP.UNAUTHORIZED, [
                    {
                      status: RESPONSE.UNAUTHORIZED,
                      message:"Invalid Session",
                      statusCode: HTTP.UNAUTHORIZED,
                      data: null,
                      code: HTTP.UNAUTHORIZED,
                    },
                  ])
                );
               }
                         // format session for comparisons
            const timeInString  = session.logged_in_time.toString(); 
            const sessionFormated = `${req.body.email}-${timeInString}`
               console.log("currentSession" , currentSession.now)
               console.log("COMPARE ========= :" , sessionFormated === currentSession.now)
    if(sessionFormated  !== currentSession.now){
          return next(
            createError(HTTP.BAD_REQUEST, [
              {
                status: RESPONSE.ERROR,
                message:"Session Unknown or Expired",
                statusCode: HTTP.BAD_REQUEST,
                data: null,
                code: HTTP.BAD_REQUEST,
              },
            ])
          );
        } 
            // data to access logs
            let now = Date.now();
      const logsData = {
        lat: req.body.lat || "",
        long: req.body.long || "",
        is_active: false,
        logged_out_time: now,
        login_duration:  now - session.logged_in_time
      }
      const accessLogs = await new AccessLogService().updateLogs({session_id: req.body.session_id}, logsData);
      const loginRecord = await new AuthService().updateARecord ({email: req.body.email} ,{is_loggedIn: false}, TYPE.LOGIN);
      const deactivatedToken = await new AuthService().updateARecord ({email: req.body.email }, {isActive: false}, TYPE.TOKEN);
      console.log("SESSION =========== :", accessLogs)
        const resdata = {
          session_id : accessLogs.session_id,
          ...loginRecord
        }
          return createResponse("Looged Out", resdata)(res, HTTP.OK);
        }
      
  } catch (err) {
    logger.error(err);

    return next(createError.InternalServerError(err));
  }
};
