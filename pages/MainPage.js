import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Toolbar } from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import realm from '../lib/store'
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

  componentWillMount () {
    this.setState({loginUser: realm.objects('User')[0]})
  }

  onMenuPressHandler = e => {
    if (MENU[e.index] === 'LOGOUT') {
      realm.write(() => {
        const users = realm.objects('User')
        realm.delete(users)

        this.props.navigation.dispatch(resetScreen('Home'))
      })
    }
  }

  scan = () => {
    this.props.navigation.navigate('Scan')
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

        <View style={{padding: 10}}>
          <View>
            <Icon.Button name="qrcode" backgroundColor="#03A9F4" size={80} onPress={this.scan}>
              <Text style={{fontSize: 50, color: '#fff'}}>扫描二维码</Text>
            </Icon.Button>
          </View>

          <View style={{paddingVertical: 10}}>
            <Icon.Button name="lead-pencil" backgroundColor="#E91E63" size={80}>
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