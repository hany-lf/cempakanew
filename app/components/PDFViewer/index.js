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
    PermissionsAndroid
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

import { Style, Colors } from "./../../Themes";
import Styles from "./style";
import { Buffer } from 'buffer'
import { _storeData, _getData } from '@Component/StoreAsync';
import { urlApi } from '@Config/services';
import moment from 'moment'
import Pdf from 'react-native-pdf';
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
            page : 1,
            files: [],
            user: "",
            name: "",
            project: [],
            selected: "",
            filebase64: ''
        }

        console.log('props cf', props);
    }

    downloadFile = () =>{
        const item  = this.props.item
        const android = RNFetchBlob.android
        RNFetchBlob
        .config({
            fileCache : true,
            addAndroidDownloads: {
                path: RNFetchBlob.fs.dirs.SDCardDir +'/downloads/'+item.descs+'.pdf',
                useDownloadManager: true,
                notification: true,
                overwrite: true,
                description: 'downloading content...',
                mime: 'application/pdf',
                mediaScannable: true
            }
        })
        .fetch('GET', item.url)
        .then((res) => {
            console.log('The file saved to ', res.path())
            alert('Saved at : '+res.path())
            // android.actionViewIntent(res.path(), 'application/pdf')
            // android.actionViewIntent(RNFetchBlob.fs.dirs.SDCardDir +'/Download/laporan.pdf','application/pdf')
        })
    }

    sendAll= async() =>{
        const item  = this.props.item;
        const android = RNFetchBlob.android
        let pathFile = null;
        file_name = RNFetchBlob.fs.dirs.SDCardDir +'/downloads/'+item.descs+'.pdf'
        
        try {
            const exist = await RNFetchBlob.fs.exists(file_name)
            console.log('exist',exist);
            if (exist) {
                //    await RNFetchBlob.fs.unlink(file_name)
                var base_64 =  RNFS.readFile(file_name, 'base64');
                base_64.then((value) => {
                    
                    actualData = 'data:application/pdf;base64,' + value
                    
                    const shareOptions = {
                        message: 'Please read this brochure first. Thank you.',
                        filename: this.props.item.descs, 
                        url:  actualData,
                        type: 'application/pdf',
                    };
                
                Share.open(shareOptions)
                    .then((res) => { console.log(res) })
                    .catch((err) => { err && console.log(err); });
                })
                
            } else {
                RNFetchBlob
                .config({
                    fileCache : false,  //File cache tdk disimpan di memory, sehingga bisa lakukan transaksi berulang2
                    path: RNFetchBlob.fs.dirs.SDCardDir +'/downloads/'+item.descs+'.pdf',
                    // addAndroidDownloads: {     
                    //     path: RNFetchBlob.fs.dirs.SDCardDir +'/downloads/'+item[0].descs+'.pdf',
                    //     useDownloadManager: true,
                    //     notification: true,
                    //     title: 'Wait..',
                    //     fileCache: false,
                    //     overwrite: true,
                    //     description: 'downloading content...',
                    //     mime: 'application/pdf',
                    //     mediaScannable: true
                    // }
                })
                .fetch('GET', item.url)
                .then((res) => {
                    pathFile = res.path();
                    // file_name = Buffer.from(item.descs).toString('base64');    //Merubah string menjadi base64
                    // this.setState({filebase64: file_name});
                    // this.ShareFile(res.path());
                    return res.readFile("base64");
                })
                .then(base64Data => {
                    
                    actualData = 'data:application/pdf;base64,' + base64Data
                    console.log('actualData',this.state.filebase64);
                    const shareOptions = {
                        subject: item.descs,
                        message: 'Please read this brochure first. Thank you.',
                        filename: item.descs,
                        // social: Share.Social.WHATSAPP,
                        url:  actualData,
                        type: 'application/pdf',
                    };
                
                    Share.open(shareOptions)
                    .then((res) => { console.log(res) })
                    .catch((err) => { err && console.log(err); });

                    return RNFetchBlob.fs.unlink(pathFile);
                })
                .catch((err) => {
                    err && console.log(err);
                })
                    // alert('Saved at : '+res.path())
                    // android.actionViewIntent(res.path(), 'application/pdf')
                    // android.actionViewIntent(RNFetchBlob.fs.dirs.SDCardDir +'/Download/laporan.pdf','application/pdf')
            }
            } catch(err) {
                  console.log("Error", err)
            }
    }

    onValueChange(value) {
        this.setState({
            selected: value
        })
    }
    render() {
        const source = {uri:this.props.item.url,cache:true};
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
                    <View style={Style.actionBarRight}>
                        <Button
                            transparent
                            style={Style.actionBarBtn}
                            onPress={this.downloadFile}
                        >
                            <Icon
                                active
                                name="download"
                                style={Style.textWhite}
                                type="MaterialCommunityIcons"
                            />
                        </Button>
                    </View>
                    <View style={Style.actionBarRight}>
                        <Button 
                            transparent
                            style={Style.actionBarBtn}
                            onPress={this.sendAll}
                        >
                            <Icon
                                // source={require('../../../assets/icon/share.png')}
                                active
                                name="share"
                                style={Style.textWhite}
                                type="MaterialCommunityIcons"
                            />
                        </Button>
                    </View>
                </Header>
                <Pdf
                    
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,pageCount)=>{
                        console.log('ok');
                    }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    style={styles.pdf}/>
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
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        backgroundColor : '#333'
    }

});

//make this component available to the app
export default DownloadPage;
