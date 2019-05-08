import React from "react";
import {View, Text, Image, Dimensions, ScrollView, Button} from "react-native";
// import Video from "react-native-video";
import {SafeAreaView} from "react-navigation";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ajax, numFormat} from "../pages/utils/util";

export default class SongList extends React.Component {
  static navigationOptions = ({navigation}) => ({
    header: null
  });

  constructor() {
    super();
    this.state = {
      songList: {}
    };
  }

  componentDidMount() {
    this.getSongList();
  }

  getSongList = () => {
    ajax(`songList?key=579621905&id=${this.props.navigation.state.params.id}&limit=10&offset=0`, data => {
      if (data.code == 200) {
        this.setState({
          songList: data.data
        });
      }
    });
  };

  playMusic = (song) => {
    this.props.navigation.state.params.playMusic(song);
  };

  render() {
    const {songList} = this.state;
    const {height, width} = Dimensions.get('window');
    return (
      <SafeAreaView>
        <ScrollView>
          <View
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >{Object.keys(songList).length === 0 ? <View><Text>加载中...</Text></View> :
            <View>
              <View style={{paddingLeft: 10}}>
                <Image style={{width: 100, height: 100}} source={{uri: songList['songListPic']}}/>
              </View>
              <View style={{paddingLeft: 10, marginTop: 5, marginBottom: 5}}>
                <Button onPress={this.playMusic.bind(this, songList.songs)} title={'播放全部'}/>
              </View>
              <View>
                {songList.songs.map((song, i) => {
                  return (<View style={{display: 'flex', flexDirection: "row",}} key={song.id}>
                    <View style={{
                      width: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Text style={{textAlign: 'center', justifyContent: 'center', width: 40}}>{i + 1}</Text>
                    </View>
                    <View style={{width: width - 50}}>
                      <Text numberOfLines={1} onPress={this.playMusic.bind(this, [song])}>{song.name}</Text>
                    </View>
                  </View>)
                })}
              </View>
            </View>}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
