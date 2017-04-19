import {AsyncStorage} from 'react-native'
import _ from 'lodash'
import sjcl from './sjcl'
import {key} from '../config.json'
import url from 'url'
import qs from 'query-string'

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


async function decrypt(cipher) {
  cipher = qs.parse(cipher)

  const loginUserStr = await AsyncStorage.getItem('loginUser')
  console.log(loginUserStr)
  const loginUser = loginUserStr ? JSON.parse(loginUserStr) : null

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

async function decryptAll(querystring) {
  const qsObject = url.parse(querystring, true).query

  const receiverInfo = await decrypt(qs.stringify({kemtag: qsObject.kemtag[0], ct: qsObject.ct[0]}))
  const password = await decrypt(qs.stringify({kemtag: qsObject.kemtag[1], ct: qsObject.ct[1]}))

  return Object.assign({
    t: qsObject.t,
    w: qsObject.w,
    id: qsObject.id,
  }, receiverInfo, password)
}

module.exports = {
  genKeypair, genPassword,
  decrypt, decryptAll
}
