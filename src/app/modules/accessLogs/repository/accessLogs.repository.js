const Repository = require("../../../Repository");
const AccessLogs  = require("../models/accessLogs.models");

class AccessLogsRepository extends Repository {
    constructor() {
        super(AccessLogs);
    };
}

module.exports = new AccessLogsRepository();