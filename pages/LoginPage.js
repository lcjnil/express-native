import React, { Component } from 'react'
import { View, StyleSheet, Text, AsyncStorage } from 'react-native'
import {TextField} from 'react-native-material-textfield'
import { Button } from 'react-native-material-ui'
import {resetScreen} from '../lib/helper'
import config from '../config.json'

const styles = Object.assign({}, StyleSheet.create({
  textfieldWithFloatingLabel: {
    height: 48,  // have to do it on iOS
    marginTop: 20,
  },
}))

export default class LoginPage extends Component {
  state = {
    phone: '',
    password: '',
    loginUser: {}
  }

  componentDidMount () {
    AsyncStorage.getItem('loginUser').then(loginUser => {
      if (loginUser) {
        this.props.navigation.dispatch(resetScreen('Main'))
      }
    })
  }

  login = async () => {
    const r = await fetch(`${config.server}/api/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: this.state.phone,
        password: this.state.password
      })
    })

    if (!r.ok) {
      alert('登录失败，请检查电话号码或密码')
      return
    }

    const user = await r.json()
    user.token = r.headers.get('X-Access-Token')
    await AsyncStorage.setItem('loginUser', JSON.stringify(user))
    this.props.navigation.dispatch(resetScreen('Main'))
  }

  register = () => {
    this.props.navigation.navigate('Register')
  }

  visitor = () => {
    this.props.navigation.dispatch(resetScreen('Main'))
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
          <TextField
            label="电话号码"
            value={this.state.phone}
            onChangeText={phone => this.setState({phone}) }
          />
        </View>
        <View style={{
          marginLeft: 20,
          marginRight: 20
        }}>
          <TextField
            label="密码"
            value={this.state.password}
            secureTextEntry
            onChangeText={password => this.setState({password})}
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
            <Text onPress={this.visitor}>游客访问</Text>
          </View>
        </View>
      </View>
    )
  }
}