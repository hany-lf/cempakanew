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
  FlatList,
  Modal,
  ListView,
  Alert,
  Clipboard
  // Picker
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
  Badge,
  Picker,
  Col,
  ListItem,
  Label
} from "native-base";

// import NavigationService from "@Service/Navigation";

import { Actions } from "react-native-router-flux";

import { Style, Colors, Fonts } from "../Themes/";
import Styles from "./Style";
import { _storeData, _getData, _navigate } from "@Component/StoreAsync";
import { urlApi } from "@Config/services";
import numFormat from "@Component/numFormat";
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "rn-fetch-blob";
import moment from "moment";
// import ImageViewer from 'react-native-image-zoom-viewer';

//const {width, height} = Dimensions.get('window')
// const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
//     "window"
// );
const { height, width } = Dimensions.get("window");
let isMount = false;

class FormPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: {},
      seconds: 86400,
      currentDate: new Date(),
      markedDate: moment(new Date()).format("YYYY-MM-DD"),
      // markedTanggal : moment(new Date().format("H:m:s")),
      jam: new Date().getHours(), //Current Hours
      menit: new Date().getMinutes(), //Current Minutes
      detik: new Date().getSeconds()
      // rekening: 'tes'
      // day:'',
      // date:''
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.confirm = this.confirm.bind(this);
    // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    // this.state = {

    // };
    // console.log()
    isMount = true;

    // this.showAlert = this.showAlert.bind(this);
  }

  async componentDidMount() {
    isMount = true;
    const dataPrev = this.props.prevItems;
    console.log("dataprev", dataPrev);
    // const arrayData = dataPrev.arrayData;
    // console.log('arrayData',arrayData);

    const data = {
      fullname: this.props.prevItems.fullname,
      total: this.props.prevItems.amts,
      rekening: "24213241243112"
    };
    console.log("data", data);

    this.setState(data, () => {
      this.startTimer();
    });

    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  componentWillUnmount() {
    // this.setState({isMount:false})
    isMount = false;
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    });

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }

  addLeadingZeros(value) {
    value = String(value);
    while (value.length < 2) {
      value = "0" + value;
    }
    return value;
  }

  set_Text_Into_Clipboard = async () => {
    await Clipboard.setString(this.state.rekening);
  };

  confirm = () => {
    // alert('next')
    Actions.home();
    // _navigate("UploadBukti", { prevItems: frmData });
  };

  render() {
    const today = this.state.currentDate;
    const day = moment(today).format("dddd");
    const date = moment(today).format("D MMMM YYYY");
    // const tanggal = moment(today).format("H:m:s");
    const jam = this.state.jam;
    const menit = this.state.menit;
    const detik = this.state.detik;

    return (
      <Container style={Style.bgMain}>
        <StatusBar
          backgroundColor={Colors.statusBarNavy}
          animated
          barStyle="light-content"
        />
        {/* <Header style={[Style.navigation,{backgroundColor: 'transparent'}]}>
                    <StatusBar
                        backgroundColor={Colors.statusBarNavy}
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
                         
                            {this.state.title}
                            
                        </Text>
                        <Text style={Style.actionBarText}>
                        
                            {this.state.towerDescs}
                            
                        </Text>
                        
                    </View>
                    <View style={Style.actionBarRight} />
                </Header> */}
        <View style={{ top: 25, paddingBottom: 35 }}>
          <View style={{ paddingLeft: 15, paddingTop: 15 }}>
            <Button
              transparent
              style={Style.actionBarBtn}
              onPress={Actions.pop}
            >
              <Icon
                active
                name="arrow-left"
                // style={[Style.textWhite,{fontSize: 28}]}
                style={{ color: "#000" }}
                type="MaterialCommunityIcons"
              />
            </Button>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 40 }}>
          <View>
            <View>
              <Text
                style={{
                  fontWeight: "900",
                  color: Colors.goldUrban,
                  fontSize: 16,
                  textAlign: "center",
                  fontFamily: Fonts.type.proximaNovaBold,
                  letterSpacing: 1
                }}
                // style={[Style.actionBarText,{fontWeight: 'bold', fontFamily:Fonts.type.proximaNovaBold}]}
              >
                BANK TRANSFER
                {/* {this.state.projectdesc} */}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.type.proximaNovaBold,
                  fontSize: 11,
                  letterSpacing: 1,
                  textAlign: "center"
                }}
              >
                {/* SUNDAY, 13 JANUARY 2020 */}
                {day}, {date}
              </Text>
              {/* <Text>{jam}:{menit}</Text> */}
            </View>
          </View>

          <View style={{ paddingBottom: 15, marginTop: 35 }}>
            <Text
              style={{
                fontWeight: "900",
                color: Colors.goldUrban,
                fontSize: 16,
                textAlign: "center",
                fontFamily: Fonts.type.proximaNovaBold,
                letterSpacing: 1,
                textTransform: "uppercase"
              }}
            >
              {/* {this.state.fullname} */}
              {this.state.fullname}
            </Text>

            <Text
              style={{
                fontWeight: "400",
                // color: Colors.goldUrban ,
                fontSize: 15,
                textAlign: "center",
                fontFamily: Fonts.type.proximaNovaReg,
                letterSpacing: 1
              }}
            >
              PROCESS YOUR PAYMENT SOON
            </Text>
          </View>

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <View
                style={{ flexDirection: "column", justifyContent: "center" }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.type.proximaNovaBold,
                    fontSize: 26,
                    color: Colors.redWine,
                    textAlign: "center"
                  }}
                >
                  {this.addLeadingZeros(this.state.time.h)}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.type.proximaNovaBold,
                    fontSize: 12,
                    color: Colors.redWine,
                    textAlign: "center",
                    width: 60,
                    paddingTop: 10
                  }}
                >
                  HOUR
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: Fonts.type.proximaNovaBold,
                    fontSize: 26,
                    color: Colors.redWine,
                    textAlign: "center"
                  }}
                >
                  :
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: Fonts.type.proximaNovaBold,
                    fontSize: 26,
                    color: Colors.redWine,
                    textAlign: "center",
                    paddingLeft: 14
                  }}
                >
                  {this.addLeadingZeros(this.state.time.m)} :
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.type.proximaNovaBold,
                    fontSize: 12,
                    color: Colors.redWine,
                    textAlign: "center",
                    width: 57,
                    paddingTop: 10
                  }}
                >
                  MINUTES
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: Fonts.type.proximaNovaBold,
                    fontSize: 26,
                    color: Colors.redWine,
                    textAlign: "center"
                  }}
                >
                  {this.addLeadingZeros(this.state.time.s)}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.type.proximaNovaBold,
                    fontSize: 12,
                    color: Colors.redWine,
                    textAlign: "center",
                    width: 60,
                    paddingTop: 10
                  }}
                >
                  SECONDS
                </Text>
              </View>
            </View>
          </View>
          <View style={{ paddingVertical: 10, paddingTop: 60 }}>
            <Image
              source={require("@Asset/images/icon/booking.png")}
              style={{ alignSelf: "center" }}
            />
          </View>
          <View
            style={{
              alignSelf: "center",
              flexDirection: "column",
              paddingVertical: 10
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: Fonts.type.proximaNovaBold,
                fontSize: 15
              }}
            >
              BANK BCA
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: Fonts.type.proximaNovaReg,
                fontSize: 15
              }}
            >
              {this.state.rekening}
            </Text>
            <TouchableOpacity onPress={this.set_Text_Into_Clipboard}>
              <Text
                style={{
                  alignSelf: "center",
                  fontFamily: Fonts.type.proximaNovaReg,
                  fontSize: 14,
                  color: Colors.twitter,
                  borderBottomColor: Colors.twitter,
                  borderBottomWidth: 1,
                  width: 30
                }}
              >
                copy
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignSelf: "center",
              flexDirection: "column",
              paddingVertical: 10
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: Fonts.type.proximaNovaBold,
                fontSize: 15
              }}
            >
              ACCOUNT NAME
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: Fonts.type.proximaNovaReg,
                fontSize: 15
              }}
            >
              PT. CEMPAKA GROUP
            </Text>
          </View>

          <View
            style={{
              alignSelf: "center",
              flexDirection: "column",
              paddingVertical: 10,
              paddingTop: 30
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: Fonts.type.proximaNovaBold,
                fontSize: 12,
                letterSpacing: 1
              }}
            >
              AMOUNT OF BILL TO BE PAID
            </Text>
            <Text
              style={{
                fontFamily: Fonts.type.proximaNovaBold,
                fontSize: 20,
                color: Colors.redWine,
                textAlign: "center"
              }}
            >
              Rp. {numFormat(this.state.total)},-
            </Text>
          </View>

          <View>
            <View style={{ paddingTop: 50 }}>
              <Button style={Styles.btnMedium} onPress={() => this.confirm()}>
                <Text
                  style={{
                    width: "100%",
                    fontSize: 14,
                    alignItems: "center",
                    textAlign: "center",
                    fontFamily: Fonts.type.proximaNovaBold,
                    letterSpacing: 1
                  }}
                >
                  Confirm
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
        {/* <ScrollView style={{height: '100%'}}>
                    
                </ScrollView> */}
      </Container>
    );
  }
}

//make this component available to the app
export default FormPayment;
