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
    ActivityIndicator,
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
  import HTML from 'react-native-render-html';

import { Style, Colors } from "../Themes/";
import Styles from "./Style";

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config/services';
let isMount = false
// create a component
class UnitDetail extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      hd : null,
      gallery : [],
      lot_type: [],
      property_cd: [],
      lottype : []
    }


  }

  async componentDidMount(){
    console.log('props UD',this.props);
    const datalottype = await _getData("@getLotType");
    const datatowerz = await _getData("@getTowerz");
    isMount = true

    const data = {
      hd : new Headers({
        'Token' : await _getData('@Token')
      })
      // property_cd :this.props.items.property_cd,
      // lot_type : datalottype[0].lot_type
    };

    this.setState(data,()=>{
      this.getPropertyDetail();
      this.getGallery();
    });

    // console.log('get LOTYPE', data.lot_type);
    // console.log('get PROPERTYCD', data.property_cd);
  }


 
  getPropertyDetail = () =>{
    const item = this.props.items
    const items = this.props.prevItems
    const property_code = item.property_cd
    const clusterCode = this.props.clusterCode;
    
    {isMount ?
        fetch(urlApi+'c_product_info/getPropertyDetail/'+items.db_profile+'/'+items.entity_cd+'/'+items.project_no+'/'+clusterCode+'/'+property_code,{
            method:'GET',
            headers : this.state.hd,
        }).then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                const resData = res.Data;
                this.setState({lottype : resData})
            } else {
                this.setState({isLoaded: !this.state.isLoaded},()=>{
                    alert(res.Pesan)
                });
            }
            console.log('getPropertyDetail',res);
        }).catch((error) => {
            console.log(error);
        })
    :null}
  };
  getLotType = () => {
      const item = this.props.items;
      console.log('itemproper', item);
      // console.log('item lot type', item);
      const clusterCode = this.props.clusterCode;
      console.log("cluster code", clusterCode);
      {
        isMount
          ? fetch(
              urlApi +
                "c_product_info/getLotType/" +
                item.db_profile +
                "/" +
                item.entity_cd +
                "/" +
                item.project_no +
                "/" +
                clusterCode,
                "/" +
                item.property_cd,
  
  
              {
                method: "GET",
                headers: this.state.hd
              }
            )
              .then(response => response.json())
              .then(res => {
                if (!res.Error) {
                  const resData = res.Data;
                  this.setState({ properties: resData });
                  _storeData("@getLotType", resData);
                } else {
                  this.setState({ isLoaded: !this.state.isLoaded }, () => {
                    alert(res.Pesan);
                  });
                }
                console.log("getLotType", res);
              })
              .catch(error => {
                console.log(error);
              })
          : null;
      }
    };

  getGallery = () =>{
    const item = this.props.items
    console.log('item',item)
    const items = this.props.prevItems
    const property_code = item.property_cd
   
    {isMount ?
        fetch(urlApi+'c_product_info/getGallery/'+items.db_profile+'/'+items.entity_cd+'/'+items.project_no+'/'+property_code,{
            method:'GET',
            headers : this.state.hd,
        }).then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                const resData = res.Data;
              
                this.setState({gallery : resData})
            } else {
                this.setState({isLoaded: !this.state.isLoaded},()=>{
                    alert(res.Pesan)
                });
            }
            console.log('getGallery',res);
        }).catch((error) => {
            console.log(error);
        })
    :null}
  };

  clickChouseFloor() {
    const lotstype = this.state.lottype
      Actions.chousefloor({
        item : this.props.items,
        prevItems:this.props.prevItems,
        // lottype: lotstype[0].lot_type,
        propsCode: this.props.items.property_cd,
        clusterCode : this.props.clusterCode,
        goToItem: this.props.goToItem
      });
      this.setState({ click : true})
  }
    render() {
      const items = this.props.prevItems
      const item = this.props.items
      const lotstype = this.state.lottype
      let specifications = ''
     
      if(lotstype.length > 0){
        spec_info = lotstype[0].spec_info
        
        specifications = spec_info.replace(/(\r\n|\n|\r)/gm," ")
        specifications = specifications.replace(/<div>|<strong>|<\/strong>|<\/div>|<ul>|<\/ul>/gi, '')
        specifications = specifications.replace(/<\/li>/gi,'')
        specifications = specifications.replace(/<li>/gi,'\n• ')
        specifications = specifications.replace(/<br>/gi,' ')
        console.log('feature',specifications)
      }

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
                {"Property Type Detail".toUpperCase()}
              </Text>
            </View>
            <View style={Style.actionBarRight}/>
          </Header>
        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}
        >
            {/* <Image
              source={{uri : this.props.items.picture_url}}
              style={{
                width: Dimensions.get('window').width,
                height: 400,
                resizeMode: "cover",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 0
              }}
            />  */}
            <ScrollView horizontal showsHorizontalScrollIndicator={true} scrollEventThrottle={0}
            pagingEnabled alwaysBounceHorizontal style={{height:400}}>
              {this.state.gallery.length !== 0 ?
                this.state.gallery.map((item,key)=>
                  <Image
                    key={key}
                    source={{uri : item.gallery_url}}
                    style={{
                      width: Dimensions.get('window').width,
                      height: 400,
                      resizeMode: "cover",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 0
                    }}
                  />
                )  
              :null}
            </ScrollView>
            <Text
              style={{
                fontWeight: "300",
                fontSize: 16,
                padding: 8,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {items.project_descs}
            </Text>
            <Text style={{ fontSize: 16,                 padding: 8,
 }}>
              {items.towerDescs} | {item.descs} | {item.remarks}
            </Text>

            <View style={{ paddingTop: 10, paddingLeft: 10 }} >  
        
              {/* <Text style={{fontSize: 12,padding:8}}> </Text> */}
                {specifications ?  <HTML html={specifications} imagesMaxWidth={Dimensions.get('window').width} />  :<ActivityIndicator /> } 
              
            </View>
            
    </Content>
        <Button full style={{ backgroundColor: Colors.statusBarNavy }}
        onPress={() => {
            this.clickChouseFloor();
          }}>
              <Text>Find Unit</Text>
        </Button>
    </Container>
   );
}
}  


//make this component available to the app
export default UnitDetail;
