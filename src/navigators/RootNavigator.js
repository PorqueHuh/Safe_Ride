import { createStackNavigator, createAppContainer } from 'react-navigation';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import Login from '../screens/Login';
import HomeScreen from '../screens/HomeScreen'

// const SwitchNavigator = createSwitchNavigator(
//     {
//         App: AppStack,
//         Auth: AuthStack,
//     },
//     {
//         initialRouteName: 'Auth',
//     }
// );

// const RootNavigator = createAppContainer(SwitchNavigator);

// export default RootNavigator;

const screens = {
	HomeScreen: {
		screen: HomeScreen
	},
	Login: {
		screen: Login
	}
}

const config = {
	initialRouteName: 'Login'
}

const RootNavigator = createStackNavigator(screens, config);
export default createAppContainer(RootNavigator);