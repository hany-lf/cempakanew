import React, { Component } from "react";
import {
    StatusBar,
    StyleSheet,
    View,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    Platform,
    ActivityIndicator
} from "react-native";
import {
    Container,
    Header,
    Button,
    Icon,
    Text,
    ListItem,
    Right,
    Content,
    Picker,
    DatePicker,
    Item,
    Input,
    Textarea
} from 'native-base'
import nbStyles from './Style3'
import ModalSelector from 'react-native-modal-selector'
import { Style, Colors } from "../Themes";
import { Actions } from "react-native-router-flux";
import { DropdownInput } from '@Component/Input/_DropdownInput';
import {_storeData,_getData} from '@Component/StoreAsync';
import { urlApi } from "@Config/services";
import {  MinuteInput, DateInput, DatetimeInput } from "../components/Input";

class ReportProspect extends Component {
    static options(passProps) {
        return {
            topBar: {
                noBorder: true
            },
            bottomTabs :{
                visible : false,
                drawBehind: true, 
                animate: true
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = { 
            chosenDate: new Date(),
            dataDebtor : [],
            dataTower : [],
            
            status_cd : '',
            selProject : [],

            email : '',
            debtor : '',
            group : '',
            typeTicket : "'C','R'",

            textDebtor : '',
            textProject : '',
            startDate : new Date(),
            endDate : new Date(),
            getstatus: [],
         };
    }
    async componentDidMount(){
        isMount = true;
        const data = {
            userId: await _getData("@UserId"),
            email : await _getData('@User'),
            group : await _getData('@Group'),
            dataTower : await _getData('@UserProject')
        }
          
        this.setState(data, () =>{
            this.getStatus()
        })
    }

    componentWillUnmount(){
        isMount =false;
      }

    getStatus = () => {

        // const dataProspect = await _getData("statusProspect");
        // const {status_cd} = dataProspect
        {isMount ?
            fetch(urlApi + 'c_status/getStatus2/IFCAPB2/',{
                method:'POST',
                // body: JSON.stringify({status_cd})
                // headers : this.state.hd,
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data
                   
                    this.setState({getstatus:resData});
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

    handleDateChange = (name, time) => {
        this.setState({ [name]: time });
    };

    handleNavigation(){
     
        Actions.ReportListProspect({
            status : this.state.status_cd,
            startDate : this.state.startDate,
            endDate : this.state.endDate,
          });
        
    }

    render() {
        return (
            <Container>
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
                            {"Prospect Customer".toUpperCase()}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight} />

                </Header>
                <Content>
                    <View style={nbStyles.wrap}>
                        {/* <Title text="Statement of Account" /> */}
                       
                        <View style={nbStyles.subWrap}>
                            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 14}}>Status</Text>
                            <Item regular style={{height: 35}}>
                                <Picker  
                                        mode="dropdown"
                                        // style={Styles.textInput}
                                        selectedValue={this.state.status_cd}
                                        onValueChange={(val)=>{
                                            const statuspros = this.state.getstatus.filter(item=>item.value==val)
                                           
                                            this.setState({status_cd:val,status:statuspros})
                                            console.log('status change', val);
                                            console.log('statuspros', statuspros);
                                        }}
                                >
                                    <Picker.Item label="Choose Status" />
                                    {this.state.getstatus.map((data, key) =>
                                        <Picker.Item key={key} label={data.label} value={data.value} />
                                    )}
                                </Picker>
                            </Item>
                        </View>
                        <View style={{marginTop: 15}}>
                           
                            <DatetimeInput
                              style={{fontFamily: 'Montserrat-Regular', color: "black"}}
                              mode="date"
                              name="startDate"
                              label="Start Date"
                              format="DD MMMM YYYY"
                              minimumDate={new Date(1900,1,1)}
                              onChange={this.handleDateChange}
                              value={this.state.startDate}
                            />
                            <DatetimeInput
                                style={{fontFamily: 'Montserrat-Regular', color: "black"}}
                                mode="date"
                                name="endDate"
                                label="End Date"
                                format="DD MMMM YYYY"
                                minimumDate={new Date(1900,1,1)}
                                onChange={this.handleDateChange}
                                value={this.state.endDate}
                            />
                        </View>
                       
                        <View style={nbStyles.subWrap}>
                            <Button block style={Style.buttonSubmit} onPress={()=>this.handleNavigation()}>
                                <Text>View</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
export default ReportProspect;
const styles = StyleSheet.create({

    input :{
        height: 40,
        backgroundColor: '#f5f5f5',
        color:"black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: null,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputs :{
        height: 80,
        backgroundColor: '#f5f5f5',
        color:"black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: null,
        borderRadius: 10,
    }
})

