import React, { Component } from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
  Text
} from 'react-native'
import Camera from 'react-native-camera'
const {height, width} = Dimensions.get('window')
const WIDTH = 250
const borderTopWidth = (height - WIDTH) / 2
const borderLeftWidth = (width - WIDTH) / 2

export default class ScanPage extends Component {
  qrCodeHandler = (type, data) => {
    console.log(data)
    this.props.navigation.goBack()
  }

  render () {
    return (
      <View style={styles.container}>
        <Camera
          onBarCodeRead={this.qrCodeHandler}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <View style={styles.shade}>
            <Text style={styles.tip}>将二维码放入框中，即可自动扫描</Text>
          </View>
        </Camera>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  shade: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderTopWidth: borderTopWidth - 20,
    borderBottomWidth: borderTopWidth + 20,
    borderLeftWidth: borderLeftWidth,
    borderRightWidth: borderLeftWidth
  },
  tip: {
    top: 40,
    color: 'rgba(255, 255, 255, 0.5)'
  }
})