const { HTTP } = require("../../../../../_constants/http");
const { RESPONSE } = require("../../../../../_constants/response");
const { TYPE } = require("../../../../../_constants/record.type");
const createError = require("../../../../../_helpers/createError");
const { createResponse } = require("../../../../../_helpers/createResponse");
const InviteCodeService = require("../../../inviteCodes/services/inviteCode.services");
const { generateRandomChar } = require("../../../../../_helpers/inviteCode/generateRandomChar");
const { calculateAge } = require("../../../../../_helpers/inviteCode/ageCalculator");
const logger = require("../../../../../logger.conf");

exports.generateInviteCode = async (req, res, next) => {
  try {
    // generate Random
    const randomChars = await generateRandomChar(Math.floor(Math.random() * 10));
    let code_age = await calculateAge(Date.now());
    const dataToModel = {
      code:randomChars,
      was_autogenerated: true,
      generated_by:req.user.username,
      isActive: true,
      expires_at: req.body.expires_at,
      code_age,
    }
      const newInviteCode = await new InviteCodeService().create(dataToModel);
    // update User record In user service
    return createResponse(`Invite Code Generated`, {code: newInviteCode.code})(res, HTTP.OK);
  } catch (err) {
    console.error(err);
    return next(createError.InternalServerError(err));
  }
};
