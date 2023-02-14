const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

exports.verifyAccountQuerySchema = Joi.object({
    token: Joi.string().required(),
  });