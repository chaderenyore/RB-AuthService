const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

exports.resetUserPasswordSchema = Joi.object({
    channel: Joi.string()
      .trim()
      .valid('email', 'phone_number')
      .required(),
    channel_value: Joi.string().trim().required(),
    key: Joi.string().required(),
    new_password: Joi.string().required(),
  });