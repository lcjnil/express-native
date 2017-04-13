import React, { Component } from 'react'
import { View } from 'react-native'
import { Toolbar, ActionButton } from 'react-native-material-ui'
import realm from '../lib/store'
import { resetScreen } from '../lib/helper'

const MENU = {
  0: 'LOGOUT'
}

const SCAN_QR = 'SCAN_QR'
const INPUT_ID = 'INPUT_ID'
const ADD = 'ADD'

const actions = [{
  icon: 'camera-alt',
  name: SCAN_QR,
  label: '扫描二维码'
}, {
  icon: 'edit',
  name: INPUT_ID,
  label: '手动输入'
}, {
  icon: 'note-add',
  name: ADD,
  label: '添加新的物流'
}]

export default class MainPage extends Component {
  onMenuPressHandler = e => {
    if (MENU[e.index] === 'LOGOUT') {
      realm.write(() => {
        const users = realm.objects('User')
        realm.delete(users)

        this.props.navigation.dispatch(resetScreen('Home'))
      })
    }
  }

  onAddQrHandler = type => {
    if (type === SCAN_QR) {
      this.props.navigation.navigate('Scan')
    }

    if (type === INPUT_ID) {
      //TODO add id
    }

    if (type === ADD) {
      this.props.navigation.navigate('AddForm')
    }
  }

  render () {
    const users = realm.objects('User')
    const loginUser = users[0]

    let availableActions = [...actions]
    if (loginUser && loginUser.type !== 'staff') {
      availableActions.pop()
    }

    return (
      <View style={{flex: 1}}>
        <Toolbar
          centerElement="主页"
          rightElement={{
            menu: {labels: ['登出']},
          }}
          onRightElementPress={this.onMenuPressHandler}
        />
        <ActionButton
          actions={availableActions}
          icon="add"
          transition="speedDial"
          onPress={this.onAddQrHandler}
        />
      </View>
    )
  }
}