const NodeRSA = require('node-rsa');
const keys = ()=>{
  const keys = new NodeRSA({b: 1024});
  const publicKeyBackend = keys.exportKey('public');
  const publicKeyUsuario = keys.exportKey('public');
  const privateKeyBackend = keys.exportKey('private');
  const privateKeyUsuario = keys.exportKey('private');
  return {
    publicKeyBackend,
    publicKeyUsuario,
    privateKeyBackend,
    privateKeyUsuario
  }
}
const Encrypt = (text, key)=>{
  const keyPublic = new NodeRSA(key);
  const encrypted = keyPublic.encrypt(text, 'base64');
  return {encrypt:encrypted}
}
const Decrypt = (text,key)=>{
  let keyPrivate = new NodeRSA(key);
  let decrypt = keyPrivate.decrypt(text, 'utf8');
  return decrypt;
}
module.exports = {
  keys,
  Encrypt,
  Decrypt
};
