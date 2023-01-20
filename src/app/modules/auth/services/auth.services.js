const loginRepository = require("../repository/login.repository");
const SecurityRepository = require("../repository/login.repository");
const TokenRepository = require("../repository/token.repository");
const { message } = require("../../../../_constants/service.message");
const { TYPE } = require("../../../../_constants/record.type");

class AuthService {
  constructor() {
    this.loginRepository = loginRepository;
    this.SecurityRepository = SecurityRepository;
    this.TokenRepository = TokenRepository;
  }
  
  async createRecord(data, type) {
    return type === TYPE.LOGIN
      ? this.loginRepository.create(data)
      : type === TYPE.SECURITY
      ? this.SecurityRepository.create(data)
      : type === TYPE.TOKEN
      ? this.TokenRepository.create(data)
      : message;
  }

  async findARecord(query, type) {
    return type === TYPE.LOGIN
      ? this.loginRepository.findOne(query)
      : type === TYPE.SECURITY
      ? this.SecurityRepository.findOne(query)
      : type === TYPE.TOKEN
      ? this.TokenRepository.findOne(query)
      : message;
  }

  async updateARecord(condition, update, type) {
    return type === TYPE.LOGIN
      ? this.loginRepository.update(condition, update)
      : type === TYPE.SECURITY
      ? this.SecurityRepository.update(condition, update)
      : type === TYPE.TOKEN
      ? this.TokenRepository.update(condition, update)
      : message;
  }

  async GetAllRecords(limit, page, data, selectedFields, type) {
    return type === TYPE.LOGIN
      ? this.loginRepository.all(limit, page, data, selectedFields)
      : type === TYPE.SECURITY
      ? this.SecurityRepository.all(limit, page, data, selectedFields)
      : type === TYPE.TOKEN
      ? this.TokenRepository.all(limit, page, data, selectedFields)
      : message;
  }

  async findRecordById(id, type) {
    return type === TYPE.LOGIN
      ? this.loginRepository.findById(id)
      : type === TYPE.SECURITY
      ? this.SecurityRepository.findById(id)
      : type === TYPE.TOKEN
      ? this.TokenRepository.findById(id)
      : message;
  }

  async deletAll(type) {
    return type === TYPE.LOGIN
      ? this.loginRepository.delete({})
      : type === TYPE.SECURITY
      ? this.SecurityRepository.delete({})
      : type === TYPE.TOKEN
      ? this.TokenRepository.delete({})
      : message;
  }

  async deletOne (type, condition) {
    return type === TYPE.LOGIN
      ? this.loginRepository.delete(condition)
      : type === TYPE.SECURITY
          ? this.SecurityRepository.delete(condition)
          :  type === TYPE.TOKEN
          ? this.TokenRepository.delete(condition) : message;
  }
}

module.exports = AuthService;
