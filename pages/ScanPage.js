import React, { Component } from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
  Text
} from 'react-native'
import Camera from 'react-native-camera'
import {decryptAll} from '../lib/Ecc'

const {height, width} = Dimensions.get('window')
const WIDTH = 250
const borderTopWidth = (height - WIDTH) / 2
const borderLeftWidth = (width - WIDTH) / 2

export default class ScanPage extends Component {
  constructor() {
    super()

    this.state = {
      loading: false
    }
  }
  qrCodeHandler = ({type, data}) => {
    this.setState({
      loading: true
    })
    // 解密过程非常慢，所以需要放到下一个 tick，否则会阻塞渲染
    setTimeout(() => {
      if (type === 'QR_CODE') {
        alert(JSON.stringify(decryptAll(data)))
        this.props.navigation.goBack()
      }
    })
  }

  render () {
    return (
      <View style={styles.container}>
        {this.state.loading ?
          <Text>已经扫描到二维码，请稍后</Text> :
           <Camera
            onBarCodeRead={this.qrCodeHandler}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}>
            <View style={styles.shade}>
              <Text style={styles.tip}>将二维码放入框中，即可自动扫描</Text>
            </View>
          </Camera>
        }
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