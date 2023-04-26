const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

exports.verifyAccountQuerySchema = Joi.object({
    token: Joi.string().required(),
    login_page: Joi.string().required(),
    resend_link_page: Joi.string().required()
  });