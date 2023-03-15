const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.blockUsersSchema = Joi.object({
    user_ids: Joi.array().required(),
  });