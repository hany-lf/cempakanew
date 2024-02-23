import React, { Component } from "react";
import {
    StatusBar,
    StyleSheet,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Platform, 
    Dimensions,
    Linking,
    // LinearGradient

} from "react-native";
import {
    Container,
    Header,
    Button,
    Icon,
    Text,
    ListItem,
    List,
    Right,
    Card,
    Content,
    Accordion,
    Label,
    Picker,
    CardItem,
    Left,
    Tab,
    Tabs,
    Item,
    Col,
    // LinearGradient

} from "native-base";
// import {Icon} from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { Style, Colors } from "../Themes";
import { Actions } from "react-native-router-flux";
import TabBar from '@Component/TabBar';
import Styles from "./Style";
import { _storeData, _getData } from '@Component/StoreAsync';
import { urlApi } from "@Config/services";
import Shimmer from '@Component/Shimmer';
import { Input } from "react-native-elements";
import SearchableDropdown from 'react-native-searchable-dropdown';
import RNPickerSelect from 'react-native-picker-select';
import Mailer from "react-native-mail";
// import ListProject from './ListProspect';
import FollowupProspect from './FollowupProspect';
import DetailPage from './DetailPage';
// import styles, { colors } from "./styles/index";
import { TabView, SceneMap } from 'react-native-tab-view';
import moment from "moment";


const navState = {
    index: 0,
    routes: [
        { key: 'detail', title: 'Detail' },
        { key: 'follow', title: 'Follow Up' },


    ]
}

