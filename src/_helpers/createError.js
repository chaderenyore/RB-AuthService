const { RESPONSE } = require("../_constants/response");
const { HTTP } = require("../_constants/http");

/**
 * Creates an error payload
 */

function createError(status, data) {
  return {
    status: data[0].status,
    message: data[0].message,
    data: data[0].data,
    stack: new Error().stack,
    statusCode: status,
    code: data[0].code?data[0].code:status
  };
}

createError.InternalServerError = (data = null) =>
  createError(HTTP.SERVER_ERROR, [
    {
      status: RESPONSE.ERROR,
      message: "Internal Server Error.",
      data: data.message ? data.message : "Server Downtime, Unable To sign up now, please try again affter few minutes",
      stack: process.env.NODE === "development" ? new Error().stack : undefined,
    },
  ]);

module.exports = createError;
