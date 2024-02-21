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
    Modal
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

  import { Actions } from "react-native-router-flux";
  import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

import { Fonts,Style, Colors } from "../Themes";
import Styles from "./Style";

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config/services';

let isMount = false
// create a component
class ChouseFloor extends Component {

    constructor(props){
      super(props)

      this.state={
        hd : null,

        blok : []

    }

      console.log('props cf',props);
      console.log('props lottype', this.props.lottype);
    }

    async componentDidMount(){
      isMount = true
      const data = {
        hd : new Headers({
          'Token' : await _getData('@Token')
        })
      }

      this.setState(data,()=>{
          this.getBlok();
      })
    }

    getBlok = () =>{
      const item = this.props.item
      const items = this.props.prevItems
      const lottype = this.props.lottype
      const propsCode = item.property_cd
      
      {isMount ?
          fetch(urlApi+'c_product_info/getBlok/'+items.db_profile+'/'+items.entity_cd+'/'+items.project_no+'/'+propsCode+'/'+lottype,{
              method:'GET',
              headers : this.state.hd,
          }).then((response) => response.json())
          .then((res)=>{
              if(!res.Error){
                  const resData = res.Data
                  this.setState({blok : resData})
              } else {
                  this.setState({isLoaded: !this.state.isLoaded},()=>{
                      alert(res.Pesan)
                  });
              }
              console.log('getBlok',res);
          }).catch((error) => {
              console.log(error);
          })
      :null}
    }


    clickChouseUnit(item) {
      
        Actions.chouseunit({
          unitItems : item,
          items : this.props.item,
          prevItems : this.props.prevItems,
          lottype: this.props.lottype,
          propsCode: this.props.propsCode,
          clusterCode : this.props.clusterCode,
          goToItem: this.props.goToItem
        });
        // this.setState({ click : true})
    }
    clickUnitEnquiry() {
        Actions.UnitEnquiryProjectPage({
          items : this.props.item,
          prevItems : this.props.prevItems
        });
        this.setState({ click : true})
    }
    render() {
        const prevItem = this.props.prevItems
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
                   {"Choose Block / Level".toUpperCase()}
                 </Text>
               </View>
               <View style={Style.actionBarRight}>
               {/* <Button
                   transparent
                   style={Style.actionBarBtnRight}
                   onPress={Actions.categoris}
                 >
                   <Icon
                     active
                     name="action-undo"
                     style={Style.actionIcon}
                     type="SimpleLineIcons"
                   />
                 </Button> */}
                 </View>
                 
                
               </Header>
             <Content
               style={Style.layoutInner}
               contentContainerStyle={Style.layoutContent}
             >
              {/* <Image
              source={require("@Asset/images/tigabr.jpg")}
              style={{
                width: null,
                height: 168,
                resizeMode: "cover",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 8
              }}
            />  */}
              <View>
              
                    <View style={[Styles.headerUnit, {paddingHorizontal: 0, paddingLeft: 20}]}>
                        <Text style={Styles.cHeader}>{prevItem.title.toUpperCase()}</Text>
                        {/* <Right>
                            <Button small rounded style={Styles.sBtn} onPress={() => { this.clickUnitEnquiry(); 
                            }}  >
                                <Text style={Styles.sLink}>Unit Enquiry</Text>
                            </Button>
                        </Right> */}
                    </View>
                    <View style={{flexDirection: 'row',paddingHorizontal: 20}}>
                          <View style={{  flexDirection: 'row',
                                          marginBottom: 8,
                                          paddingHorizontal: 20,
                                          paddingRight: 16,borderWidth: 1,
                                          // borderColor: '#ff0080',
                                          width: 35,
                                          height: 25,
                                          backgroundColor: '#03A8E9'}}>
                                            
                          </View>
                          <Text style={{
                                                  color: '#000000',
                                                  fontFamily: Fonts.type.sfuiDisplaySemibold,
                                                  fontSize: 12,
                                                  paddingLeft: 20,
                                                  paddingRight: 20,
                                                }}>Unit Available
                          </Text>
                          <View style={{  flexDirection: 'row',
                                          marginBottom: 8,
                                          paddingHorizontal: 20,
                                          paddingRight: 16,borderWidth: 1,
                                          // borderColor: '#ff0080',
                                          width: 35,
                                          height: 25,
                                          backgroundColor: '#A9B2A9'}}>
                                            
                          </View>
                          <Text style={{
                                                  color: '#000000',
                                                  fontFamily: Fonts.type.sfuiDisplaySemibold,
                                                  fontSize: 12,
                                                  paddingLeft: 20,
                                                }}>No Unit Available
                          </Text>
                    </View>
                    {/* <View style={{flexDirection: 'row',paddingHorizontal: 20}}>
                          <View style={{  flexDirection: 'row',
                                          marginBottom: 8,
                                          paddingHorizontal: 20,
                                          paddingRight: 16,borderWidth: 1,
                                          // borderColor: '#ff0080',
                                          width: 35,
                                          height: 25,
                                          backgroundColor: '#A9B2A9'}}>
                                            
                          </View>
                          <Text style={{
                                                  color: '#000000',
                                                  fontFamily: Fonts.type.sfuiDisplaySemibold,
                                                  fontSize: 12,
                                                  paddingLeft: 20,
                                                }}>No Unit Available
                          </Text>
                    </View> */}
                    
                    {/* <Text style={{
                        fontWeight: "300",
                        fontSize: 16,
                        paddingLeft: 16,
                        justifyContent: "center",
                        alignItems: "center",

                    }}>Unit type</Text> */}
                    <View style={this.state.blok.length > 1 ? Styles.city: Styles.city1}>
                      {this.state.blok.map((item,key)=>
                        <TouchableOpacity key={key} style={[Styles.btnCity, {backgroundColor: item.status > 0 ? '#03A8E9' : '#A9B2A9'}]} onPress={() => {item.status > 0 ? this.clickChouseUnit(item): alert('No Unit Available');}} >
                          <View style={Styles.btnCityLocation}>
                              <Icon
                                  active
                                  name="floor-plan"
                                  style={{
                                            fontSize: 32,
                                            color: '#000000',
                                        }}
                                  type="MaterialCommunityIcons"
                              />
                              <Text style={{
                                            color: '#000000',
                                            fontFamily: Fonts.type.sfuiDisplaySemibold,
                                            fontSize: 12,
                                          }}>{item.descs}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                </View>
             </Content>
             </Container>
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
});

//make this component available to the app
export default ChouseFloor;
