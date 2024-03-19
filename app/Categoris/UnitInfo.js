//import liraries
import React, { Component } from "react";
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
  Form,
  Label
} from "native-base";

import Interested from "./Interested"

import { Actions } from "react-native-router-flux";
import ParallaxScroll from "@monterosa/react-native-parallax-scroll";

import { Fonts, Style, Colors } from "../Themes";
import Styles from "./Style";

import RBSheet from "react-native-raw-bottom-sheet";
import numFormat from '@Component/numFormat'
import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config/services';
import Mailer from "react-native-mail";
let isMount = false
// create a component
class UnitInfo extends Component {

  constructor(props){
    super(props)

    this.state = {
      hd : null,
      price : [],
      isVisible : false,
      isHide: false,
      getloads: [],
      gallery : [],
      getpaydet: [],
      property_cd: '',
      payment_cd: '',
      Group_cd:'',
      // dashmenu: [],
      bookpage: [],
      unitpage: [],


      descs : '',
      // project: '',
      email_add: '',
      wa_no: '',
      projects:[],
      amenities  : null,
      feature : null,
      overview : null,
      project : null,
      plans : null,
      detail: [],
      descs_wa: '',
    }
    console.log('props UI',props);
    // console.log("props _UnitInfo", props);
    // console.log("props _getRoutes", props.routes);
  }

  async componentDidMount(){
    isMount = true;
    const dashmenu = await _getData("@DashMenu");
    const coba = this.state.price;
    const data = {
      hd : new Headers({
        'Token' : await _getData('@Token')
      }),
      email : await _getData('@User'),
      userId : await _getData('@UserId'),
      name : await _getData('@Name'),
      handphone : await _getData('@Handphone'),
      projects : await _getData('@UserProject'),
      Group_cd: await _getData("@Group"),
      descs : 'Saya tertarik reservasi ' +this.props.prevItems.project_descs+ '\n\nLantai ' +this.props.items.level_no+ ' | ' +this.props.items.descs+ ' | ' +this.props.items.lot_no+'\n\nHubungi saya untuk info detail.',
      descs_wa : 'Saya tertarik reservasi ' +this.props.prevItems.project_descs+ '\n\nLantai ' +this.props.items.level_no+ ' | ' +this.props.items.descs+ ' | ' +this.props.items.lot_no,
      bookpage: dashmenu[1].URL,
      unitpage: dashmenu[2].URL,
      pm_cd: coba.payment_cd
      // projects: await _getData('@UserProject')
      // descs : this.props.prevItems.project_descs,
    }

    // console.log('dataImInterested',data);
    // console.log('dashmenu',dashmenu);

    this.setState(data,()=>{
      // this.getPriceInfo();
      this.getDetailProject();


      this.getPrice();
      this.getLoad();
      this.getGallery();
      this.getUserEmail();
    })
  }

  clickBooking(item) {
    if(item.status == 'A'){
      Actions.BookingPage({
        items : item,
        prevItems : this.props.prevItems,
        unitItems : this.props.unitItems,
        theItems: this.props.items,
        theTems: this.props.theItems,
        goToItem: this.props.goToItem,
        price: this.state.price,
        propertyCode: this.props.propertyCode,
        clusterCode: this.props.clusterCode
      });
      
    }
    // this.setState({ click: true }); 
  };

  getPrice = () => {
    const item = this.props.items;
    const items = this.props.prevItems;
    
    lot_nos = item.lot_no;
    data = JSON.stringify(lot_nos);
    const lotnos = lot_nos.replace("/", "__");

    {
        isMount
            ? fetch(
                  urlApi +
                      "c_booking/getPrice/" +
                      items.db_profile +
                      "/" +
                      items.entity_cd +
                      "/" +
                      items.project_no +
                      "/" +
                      item.lot_no,
                      
                  {
                      method: "POST",
                      headers: this.state.hd
                  }
              )
                  .then(response => response.json())
                  .then(res => {

                      if (!res.Error) {
                          const resData = res.Data[0];
                          this.setState({ price: resData });
                          _storeData("@getprice",resData);
                          this.getPayDetail(res);
                      }
                      console.log("getPrice", res);
                  })
                  .catch(error => {
                      console.log(error);
                  })
            : null;
    }
  };

