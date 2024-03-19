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
    TextInput
    

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
    
    // DatePicker,
    CardItem,
    Left,
   
    Item,
} from "native-base";
// import {Icon} from "react-native-elements";
import { Style, Colors } from "../Themes";
import { Actions } from "react-native-router-flux";
import TabBar from '@Component/TabBar';
import Styles from "./Style";
import {_storeData,_getData} from '@Component/StoreAsync';
import { urlApi } from "@Config/services";
import Shimmer from '@Component/Shimmer';
import { Input } from "react-native-elements";
import moment from "moment";
// import DateTimePicker from "react-native-modal-datetime-picker";
// import DatePicker from "react-native-modal-datetime-picker";
import { DateInput, MinuteInput, DatetimeInput } from "../components/Input";
import Timer from "jest-jasmine2/build/jasmine/Timer";

// import styles, { colors } from "./styles/index";




   


class DetailFollowUp extends Component {
    constructor(props){
        super(props)

        this.state = {
           business_id: '',
           remarks: '',
           remarks2: '',
        //    contact_date: '',
        //    time_prospect: '',
        
           duration_hour: '',
           duration_minute: '',

           time_prospect: new Date(2018, 11, 1, 0, 0, 0),
           // duration:new Date('00:00'),
           duration: new Date(Date.UTC(2018, 11, 1, 0, 0, 0)),
           contact_date: new Date(),
           project: [],
           detail:[],
           entryDate:[],
           data_follow: [],
           status_cd : '',
            email: '',
        }
        console.log('props detail follow up',props);
    }
    
    async componentDidMount(){
        Actions.refresh({ backTitle: () => this.props.datas.business_id });

        const dh = parseInt(this.props.datas.duration_hour);
        const dm = parseInt(this.props.datas.duration_minute);
        const dur = new Date(2018, 11, 1, dh, dm, 0);

        const tph = parseInt(this.props.datas.time_prospect.slice(0,2));
        const tpm = parseInt(this.props.datas.time_prospect.slice(3,5));
        const tm = new Date(2018, 11, 1, tph, tpm, 0);
       
        const data = {
            business_id : this.props.datas.business_id,
            remarks : this.props.datas.activity_descs,
            // remarks2 : this.props.datas.remarks2,
            contact_date: this.props.datas.contact_date,
            time_prospect: tm,
            duration : dur,
            activity_id: this.props.datas.activity_id,
            project : await _getData('@UserProject'),
            audit_user : await _getData('@UserId'),
            data_follow : await _getData('statusProspect'),
        }
        
        isMount = true;
        this.setState(data, () => {
           this.getDataListProspect()
            // this.getDataFollowUp(this.props.datas)
            // this.getStatus()
        });
    };

    handleDateChange = (name, time) => {
        this.setState({ [name]: time });
    };
    
    popRoot = async() => {
        const data_follow = await _getData('statusProspect');
        Actions.popTo('Detail', {datas:data_follow, onBack: () => this.receiveProps()});
        setTimeout(() => Actions.refresh())
            
    }
    receiveProps = () =>{
        // this.tes();
        isMount=true;
        // alert('refresh');
        this.getDataListProspect();
    }

