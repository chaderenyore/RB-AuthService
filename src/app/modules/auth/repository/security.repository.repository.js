const Repository = require("../../../Repository");
const SecurityLog  = require("../models/security.model");

class SecurityLogRepository extends Repository {
    constructor() {
        super(SecurityLog);
    };
}

module.exports = new SecurityLogRepository();