import crypto from 'crypto'
import eccrypto from 'eccrypto'
import config from '../config'

function genKeypair() {
  const privateKey = crypto.randomBytes(32)
  const publicKey = eccrypto.getPublic(privateKey)
  return {
    privateKey: privateKey.toString('base64'),
    publicKey: publicKey.toString('base64')
  }
}

function genPassword() {
  return ('000000' + Math.floor(Math.random() * 1000000).toString()).substr(-6)
}

function encodeBase64JSON(object) {
  const o = {}
  delete object.iv
  delete object.ephemPublicKey
  console.log(object)
  for (const key in object) {
    o[key] = object[key].toString('base64')
  }
  return o
}

function decodeBase64JSON(cipher) {
  const o = JSON.parse(cipher)
  for (const key in o) {
    o[key] = Buffer(o[key], 'base64')
  }
  o.iv = config.key.iv
  o.ephemPrivateKey = config.key.ephemPrivateKey
  return o
}

async function encode(object, publicKey) {
  if (typeof publicKey === 'string') {
    publicKey = Buffer(publicKey, 'base64')
  }

  const message = JSON.stringify(object)
  const cipher = await eccrypto.encrypt(publicKey, Buffer.from(message), {
    ephemPrivateKey: config.key.ephemPrivateKey,
    iv: config.key.iv
  })
  return encodeBase64JSON(cipher)
}

async function decode(cipher, privateKey) {
  if (typeof privateKey === 'string') {
    privateKey = Buffer.from(privateKey, 'base64')
  }
  const eccCipher = decodeBase64JSON(cipher)
  const message = await eccrypto.decrypt(privateKey, eccCipher)
  return JSON.parse(message.toString())
}

module.exports = {
  genKeypair, genPassword,
  encode, decode
}