  // getPriceInfo = () =>{
  //   const item = this.props.items
  //   const items = this.props.prevItems
  //   {isMount ?
  //       fetch(urlApi+'c_product_info/getPriceInfo/'+items.db_profile+'/'+items.entity_cd+'/'+items.project_no+'/'+item.lot_no,{
  //           method:'GET',
  //           headers : this.state.hd,
  //       }).then((response) => response.json())
  //       .then((res)=>{
  //           if(!res.Error){
  //               const resData = res.DataHC
  //               this.setState({price : resData});
  //               _storeData("@getprice",resData);
  //           }
  //           console.log('getPriceInfo',res);
  //       }).catch((error) => {
  //           console.log(error);
  //       })
  //   :null}
  // };

  getPayDetail = res => {
    let result = res.Data[0];
    const getpaymentcds = result.payment_cd;
    const item = this.props.items;
    const items = this.props.prevItems;
    lot_nos = item.lot_no;
    data = JSON.stringify(lot_nos);
    const lotnos = lot_nos.replace("/", "__");

    // console.log('lot_no', lotnos);
    // console.log('cobaliat _getPaymentcds', getpaymentcds);


    {
        isMount
            ? fetch(
                  urlApi +
                      "c_booking/getPayDetail/" +
                      items.db_profile +
                      "/" +
                      items.entity_cd +
                      "/" +
                      items.project_no +
                      "/" +
                      lotnos + 
                      "/" +
                      getpaymentcds,
                  {
                      method: "POST",
                    //   body: JSON.stringify({payment_cd})
                  }
              )
                  .then(response => response.json())
                  .then(res => {
                      if (!res.Error) {
                          const resData = res.Data;
                          this.setState({ getpaydet: resData, isLoaded: true });
                      }
                      console.log("getPayDetail", res);

                  })
                  .catch(error => {
                      console.log(error);
                  })
            : null;
    }
};



getLoad = () => {
    const item = this.props.items;
    const items = this.props.prevItems;
    lotnos = item.lot_no;
    data = JSON.stringify(lotnos);

    // const lotnos = lot_nos.replace("/", "__");

    // console.log('propertyCode', this.props.propertyCode);

    {
        isMount
            ? fetch(
                  urlApi +
                      "c_booking/getInfo/" +
                      items.db_profile +
                      "/" +
                      items.entity_cd +
                      "/" +
                      items.project_no +
                      "/" +
                      this.props.propertyCode +
                      "/" +
                      item.level_no +
                      "/" +
                      lotnos,
                  {
                      method: "POST",
                      headers: this.state.hd
                      // body: {name: "data", data : lotnos}
                    // body: data
                  }
              )
                  .then(response => response.json())
                  .then(res => {
                      if (!res.Error) {
                          const resData = res.Data[0];
                          this.setState({ getloads: resData });
                        
                      }
                      console.log("getLoads", res);
                  })
                  .catch(error => {
                      console.log(error);
                  })
            : null;
    }
  };

