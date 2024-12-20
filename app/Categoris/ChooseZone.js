//import liraries
import React from 'react';
import {
  StatusBar,
  ActivityIndicator,
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
} from 'native-base';

import NavigationService from '@Service/Navigation';

import PROPERTIES from './Properties';

import {Actions} from 'react-native-router-flux';

import {Style, Colors} from '../Themes/';
import Styles from './Style';
import {_storeData, _getData, _navigate} from '@Component/StoreAsync';
import {urlApi} from '@Config/services';

//const {width, height} = Dimensions.get('window')
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
let isMount = false;

// create a component
class Categoris extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hd: null,

      tower: [],
    };
    console.log('props', this.props);
  }

  async componentDidMount() {
    isMount = true;

    const data = {
      hd: new Headers({
        Token: await _getData('@Token'),
      }),
    };
    this.setState(data, () => {
      this.getTower();
    });
  }

  getTower = () => {
    const item = this.props.items;
    {
      isMount
        ? fetch(
            urlApi +
              'c_product_info/getZone/' +
              item.db_profile +
              '/' +
              item.entity_cd +
              '/' +
              item.project_no +
              '/' +
              item.tower,
            {
              method: 'GET',
              headers: this.state.hd,
            },
          )
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({tower: resData});
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
              console.log('getTower', res);
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  goTo(item) {
    const data = this.props.items;
    data['zoneCd'] = item.zone_cd;
    _navigate('categoris', {items: data});
  }

  render() {
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
              {'Choose Zone'.toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight} />
        </Header>

        {/* <Content
                    style={Style.layoutInner}
                    contentContainerStyle={Style.layoutContent}
                > */}
        <ScrollView>
          <ImageBackground style={Styles.homeBg}>
            <View style={Styles.section}>
              {this.state.tower.length == 0 ? (
                <ActivityIndicator />
              ) : (
                <FlatList
                  data={this.state.tower}
                  style={Styles.item}
                  keyExtractor={item => item.rowID}
                  renderItem={({item, separators}) => (
                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={() => this.goTo(item)}>
                      <View style={Styles.record}>
                        <Image
                          source={{
                            uri: item.picture_url,
                          }}
                          style={Styles.itemImg}
                        />
                        <View style={Styles.itemInfo}>
                          <Text style={Styles.itemTitle}>{item.descs}</Text>
                        </View>
                        <View style={Styles.trash}>
                          <Button
                            transparent
                            onPress={() => {
                              NavigationService.navigate('MemberFavorites');
                            }}>
                            <Icon
                              name="arrow-right"
                              type="FontAwesome"
                              style={Styles.itemIcon}
                            />
                          </Button>
                        </View>
                      </View>
                    </TouchableHighlight>
                  )}
                />
              )}
            </View>
          </ImageBackground>
        </ScrollView>
      </Container>
    );
  }
}

//make this component available to the app
export default Categoris;
