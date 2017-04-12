import React, {Component} from 'react'
import {View, Text} from 'react-native'
import {Toolbar, ListItem, Subheader} from 'react-native-material-ui'

export default class ExpressPage extends Component {
  render() {
    const {params} = this.props.navigation.state;
    return (
      <View style={{flex: 1}}>
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
      </View>
    )
  }
}