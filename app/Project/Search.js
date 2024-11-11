import React from 'react';
import {
  StatusBar,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  Platform,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
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
  View,
  FooterTab,
  Badge,
} from 'native-base';
import RadioGroup from 'react-native-custom-radio-group';
import {Actions} from 'react-native-router-flux';
import {Style} from '../Themes/';
import {Fonts, Metrics, Colors} from '../Themes/';
import Styles from './Style';
import {_storeData, _getData} from '@Component/StoreAsync';
// import Shimmer from 'react-native-shimmer';
import Shimmer from '@Component/Shimmer';
//const {width, height} = Dimensions.get('window')
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import {urlApi} from '@Config/services';

import dummyProject from './dummy_project.json';

export default class Project extends React.Component {
  state = {
    dataTower: [],
    isVisible: false,
    tower_dummy: [],
  };

  async componentDidMount() {
    isMount = true;
    const data = {
      dataTower: await _getData('@UserProject'),
      // dataTower: dummyProject.data,
    };

    console.log('data', data);

    this.setState(data, () => {
      this.getTower();
    });

    console.log('gotoooo', this.props.goTo);

    setTimeout(() => {
      this.setState(data);
    }, 1000);
  }

  getTower = () => {
    this.setState({tower_dummy: dummyProject.data});
    const dbprofile = this.state.dataTower[0].db_profile;
    // const entitycd = this.state.dataTower[0].entity_cd;
    // const projectno = this.state.dataTower[0].project_no;

    console.log('check __getTower', dbprofile);
    {
      isMount
        ? fetch(
            urlApi + 'c_product_info/getProject/' + dbprofile,
            //   "/" +
            //   entitycd +
            //   "/" +
            //   projectno,
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
                _storeData('@getTowers', resData);
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
              console.log('data project yang dipakai', res);
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  componentWillMount() {}
  clickProject(item) {
    console.log('property', item);
    const getTower = this.state.tower;
    console.log('cluster', getTower);
    let isBook = false;
    let isProduct = false;
    if (this.props.goTo == 'BookingPage') {
      isBook = true;
      this.props.goTo = 'ProductProjectPage';
    } else if (this.props.goTo == 'ProductProjectPage') {
      isProduct = true;
    } else {
      isProduct = true;
    }
    console.log('item', this.props.goTo);
    Actions[this.props.goTo.URL_angular]({
      items: item,
      goTo: this.props.goTo,
      dyn: true,
      isBook,
      isProduct,
      getTower: getTower,
    });
    // Actions[this.props.goTo]({items : item,dyn : true});
    // this.setState({ click : true})
  }
  render() {
    return (
      <Container style={Style.bgMain}>
        <Header style={Style.navigation}>
          <StatusBar
            backgroundColor={Colors.statusBarOrange}
            animated
            barStyle="dark-content"
          />

          <View style={Style.actionBarLeft}>
            <Button
              transparent
              style={Style.actionBarBtn}
              onPress={Actions.pop}>
              <Icon
                // active
                // name="arrow-left"
                // style={Style.textWhite}
                // type="MaterialCommunityIcons"
                active
                name="chevron-left"
                type="FontAwesome"
                style={[Style.textWhite, {fontSize: 18}]}
              />
            </Button>
          </View>
          <View style={Style.actionBarMiddle}>
            <Text style={Style.actionBarText}>
              {'Choose Project'.toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight}></View>
        </Header>

        <Content style={Style.layoutContent}>
          <ScrollView scrollEventThrottle={200} directionalLockEnabled={true}>
            <View style={Styles.sectionGrey}>
              {this.state.tower_dummy.length == 0 ? (
                <View style={Styles.city}>
                  <Shimmer autoRun={true} style={Styles.btnCity} />
                  <Shimmer autoRun={true} style={Styles.btnCity} />
                  <Shimmer autoRun={true} style={Styles.btnCity} />
                  <Shimmer autoRun={true} style={Styles.btnCity} />
                </View>
              ) : (
                <View style={Styles.city}>
                  {this.state.tower_dummy.map((item, key) => (
                    <TouchableOpacity
                      key={key}
                      style={Styles.btnCity}
                      onPress={() => this.clickProject(item)}>
                      <Image
                        source={{
                          uri:
                            item.picture_url +
                            '?random_number=' +
                            new Date().getTime(),
                        }}
                        resizeMode={'cover'}
                        style={Styles.btnCityImg}
                      />
                      <View style={Styles.btnCityLocation}>
                        <Text style={Styles.btnCityText}>
                          {item.project_descs}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
