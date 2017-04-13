import React, {Component} from 'react'
import {Text, View, ScrollView, TextInput, StyleSheet} from 'react-native'
import {Toolbar, ListItem, Subheader, Button} from 'react-native-material-ui'
import _ from 'lodash'

import realm from '../lib/store'
import config from '../config.json'

export default class AddFormPage extends Component {
  constructor() {
    super()
    this.state = {
      type: '',
      weight: '',
      receiverName: '',
      receiverPhone: '',
      receiverAddress: '',
      senderName: '',
      senderPhone: '',
      senderAddress: ''
    }
  }

  addExpress = () => {
    const [loginUser] = realm.objects('User')
    const data = JSON.stringify(
      _.pick(this.state, [
        'type', 'weight',
        'receiverName', 'receiverPhone', 'receiverAddress',
        'senderName', 'senderPhone', 'senderAddress'
      ])
    )

    fetch(`http://${config.server}/api/express`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Access-Token': loginUser.token
      },
      body: data
    }).then(() => {
      alert('Create Express success!')
      this.props.navigation.goBack()
    })
  }

  render() {
    const inputProps = {
      style: styles.input,
      underlineColorAndroid: 'rgba(0,0,0,0)'
    }
    return (
      <View style={styles.container}>
        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.navigation.goBack()}
          centerElement="添加新的物流"
        />
        <ScrollView style={styles.container}>
          <Subheader text="物料信息" />
          <ListItem
            divider
            leftElement="toc"
            centerElement={
              <TextInput
                {...inputProps}
                value={this.state.type}
                onChangeText={type => this.setState({type})}
                placeholder="请填写物流类型" />
            }
          />
          <ListItem
            divider
            leftElement="link"
            centerElement={
              <TextInput
                {...inputProps}
                value={this.state.weight}
                onChangeText={weight => this.setState({weight})}
                placeholder="请填写货品重量"
              />
            }
          />
          <Subheader text="收货人信息（仅内部人员可见）" />
          <ListItem
            divider
            leftElement="person"
            centerElement={
              <TextInput
                {...inputProps}
                value={this.state.receiverName}
                onChangeText={receiverName => this.setState({receiverName})}
                placeholder="请填写收货人姓名"
              />
            }
          />
          <ListItem
            divider
            leftElement="call"
            centerElement={
              <TextInput
                {...inputProps}
                value={this.state.receiverPhone}
                onChangeText={receiverPhone => this.setState({receiverPhone})}
                placeholder="请填写收货人电话"
              />
            }
          />
          <ListItem
            divider
            leftElement="location-on"
            centerElement={
              <TextInput
                {...inputProps}
                value={this.state.receiverAddress}
                onChangeText={receiverAddress => this.setState({receiverAddress})}
                placeholder="请填写收货人地址"
              />
            }
          />
          <Subheader text="发件人信息（仅内部人员可见）" />
          <ListItem
            divider
            leftElement="person"
            centerElement={
              <TextInput
                {...inputProps}
                value={this.state.senderName}
                onChangeText={senderName => this.setState({senderName})}
                placeholder="请填发件人姓名"
              />
            }
          />
          <ListItem
            divider
            leftElement="call"
            centerElement={
              <TextInput
                {...inputProps}
                value={this.state.senderPhone}
                onChangeText={senderPhone => this.setState({senderPhone})}
                placeholder="请填发件人电话"
              />
            }
          />
          <ListItem
            divider
            leftElement="location-on"
            centerElement={
              <TextInput
                {...inputProps}
                value={this.state.senderAddress}
                onChangeText={senderAddress => this.setState({senderAddress})}
                placeholder="请填发件人地址"
              />
            }
          />
          <Button primary raised icon="done" text="确定" onPress={this.addExpress} />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderBottomWidth: 0,
  },
});
