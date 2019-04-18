import React from "react";
import {View, Text, Button} from "react-native";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <Text>home</Text>,
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="button"
        color="#333"
      />
    ),
  };


  render() {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}
