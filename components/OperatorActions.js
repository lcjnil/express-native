import React, {Component} from 'react'
import {View, Text, TextInput, AsyncStorage} from 'react-native'
import {Subheader, Button} from 'react-native-material-ui'
import { MaterialDialog } from 'react-native-material-dialog'

import config from '../config.json'

export default class OperatorActions extends Component {
  state = {
    position: '',
    password: '',
    showAddPositionDialog: false,
    showReceiveDialog: false
  }

  showDialog = (type = 'position') => () => {
    if (type === 'position') {
      this.setState({showAddPositionDialog: true})
    } else if (type === 'receive') {
      this.setState({showReceiveDialog: true})
    }
  }

  hideDialog = (type = 'receive') => () => {
    if (type === 'position') {
      this.setState({showAddPositionDialog: false})
    } else if (type === 'receive') {
      this.setState({showReceiveDialog: false})
    }
  }

  addPosition = async () => {
    const loginUserStr = await AsyncStorage.getItem('loginUser')
    const loginUser = JSON.parse(loginUserStr)
    const token = loginUser.token
    const data = JSON.stringify({
      position: this.state.position
    })

    const r = await fetch(`http://${config.server}/api/express/${this.props.expressId}/history`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Access-Token': token
      },
      body: data
    })

    if (r.ok) {
      alert('添加物流记录成功')
      this.hideDialog('position')
    } else {
      const message = await r.json()
      alert(message.error || '添加物流记录失败')
    }
  }

  markReceive = async () => {
    const loginUserStr = await AsyncStorage.getItem('loginUser')
    const loginUser = JSON.parse(loginUserStr)
    const token = loginUser.token
    const data = JSON.stringify({
      password: this.state.password
    })

    const r = await fetch(`http://${config.server}/api/express/${this.props.expressId}/receive`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Access-Token': token
      },
      body: data
    })

    if (r.ok) {
      alert('确认收货成功')
      this.hideDialog('receive')
    } else {
      const message = await r.json()
      alert(message.error || '确认收货失败')
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Subheader text="物流人员操作" />
        <Button raised icon="add" text="添加物流记录" onPress={this.showDialog('position')} />
        <Button primary raised icon="done" text="确认收货" onPress={this.showDialog('receive')} />


        <MaterialDialog
          title="添加新的物流节点"
          visible={this.state.showAddPositionDialog}
          okLabel="确定"
          cancelLabel="取消"
          onOk={this.addPosition}
          onCancel={this.hideDialog('position')}
        >
          <TextInput
            placeholder="请输入物流当前位置"
            value={this.state.position}
            onChangeText={position => this.setState({position})}
          />
        </MaterialDialog>

        <MaterialDialog
          title="确认收货"
          visible={this.state.showReceiveDialog}
          okLabel="确定"
          cancelLabel="取消"
          onOk={this.markReceive}
          onCancel={this.hideDialog('receive')}
        >
          <TextInput
            placeholder="请输入确认收货密码"
            value={this.state.password}
            onChangeText={password => this.setState({password})}
          />
        </MaterialDialog>
      </View>
    )
  }
}