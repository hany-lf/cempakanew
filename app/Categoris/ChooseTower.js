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
import { _storeData, _getData, _navigate } from "@Component/StoreAsync";
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

      tower: []
    };
    console.log("props CLUSTER", this.props);
    console.log("props getTower", this.props.getTower);
  }

  async componentDidMount() {
    isMount = true;

    const data = {
      hd: new Headers({
        Token: await _getData("@Token")
      })
    };
    this.setState(data, () => {
      this.getTower();
    });
  }

  getTower = () => {
    const dataPenting = this.props.items;
    console.log('item',dataPenting);
    const towers = this.props.getTower;
    // console.log('tower',towers);
    // const entity = towers.entity_cd;
    // console.log('entity',entity);
    // const project = towers.project_no;
    // console.log('project',project);
    {
      isMount
        ? fetch(
            urlApi +
              "c_product_info/getTowerData/" +
              dataPenting.db_profile +
              "/" +
              dataPenting.entity_cd +
              "/" +
              dataPenting.project_no,
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
              } else {
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                  alert(res.Pesan);
                });
              }
              console.log("getTowerZ", res);
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  // goTo(item) {
  //   const data = this.props.items;
  //   data["tower"] = item.property_cd;
  //   data["towerDescs"] = item.descs;
  //   console.log('data',data);
  //   // _navigate("UnitEnquiryProjectPage", { prevItems: data })
  //   if(this.props.dyn){
  //     _navigate("UnitEnquiryProjectPage", { prevItems: data });
  //   } else {
  //     _navigate("chooseZone", { items: this.props.items });
  //   }
  // }

  goTo(item) {
    const dataPenting = this.props.items;
    // const takeLotType = this.state.lottype;
    // console.log('ini lot ype', takeLotType);
    // const clusterCode = this.props.clusterCode;
    // const clusterCode = this.state.tower[0].cluster_cd;
    const clusterCode = this.state.tower;
    // const cl_cd = clusterCode.cluster_cd;
    console.log('cek cluster',clusterCode);
    const cl_cd = item.cluster_cd;
    
    console.log('cl_cd',cl_cd);
    // console.log('GET cluster code', dataPenting);
    let url;
    dataPenting["tower"] = item.property_cd;
    dataPenting["towerDescs"] = item.descs;
    // clusterCode["cluster_cd"] = item.cluster_cd;

    console.log("check DATA", dataPenting);
    console.log("get __goTo", this.props.goTo);
    // console.log('get __routeName', this.props.routeName);
    // console.log("check _getLotType", takeLotType);
    // const lotty = this.state.tower;
    // const lottyped = lotty.lot_type;
    // console.log('lotty', lotty);
    // console.log('lottyped', lottyped);

    if (this.props.goTo) {
      if (this.props.goTo.URL == "UnitEnquiryPage") {
        console.log("dyn true", this.props.dyn);
        _navigate("UnitEnquiryProjectPage", {
          prevItems: dataPenting,
          items: this.props.items,
          gotoItems: this.props.goTo,
          // lottypes: takeLotType,
          clusterCode: clusterCode,
          // cl_cd:item.cluster_cd
        });
      } else {
        console.log("dyn false", this.props.dyn);
        _navigate("categoris", {
          items: this.props.items,
          gotoItems: this.props.goTo,
          // lottypes: takeLotType,
          routes: this.props.routes,
          clusterCode: cl_cd
        });
      }
    } else {
      _navigate("categoris", {
        items: this.props.items
      });
    }
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
            <Text style={Style.actionBarText}>
              {"Choose Cluster / Tower".toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight} />
        </Header>

        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}
        >
          <ImageBackground style={Styles.homeBg}>
            <View style={Styles.section}>
              {this.state.tower.length == 0 ? (
                <ActivityIndicator />
              ) : (
                <FlatList
                  data={this.state.tower}
                  style={Styles.item}
                  keyExtractor={item => item.cluster_cd}
                  renderItem={({ item, separators }) => (
                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={() => this.goTo(item)}
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
                            onPress={() =>this.goTo(item)}
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