  getGallery = () =>{
    const item = this.props.prevItems;
    const items = this.props.items;
    // const theitemz = this.props.theItemz;

    // console.log('check _item', item);
    // console.log('check _items', items);
    // console.log('check _theitem', theitem);
    // console.log('check _unitItem', theitemz[0].lot_type);

    {isMount ?
        fetch(urlApi+'c_product_info/getGallery/'+item.db_profile+'/'+item.entity_cd+'/'+item.project_no+'/'+this.props.propertyCode,{
            method:'GET',
            headers : this.state.hd,
        }).then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                const resData = res.Data
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
  }
  
  getUserEmail() {
    const {db_profile, entity_cd, project_no} = this.props.prevItems
    fetch(urlApi+'c_product_info/userEmail/'+db_profile+'/'+entity_cd+'/'+project_no ,{
        method : "GET",
    })
    .then((response) => response.json())
    .then((res)=>{
    if(!res.Error){
      const emails = res.Data[0].email_add;
      const wassaf = res.Data[0].wa_no;
      this.setState({dataEmail:emails, dataWassaf:wassaf})
      console.log('getUserEmail',res);
    }
    }).catch((error) => {
      console.log(error);
    });
  };

  getDetailProject = async() => {
          const project = await _getData('@UserProject');
        // console.log('project detail',project);
        const entity_cd = project[0].entity_cd
        const project_no = project[0].project_no
        // console.log('entity dan project no',{entity_cd, project_no});
        {isMount ?
        fetch(urlApi + 'c_project/getProject2/IFCAPB2/',{
            method:'POST',
            body: JSON.stringify({entity_cd,project_no})
            // headers : this.state.hd,
        }).then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                const resData = res.Data
               
                console.log('getDetailProject',res);
                this.setState({detail:resData});
            } else {
                this.setState({isLoaded: !this.state.isLoaded},()=>{
                    alert(res.Pesan)
                });
            }
            // console.log('datalistprospect',res);
        }).catch((error) => {
            console.log(error);
        })
        :null}

  }

  sendWa(){
    // alert('wa');
    const noHp = this.state.dataWassaf;
    // const noHp = this.state.projects[0].handphone
    // const noHp = this.state.handphone
    const descs_ = this.state.descs;
    Linking.openURL('https://wa.me/+62'+noHp+'?text='+descs_)
    // console.log('hp wa', noHp);
    // console.log('desc', descs_);
  
  }
  
  sendEmail(){
    // alert('email');
    const email_add = this.state.dataEmail;
    const descs_ = this.props.prevItems.project_descs;
    const nounit = this.props.items.lot_no;
    // noHp = '';
    // const email_add = this.state.projects[0].email_add
    // const descs = this.props.items.project_descs
    
    // alert(email_add);
  
    // console.log('email send add', email_add)
    Mailer.mail(
      {
        subject: "Saya tertarik reservasi " + descs_ + " dengan Nomor Unit " + nounit,
        recipients: [`${email_add}`],
        ccRecipients: [""],
        bccRecipients: [""],
        body: "",
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
  

  render() {
    // const dashmenu1 = await _getData("@DashMenu");
    const item = this.props.items;
    const prevItems = this.props.prevItems;
    const unit = this.props.unitItems;
    const names = this.props.name;
    const getURL = this.props.goToItem.URL;
    const getRoutes = this.props.routeName;
    const getpaymentcds = this.state.price.payment_cd;
    
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
            <Text style={Style.actionBarText}>{"Unit Info".toUpperCase()}</Text>
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
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} scrollEventThrottle={0}
                    pagingEnabled alwaysBounceHorizontal style={{height:340}}>
                    {this.state.gallery.length !== 0 ?
                        this.state.gallery.map((item,key)=>
                        <Image
                            key={key}
                            source={{uri : item.gallery_url}}
                            style={{
                            width: Dimensions.get('window').width,
                            height: 340,
                            resizeMode: "contain",
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
              fontSize: 12,
              paddingTop: 16,
              marginLeft: 16,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {prevItems.title}
          </Text>
          <Text style={{ fontSize: 12, marginLeft: 16 }}>{prevItems.towerDescs} | Lantai {item.level_no}</Text>
          <Text style={{ fontSize: 12, marginLeft: 16 }}>{item.descs} | {item.lot_no}</Text>
          <Text style={{ fontSize: 12, marginLeft: 16 }}>
            By Request : IDR, {numFormat(this.state.price.trx_amt)}
          </Text>

          {
                        getURL == 'BookingPage' ?
                        <View>
                        {/* <View style={styles.lineStyle}/> */}
                    
                        {/* <Text
                            style={{
                                fontSize: 15,
                                paddingTop: 16,
                                marginLeft: 16,
                                justifyContent: "center",
                                alignItems: "center",
                                fontFamily:Fonts.type.sfuiDisplayBold
                            }}
                        >
                            PAYMENT DETAILS
                        </Text>
                        <View style={styles.containers}>
                        <View style={styles.itemLeftPlan}>
                            <Text style={{ fontSize: 13, marginLeft: 16, fontFamily: Fonts.type.sfuiDisplayBold }}>
                                Payment Plan
                            </Text>
                        </View>
                        <View style={styles.itemRightPlan}>
                        <Text style={{ color: Colors.redWine, fontSize: 13, marginLeft: 16, fontFamily: Fonts.type.sfuiDisplayBold, textAlign: 'right' }}>
                                {this.state.price.descs}
                            </Text>
                        </View>
                        </View> */}
                        
                     <View style={styles.containersLooping}>
                        {this.state.getpaydet.map((data, key) =>
                           <View key={key} style={styles.containers}>
                               <View style={styles.itemLeft}>
                               <Text style={{ fontSize: 13, marginLeft: 16, fontFamily: Fonts.type.sfuiDisplayBold }}>
                                   {data.descs}
                                   </Text>
                               </View>
                               <View style={styles.itemIdr}>
                                   <Text style={{ fontSize: 13, marginLeft: 16, fontFamily: Fonts.type.sfuiDisplayBold, textAlign: 'right' }}>
                                       IDR.
                                   </Text>
                               </View>
                               <View style={styles.itemRight}>
                                   <Text style={{ 
                                       fontSize: 13, 
                                       marginLeft: 16, 
                                       fontFamily: Fonts.type.sfuiDisplayBold, 
                                       textAlign: 'right',
                                       marginRight: 18,
                                       color: '#49C60E' }}>
                                           {data.trx_amt}
                                   </Text>
                               </View>
                           </View>
                           )
                        }
                            </View>
                        </View>
                        : null
                    }

        </Content>
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.isVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <Header style={Style.navigationModal}>
          <StatusBar
            backgroundColor={Colors.statusBarNavy}
            animated
            barStyle="light-content"
          />
           <View style={Style.actionBarLeft}>
               </View>
          <View style={Style.actionBarMiddle}>
            <Text style={Style.actionBarText}>
              {"I'm Interested".toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight}>
            <Button
              transparent
              style={Style.actionBtnRight}
              onPress={() => {
                this.setState({ isVisible: !this.state.isVisible });
              }}            >
              <Icon
                active
                name="close"
                style={Style.actionIcon}
                type="FontAwesome"
              />
            </Button>
          </View>
        </Header>
        <ScrollView>
        <Form>
            <Item floatingLabel>
              <Label>Nama Anda</Label>
              <Input value={this.state.name} onChangeText={(val)=>this.setState({name : val})} />
            </Item>
            <Item floatingLabel>
              <Label>Handphone</Label>
              <Input value={this.state.handphone} onChangeText={(val)=>this.setState({handphone : val})} />
            </Item>
            <Item floatingLabel>
              <Label>Deskripsi</Label>
              <Input multiline value={this.state.descs} onChangeText={(val)=>this.setState({descs : val})} />
            </Item>
            <Item floatingLabel>
              <Label>Reference Email</Label>
              <Input value={this.state.refEmail} onChangeText={(val)=>this.setState({refEmail : val})} />
            </Item>
            <Body style={{ paddingVertical:32 }} >
            <Button rounded success full
            style={{ marginTop:16, backgroundColor: Colors.blueUrban }} onPress={()=>this.sendEmail()} >
            <Text>Send Email</Text>
          </Button>
            <Button rounded warning iconRight full
            style={{ marginTop:16, backgroundColor: Colors.loginGreen }} onPress={()=>this.sendWa()}>
            <Text>Send via WhatsApp</Text>
            <Icon name='whatsapp' 
            type="FontAwesome5"/>
          </Button>
          </Body>
          </Form>
          </ScrollView>
        </Modal>


                {
                    getURL == 'UnitEnquiryPage' || getURL == 'FindUnitPage' || getRoutes == 'propertydetail' || this.state.Group_cd == 'Guest' && this.state.Group_cd == 'DEBTOR' ?  
                        <Button
                        rounded
                        full
                        style={{ backgroundColor: "#fb5f26" }}
                        onPress={() => {
                            this.setState({ isVisible: true });
                        }}
                    >
                    <Text>Reserve Now</Text>
                    </Button>
                
                : 

                     getURL == 'BookingPage' || this.state.Group_cd == 'INHOUSE' ? 
                       
                     <Button
                         rounded
                         full
                         style={{ backgroundColor: "#fb5f26", marginTop: 20 }}
                         onPress={() => { this.clickBooking(item) }}
                     >
                         <Text style={{fontFamily: Fonts.type.sfuiDisplaySemibold}}>Booking Now</Text>
                     </Button> 
                     
                     : 
                     null
              }
      </Container>
    );
  }
}



// define your styles
const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      // paddingBottom: 30
      backgroundColor: '#000000'
  },
  buttonPalingBawah: {
      flex: 1,
      marginLeft: 18
  },
  lineStyle:{
      borderWidth: 0.5,
      borderColor:'black',
      margin:10,
 },
 containers: {
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-start' // if you want to fill rows left to right
},
containersLooping: {

  marginBottom: 40
},
itemLeft: {
  width: '50%', // is 50% of container width

},
itemLeftPlan: {
  width: '61%', // is 50% of container width

},
itemIdr:{
  width:'15%'
},
itemRight:{
  width: '35%', // is 50% of container width
},
itemRightPlan:{
  width: '35%', // is 50% of container width
}
});

//make this component available to the app
export default UnitInfo;
