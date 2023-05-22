const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

exports.logoutSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  session_id: Joi.string().required()
  });
