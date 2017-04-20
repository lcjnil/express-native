import React, {Component} from 'react'
import {View, ScrollView, Text, AsyncStorage, TextInput} from 'react-native'
import {Toolbar, ListItem, Subheader, Button} from 'react-native-material-ui'
import { MaterialDialog } from 'react-native-material-dialog'
import moment from 'moment'

import OperatorActions from '../components/OperatorActions'
import {resetScreen} from '../lib/helper'
import config from '../config.json'

const STATUS_MAP = {
  initial: '已接单',
  transfer: '运输中',
  received: '已送达'
}

export default class ExpressPage extends Component {
  state = {
    loginUser: {},
    showAddPositionDialog: false,
    position: ''
  }

  componentWillMount () {
    AsyncStorage.getItem('loginUser').then(loginUser => {
      if (loginUser) {
        this.setState({
          loginUser: JSON.parse(loginUser)
        })
      }
    })
  }

  handleLogin = () => {
    this.props.navigation.dispatch(resetScreen('Home'))
  }

  fetchExpress = () => {
    const {params} = this.props.navigation.state
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

    if (this.state.loginUser && this.state.loginUser.token) {
      headers['X-Access-Token'] = this.state.loginUser.token
    }
    fetch(`${config.server}/api/express/${params.id}`, {
      method: 'GET',
      headers,
    }).then(r => {
      if (!r.ok) {
        alert('未找到此物流 ID 对应的物流记录')
        return
      }
      r.json().then(express => {
        this.setState({express})
      })
    })
  }

  renderOperations() {
    return (
      <View style={{flex: 1}}>
        <Subheader text="物流人员操作" />
        <Button raised icon="add" text="添加物流记录" onPress={this.showAddPositionDialog} />
        <Button primary raised icon="done" text="确认收货" onPress={this.register} />
        
        
        <MaterialDialog
          title="添加新的物流节点"
          visible={this.state.showAddPositionDialog}
          okLabel="确定"
          cancelLabel="取消"
          onOk={this.addPosition}
          onCancel={this.hideAddPositionDialog}
        >
          <TextInput
            placeholder="请输入物流当前位置"
            value={this.state.position}
            onChangeText={position => this.setState({position})}
          />
        </MaterialDialog>
      </View>
    )
  }

  renderExpress() {
    const {express} = this.state
    return (
      <View>
        <Subheader text="物料信息"/>
        <ListItem
          divider
          leftElement={<Text>状态</Text>}
          centerElement={STATUS_MAP[express.status]}
        />
        <Subheader text="历史记录"/>
        {express.history.map((v, index) => (
          <ListItem
            divider
            key={index}
            leftElement={<Text>运输</Text>}
            centerElement={{
              primaryText: `地点: ${v.position}`,
              secondaryText: `操作人员: ${v.operator.name || '张三'} 时间: ${moment(v.date).format('YYYY-MM-DD')} `,
            }}
          />
        ))}
      </View>
    )
  }

  renderMore() {
    return (
      <View>
        <Button primary text="点击获取更多信息" onPress={this.fetchExpress}/>
        {this.state.express && this.renderExpress()}
      </View>
    )
  }

  render() {
    const {params} = this.props.navigation.state;
    return (
      <ScrollView style={{flex: 1}}>
        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.navigation.goBack()}
          centerElement="物流详情页"
        />
        <Subheader text="物流资料" />
        <ListItem
          divider
          leftElement={<Text>ID</Text>}
          centerElement={params.id}
        />
        <ListItem
          divider
          leftElement={<Text>类型</Text>}
          centerElement={params.t}
        />
        <ListItem
          divider
          leftElement={<Text>重量</Text>}
          centerElement={params.w}
        />
        {params.p && [
          <Subheader text="收货人信息" key="1" />,
          <ListItem
            key="2"
            divider
            leftElement={<Text>姓名</Text>}
            centerElement={params.n}
          />,
          <ListItem
            key="3"
            divider
            leftElement={<Text>电话</Text>}
            centerElement={params.p}
          />,
          <ListItem
            key="4"
            divider
            leftElement={<Text>地址</Text>}
            centerElement={params.a}
          />,
        ]}
        {params.s && [
          <Subheader text="收货确认密码" key="1" />,
          <ListItem
            key="2"
            divider
            leftElement={<Text>密码</Text>}
            centerElement={params.s}
          />,
        ]}

        {!this.state.loginUser.type &&
          <Text style={{textAlign: 'center', marginTop: 20}}>
            查看更多信息，请<Text style={{color: '#03A9F4'}} onPress={this.handleLogin}>登录</Text>
          </Text>
        }
        {(params.p || params.s) && this.renderMore()}
        {this.state.loginUser.type !== 'user' &&
          <OperatorActions expressId={params.id} />
        }

      </ScrollView>
    )
  }
}
