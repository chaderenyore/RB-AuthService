const Repository = require("../../../Repository");
const InviteCode  = require("../models/inviteCode.mode");

class InviteCodeRepository extends Repository {
    constructor() {
        super(InviteCode);
    };
}

module.exports = new InviteCodeRepository();