    getDataListProspect = async() => {
        
        const status_cd = this.state.data_follow.status_cd
        const email = await _getData("@User")
        const business_id = ''
        // alert(isMount);
        {isMount ?
        fetch(urlApi + 'c_prospect/getprospect/IFCAPB/',{
            method:'POST',
            body: JSON.stringify({status_cd,email, business_id})
            // headers : this.state.hd,
        }).then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                const resData = res.Data
               
                this.setState({detail:resData});
                this.setState({entryDate:res.DataFollow});
            } else {
                this.setState({isLoaded: !this.state.isLoaded},()=>{
                    alert(res.Pesan)
                });
            }
            
        }).catch((error) => {
            console.log(error);
        })
        :null}
    }

    updateFollowUp = () => {
        const {
            activity_id,
            //tab2
            // entity_cd,
            // project_cd,
            project,
            business_id,
            contact_date,
            // follow_up_date,
            time_prospect,
            // contact_person,
            // duration_hour,
            // duration_minute,
            duration,
            remarks,
            // remarks2,
            audit_user,
            // audit_user,
            data_follow
            
            
        } = this.state

       

        const formData = {
            activity_id: activity_id,
            entity_cd: project[0].entity_cd,
            project_no: project[0].project_no,
            business_id: business_id,
            // audit_user: audit_user,
            // contact_date: contact_date,
            // contact_person: 'null',
          
            contact_date: moment(contact_date).format("YYYY-MM-DD"),
            follow_up_date: moment(contact_date).format("YYYY-MM-DD HH:mm:ss"),
            time_prospect:  moment(time_prospect).format("HH:mm"),
            // time_prospect: moment(time_prospect).format("YYYY/MM/DD HH:mm:ss"),
            duration_hour: moment(duration).format("HH"),
            duration_minute: moment(duration).format("mm"),
            remarks: remarks,
            audit_user: audit_user,
            data_follow: data_follow
            // remarks2: remarks2

        }
        
        fetch(urlApi+'c_follow_up/updateActivity/IFCAPB2/',{
            method : "POST",
            body :JSON.stringify(formData),
            // headers :{
            //     Accept: 'application/json',
            //     'Content-Type': 'application/json',
            //     'Token' : this.state.token
            // }
        })
        .then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                alert(res.Pesan)
                // _storeData('@Name',name)
                // _storeData('@Handphone',hp)
                // _storeData('@ProfileUpdate',true)
                _storeData("statusProspect",data_follow);
            }
            
           
            // _storeData("statusProspect",data);
            Actions.Detail({datas:data_follow, onBack: () => this.receiveProps() });
            // Actions.popTo( 'Detail', {datas:data_follow, onBack: () => this.receiveProps()});
            // Actions.replace('Detail');
            // setTimeout(() => Actions.refresh({datas:data_follow}))
            // Actions.home();
            // Actions.reset('ProspectPage');
           
        }).catch((error) => {
            console.log(error);
        });
       
    } 

    deleteFollowUp = () => {
        const {
            activity_id,
            data_follow
        } = this.state

        const formData = {
            activity_id: activity_id,
            data_follow: data_follow
        }
        fetch(urlApi+'c_follow_up/deleteActivity/IFCAPB2/',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                alert(res.Pesan)
            }
            Actions.Detail({datas:data_follow, onBack: () => this.receiveProps() });

        }).catch((error) => {
            console.log(error);
        });
       
    }

    render() {
        // const contact_date = this.state.contact_date
        // const date = moment(Date(this.state.contact_date)).format("DD/MM/YYYY");
        // console.log('date',date);
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
                            {/* {"Low".toUpperCase()} */}
                            {/* {data.descs} */}
                            {/* {this.state.status_cd.toUpperCase()} */}
                            {/* {this.state.descs.toUpperCase()} */}
                            Update / Delete Follow Up
                        </Text>
                    </View>
                    <View style={Style.actionBarRight} />

                </Header>
               
                <Content>
                        {this.state.props == 0 ?
                            <ActivityIndicator />
                        : 
                    <View>
                        
                        <View style={{marginTop:20,flex: 1,paddingHorizontal: 10}}  >
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" />
                                <Text style={Styles.overviewTitles}>Prospect ID</Text>
                            </View>
                            <TextInput style={Styles.textInput_medium} placeholder={'Prospect ID'} value={this.state.business_id} />
                        </View>
                        <View style={Styles.overview}>
                            <View style={Styles.subWrapLarge}>
                                <DatetimeInput
                                    name="contact_date"
                                    label="Date Prospect"
                                    mode="date"
                                    onChange={this.handleDateChange}
                                    value={this.state.contact_date}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
                            <View style={Styles.subWrap}>
                                <DateInput
                                    name="time_prospect"
                                    label="Time Prospect"
                                    mode="time"
                                    onChange={this.handleDateChange}
                                    value={this.state.time_prospect}
                                />
                            </View>
                            <View style={Styles.subWrap}>
                                <DateInput
                                    name="duration"
                                    label="Duration hr. mn."
                                    mode="time"
                                    onChange={this.handleDateChange}
                                    value={this.state.duration}
                                />
                            </View>
                        </View>
                        <View style={Styles.overview}  >
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" />
                                <Text style={Styles.overviewTitles}>Description</Text>
                            </View>
                            <TextInput style={Styles.textInput_medium} placeholder={'Description'} value={this.state.remarks} onChangeText={(val)=>{this.setState({remarks:val})}}  />
                        </View>
                        {/* <View style={Styles.overview}  >
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" />
                                <Text style={Styles.overviewTitles}>Note from PIC</Text>
                            </View>
                            <TextInput style={Styles.textInput_medium} placeholder={'Note from PIC'} value={this.state.remarks2} onChangeText={(val)=>{this.setState({remarks2:val})}} />
                        </View> */}
                        
                        </View>
                    }
                   </Content>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>      
                <Button rounded warning full style={{  marginTop: 100, 
                                                marginRight: 50,
                                                width: 130, 
                                                borderRadius: 10}}  
                                                onPress={() => {
                                                    this.updateFollowUp();
                                                    // alert('update follow up')
                                                }}>
                    <Text>Update</Text>
                </Button>
                <Button rounded warning full style={{ backgroundColor: '#e73536',
                                            width: 130,
                                            marginTop: 100, 
                                            borderRadius: 10}}  
                                            onPress={() => {
                                                this.deleteFollowUp();
                                                // alert('update follow up')
                                            }}>
                    <Text>Delete</Text>
                </Button>
            </View>
                
                

            </Container>
            

        );
    }
}
export default DetailFollowUp;

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