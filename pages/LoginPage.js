import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { MKTextField, MKButton, MKColor } from 'react-native-material-kit'
import { Button } from 'react-native-material-ui'
import realm from '../lib/store'
import {resetScreen} from '../lib/helper'
import config from '../config.json'

const styles = Object.assign({}, StyleSheet.create({
  textfieldWithFloatingLabel: {
    height: 48,  // have to do it on iOS
    marginTop: 20,
  },
}))

const PasswordInput = MKTextField.textfieldWithFloatingLabel()
  .withPassword(true)
  .withPlaceholder('密码')
  .withHighlightColor(MKColor.Blue)
  .withStyle(styles.textfieldWithFloatingLabel)
  .withTextInputStyle({flex: 1})
  .build()

const PhoneInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('电话号码')
  .withHighlightColor(MKColor.Blue)
  .withStyle(styles.textfieldWithFloatingLabel)
  .withTextInputStyle({flex: 1})
  .build()

export default class LoginPage extends Component {
  constructor () {
    super()

    this.state = {
      phone: '',
      password: '',
    }
  }

  componentDidMount () {
    const users = realm.objects('User')
    if (users.length > 1) {
      realm.write(() => {
        realm.delete(users)
      })
    }

    if (users.length === 1) {
      this.props.navigation.dispatch(resetScreen('Main'))
    }
  }

  login = () => {
    fetch(`http://${config.server}/api/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: this.state.phone,
        password: this.state.password
      })
    }).then(r => {
      if (r.ok) {
        r.json()
          .then(user => {
            this.props.navigation.dispatch(resetScreen('Main'))
            realm.write(() => {
              realm.create('User',
                Object.assign(
                  user, {token: r.headers.get('x-access-token')}
                )
              )
            })
          })
      } else {
        alert('登录失败，请检查电话号码或密码')
      }
    })
  }

  register = () => {
    this.props.navigation.navigate('Register')
  }

  render () {
    return (
      <View style={{
        paddingVertical: 30,
        flex: 1,
        justifyContent: 'center'
      }}>
        <Text style={{
          margin: 20,
          fontSize: 30,
          textAlign: 'center'
        }}>
          Express 物流管理系统
        </Text>
        <View style={{
          marginLeft: 20,
          marginRight: 20
        }}>
          <PhoneInput
            value={this.state.phone}
            onTextChange={phone => this.setState({phone})}
          />
        </View>
        <View style={{
          marginLeft: 20,
          marginRight: 20
        }}>
          <PasswordInput
            value={this.state.password}
            onTextChange={password => this.setState({password})}
          />
        </View>
        <View style={{
          margin: 20,
          marginTop: 60
        }}>
          <Button primary raised text="登录" onPress={this.login}/>
          <View style={{
            marginTop: 20,
            justifyContent: 'space-between',
            flexDirection: 'row'
          }}>
            <Text onPress={this.register}>注册</Text>
            <Text>游客访问</Text>
          </View>
        </View>
      </View>
    )
  }
}