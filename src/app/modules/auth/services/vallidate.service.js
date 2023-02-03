const loginRepository = require ('../repository/login.repository');
const TokenRepository = require ('../repository/token.repository');
const { jwtVerify } = require("../../../../_helpers/jwtUtil");


class VallidateService {
  constructor () {
    this.loginRepository = loginRepository;
    this.TokenRepository = TokenRepository;
  }

  async vallidateToken (data, token) {

    // console.log("DATA FROM REQ ==================", data);
    // console.log("Token Record ==================", tokenRecord);
    console.log("Equal Token ==================", data.access_token === token);
    console.log("Equal Token ==================", data);


    if (data.access_token !== token || data.is_loggedIn === false ) {
      return {
        error: true,
        message: "You have logged out or invalid token",
        data: null,
      };
    }
    else{
      return {
        error: false,
        message: "Token Valid",
        data: data,
      };
    }


  }
}

module.exports = VallidateService;
