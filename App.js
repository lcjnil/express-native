import React from 'react'
import {
  AppRegistry,
  UIManager,
  Platform
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import { COLOR, ThemeProvider } from 'react-native-material-ui'

import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'
import ScanPage from './pages/ScanPage'
import AddFormPage from './pages/AddFormPage'
import RegisterPage from './pages/RegisterPage'
import ExpressPage from './pages/ExpressPage'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

global._fetch = fetch
global.fetch = function (uri, options, ...args) {
  return global._fetch(uri, options, ...args).then((response) => {
    console.log('Fetch', {request: {uri, options, ...args}, response})
    return response
  })
}

const SimpleApp = StackNavigator({
  Home: {screen: LoginPage},
  Main: {screen: MainPage},
  Scan: {screen: ScanPage},
  AddForm: {screen: AddFormPage},
  Register: {screen: RegisterPage},
  Express: {screen: ExpressPage}
}, {
  headerMode: 'none'
})

const App = () =>
  <ThemeProvider>
    <SimpleApp />
  </ThemeProvider>

AppRegistry.registerComponent('SimpleApp', () => App)

