//import liraries
import React, {Component} from 'react';
import {
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  Platform,
  SafeAreaView,
  View,
  FlatList,
  Modal,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Text,
  Title,
  Left,
  Right,
  Body,
  Input,
  Item,
  Footer,
  FooterTab,
  Badge,
  Card,
  Textarea,
  Picker,
} from 'native-base';

import {Actions} from 'react-native-router-flux';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import {Style, Colors} from '../Themes';
import Styles from './Style';

import {_storeData, _getData} from '@Component/StoreAsync';
import {WebView} from 'react-native-webview';
import {urlApi} from '@Config/services';
import moment from 'moment';

let isMount = false;
// create a component
class SurveyDetail extends Component {
  constructor(props) {
    super(props);

    const items = this.props.data;
    this.state = {
      hd: null,

      customers: [],
      user: '',
      name: '',
      project: [],
      selected: '',
    };

    console.log('props cfs', props);
  }

  render() {
    const item = this.props.data;
    return (
      <Container style={Style.bgMain}>
        <Header style={Style.navigation}>
          <StatusBar
            backgroundColor={Colors.statusBarOrange}
            animated
            barStyle="light-content"
          />

          <View style={Style.actionBarLeft}>
            <Button
              transparent
              style={Style.actionBarBtn}
              onPress={Actions.pop}>
              <Icon
                active
                name="arrow-left"
                style={Style.textWhite}
                type="MaterialCommunityIcons"
              />
            </Button>
          </View>
          <View style={Style.actionBarMiddle}>
            <Text style={Style.actionBarText}>
              {/* {"Low".toUpperCase()} */}
              {/* {data.descs} */}
              {/* {this.state.status_cd.toUpperCase()} */}
              {'Detail Survey'.toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight} />
        </Header>

        <Content style={[Style.layoutContent, {backgroundColor: '#f3f3f3'}]}>
          <View style={{flex: 1, paddingHorizontal: 10}}>
            <Text style={Style.actionBarText}>Survey Detail</Text>
            {/* <Text>{this.state.overview[0].youtube_link}</Text> */}
            {item ? (
              // <Text>{this.state.overview[0].youtube_link}</Text>
              <WebView
                useWebKit={true} // Tambahkan ini
                style={{height: 480}}
                source={{
                  uri:
                    'http://34.87.121.155:2121/cempaka/c_survey_mobile/detail/' +
                    item.publish_id +
                    '/' +
                    item.entity_cd +
                    '/' +
                    item.project_no +
                    '/' +
                    this.props.userId +
                    '/' +
                    this.props.email,
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            ) : (
              <ActivityIndicator />
            )}
          </View>
          <View
            style={{
              paddingTop: 10,
              alignItems: 'center',
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <Button
              style={(Styles.btnMedium, {width: 250})}
              onPress={() => {
                Actions.home();
              }}>
              <Text
                style={{
                  width: '100%',
                  fontSize: 14,
                  alignItems: 'center',
                  textAlign: 'center',
                  letterSpacing: 1,
                }}>
                Home
              </Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  buttonUpload: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    height: 80,
  },
});

//make this component available to the app
export default SurveyDetail;
