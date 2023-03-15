const Joi = require("joi");

exports.getAllBlockedUsersSchema = Joi.object({
    page: Joi.number().positive().optional(),
    limit: Joi.number().positive().optional(),
  });