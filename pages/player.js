import React from "react";
import {View, Text, Image, Dimensions, Platform, TouchableOpacity} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Slider from '@react-native-community/slider';


export default class Player extends React.Component {
  static navigationOptions = ({navigation}) => ({
    header: null
  });

  constructor() {
    super();
    this.state = {
      hotSongList: [],
      songPlayList: [],
      songUrl: ''
    };
  }

  componentWillMount() {
    // this.getSongPlayList();
  }

  formatNum = (num) => {
    if (!isNaN(num)) {
      let m = Math.floor(num / 60);
      let s = Math.round(num % 60);
      return (m > 9 ? m : `0${m}`) + ':' + (s > 9 ? s : `0${s}`);
    } else {
      return '--:--';
    }
  }

  changePaused = () => {
    this.props.changePaused();
  }

  render() {
    const {playSong, duration, paused} = this.props;
    const {height, width} = Dimensions.get('window');
    return (
      <View style={{
        height: 49,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        display: 'flex',
        flexDirection: "row",
        shadowColor: '#eee',
        shadowOffsetY: 2,
      }}>
        <View style={{width: 50, paddingLeft: 5, paddingTop: 5}}>
          <Image source={{uri: playSong.pic}} style={{width: 40, height: 40}}/>
        </View>
        <View style={{width: 30, height: 30, marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={this.changePaused} style={{
            height: '100%', width: '100%', textAlign: 'center',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <FontAwesome
              name={paused ? 'play' : 'pause'}
              style={{fontSize: 20, color: '#31C27C'}}
            />
          </TouchableOpacity>
        </View>
        <View style={{paddingTop: 5, width: width - 80}}>
          <View style={{height: 18, overflow: 'hidden', display: 'flex', flexDirection: 'row', paddingLeft: 15, paddingRight: 15}}>
            <Text numberOfLines={1} style={{width: width - 80 - 100 - 20, fontSize: 12}}>{playSong.name}</Text>
            <View style={{textAlign: 'right', width: 90}}>
              <Text numberOfLines={1}
                    style={{textAlign: 'right', fontSize: 12}}>{this.formatNum(duration.currentTime)}/{this.formatNum(duration.time)}</Text>
            </View>
          </View>
          <View>
            <Slider value={Math.round(duration.currentTime)} maximumValue={Math.round(duration.time)} step={1}
                    thumbTintColor={'#31C27C'} minimumTrackTintColor={'#31C27C'} style={{width: '100%'}}/>
          </View>
        </View>
      </View>
    );
  }
}
