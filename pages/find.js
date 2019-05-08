import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  BackHandler,
  Platform,
  NativeModules
} from "react-native";
// import {SafeAreaView} from "react-navigation";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ajax, numFormat} from "../pages/utils/util";
import Video from 'react-native-video';
import Player from '../pages/player';
import AsyncStorage from '@react-native-community/async-storage';

const {StatusBarManager} = NativeModules;
export default class Find extends React.Component {
  static navigationOptions = ({navigation}) => ({
    header: null
  });

  constructor() {
    super();
    this.state = {
      hotSongList: [],
      highQualitySongList: [],
      songPlayList: [],
      playSong: '',
      duration: {
        time: 100,
        currentTime: 0
      },
      paused: true
    };
  }


  componentWillMount() {

  }

  getPlaySong = async () => {
    try {
      const value = await AsyncStorage.getItem('playSong');
      if (value) {
        this.setState({
          playSong: JSON.parse(value)
        })
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  setPlaySong = async (list) => {
    try {
      await AsyncStorage.setItem('playSong', JSON.stringify(list));
    } catch (error) {
      // Error saving data
    }
  };

  getSongPlayList = async () => {
    try {
      const value = await AsyncStorage.getItem('songPlayList');
      if (value == null) {
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
      playSong: list[0],
      paused: false
    })
    this.setPlaySong(list[0]);
  }


  componentDidMount() {
    this.getSongPlayList();
    this.getPlaySong();
    this.hotSongList();
    this.highQualitySongList();
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
    ajax("hotSongList?key=579621905&cat=全部&limit=15&offset=0", data => {
      if (data.code == 200) {
        this.setState({
          hotSongList: data.data
        });
      }
    });
  };


  highQualitySongList = () => {
    ajax("highQualitySongList?key=579621905&cat=全部&limit=15", data => {
      if (data.code == 200) {
        this.setState({
          highQualitySongList: data.data.playlists
        });
      }
    });
  };

  playNext = () => {
    let i = 0;
    for (let len = this.state.songPlayList.length; i < len; i++) {
      if (this.state.playSong.url === this.state.songPlayList[i].url) {
        break;
      }
    }
    if (i === this.state.songPlayList.length - 1) {
      this.setState({
        playSong: this.state.songPlayList[0],
      })
      this.setPlaySong(this.state.songPlayList[0]);
    } else {
      this.setState({
        playSong: this.state.songPlayList[i + 1]
      });
      this.setPlaySong(this.state.songPlayList[i + 1]);
    }
  }
  onEnd = () => {
    this.playNext();
  };
  videoError = () => {
    this.playNext();
  }
  onProgress = (data) => {
    let currentTime = data.currentTime;
    let seekableDuration = data.seekableDuration;
    this.setState({
      duration: {
        time: seekableDuration,
        currentTime: currentTime
      }
    })
  }

  changePaused = () => {
    this.setState({
      paused: !this.state.paused
    })
  }

  render() {
    const {hotSongList, highQualitySongList, playSong, duration, paused} = this.state;
    const {height, width} = Dimensions.get('window');
    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
    return (
      <View>
        <View style={{height: height - 100 - STATUSBAR_HEIGHT}}>
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
                        <View
                          style={{
                            position: 'absolute',
                            right: 5,
                            top: 0,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                          <FontAwesome
                            name={'play'}
                            style={{color: '#fff', fontSize: 12,}}
                          />
                          <Text> </Text>
                          <Text style={{color: '#fff', fontSize: 12}}>{numFormat(item.playCount)}</Text>
                        </View>

                      </View>
                      <View>
                        <Text numberOfLines={2} style={{fontSize: 12}}>{item.title}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            <View style={{paddingLeft: 10, paddingBottom: 6,}}>
              <Text style={{fontWeight: 'bold'}}>精品歌单</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                paddingLeft: 10
              }}
            >
              {highQualitySongList.map(item => {
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
                        {/*<View*/}
                        {/*  style={{*/}
                        {/*    position: 'absolute',*/}
                        {/*    right: 5,*/}
                        {/*    top: 0,*/}
                        {/*    display: 'flex',*/}
                        {/*    flexDirection: 'row',*/}
                        {/*    justifyContent: 'center',*/}
                        {/*    alignItems: 'center'*/}
                        {/*  }}>*/}
                        {/*  <FontAwesome*/}
                        {/*    name={'play'}*/}
                        {/*    style={{color: '#fff', fontSize: 12,}}*/}
                        {/*  />*/}
                        {/*  <Text> </Text>*/}
                        {/*  <Text style={{color: '#fff', fontSize: 12}}>{numFormat(item.playCount)}</Text>*/}
                        {/*</View>*/}

                      </View>
                      <View>
                        <Text numberOfLines={2} style={{fontSize: 12}}>{item.title}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            {playSong ? <Video source={{uri: playSong.url}} ref={(ref) => {
              this.player = ref
            }}
                               volume={1}
                               paused={paused}
                               onEnd={this.onEnd}
                               onError={this.videoError}
                               onProgress={this.onProgress}
                               playInBackground={true}/> : null}
          </ScrollView>
        </View>
        <Player playSong={playSong} duration={duration} changePaused={this.changePaused} paused={paused}/>
      </View>
    );
  }
}
