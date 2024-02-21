//import liraries
import React, { Component } from 'react';
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
    NativeModules,
    PermissionsAndroid,
    Linking
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
    Card,
    Textarea,
    Picker
} from "native-base";
import RNFetchBlob from 'rn-fetch-blob'
import { Actions } from "react-native-router-flux";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

import { Style, Colors } from "../Themes";
import Styles from "./Style";

import { _storeData, _getData } from '@Component/StoreAsync';
import { urlApi } from '@Config/services';
import moment from 'moment'
import pdf from 'react-native-pdf';
import Mailer from "react-native-mail";
import Share from 'react-native-share';
var RNFS =  require('react-native-fs');

const DocumentInteractionController = NativeModules.RNDocumentInteractionController;
let isMount = false
// create a component
class DownloadPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            hd: null,

            files: [],
            user: "",
            name: "",
            project: [],
            selected: "",
            base64: []
        }

        console.log('props cf', props);
    }

    async componentDidMount(){
        isMount = true
        const data = {
            hd : new Headers({
            'Token' : await _getData('@Token')
            }),
            user : await _getData('@User'),
            name : await _getData('@UserId'),
            project : await _getData('@UserProject')
        }

        this.setState(data,()=>{
            this.getFile(),
            this.requestStorage()
        })
    }

    requestStorage = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                title: 'IFCA S + want to acces your storage',
                message:
                    'Please be careful with agreement permissions ',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
          console.warn(err);
        }
    }

    getFile = () =>{
        const items = this.props.items
        console.log('items',items);

        {isMount ?
            
            fetch(urlApi+'c_download2/getFile/'+items.db_profile+'/'+items.entity_cd+'/'+items.project_no,{
                method:'POST',
                headers : this.state.hd,
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data
                    this.setState({files:resData})
                } else {
                    this.setState({isLoaded: !this.state.isLoaded},()=>{
                        alert(res.Pesan)
                    });
                }
                console.log('getFiles',this.state.files);
            }).catch((error) => {
                console.log(error);
            })
            
        :null}
    }

    downloadFile = (item) =>{
        const android = RNFetchBlob.android
        Actions.PDFViewer({item : item})

        // RNFetchBlob
        // .config({
        //     fileCache : true,
        //     addAndroidDownloads: {
        //         path: RNFetchBlob.fs.dirs.SDCardDir +'/downloads/'+item.descs+'.pdf',
        //         useDownloadManager: true,
        //         notification: true,
        //         overwrite: true,
        //         description: 'downloading content...',
        //         mime: 'application/pdf',
        //         mediaScannable: true
        //     }
        // })
        // .fetch('GET', urlApi+"pdf/"+item.url)
        // .then((res) => {
        //     console.log('The file saved to ', res.path())
        //     DocumentInteractionController.open(RNFetchBlob.fs.dirs.SDCardDir +'/Download/laporan.pdf')
        //     // android.actionViewIntent(res.path(), 'application/pdf')
        //     // android.actionViewIntent(RNFetchBlob.fs.dirs.SDCardDir +'/Download/laporan.pdf','application/pdf')
        // })
    }

    sendWa(){

        // const noHp = this.state.project[0].wa_no
        const descs = this.state.files[0].url.replace("35.198.219.220","pdf.ifca.co.id");
        Linking.openURL('https://wa.me/?text='+descs)
       
      }
    
    sendEmail(){
        // noHp = '';
        const email_add = this.state.project[0].email_add
        const link = this.state.files[0].url.replace("35.198.219.220","pdf.ifca.co.id");
        const message = "<!DOCTYPE html> <meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1'> <body> <div>  Silakan download brosur pada link di bawah ini <br><br> " + 
                        link + '</div> </body> </html>';
        // alert(email_add);
      
        Mailer.mail(
          {
            subject: "Download Brochure Cempaka",
            recipients: [""],
            ccRecipients: [""],
            bccRecipients: [""],
            body: message,
            isHTML: true,
            // attachment: {
            //     /**
            //      * The absolute path of the file from which to read data.
            //      */
            //     // let source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};
            //   //let source = require('./test.pdf');  // ios only
            //   //let source = {uri:'bundle-assets://test.pdf'};
            //   //path: `${RNFS.DocumentDirectoryPath}/${file.name}`,
            //   //let source = {uri:'file:///sdcard/test.pdf'};
            //     path: '',
            //     /**
            //      * Mime Type: jpg, png, doc, ppt, html, pdf, csv
            //      */
            //     type: 'pdf',
            //     /**
            //      * Optional: Custom filename for attachment
            //      */
            //     name: 'Brochure',
            // }
          },
          (error, event) => {
            Alert.alert(
              error,
              event,
              [
                {
                  text: "Ok",
                  onPress: () => console.log("OK: Email Error Response")
                },
                {
                  text: "Cancel",
                  onPress: () => console.log("CANCEL: Email Error Response")
                }
              ],
              { cancelable: true }
            );
          }
        );
      };

    ShareFile = (path, name) => {
       
        var base_64 =  RNFS.readFile(path, 'base64');
        base_64.then((value) => {
              
            actualData = 'data:application/pdf;base64,' + value
            console.log('actualData',actualData);
            const shareOptions = {
                message: 'Please read this brochure first. Thank you.',
                filename: this.state.files[0].descs, 
                url:  actualData,
                type: 'application/pdf',
            };
        
          Share.open(shareOptions)
            .then((res) => { console.log(res) })
            .catch((err) => { err && console.log(err); });
        })
    }

    onValueChange(value) {
        this.setState({
            selected: value
        })
    }
    render() {
        const item = this.props.items
        let { bookedby, name, email, hp } = this.state
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
                            {"Download".toUpperCase()}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight}></View>
                </Header>
                <Content
                    style={Style.layoutInner}
                    contentContainerStyle={Style.layoutContent}
                >
                    <View>
                        <ScrollView>
                            <View style={Styles.overview}>
                                <Text style={Styles.projectTitle}>{item.title}</Text>
                            </View>

                            <View style={Styles.overview}>
                                <Image
                                    style={[Styles.picWidth,{ height: 190, borderRadius: 10, marginTop: 5 }]}
                                    source={{uri : item.picture_path}}
                                />
                            </View>

                            {this.state.files.map((val,key)=>
                                <View key={key} style={Styles.overviewButton}>
                                    <Button rounded warning full
                                        style={{ marginTop: 16, borderRadius: 10 }}
                                        onPress={()=>this.downloadFile(val)}>
                                        <Icon
                                            active
                                            name="file-pdf"
                                            style={Style.textWhite}
                                            type="MaterialCommunityIcons"
                                        />
                                        <Text style={Styles.textButton}>{val.descs}</Text>
                                    </Button>
                                    {/* <Button rounded warning full
                                    style={{ marginTop: 16, borderRadius: 10 }}
                                    onPress={()=>this.sendWa()}>
                                    <Icon
                                        active
                                        name="file-pdf"
                                        style={Style.textWhite}
                                        type="MaterialCommunityIcons"
                                    />
                                    <Text style={Styles.textButton}>SHARE VIA WA</Text>
                                    </Button>
                                    <Button rounded warning full
                                    style={{ marginTop: 16, borderRadius: 10 }}
                                    onPress={()=>this.sendEmail()}>
                                    <Icon
                                        active
                                        name="file-pdf"
                                        style={Style.textWhite}
                                        type="MaterialCommunityIcons"
                                    />
                                    <Text style={Styles.textButton}>SHARE VIA EMAIL</Text>
                                    </Button> */}
                                    {/* <Button rounded warning full
                                    style={{ marginTop: 16, borderRadius: 10 }}
                                    onPress={()=>this.ShareFile()}>
                                    <Icon
                                        active
                                        name="file-pdf"
                                        style={Style.textWhite}
                                        type="MaterialCommunityIcons"
                                    />
                                    <Text style={Styles.textButton}>SHARE</Text>
                                    </Button> */}
                                </View>
                            )}

                        </ScrollView>
                    </View>
                </Content>
            </Container >
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
export default DownloadPage;
