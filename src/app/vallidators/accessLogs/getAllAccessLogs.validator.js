const Joi = require("joi");
exports.getAllAccessLogsSchema = Joi.object({
    page: Joi.number().positive().optional(),
    limit: Joi.number().positive().optional(),
  });
