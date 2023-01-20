const jwt = require("jsonwebtoken");
const KEYS = require("../_config/keys");

exports.jwtSign = (_id) => {
  return jwt.sign({ _id }, KEYS.JWTSecret, {
    expiresIn: KEYS.expiresIn,
  });
};

exports.jwtSignAccessLogsData = (now) => {
  return jwt.sign({ now }, KEYS.JWTSecret);
};

exports.jwtVerify = (token) => {
   try {
     return jwt.verify(token, KEYS.JWTSecret);
   } catch (err) {
     console.log(err);
     return {};
   }
};

exports.jwtDecode = (token) => {
	try {
    return jwt.decode(token);
  } catch (err) {
    console.log(err);
    return {};
  }
}
