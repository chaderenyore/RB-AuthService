const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.unblockUsersSchema = Joi.object({
    user_ids: Joi.array().required(),
  });