import React, { Component } from 'react'
import { Text, View, ScrollView, TextInput, StyleSheet, AsyncStorage } from 'react-native'
import { Toolbar, ListItem, Subheader, Button } from 'react-native-material-ui'
import moment from 'moment'

import config from '../config.json'
import OperatorActions from '../components/OperatorActions'

const STATUS_MAP = {
  initial: '已接单',
  transfer: '运输中',
  received: '已送达'
}

export default class SearchPage extends Component {
  state = {
    loginUser: null,
    expressId: '',
    express: {}
  }

  componentWillMount () {
    AsyncStorage.getItem('loginUser').then(loginUser => {
      if (loginUser) {
        this.setState({loginUser: JSON.parse(loginUser)})
      }
    })
  }

  searchExpress = async () => {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

    if (this.state.loginUser && this.state.loginUser.token) {
      headers['X-Access-Token'] = this.state.loginUser.token
    }
    fetch(`${config.server}/api/express/${encodeURIComponent(this.state.expressId)}`, {
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

  renderCommonInfo () {
    const express = this.state.express
    return (
      <View>
        <Subheader text="物料信息"/>
        <ListItem
          divider
          leftElement={<Text>ID</Text>}
          centerElement={String(express.expressId)}
        />
        <ListItem
          divider
          leftElement={<Text>类型</Text>}
          centerElement={express.type}
        />
        <ListItem
          divider
          leftElement={<Text>重量</Text>}
          centerElement={express.weight}
        />
        <ListItem
          divider
          leftElement={<Text>状态</Text>}
          centerElement={STATUS_MAP[express.status]}
        />
      </View>
    )
  }

  renderSenderInfo () {
    const express = this.state.express
    return (
      <View>
        <Subheader text="发货人信息" key="1"/>
        <ListItem
          divider
          leftElement={<Text>姓名</Text>}
          centerElement={express.senderName}
        />
        <ListItem
          divider
          leftElement={<Text>电话</Text>}
          centerElement={express.senderPhone}
        />
        <ListItem
          divider
          leftElement={<Text>地址</Text>}
          centerElement={express.senderAddress}
        />
      </View>
    )
  }

  renderReceiverInfo () {
    const express = this.state.express
    return (
      <View>
        <Subheader text="收货人信息"/>
        <ListItem
          divider
          leftElement={<Text>姓名</Text>}
          centerElement={express.receiverName}
        />
        <ListItem
          divider
          leftElement={<Text>电话</Text>}
          centerElement={express.receiverPhone}
        />
        <ListItem
          divider
          leftElement={<Text>地址</Text>}
          centerElement={express.receiverAddress}
        />
        {express.password &&
          <ListItem
            divider
            leftElement={<Text>密码</Text>}
            centerElement={express.password}
          />}
      </View>
    )
  }

  renderHistory() {
  const express = this.state.express
    return (
      <View>
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

  render () {
    return (
      <View style={{flex: 1}}>
        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.navigation.goBack()}
          centerElement="物流搜索页"
        />
        <Subheader text="物流搜索"/>
        <ListItem
          divider
          leftElement="bookmark"
          centerElement={
            <TextInput
              underlineColorAndroid="rgba(0,0,0,0)"
              value={this.state.expressId}
              onChangeText={expressId => this.setState({expressId})}
              placeholder="请填写物流 ID"/>
          }
        />
        <Button primary raised icon="search" text="搜索" onPress={this.searchExpress}/>
        <ScrollView style={{flex: 1}}>
          {this.state.express.expressId && this.renderCommonInfo()}
          {this.state.express.senderPhone && this.renderSenderInfo()}
          {this.state.express.receiverPhone && this.renderReceiverInfo()}
          {this.state.express.history && this.renderHistory()}
          {this.state.loginUser && this.state.loginUser.type !== 'user'
            && this.state.express.expressId &&
            <OperatorActions expressId={this.state.express.expressId} />
          }
        </ScrollView>

      </View>
    )
  }
}