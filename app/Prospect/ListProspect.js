import React, {Component} from 'react';
// import jspdf from  '@Component/jspdf-master';
// import html2canvas from  '@Component/html2canvas';
// import html2canvas from 'html2canvas';
// import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import RNFetchBlob from 'rn-fetch-blob';
// var RNFS = require('react-native-fs');
// import Permissions from 'react-native-permissions';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  PermissionsAndroid,
  Platform,
  LogBox
} from 'react-native';
import {
  Container,
  Content,
  Header,
  Button,
  Icon,
  Text,
  ListItem,
  List,
  Right,
  Card,
} from 'native-base';
// import {Icon} from "react-native-elements";
import {Style, Colors} from '../Themes';
import {Actions} from 'react-native-router-flux';
import TabBar from '@Component/TabBar';
import Styles from './Style';
import {_storeData, _getData} from '@Component/StoreAsync';
import {urlApi} from '@Config/services';
import Shimmer from '@Component/Shimmer';
// import styles, { colors } from "./styles/index";

// const navState = {
//     index: 0,
//     routes: [
//       { key: 'nup', title: 'NUP Online' },
//       { key: 'status', title: 'Status' },
//       { key: 'history', title: 'History' },
//     ]
// }

// const navScene = {
//     nup: NUP,
//     status: NUPStatus,
//     history : NUPHistory
// }

class ListProspect extends Component {
  // isMount = false;

  constructor(props) {
    super(props);

    this.state = {
      status_cd: '',
      email: '',
      detail: [],
      handphone: '',
      business_id: '',
      descs: '',
      filePath: '',
      entryDate: [],
    };
  }

  async componentDidMount() {
       LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    // if(Platform.OS == "android"){
    //     try
    //     {
    //         await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //             {
    //                 title: 'Storage Permission',
    //                 message: 'Write Storage Permission Need',
    //                 buttonNegative: 'Cancel',
    //                 buttonPositive: 'OK',
    //             },
    //         );
    //     } catch(err) {
    //         console.warn(err);
    //     }
    // }

    Actions.refresh({backTitle: () => this.props.status_cd});
    const data = {
      status_cd: this.props.datas.status_cd,
      descs: this.props.datas.descs,
      email: await _getData('@User'),
      business_id: this.state.business_id,
    };

    isMount = true;
    this.setState(data, () => {
      this.getDataListProspect(this.props.datas);
      // this.printDocument();
      // this.getDataFollowUp(this.props.datas)
      // this.getStatus()
    });
  }

  componentWillUnmount() {
    // this.setState({isMount:false})
    isMount = false;
  }

