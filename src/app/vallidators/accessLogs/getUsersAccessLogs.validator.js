const Joi = require("joi");

exports.getAllUsersAccessLogsSchema = Joi.object({
    page: Joi.number().positive().optional(),
    limit: Joi.number().positive().optional(),
    user_id: Joi.string().optional()
  });