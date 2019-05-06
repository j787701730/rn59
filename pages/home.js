import React from "react";
// import { View, Text } from "react-native";
// import { Button, Icon, Header, CheckBox } from "react-native-elements";
// import Video from "react-native-video";
import { SafeAreaView } from "react-navigation";
import  Find  from "../pages/find";
import  My  from "../pages/my";
import { Container, Header, Content, Tab, Tabs } from "native-base";

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor() {
    super();
    this.state = {
      check: false
    };
  }

  render() {
    return (
      <Container>
        <Tabs style={{backgroundColor: '#fff',}}>
          <Tab heading="我的" style={{backgroundColor: '#fff',}}>
            <My />
          </Tab>
          <Tab heading="发现">
            <Find />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
