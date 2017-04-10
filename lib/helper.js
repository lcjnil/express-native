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
