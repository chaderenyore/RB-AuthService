/**
 * Creates a reusable response payload
 *
 * @returns Response
 */
 exports.createResponse =
 (message, data = [], pagination, status = "success") =>
 (res, code) => {
   return res.status(code).json({ code, status, message, data, pagination });
 };
