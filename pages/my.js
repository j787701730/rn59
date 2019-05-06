import React from "react";
import {View, Text, Platform, BackHandler, ToastAndroid} from "react-native";
import {SafeAreaView} from "react-navigation";

export default class My extends React.Component {
  static navigationOptions = ({navigation}) => ({
    header: null
  });

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  onBackAndroid = () => {
    if (this.props.navigation.isFocused()) {//判断   该页面是否处于聚焦状态
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        BackHandler.exitApp();//直接退出APP
      } else {
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', 1000);//提示
        return true;
      }
    }
  };

  render() {
    return (
      <View style={{height: 200, justifyContent: "center"}}>
        <Text style={{textAlign: "center"}}>112122</Text>
      </View>
    );
  }
}