  askPermission() {
    var that = this;
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'CameraExample App External Storage Write Permission',
            message:
              'CameraExample App needs access to Storage data in your SD Card ',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //If WRITE_EXTERNAL_STORAGE Permission is granted
          askPermission; //changing the state to show Create PDF option
          that.createPDF();
        } else {
          alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        alert('Write permission err', err);
        console.warn(err);
      }
    }
    //Calling the External Write permission function
    if (Platform.OS === 'android') {
      requestExternalWritePermission();
    } else {
      this.createPDF();
    }
  }

  async createPDF() {
    let options = {
      //Content to print
      html:
        '<h1 style="text-align: center;"><strong>Hello Guys</strong></h1><p style="text-align: center;">Here is an example of pdf Print in React Native</p><p style="text-align: center;"><strong>Team About React</strong></p>' +
        this.state.email,
      //File Name
      fileName: 'test',
      //File directory
      directory: 'downloads',
    };
    let file = await RNHTMLtoPDF.convert(options);
    console.log('file', file);
    this.setState({filePath: file.filePath});
  }

  //   printDocument = () =>
  //   {
  //       var docsDir = PDFLib.getDocumentsDirectory();
  //       const pdfPath = `${docsDir}`;
  //       console.log('docsDir',docsDir);

  //       const page1 = PDFPage
  //       .create()
  //       .setMediaBox(200, 200)
  //       .drawText('You can add text and rectangles to the PDF!', {
  //         x: 5,
  //         y: 235,
  //         color: '#007386',
  //       })
  //       .drawRectangle({
  //         x: 25,
  //         y: 25,
  //         width: 150,
  //         height: 150,
  //         color: '#FF99CC',
  //       })
  //       .drawRectangle({
  //         x: 75,
  //         y: 75,
  //         width: 50,
  //         height: 50,
  //         color: '#99FFCC',
  //       });

  //       PDFDocument
  //       .create(pdfPath)
  //       .addPages(page1)
  //       .write() // Returns a promise that resolves with the PDF's path
  //       .then(path => {
  //           console.log('PDF created at: ' + path);
  //           // Do stuff with your shiny new PDF!
  //       });

  //       // const android = RNFetchBlob.android
  //       // RNFetchBlob

  //       // .fetch('GET', this.props.datas.descs)
  //       // .then((res) => {
  //       //     console.log('The file saved to ', res.path())
  //       //     alert('Saved at : '+res.path())
  //       //     // android.actionViewIntent(res.path(), 'application/pdf')
  //       //     // android.actionViewIntent(RNFetchBlob.fs.dirs.SDCardDir +'/Download/laporan.pdf','application/pdf')
  //       // })

  //   }

  getDataListProspect = () => {
    const {status_cd} = this.props.datas;
    const {email} = this.state;
    const {business_id} = this.state;
    // alert(isMount);
    {
      isMount
        ? fetch(urlApi + 'c_prospect/getProspect/IFCAPB/', {
            method: 'POST',
            body: JSON.stringify({status_cd, email, business_id}),
            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;

                this.setState({detail: resData});
                this.setState({entryDate: res.DataFollow});
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  getDataFollowUp = () => {
    // const {status_cd} = this.props.datas
    // const {email} = this.state
    // alert(isMount);
    {
      isMount
        ? fetch(urlApi + 'c_prospect/getProspect/IFCAPB/', {
            method: 'POST',
            body: JSON.stringify({status_cd, email}),
            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;

                console.log('datalistprospect', res);
                this.setState({detail: resData});
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  tes = () => {
    alert('tes');
  };
  receiveProps = () => {
    // this.tes();
    isMount = true;
    // alert('refresh');
    this.getDataListProspect(this.props.datas);
  };

  async DetailProspect(data) {
    console.log('data detail', data);
    _storeData('statusProspect', data);
    Actions.Detail({datas: data, onBack: () => this.receiveProps()});
    // { onBack: () => this.receiveProps() }
    // Actions.IndexProspect
    this.setState({click: true});
  }

  async FollowUp(data) {
    _storeData('statusProspect', data);
    Actions.FollowupProspect({datas: data, onBack: () => this.receiveProps()});
    // { onBack: () => this.receiveProps() }
    // Actions.IndexProspect
    this.setState({click: true});
  }

  callphone() {
    const noHp = this.state.detail[0].handphone;
    // alert(noHp);
    // const noHp = "82236203286"
    Linking.openURL('tel:' + noHp);
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
              {/* {"Low".toUpperCase()} */}
              {/* {data.descs} */}
              {/* {this.state.status_cd.toUpperCase()} */}
              {this.state.descs.toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight} />
        </Header>

        {/* <View> */}
        <Content style={[Style.layoutContent, {backgroundColor: '#f3f3f3'}]}>
          <ScrollView scrollEventThrottle={200} directionalLockEnabled={true}>
            <View>
              <List style={{paddingVertical: 10}}>
                {this.state.detail.map((data, key) => (
                  //  <TouchableOpacity key={key} style={navStyles.newsContainer} onPress={()=>this.DetailProspect(data)}>
                  <ListItem
                    style={navStyles.newsContainer}
                    onPress={() => this.DetailProspect(data)}
                    key={key}>
                    <View style={{alignSelf: 'flex-start'}}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Regular',
                          alignSelf: 'flex-start',
                          color: '#333',
                          marginBottom: 5,
                          fontSize: 15,
                        }}>
                        {data.name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Regular',
                          alignSelf: 'flex-start',
                          color: '#333',
                          marginBottom: 5,
                          fontSize: 15,
                        }}>
                        {data.handphone}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Regular',
                          alignSelf: 'flex-start',
                          color: '#333',
                          marginBottom: 5,
                          fontSize: 15,
                        }}>
                        {data.business_id}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Regular',
                          alignSelf: 'flex-start',
                          color: '#333',
                          marginBottom: 5,
                          fontSize: 15,
                        }}>
                        Follow Up Date : {data.entry_date}
                      </Text>
                    </View>
                    <Right style={{position: 'absolute', right: 30}}>
                      <Icon
                        color="green"
                        name="phone"
                        style={{fontSize: 30, color: 'green'}}
                        type="FontAwesome"
                        onPress={() => this.callphone()}
                      />
                    </Right>
                  </ListItem>
                  // </TouchableOpacity>
                ))}
              </List>
            </View>
          </ScrollView>
        </Content>
        {/* </View> */}

        {/* <Button
                            // transparent
                            // style={Style.actionBarBtn}
                            onPress={this.askPermission.bind(this)}
                        > */}
        {/* <Text>Download PDF</Text> */}
        {/* <Icon
                                active
                                name="arrow-left"
                                style={Style.textWhite}
                                type="MaterialCommunityIcons"
                            /> */}
        {/* </Button>   */}
      </Container>
    );
  }
}
export default ListProspect;

const navStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  tabItem: {
    // flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  newsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 5,
    backgroundColor: '#fff',
    marginRight: 15,
  },
});
