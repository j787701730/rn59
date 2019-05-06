import React from "react";
import {View, Text, Image, Dimensions, ScrollView, TouchableOpacity, ToastAndroid, BackHandler, Platform,} from "react-native";
// import {SafeAreaView} from "react-navigation";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ajax, numFormat} from "../pages/utils/util";
import Video from 'react-native-video';
import AsyncStorage from 'react-native';

export default class Find extends React.Component {
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
    this.getSongPlayList();
  }

  getSongPlayList = async () => {
    try {
      const value = await AsyncStorage.getItem('songPlayList');
      if (value !== null) {
        await AsyncStorage.setItem('songPlayList', JSON.stringify([]));
      } else {
        this.setState({
          songPlayList: JSON.parse(value)
        })
      }
    } catch (error) {
      // Error retrieving data
    }
  };


  setSongPlayList = async (list) => {
    try {
      await AsyncStorage.setItem('songPlayList', JSON.stringify(list));
    } catch (error) {
      // Error saving data
    }
  };


  playMusic = (list) => {
    // console.warn(list);
    console.warn('ppp');
    // this.player.stop();
    let temp = this.state.songPlayList;
    temp.unshift(list[0]);
    if (list.length === 1) {
      this.setState({
        songPlayList: temp
      }, () => {
        this.setSongPlayList(this.state.songPlayList);
      });

    } else {
      this.setState({
        songPlayList: list
      })
      this.setSongPlayList(list);
    }
    this.setState({
      songUrl: list[0].url
    })
  }


  componentDidMount() {
    this.hotSongList();
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

  hotSongList = () => {
    ajax("hotSongList?key=579621905&cat=全部&limit=12&offset=0", data => {
      if (data.code == 200) {
        this.setState({
          hotSongList: data.data
        });
      }
    });
  };

  playNext = () => {
    console.warn('xxxxxx');
    console.log('111');
    let i = 0;
    for (let len = this.state.songPlayList.length; i < len; i++) {
      if (this.state.songUrl === this.state.songPlayList[i].url) {
        console.warn(this.state.songPlayList[i]);
        break;
      }
    }
    if (i === this.state.songPlayList.length - 1) {
      this.setState({
        songUrl: this.state.songPlayList[0].url
      })
    } else {
      this.setState({
        songUrl: this.state.songPlayList[i + 1].url
      });
    }
  }
  onEnd = () => {
    this.playNext();
  };
  videoError = () => {
    this.playNext();
  }
  onProgress = (data) => {
    // console.warn(data);
  }

  render() {
    const {hotSongList, songUrl} = this.state;
    const {height, width} = Dimensions.get('window');
    return (
      <ScrollView>
        <View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 10}}>
          <Text style={{fontWeight: 'bold'}}>热门歌单</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            paddingLeft: 10
          }}
        >
          {hotSongList.map(item => {
            return (
              <View
                style={{width: "33.333333%", paddingRight: 10, paddingBottom: 10}}
                key={item.id}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.push('SongList', {
                      id: item.id,
                      playMusic: this.playMusic
                    })
                  }}
                >
                  <View style={{height: ((width - 10) / 3 - 10), position: 'relative'}}>
                    <Image
                      source={{uri: item.coverImgUrl}}
                      style={{
                        width: "100%",
                        height: "100%"
                      }}
                    />
                    <Text style={{position: 'absolute', right: 10, top: 10, color: '#fff'}}>
                      <FontAwesome
                        name={'play'}
                      />
                      {numFormat(item.playCount)}</Text>
                  </View>
                  <View>
                    <Text numberOfLines={2}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
          <Video source={{uri: songUrl}} ref={(ref) => {
            this.player = ref
          }}
                 volume={1}
                 onEnd={this.onEnd}
                 onError={this.videoError}
                 onProgress={this.onProgress}
                 playInBackground={true}/>
        </View>
      </ScrollView>
    );
  }
}
