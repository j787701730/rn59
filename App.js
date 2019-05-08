/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from "react";
import {View, AppRegistry} from 'react-native'
import HomeScreen from "./pages/home";
import My from "./pages/my";
import Find from "./pages/find";
import SongList from './pages/songList';
import {Provider} from "react-redux";
import {createStore} from "redux";
import reducer from "./pages/redux/reducer";

const store = createStore(reducer);

import {
  createStackNavigator,
  createAppContainer,
  createMaterialTopTabNavigator,
} from "react-navigation";
import Icon from "react-native-vector-icons/RNIMigration";

const Tab = createMaterialTopTabNavigator(
  {
    My: {
      screen: My,
      navigationOptions: ({navigation}) => ({
        tabBarLabel: "我的",
        tabBarIcon: ({focused, tintColor}) => (
          <Icon name="ios-contacts-outline" size={30} color={tintColor}/>
        )
      })
    },
    Find: {
      screen: Find,
      navigationOptions: ({navigation}) => ({
        tabBarLabel: "发现",
        tabBarIcon: ({focused, tintColor}) => (
          <Icon name="ios-contacts-outline" size={30} color={tintColor}/>
        )
      })
    }
  },
  {
    initialRouteName: "Find",
    backBehavior: "none",
    swipeEnabled: true,
    animationEnabled: true,
    lazy: true,
    tabBarOptions: {
      activeTintColor: "#333333",
      inactiveTintColor: "#999999",
      style: {
        backgroundColor: "#ffffff",
        border: "none"
      },
      tabStyle: {
        border: "none"
      },
      indicatorStyle: {
        width: 0
      }
    }
  }
);

const AppNavigator = createStackNavigator(
  {
    Tab: {
      screen: Tab,
      navigationOptions: ({navigation}) => ({
        header: null
      })
    },
    Home: {
      screen: HomeScreen
    },
    SongList: {
      screen: SongList
    }
  },
  {
    initialRouteName: "Tab"
  }
);


let Navigation = createAppContainer(AppNavigator);

// Render the app container component with the provider around it
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}



// export default createAppContainer(NeteaseCloudMusic);
// AppRegistry.registerComponent('rn59', () => NeteaseCloudMusic);


// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// type Props = {};
// export default class App extends Component<Props> {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>Welcome to React Native!</Text>
//         <Text style={styles.instructions}>To get started, edit App.js</Text>
//         <Text style={styles.instructions}>{instructions}</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
