import { NavigationActions } from 'react-navigation';

export function resetScreen(screenName) {
  return NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: screenName
      })
    ]
  })
}

export function resetExpress(expressData) {
  return NavigationActions.reset({
    index: 1,
    actions: [
      NavigationActions.navigate({
        routeName: 'Main'
      }),
      NavigationActions.navigate({
        routeName: 'Express',
        params: expressData
      }),
    ]
  })
}