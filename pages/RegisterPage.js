import React, {Component} from 'react'
import {View, StyleSheet, TextInput} from 'react-native'
import {Toolbar, ListItem, Subheader, Button} from 'react-native-material-ui'
import config from '../config.json'

export default class RegisterPage extends Component {
  constructor() {
    super()
    this.state = {
      phone: '',
      name: '',
      password: '',
      repeatPassword: ''
    }
  }

  register = () => {
    fetch(`${config.server}/api/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: this.state.phone,
        password: this.state.password,
        name: this.state.name
      })
    }).then(r => {
      if (r.ok) {
        alert('注册成功，请登录')
        this.props.navigation.goBack()
      } else {
        alert('注册失败，请检查电话号码或密码')
      }
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
          centerElement="注册"
        />
        <Subheader text="账户资料" />
        <ListItem
          divider
          leftElement="call"
          centerElement={
            <TextInput
              {...inputProps}
              value={this.state.phone}
              onChangeText={phone => this.setState({phone})}
              placeholder="请填写电话号码" />
          }
        />
        <ListItem
          divider
          leftElement="person"
          centerElement={
            <TextInput
              {...inputProps}
              value={this.state.name}
              onChangeText={name => this.setState({name})}
              placeholder="请填写姓名" />
          }
        />
        <ListItem
          divider
          leftElement="lock"
          centerElement={
            <TextInput
              {...inputProps}
              value={this.state.password}
              secureTextEntry
              onChangeText={password => this.setState({password})}
              placeholder="请填写密码"
            />
          }
        />
        <ListItem
          divider
          leftElement="lock"
          centerElement={
            <TextInput
              {...inputProps}
              value={this.state.repeatPassword}
              secureTextEntry
              onChangeText={repeatPassword => this.setState({repeatPassword})}
              placeholder="请重复填写密码"
            />
          }
        />
        <Button primary raised icon="done" text="确定" onPress={this.register} />
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