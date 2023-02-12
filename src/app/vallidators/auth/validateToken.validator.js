const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

exports.validateTokenSchema = Joi.object({
    token: Joi.string().required(),
  });
  