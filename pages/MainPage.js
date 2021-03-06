import React, { Component } from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import { Toolbar } from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { resetScreen } from '../lib/helper'

const MENU = {
  0: 'LOGOUT'
}

const SCAN_QR = 'SCAN_QR'
const INPUT_ID = 'INPUT_ID'
const ADD = 'ADD'

export default class MainPage extends Component {
  state = {
    loginUser: null
  }

  componentDidMount () {
    AsyncStorage.getItem('loginUser').then(loginUser => {
      if (loginUser) {
        this.setState({loginUser: JSON.parse(loginUser)})
      }
    })
  }

  onMenuPressHandler = async e => {
    if (MENU[e.index] === 'LOGOUT') {
      await AsyncStorage.removeItem('loginUser')
      this.props.navigation.dispatch(resetScreen('Home'))
    }
  }

  scan = () => {
    this.props.navigation.navigate('Scan')
  }

  search = () => {
    this.props.navigation.navigate('Search')
  }

  add = () => {
    this.props.navigation.navigate('AddForm')
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <Toolbar
          centerElement="主页"
          rightElement={{
            menu: {labels: [this.state.loginUser ? '登出' : '登录']},
          }}
          onRightElementPress={this.onMenuPressHandler}
        />

        <Text style={{paddingLeft: 10, paddingTop: 10}}>你好！{this.state.loginUser ? this.state.loginUser.name : '游客'}</Text>

        <View style={{padding: 10}}>
          <View>
            <Icon.Button name="qrcode" backgroundColor="#03A9F4" size={80} onPress={this.scan}>
              <Text style={{fontSize: 50, color: '#fff'}}>扫描二维码</Text>
            </Icon.Button>
          </View>

          <View style={{paddingVertical: 10}}>
            <Icon.Button name="lead-pencil" backgroundColor="#E91E63" size={80} onPress={this.search}>
              <Text style={{fontSize: 50, color: '#fff'}}>输入物流 ID</Text>
            </Icon.Button>
          </View>

          {this.state.loginUser && this.state.loginUser.type !== 'user' &&
          <View>
            <Icon.Button name="plus" backgroundColor="#673AB7" size={80} onPress={this.add}>
              <Text style={{fontSize: 50, color: '#fff'}}>新建物流单</Text>
            </Icon.Button>
          </View>
          }
        </View>
      </View>
    )
  }
}