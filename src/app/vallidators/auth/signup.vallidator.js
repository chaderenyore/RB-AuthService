const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

exports.registerUserSchema = Joi.object().keys({
  phone_number: Joi.string()
    .pattern(/^\+[0-9]+$/)
    .trim()
    .optional()
    .label("Phone number"),
  password: Joi.string().when("auth_type", {
    not: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  email: Joi.string().email().trim().required(),
  auth_type: Joi.string().optional().valid("gg", "fb", "ap", "local"),
  image_url: Joi.string().uri().optional(),
  imei: Joi.string().optional(),
  user_id: Joi.string().optional(),
  name: Joi.string().optional(),
  gender: Joi.string().trim().valid("male", "female").optional(),
  dob: Joi.date()
    .format(["YYYY-MM-DD", "DD-MM-YYYY", "DD/MM/YYYY"])
    .utc()
    .optional(),
  username: Joi.string()
    .trim().required(),
  name: Joi.string().optional(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  access_token: Joi.string().optional(),
  user_type: Joi.string().trim().valid("user", "org").required(),
});

exports.signupQuerySchema = Joi.object({
  login_page: Joi.string().required(),
  resend_link_page: Joi.string().required()
});