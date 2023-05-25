const InviteCodeRepository = require("../repository/inviteCode.repository");

class InviteCodeService {
  constructor() {
    this.InviteCodeRepository = InviteCodeRepository;
  }
  
  async create(data) {
    return this.InviteCodeRepository.create(data)
  }

  async findARecord(query) {
    return this.InviteCodeRepository.findOne(query);
  }

  async update(condition, update) {
    return this.InviteCodeRepository.update(condition, update)
  }

  async getAll(limit, page, data, selectedFields) {
   return this.InviteCodeRepository.all(limit, page, data, selectedFields)

  }

  async findById(id) {
    return this.InviteCodeRepository.findById(id)
  }

  async deletAll() {
    this.InviteCodeRepository.delete({})
  }

  async deletOne (condition) {
    this.InviteCodeRepository.deleteOne(condition)
  }
  async updateMany(condition, update) {
    return this.InviteCodeRepository.updateMany(condition, update);
  }
}

module.exports = InviteCodeService;
