const _ = require('lodash')
const sjcl = require('./sjcl')
const {key} = require('../config')
const qs = require('query-string')
import realm from './store'

function serializePubKey(pub) {
  return sjcl.codec.base64.fromBits(pub.x.concat(pub.y))
}

function unserializePubKey(pub) {
  return new sjcl.ecc.elGamal.publicKey(
    sjcl.ecc.curves.c256,
    sjcl.codec.base64.toBits(pub)
  )
}

function serializePriKey(sec) {
  return sjcl.codec.base64.fromBits(sec)
}

function unserializePriKey(sec) {
  return new sjcl.ecc.elGamal.secretKey(
    sjcl.ecc.curves.c256,
    sjcl.ecc.curves.c256.field.fromBits(sjcl.codec.base64.toBits(sec))
  )
}

function genKeypair() {
  const pair = sjcl.ecc.elGamal.generateKeys(256)
  const pub = pair.pub.get()
  const sec = pair.sec.get()
  return {
    publicKey: serializePubKey(pub),
    privateKey: serializePriKey(sec),
  }
}

function encrypt(message) {
  const users = realm.objects('User')
  const loginUser = users[0]
  let privateKey = loginUser.privateKey

  if (typeof message !== 'string') {
    message = JSON.stringify(message)
  }
  if (typeof publicKey === 'string') {
    publicKey = unserializePubKey(publicKey)
  }

  const cipher = JSON.parse(sjcl.encrypt(publicKey, message, {iv: key.iv}))
  return qs.stringify(_.pick(cipher, ['kemtag', 'ct']))
}

function decrypt(cipher) {
  cipher = qs.parse(cipher)

  const users = realm.objects('User')
  const loginUser = users[0]

  if (!loginUser) {
    return {}
  }

  let privateKey = loginUser.privateKey

  if (!cipher.iv) {
    cipher.iv = key.iv
  }
  cipher = JSON.stringify(cipher)
  if (typeof privateKey === 'string') {
    privateKey = unserializePriKey(privateKey)
  }

  console.log(cipher)
  try {
    const message = sjcl.decrypt(privateKey, cipher)
    return JSON.parse(message)
  } catch (e) {
    return {}
  }
}

function genPassword() {
  return ('000000' + Math.floor(Math.random() * 1000000).toString()).substr(-6)
}

function decryptAll(querystring) {
  const qsObject = qs.parse(querystring)
  return Object.assign({
    t: qsObject.t,
    w: Object.w,
  }, decrypt(qs.stringify({kemtag: qsObject.kemtag[0], ct: qsObject.ct[0]})),
    decrypt(qs.stringify({kemtag: qsObject.kemtag[1], ct: qsObject.ct[1]})),
  )
}

module.exports = {
  genKeypair, genPassword,
  encrypt, decrypt, decryptAll
}
