//import liraries
import React from "react";
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
  FlatList
} from "react-native";
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
  Badge
} from "native-base";

import NavigationService from "@Service/Navigation";

import PROPERTIES from "./Properties";

import { Actions } from "react-native-router-flux";

import { Style, Colors } from "../Themes/";
import Styles from "./Style";
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config/services";

//const {width, height} = Dimensions.get('window')
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);
let isMount = false;

// create a component
class Categoris extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hd: null,

      properties: [],
      tower: []
    };

    console.log("props", props);
    console.log("props _getCLUSTER", props.clusterCode);
  }

  async componentDidMount() {
    isMount = true;

    const data = {
      hd: new Headers({
        Token: await _getData("@Token")
      })
    };
    this.setState(data, () => {
      this.getLotType();
      this.getTower();
    });
  }

  getLotType = () => {
    const item = this.props.items;
    console.log('itemproper', item);
    // console.log('item lot type', item);
    const clusterCode = this.props.clusterCode;
    console.log("cluster code", clusterCode);
    {
      isMount
        ? fetch(
            urlApi +
              "c_product_info/getLotType/" +
              item.db_profile +
              "/" +
              item.entity_cd +
              "/" +
              item.project_no +
              "/" +
              clusterCode,
              "/" +
              item.property_cd,


            {
              method: "GET",
              headers: this.state.hd
            }
          )
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({ properties: resData });
                _storeData("@getLotType", resData);
              } else {
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                  alert(res.Pesan);
                });
              }
              console.log("getLotType", res);
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  getTower = () => {
    const item = this.props.items;
    console.log('itm',item);
    const clusterCode = this.props.clusterCode;
    console.log("cluster code gettower", clusterCode);
    {
      isMount
        ? fetch(
            urlApi +
              "c_product_info/getTower/" +
              item.db_profile +
              "/" +
              item.entity_cd +
              "/" +
              item.project_no +
              "/" +
              clusterCode,
            {
              method: "GET",
              headers: this.state.hd
            }
          )
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({ tower: resData });
                _storeData("@getTowerz", resData);
              } else {
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                  alert(res.Pesan);
                });
              }
              console.log("getTower", res);
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  clickUnitgoris(item) {
    console.log('item',item)
    console.log('props item', this.props.items)
    const properties = this.state.properties;
    // console.log('propertis', properties);
    // const lottype = properties[0].lot_type;
    // console.log("lot type", lottype);
    //kalo array [0] yg keluar 'KIOS', sedangkan aku maunya yg keluar adalah '2BR' yg ada di array [2]

    // const propertycd = this.state.tower;
    // const propsCode = propertycd[0].property_cd;
    // console.log('propertycd', propertycd);
    // console.log("propsCode", propsCode);
    const clusterCode = this.props.clusterCode;
   
    Actions.unitdetail({
      items: item,
      prevItems: this.props.items,
      clusterCode: clusterCode,
      goToItem: this.props.gotoItems
      // lottype: lottype,
      // propsCode: propsCode
    });
    this.setState({ click : true})
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
              onPress={Actions.pop}
            >
              <Icon
                active
                name="arrow-left"
                style={Style.textWhite}
                type="MaterialCommunityIcons"
              />
            </Button>
          </View>
          <View style={Style.actionBarMiddle}>
            <Text style={Style.actionBarText}>{"Property Type".toUpperCase()}</Text>
          </View>
          <View style={Style.actionBarRight}></View>
        </Header>

        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}
        >
          <ImageBackground style={Styles.homeBg}>
            {/* <Text>tres</Text> */}
            <View style={Styles.section}>
              {this.state.tower.length == 0 ? (
                <ActivityIndicator />
              ) : (
                <FlatList
                  data={this.state.tower}
                  style={Styles.item}
                  keyExtractor={item => item.rowID}
                  renderItem={({ item, separators }) => (
                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={() => this.clickUnitgoris(item)}
                    >
                      <View style={Styles.record}>
                        <Image
                          source={{ uri: item.picture_url }}
                          style={Styles.itemImg}
                        />
                        <View style={Styles.itemInfo}>
                          <Text style={Styles.itemTitle}>{item.descs}</Text>
                        </View>
                        <View style={Styles.trash}>
                          <Button
                            transparent
                            onPress={() => this.clickUnitgoris(item)}
                          >
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
        </Content>
      </Container>
    );
  }
}

//make this component available to the app
export default Categoris;
