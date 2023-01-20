const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.loginUserSchema = Joi.object({
  email: Joi.string().trim().optional().label("email"),
  username: Joi.string().trim().optional().label("username"),
  phone_number: Joi.string()
    .pattern(/^\+[0-9]+$/)
    .trim()
    .label("phone_number"),
  password: Joi.string().when("auth_type", {
    not: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  user_type: Joi.string().valid('user', 'org').required(),
  auth_type: Joi.string().valid("gg", "fb", "ap").optional(),
  access_token: Joi.string().optional(),
  imei: Joi.string().optional(),
})
  .xor("email", "username", "phone_number")
  .label("field");