const navScene = {
    detail: DetailPage,
    follow: FollowupProspect,


}
const popRoot = () => {
    Actions.popTo('ListProspect');
    setTimeout(() => Actions.refresh())
        
}
class DetailProspect extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // navState: {
                index: 0,
                routes: [
                    { key: 'detail', title: 'Detail' },
                    { key: 'follow', title: 'Follow Up' },


                ],
            // },

            // navScene: {
            //     detail: DetailPage,
            //     follow: FollowupProspect,


            // },
            // status_cd:'',
            // descs: '',
            // business_id: '',
            // name: '',
            // handphone: '',
            // email_addr: '',
            // tel_no: '',
            datafollowup: [],
        }

       
    }
    async componentDidMount(){
        const dataProspect = this.props.datas;
       console.log('navState',this.state.navState);
        Actions.refresh({ backTitle: () => dataProspect.status_cd });
        const data = {
            status_cd : dataProspect.status_cd,
            descs : dataProspect.descs,
            name: dataProspect.name,
            business_id: dataProspect.business_id,
            handphone: dataProspect.handphone,
            email_addr: dataProspect.email_addr,
            tel_no: dataProspect.tel_no


        }
      console.log('this.props.datas',this.props.datas);
        isMount = true;
        this.setState(data, () => {
            this.getDataFollowUp(this.props.datas)
        });
    }
    componentWillUnmount(){
        // this.setState({isMount:false})
        isMount =false
        this.props.onBack();
      }
      sendEmail(){
        // noHp = '';
        // const email_addr = this.state.detail[0].email_addr
        const email_addr = this.state.email_addr
        // const descs = this.props.items.project_descs
        
        // alert(email_addr);
      
      console.log('email send add', email_addr)
        Mailer.mail(
          {
            // subject: "Description prospect" + descs,
            subject: "Follow Up",
            recipients: [`${email_addr}`],
            ccRecipients: [""],
            bccRecipients: [""],
            body:  "Dear " + this.state.name + ",",
            isHTML: true
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
    sendWa(){

        const noHp = this.state.handphone
        const descs = "Dear " + this.state.name + ","
        Linking.openURL('https://wa.me/+62'+noHp+'?text='+descs)
        
    }
    callphone(){
        // const noHp = this.state.detail[0].handphone
        const noHp = this.state.handphone
        // alert(noHp);
        // const noHp = "82236203286"
        Linking.openURL('tel:'+noHp)
        console.log('tel no', noHp);
    }
 
    getDataFollowUp = () => {
       
        const business_id = this.state.business_id
        // const {status_cd} = this.props.datas
        // const {email} = this.state
        console.log('business id', business_id);
        {isMount ?
        fetch(urlApi + 'c_follow_up/getTableActivity/IFCAPB2/',{
            method:'POST',
            body: JSON.stringify({business_id})
            // headers : this.state.hd,
        }).then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                const resData = res.Data
               
               
                this.setState({datafollowup:resData});
            } else {
                this.setState({isLoaded: !this.state.isLoaded},()=>{
                    // alert(res.Pesan)
                });
            }
            
        }).catch((error) => {
            console.log(error);
        })
        :null}
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
                            onPress={popRoot}
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
                            {"Detail & Follow Up".toUpperCase()}
                            {/* {dataProspect.descs.toUpperCase()} */}
                            {/* {this.state.status_cd.toUpperCase()}
                            {this.state.descs.toUpperCase()} */}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight} />
                   
                </Header>

                
                    
                    
                    <LinearGradient colors={[ "#6dd5ed", Colors.twitter]} //#2193b0
                        startPoint={{ x: 0, y: 1 }}
                        endPoint={{ x: 0, y: 0 }} style={{backgroundColor: Colors.twitter, height: 130, paddingBottom: 30, paddingTop: 30, marginBottom: 0}}>
                    
                    {/* {this.gradient} */}
                        {/* <TouchableOpacity style={{paddingHorizontal: 10}}> */}
                            {/* <Card style={{
                                height: 100,
                                backgroundColor: 'white',
                                shadowOffset: { width: 1, height: 1 },
                                shadowColor: "#37BEB7",
                                shadowOpacity: 0.5,
                                elevation: 5,
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 10,
                                top: 25,
                                // flex: 1, 
                                alignItems: "flex-start",
                                
                                // backgroundColor: 'red'
                            }} 
                        
                            > */}
                            {/* <View style={{flexDirection: "row"}}>
                                <View style={{ alignSelf: "center",width: '100%'}}>
                                    <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                                        <Label style={{paddingHorizontal: 5, bottom: 0}}>
                                                <Text style={{fontWeight:'bold', right: 10, fontSize: 22,color: "#FFFFFF"}}>{this.state.name}</Text>
                                        </Label>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                                        <Label style={{paddingHorizontal: 5, bottom: 0}}>
                                                <Text style={{fontWeight:'bold',right: 10, fontSize: 13, color:  "#FFFFFF"}}># {this.state.business_id}</Text>
                                        </Label>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center', paddingTop: 10, paddingBottom: 50}}>
                                        <TouchableHighlight onPress={()=>this.sendEmail()}>
                                            <Icon  name="envelope" style={{fontSize: 17,color: "#FFFFFF", marginHorizontal:20}} type="FontAwesome" />

                                        </TouchableHighlight>
                                                            
                                        <TouchableHighlight onPress={()=>this.callphone()}>
                                            <Icon  name="phone" style={{fontSize: 19,color: "#FFFFFF", marginHorizontal:20}} type="FontAwesome" />

                                        </TouchableHighlight>
                                        <TouchableHighlight onPress={()=>this.sendWa()}>
                                            <Icon  name="whatsapp" style={{fontSize: 22,color: "#FFFFFF", marginHorizontal:20}} type="FontAwesome" />

                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View> */}
                            {/* </Card> */}
                        {/* </TouchableOpacity> */}
                    </LinearGradient>
                
                    
                    {/* <View style={{borderBottomColor: Colors.bluegreyUrban, borderBottomWidth: 1,marginHorizontal:15, opacity: 70, paddingBottom: 5}}>
                    </View> */}
                            
                    <TabBar navState={this.state} navScene={navScene} onIndexChange={index => this.setState({index })} style={{paddingTop: 10}}/>
            </Container>

        );
    }
}
export default DetailProspect;

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
});