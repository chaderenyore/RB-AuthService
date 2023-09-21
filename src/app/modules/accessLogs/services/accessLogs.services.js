const AccessLogsRepository = require ('../repository/accessLogs.repository');

class AccessLogsService {
  constructor () {
    this.AccessLogsRepository = AccessLogsRepository;
  }

  async createUserLog(data) {
    return this.AccessLogsRepository.create (data)
  }

  async findAUserLogs(query) {
    return this.AccessLogsRepository.findOne (query)
  }

  async updateLogs(condition, update) {
    return this.AccessLogsRepository.update (condition, update)

  }
  async deleteAllLogs(condition) {
    return this.AccessLogsRepository.delete(condition)

  }


  async allLogs(limit, page, data) {
    return this.AccessLogsRepository.all (limit, page, data)
  }

  async findLogsById(id) {
    return this.AccessLogsRepository.findById (id)
  }
}

module.exports = AccessLogsService;
