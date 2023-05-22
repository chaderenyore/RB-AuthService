const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.logOutSessionSchema = Joi.object({
    session_id: Joi.objectId().required()
  });