import React, { Component } from "react";
import RNFetchBlob from "rn-fetch-blob";
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
    Platform
} from "react-native";
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
    Card
} from "native-base";

import { Style, Colors } from "../Themes";
import { Actions } from "react-native-router-flux";
import TabBar from '@Component/TabBar';
import Styles from "./Style";
import {_storeData,_getData} from '@Component/StoreAsync';
import { urlApi } from "@Config/services";
import Shimmer from '@Component/Shimmer';

class SurveyPage extends Component {
    

    constructor(props){
        super(props)

        this.state = {
            status_cd : '',
            email: '',
            list_survey: [],
            handphone: '',
            business_id: '',
            descs: '',
            filePath: '',
            entryDate: [],

        }
        
    }
  
    
    async componentDidMount(){
       
        const items = this.props.items;
        const data = {
              hd : new Headers({
                'Token' : await _getData('@Token')
              }),
              email : await _getData('@User'),
              userId : await _getData('@UserId'),
              name : await _getData('@Name'),
              handphone : await _getData('@Handphone'),
              isLogin : await _getData('@isLogin'),
              entity: items.entity_cd,
              project: items.project_no
        }
      
        isMount = true;
        this.setState(data, () => {
            this.getDataListSurvey();
            // this.printDocument();
            // this.getDataFollowUp(this.props.datas)
            // this.getStatus()
        });
    };

    componentWillUnmount(){
        // this.setState({isMount:false})
        isMount =false
      }

    getDataListSurvey = () => {
        const {userId} = this.state
        const {email} = this.state
        const {entity} = this.state
        const {project} = this.state
        
        fetch(urlApi + 'c_survey/getSurveyHdr/IFCAMOBILE/',{
            method:'POST',
            body: JSON.stringify({userId, email, entity, project})
            // headers : this.state.hd,
        }).then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                const resData = res.Data
               console.log('list_survey',resData);
                this.setState({list_survey:resData});
            } else {
                this.setState({isLoaded: !this.state.isLoaded},()=>{
                    alert('No Survey in this Project')
                });
            }
            
        }).catch((error) => {
            console.log(error);
        })
       
    }

    receiveProps = () =>{
        isMount=true;
        // alert('refresh');
        this.getDataListSurvey(this.props.datas);
    }

    async DetailSurvey(data) {
     
        _storeData("dataSurvey",data);
        Actions.SurveyDetail({data :data, email: this.state.email, userId: this.state.userId, onBack: () => this.receiveProps() });
        // { onBack: () => this.receiveProps() }
        // Actions.IndexProspect
        this.setState({ click : true})
    }

    render() {
        return (
      
            <Container  style={Style.bgMain}>
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
                        {"Choose Survey".toUpperCase()}
                    </Text>
                </View>
                <View style={Style.actionBarRight} />

            </Header>

          
            <Content style={[Style.layoutContent,{backgroundColor:'#f3f3f3'}]} >
            <ScrollView
                    scrollEventThrottle={200}
                    directionalLockEnabled={true}
                    >
                <View >
                <List style={{paddingVertical: 10}} >

                    {this.state.list_survey.map((data, key) => (
                        //  <TouchableOpacity key={key} style={navStyles.newsContainer} onPress={()=>this.DetailProspect(data)}>
                         <ListItem  style={navStyles.newsContainer} key={key}  onPress={()=>this.DetailSurvey(data)}>                                
                            <View style={{alignSelf:'flex-start', width: 250}} >
                                <Text style={{fontFamily: "Montserrat-Regular",alignSelf:'flex-start',color: "#02326b",marginBottom: 5,fontSize: 18, fontWeight:'bold'}}>{data.title}</Text>
                                <Text style={{fontFamily: "Montserrat-Regular",alignSelf:'flex-start',color: "#333",marginBottom: 5,fontSize: 15}}>{data.publishdate} - {data.expireddate}</Text>
                                
                            </View>
                           
                            <Icon
                              name="arrow-right"
                              type="MaterialCommunityIcons"
                              style={{color:'#1faa00'}}
                            />
                           
                        </ListItem>
                        // </TouchableOpacity>
                    ))}

  
                </List>
                </View>
            </ScrollView>
            </Content>
        </Container>
        
      
        );
    }
}
export default SurveyPage;

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
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 2,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 5,
        backgroundColor: "#fff",
        marginRight: 15
    }
});