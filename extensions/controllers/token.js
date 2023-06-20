const jwt = require('jsonwebtoken');
const token = (params, expiresIn, keySecret)=> {
  return jwt.sign(params,keySecret,{ expiresIn: expiresIn });
}
const verify_token = (token, keySecret)=> {
  return jwt.verify(token, keySecret);
}
module.exports = {token, verify_token};
