const Repository = require("../../../Repository");
const Token  = require("../models/refereshToken.model");

class TokenRepository extends Repository {
    constructor() {
        super(Token);
    };
}

module.exports = new TokenRepository();