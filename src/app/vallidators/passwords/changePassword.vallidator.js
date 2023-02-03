const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

exports.changePasswordSchema = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required().label("new password"),
    confirm_password: Joi.string()
      .equal(Joi.ref("new_password"))
      .required()
      .label("confirm password")
      .messages({ "any.only": "{{#label}} does not match new password" }),
  });