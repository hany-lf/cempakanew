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
    Alert,
    ActivityIndicator
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

import { Actions } from "react-native-router-flux";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

import { Style, Colors } from "../Themes";
import Styles from "./Style";
import { _navigate } from "@Component/StoreAsync";
//1. import komponen untuk upload foto
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "rn-fetch-blob";

import { _storeData, _getData } from '@Component/StoreAsync';
import { urlApi } from '@Config/services';
import numFormat from "@Component/numFormat";
import moment from 'moment';

let isMount = false;
// create a component
class BookingPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            hd: null,
            isLoaded: true,
            
            user: "",
            name: "",
            selected: "",
            projectName: "",
            towerName: "",
            level_descs: "",
            lot_no: "",
            payment_descs: "",
            payment_amt: "",
            choosebookingtp: '',
            booking_type:'',
        

            //state form
            category: '',
            fullname: '',
            nohp: '0',
            email_add: '',
            identity_no: '',
            no_ktp: '',
            npwp:'',
            citys: '',
            nationality_descs: '',
            addresses: '',
            address2: '',
            address3: '',
            post_cd: '',
            bookingtp: '',
            amt: '',
            remarks: '',
            entity: '',
            project: '',
            lotnno: '',
            payment_cd: '',
            userId: '',
            Group_cd: '',
            agent_cd: '',
            rowID: '',
            business_id: '',
            gender: '',

            //2. tambahkan state upload foto booking
            pictUrlKTP: '',
            pictUrlNPWP: '',
            pictUrlBuktiTF: '',


            //state looping
            project: [],
            customers: [],
            nationality: [],
            booking_type: [],
            amounts:[],
            sell_price: [],
            paydescs: [],
            trx_amts: [],
            email: ''
            
            // getAgentcd: [],
            // business_id: [],
            
        }

        console.log('props cf', props);
    }

    async componentDidMount() {
        // start : 2.
        const items = this.props.items;
        const prevItems = this.props.prevItems;
        const getprc = await _getData("@getprice");
        console.log('check _getPrice', getprc);
        // end : 2.
        isMount = true;
        const data = {
            email: await _getData("@User"),
            name: await _getData("@Name"),
            no_hp: await _getData("@Handphone"),
            token: await _getData("@Token"),
            userId: await _getData("@UserId"),
            Group_cd: await _getData("@Group"),
            agent_cd: await _getData("@AgentCd"),
            paydescs: getprc.descs,
            trx_amts: getprc.price,
            sell_price: getprc.trx_amt,
            lotnno: items.lot_no,
            entity: prevItems.entity_cd,
            project: prevItems.project_no,
            payment_cd: getprc.payment_cd

        }
        console.log('coba liat data', data);
        this.setState(data, () => {
            // this.getMedia()
            this.getNationality();
            // this.getBookingType();
            this.getAmount();
            // this.getAgent();
            // this.getSprice();
            this.getLoadData();
            
        });
        console.log('get __GoTo from booking or unit enquiry', this.props.goToItem);

    }

    goBacktoUnit(){
         Actions.chouseunit({
            prevItems: this.props.prevItems,
           gotoTheItem: this.props.goToItem,
          item: this.props.items
      });
    }

    getNationality = () => {
        const items = this.props.prevItems;
        // console.log('got item', items);
        {isMount ?
            fetch(urlApi + 'c_booking/getNationality/'+items.db_profile,{
                method: 'GET',
                // method:'POST',
                // body: JSON.stringify({province_cd})
                // headers : this.state.hd,
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data
                    this.setState({ nationality : resData});
                } else {
                    this.setState({isLoaded: !this.state.isLoaded},()=>{
                        alert(res.Pesan)
                    });
                }
                console.log('getNationality',res);
            }).catch((error) => {
                console.log(error);
            })
            :null}
    }

    getBookingType= () => {
        const items = this.props.prevItems;
        // console.log('got item', items);
        {isMount ?
            fetch(urlApi + 'c_booking/getNupType/'+ items.db_profile + "/" + items.entity_cd + "/" + items.project_no,{
                method: 'GET',
                // method:'POST',
                // body: JSON.stringify({province_cd})
                // headers : this.state.hd,
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data;
                    this.setState({ booking_type : resData});
                    _storeData("@checkNUP", resData);
                } else {
                    this.setState({isLoaded: !this.state.isLoaded},()=>{
                        alert(res.Pesan)
                    });
                }
                console.log('getBookingType',res);
            }).catch((error) => {
                console.log(error);
            })
            :null}
    }

    getAgent= () => {
        const items = this.props.prevItems;
        // console.log('got item', items);
        {isMount ?
            fetch(urlApi + 'c_booking/getAgent/'+ items.db_profile,{
                method: 'GET',
                // method:'POST',
                // body: JSON.stringify({province_cd})
                // headers : this.state.hd,
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data;
                    this.setState({ agent : resData});
                    // _storeData("@checkNUP", resData);
                    // console.log('get',);
                } else {
                    this.setState({isLoaded: !this.state.isLoaded},()=>{
                        alert(res.Pesan)
                    });
                }
                console.log('getAgent',res);
            }).catch((error) => {
                console.log(error);
            })
            :null}
    }

    getAmount = async(val) => {
        if(val != undefined){
            const items = this.props.prevItems;
            // const dataBtype = await _getData("@checkNUP");
            // const nup_type = dataBtype[0].nup_type;
            // console.log('got nuptype', nup_type);
            {isMount ?
                fetch(urlApi + 'c_booking/getBookingAmount/'+ items.db_profile + "/" + items.entity_cd + "/" + items.project_no + "/" + this.props.propertyCode + "/" + this.props.clusterCode  ,{
                    // method: 'GET',
                    method:'POST',
                    // body: JSON.stringify({nup_type})
                    headers : this.state.hd
                }).then((response) => response.json())
                .then((res)=>{
                    if(!res.Error){
                        const resData = res.Data;
                        this.setState({ amounts : resData});
                        console.log('liat amou',resData);
                    } else {
                        this.setState({isLoaded: !this.state.isLoaded},()=>{
                            alert(res.Pesan)
                        });
                    }
                    // console.log('getAmount',res.Data.value);
                }).catch((error) => {
                    console.log(error);
                })
                :null}

        }else{
            const items = this.props.prevItems;
            // const dataBtype = await _getData("@checkNUP");
            // const nup_type = dataBtype[0].nup_type;
            // console.log('got nuptype', nup_type);
            {isMount ?
                fetch(urlApi + 'c_booking/getBookingAmount/'+ items.db_profile + "/" + items.entity_cd + "/" + items.project_no + "/" + this.props.propertyCode + "/" + this.props.clusterCode  ,{
                    // method: 'GET',
                    method:'POST',
                    // body: JSON.stringify({nup_type})
                    headers : this.state.hd
                }).then((response) => response.json())
                .then((res)=>{
                    if(!res.Error){
                        const resData = res.Data;
                        this.setState({ amounts : resData});
                        console.log('liat amou',resData);
                    } else {
                        this.setState({isLoaded: !this.state.isLoaded},()=>{
                            alert(res.Pesan)
                        });
                    }
                    // console.log('getAmount',res.Data.value);
                }).catch((error) => {
                    console.log(error);
                })
                :null}
        }
        
    }

    // getSprice = () => {
    //     const item = this.props.items;
    //     const items = this.props.prevItems;
    //     const pay_cd = this.state.payment_cd;

    //     // console.log('get __payCD', item);
    //     {
    //         isMount
    //             ? fetch(
    //                   urlApi +
    //                       "c_booking/getSprice/" +
    //                       items.db_profile +
    //                       "/" +
    //                       items.entity_cd +
    //                       "/" +
    //                       items.project_no +
    //                       "/" +
    //                       pay_cd +
    //                       "/" +
    //                       item.lot_no,
    //                   {
    //                       method: "POST",
    //                       headers: this.state.hd
    //                   }
    //               )
    //                   .then(response => response.json())
    //                   .then(res => {
    //                       if (!res.Error) {
    //                           const resData = res.Data[0];
    //                           this.setState({ sell_price: resData });
    //                         //   _storeData("@getprice",resData);
    //                       }
    //                       console.log("getSPrice", res);
    //                   })
    //                   .catch(error => {
    //                     //   console.log(error);
    //                   })
    //             : null;
    //     }
    // };

    getLoadData = () => {
       
        const items = this.props.prevItems;
        const userid = this.state.userId;
        const rowid = this.state.rowID;

        console.log('get _userID', userid);
        console.log('get _rowID', rowid);

        {
            isMount
                ? fetch(
                      urlApi +
                          "c_booking/myReservation/" +
                          items.db_profile +
                          "/" +
                          userid +
                          "/" +
                          rowid,
                      {
                          method: "POST",
                          headers: this.state.hd
                      }
                  )
                      .then(response => response.json())
                      .then(res => {
                          if (!res.Error) {
                              const resData = res.Data[0].business_id;
                              this.setState({ business_id: resData });
                            //   _storeData("@getprice",resData);
                            // console.log('check RESDATA', resData)
                          }
                          console.log("check _getLoadData", res);
                      })
                      .catch(error => {
                        //   console.log(error);
                      })
                : null;
        }
    };

    selectAmount = (val) => {
        // alert('tes');
        // console.log('val',val);

        if(val == undefined ){
        
        }else{
            this.setState({bookingtp :val},()=>{
                this.getAmount(val)
            })
            
        }

    }

    fromCamera(key){
        ImagePicker.openCamera({
            cropping: true,
            width: 600,
            height: 600,
            compressImageQuality: 0.7,
            compressImageMaxWidth: 600,
            compressImageMaxHeight:600,
        })
            .then(image => {
                console.log("Receive Image", image);
                this.setState({ [key]: {uri: image.path}});
            })
                .catch(e => console.log("tag", e));
    }

    fromGallery(key){
        ImagePicker.openPicker({
            multiple: false,
            width: 600,
            height: 600,
            compressImageQuality: 0.7,
            compressImageMaxWidth: 600,
            compressImageMaxHeight:600,
        })
            .then(image => {
                console.log('Received Image', image);
                this.setState({ [key]: {uri: image.path} });
            })
                .catch(e => console.log("tag", e));
    }

    showAlert = (key) => {
        Alert.alert(
            "Select a Photo",
            "Choose the place where you want to get a photo",
            [
                {text: "Gallery", onPress:()=>this.fromGallery(key)},
                {text: "Camera", onPress:()=>this.fromCamera(key)},
                {
                    text: "Cancel",
                    onPress:()=> console.log("User Cancel"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    };

    validating = validationData => {
        const keys = Object.keys(validationData);
        const errorKey = [];
        let isValid = false;

        keys.map((data, key) => {
            if (validationData[data].require) {
                console.log('data',data);
                if(data == 'nohp'){
                    let isError =
                    !this.state[data] || this.state[data].length == 0 || this.state.nohp.substring(0,1) != '0'
                        ? true
                        : false;
                    let error = "error" + data;
                    errorKey.push(isError);
                    this.setState({ [error]: isError });
                } else {
                    let isError =
                        !this.state[data] || this.state[data].length == 0 
                            ? true
                            : false;
                    let error = "error" + data;
                    errorKey.push(isError);
                    this.setState({ [error]: isError });
                }
            }
        });
        
        for (var i = 0; i < errorKey.length; i++) {
            if (errorKey[i]) {
                isValid = false;
                break;
            }
            isValid = true;
        }

        return isValid;
    };

    // ------END-------


    // --------------------- START ACTION SUBMIT ------------------

    submit = () => {
        this.setState({ isLoaded: !this.state.isLoaded});

        let filektp =  this.state.category == 'C' || this.state.pictUrlKTP == '' ? '' : 
            RNFetchBlob.wrap(
            this.state.pictUrlKTP.uri.replace("file://", "") 
        );

        let filenpwp = this.state.pictUrlNPWP == '' ? '' : 
            RNFetchBlob.wrap(
            this.state.pictUrlNPWP.uri.replace("file://", "")
        );

        let filebuktitf = this.state.pictUrlBuktiTF == '' ? '' :
            RNFetchBlob.wrap(
            this.state.pictUrlBuktiTF.uri.replace("file://", "")
        );

        const items = this.props.prevItems;
        
        const {
            category,
            name,
            fullname,
            nohp,
            email_add,
            no_ktp,
            npwp,
            citys,
            nationality_descs,
            addresses,
            address2,
            address3,
            post_cd,
            // booking_type,
            amounts,
            remarks,
            userId,
            lotnno,
            entity,
            project,
            payment_cd,
            rowID,
            business_id,
            // agent_cd,
            sell_price,
            Group_cd,
            email,
            identity_no,
            gender

        } = this.state;

        const formData = {
            category: category,
            bookedby: name,
            fullname: fullname,
            nohp: nohp,
            email_add: email_add,
            no_ktp: no_ktp,
            npwp: npwp,
            citys: citys,
            nationality_descs: this.state.category == 'C' ? '-': nationality_descs,
            addresses: addresses,
            address2: address2,
            address3: address3,
            post_cd: post_cd,
            // nup_type: booking_type[0].nup_type.trim(),
            // prefix: booking_type[0].prefix,
            // descsnup: booking_type[0].descs,
            expired_minute: '1440',
            amounts: amounts[0].value,
            amts: amounts[0].label,
            remarks: remarks,
            userID: userId,
            mailadd: email,
            lotNo: lotnno,
            entitys: entity,
            projects: project,
            payment_cds: payment_cd,
            // rowID: rowID,
            business_id: business_id,
            // agent_cd: agent_cd,
            sell_price: sell_price,
            Group_cd: Group_cd,
            clusterCode: this.props.clusterCode,
            propertyCode: this.props.propertyCode,
            identity_no: identity_no,

            pictUrlKTP:  filektp,
            pictUrlNPWP: filenpwp,
            pictUrlBuktiTF: filebuktitf,
            gender: gender
        }

        const isValid = this.validating({
            category: {require: true},
            fullname: { require: true },
            nohp: { require: true },
            email_add: { require: true },
            no_ktp: { require: this.state.category == 'C' ? false : true },
            npwp: { require: true},
            citys: { require: true },
            nationality_descs: { require: this.state.category == 'C' ? false : true },
            addresses: { require: true },
            post_cd: {require: true},
            // bookingtp: { require: true },
            amounts: { require: true },
            remarks: { require: true },
            pictUrlKTP: {require: this.state.category == 'C' ? false : true},
            pictUrlNPWP: {require: true},
            pictUrlBuktiTF: {require: true},
            gender: {require: this.state.category == 'C' ? false : true}
        });

        const _fullname = fullname.replace(/\s+/g, '_');

        let fileNameKtp = "KTP_RegistAgent_"+_fullname+".png";
        let fileNameNpwp = "NPWP_RegistAgent_"+_fullname+".png";
        let fileNameBuktiTf = "BuktiTF_RegistAgent_"+_fullname+".png";

        console.log('_getDataSaveAgent', formData);

        if (isValid) {
            // console.log('ttes');
            RNFetchBlob.fetch(
                "POST",
                urlApi + "c_booking/newSaveBooking/"+items.db_profile,
                {
                    "Content-Type": "multipart/form-data"
                },
                [
                    {name: "photoktp", filename: fileNameKtp, data: filektp},
                    {name: "photonpwp", filename: fileNameNpwp, data: filenpwp},
                    {name: "photobuktitf", filename: fileNameBuktiTf, data: filebuktitf},
                    {name: "data", data: JSON.stringify(formData)}
                ]
            )
                .then(resp =>{
                    const res = JSON.parse(resp.data);
                    // const res = JSON.stringify(resp.data);
                    // const res = JSON.parse(JSON.stringify(resp.data));
                    console.log("get __formData", res);
                    
                    if (!res.Error) {
                        this.setState({ isLogin: true}, () => {
                            alert(res.Pesan);
                            Actions.home();
                            // Actions.FormPayment({
                            //     prevItems: formData
                                // gotoTheItem: this.props.goToItem,
                                // item: this.props.items
                                // unitItems : this.props.items,
                                // items : this.props.items,
                                // lottype: this.props.lottype,
                                // propsCode: this.props.propertyCode,
                                // clusterCode : this.props.clusterCode,
                                // goToItem: this.props.goToItem
                            //   });
                            // Actions.pop({
                            //     prevItems: this.props.prevItems,
                            //     gotoTheItem: this.props.goToItem,
                            //     item: this.props.items
                            // });
                            // Actions.refresh({onBack:()=>this.goBacktoUnit()});
                            // _navigate("ChouseUnit", { prevItems: this.props.prevItems });

                        });
                    }else{
                        this.setState({ isLoaded: !this.state.isLoaded }, () => {
                            alert(res.Pesan);
                        });
                    }
                });
        }else{
            if(this.state.nohp.substring(0,1) == '0'){
                alert(" Data Harus Diisi Semua ");
            }
        }
    };
   
    getBiodata = () => {
        const category_cd = this.state.category;
        const no_ktp = this.state.no_ktp;
        let npwp_no = this.state.npwp;
        const items = this.props.prevItems;

        if (!npwp_no) {
            npwp_no = '-';
        }
        
        isMount ?
                    fetch( urlApi + 'c_booking/getBiodata/' + items.db_profile + "/" + category_cd + "/" + npwp_no + "/" + no_ktp , {
                        method: 'GET',
                    }).then((response) => response.json())
                      .then((res) => {
                          if(!res.Error){
                                const resData = res.Data;
                                const resBooking = res.DataBooking;
                                this.setState({ 
                                    fullname : resData[0].name,
                                    nohp     : resData[0].hand_phone == null ? '' : resData[0].hand_phone,
                                    email_add: resData[0].email_addr == null ? '' : resData[0].email_addr,
                                    citys    : resData[0].city == null ? '' : resData[0].city,
                                    nationality_descs: resData[0].nationality == null ? '' : resData[0].nationality,
                                    addresses: resData[0].address1 == null ? '' : resData[0].address1,
                                    address2: resData[0].address2 == null ? '' : resData[0].address2,
                                    address3: resData[0].address3 == null ? '' : resData[0].address3,
                                    post_cd: resData[0].post_cd == null ? '' : resData[0].post_cd,
                                    npwp     : resData[0].income_tax == null ? '' : resData[0].income_tax,
                                    gender   : resData[0].sex == null ? '' : resData[0].sex
                                    // remarks  : resData[0].remark,
                                    // pictUrlKTP:  {uri: resBooking[0].link_ktp},
                                    // pictUrlNPWP: {uri: resBooking[0].link_npwp},
                                });
                          } else {
                                  alert('New Customer');
                                  this.setState({ 
                                      fullname : '',
                                      nohp     : '0',
                                      email_add: '',
                                      citys    : '',
                                      nationality_descs: '',
                                      addresses: '',
                                      address2: '',
                                      address3: '',
                                      post_cd: '',
                                      remarks  : ''
                                  });
                                  this.state.category == 'I' ? this.setState({npwp: ''}) : ''
                          }
                          
                      })
                      : null
                
    };

    
    render() {
        let { bookedby, name, email, hp } = this.state;
        const prevItems = this.props.prevItems;
        const item = this.props.items;

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
                            {"Booking".toUpperCase()}
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
                                <Card style={{
                                    height: null,
                                    backgroundColor: 'white',
                                    shadowOffset: { width: 1, height: 1 },
                                    shadowColor: "#37BEB7",
                                    shadowOpacity: 0.5,
                                    elevation: 5,
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    flex: 1
                                }}>

                                    <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{
                                                fontSize: 15,
                                                textAlign: 'left',
                                                color: '#333',
                                                fontWeight: "bold"
                                            }}>
                                                Booking Details
                                    </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, }}>
                                            <Text style={{
                                                fontSize: 15,
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                color: '#333'
                                            }}>
                                                {prevItems.title}
                                        </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{
                                                fontSize: 15,
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                color: '#333'
                                            }}>
                                                {prevItems.towerDescs} | Lantai {item.level_no} | {item.lot_no}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{
                                                fontSize: 15,
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                color: '#333'
                                            }}>
                                               {/* {this.state.paydescs} |  */}
                                               IDR. {this.props.price.trx_amt}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </View>

                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Agent/Marketing Name</Text>
                                <TextInput 
                                    style={Styles.textInputBold} 
                                    value={this.state.name} 
                                    editable={false} />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Category</Text>
                                <Picker note
                                    mode="dropdown"
                                    style={Styles.textInput}
                                    selectedValue={this.state.category}
                                    onValueChange={(val)=>this.setState({category:val})} 
                                >
                                    <Picker.Item label="Choose Category" value='' />
                                    <Picker.Item label="Individual" value='I' style={Styles.overviewTitle} />
                                    <Picker.Item label="Company" value='C' style={Styles.overviewTitle}  />
                                </Picker>
                               

                                    
                                {this.state.errorcategory ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                ! Category Required
                                    </Text>
                                )
                                :null
                                }
                            </View>
                            <View style={this.state.category == 'C' ? {display: 'none'} : Styles.overview}> 
                                <Text style={this.state.category == 'C' ? {display: 'none'} : Styles.overviewTitle}>Identity No.</Text>
                                <Picker note
                                    mode="dropdown"
                                    style={this.state.category == 'C' ? {display: 'none'} : Styles.textInput}
                                    selectedValue={this.state.identity_no}
                                    onValueChange={(val)=>this.setState({identity_no:val, no_ktp: ''})} 
                                >
                                    <Picker.Item label="Choose Identity Card" value='' />
                                    <Picker.Item label="KTP" value='01' style={Styles.overviewTitle} />
                                    <Picker.Item label="SIM" value='02' style={Styles.overviewTitle}  />
                                    <Picker.Item label="KITAS" value='03' style={Styles.overviewTitle}  />
                                </Picker>
                                <TextInput 
                                    // keyboardType={"number-pad"}
                                    style={this.state.category == 'C' ? {display: 'none'} : Styles.textInput} 
                                    onChangeText={val => this.setState({no_ktp : val})} 
                                    value={this.state.no_ktp}
                                    maxLength={this.state.identity_no == '01' ? 16 : this.state.identity_no == '02' ? 15 : 25} />

                                    
                                {this.state.category == 'C' ? null : this.state.errorno_ktp ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                ! Identity No. Required
                                    </Text>
                                )
                                :null
                                }
                            </View>
                            <Button rounded warning full
                                    style={this.state.category == 'C' ? {display:'none'} : Styles.btnMedium  }
                                    onPress={()=>this.getBiodata()}>
                                    
                                    {
                                        !this.state.isLoaded ? (
                                            <ActivityIndicator color="#fff" />
                                        ):(
                                            <Text style={Styles.signInBtnText}>Search</Text>
                                        )
                                    }
                                    
                                   
                            </Button>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>NPWP No.</Text>
                                <TextInput 
                                    // keyboardType={"number-pad"}
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({npwp : val})} 
                                    value={this.state.npwp}
                                    maxLength={15} />

                                    
                                {this.state.errornpwp ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                ! NPWP No. Required
                                    </Text>
                                )
                                :null
                                }
                            </View>
                            <Button rounded warning full
                                    style={this.state.category == 'C' ? Styles.btnMedium : {display:'none'} }
                                    onPress={()=>this.getBiodata()}>
                                    
                                    {
                                        !this.state.isLoaded ? (
                                            <ActivityIndicator color="#fff" />
                                        ):(
                                            <Text style={Styles.signInBtnText}>Search</Text>
                                        )
                                    }
                                    
                                   
                            </Button>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Full Name</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({fullname : val})}
                                    value={this.state.fullname} />

                                    {this.state.errorfullname ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                    > 
                                        ! Full Name Required
                                        </Text>
                                        )
                                        :null
                                    }
                            </View>
                            <View style={this.state.category == 'C' ? {display: 'none'} : Styles.overview}>
                                <Text style={this.state.category == 'C' ? {display: 'none'} : Styles.overviewTitle}>Gender</Text>
                                <Picker note
                                    mode="dropdown"
                                    style={this.state.category == 'C' ? {display: 'none'} : Styles.textInput}
                                    selectedValue={this.state.gender}
                                    onValueChange={(val)=>this.setState({gender:val})} 
                                >
                                    <Picker.Item label="Choose Gender" value='' />
                                    <Picker.Item label="Male" value='M' style={Styles.overviewTitle} />
                                    <Picker.Item label="Female" value='F' style={Styles.overviewTitle}  />
                                </Picker>
                               

                                    
                                {this.state.category == 'C' ? null : this.state.errorgender ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                ! Gender Required
                                    </Text>
                                )
                                :null
                                }
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Mobile Number</Text>
                                <TextInput 
                                    placeholder=''
                                    keyboardType={"phone-pad"}
                                    style={Styles.textInput}
                                    onChangeText={val => this.setState({nohp : val})}
                                    value={this.state.nohp} />

                                    {this.state.errornohp ?
                                    this.state.nohp.substring(0,1) != '0' ? alert('Mobile Number Must Begins With 0 (Zero)') :
                                    ( 
                                        
                                        <Text
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 25,
                                            color: "red",
                                            fontSize: 12
                                        }}
                                        > 
                                        ! Mobile Number Required
                                        </Text>
                                    )
                                    :  this.state.nohp.substring(0,1) != '0' ? alert('Mobile Number Must Begins With 0 (Zero)') 
                                    :  null
                                    }
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Email Address</Text>
                                <TextInput 
                                    keyboardType="email-address"
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({email_add : val})} 
                                    value={this.state.email_add} />

                                    {this.state.erroremail_add ? (
                                    <Text
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 25,
                                            color: "red",
                                            fontSize: 12
                                        }}
                                        > 
                                        ! Email Required
                                    </Text>
                                    )
                                    :null
                                    }
                            </View>
                              {/*style = { {display = 'none'} }  */}
                            
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>City</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({citys : val})} 
                                    value={this.state.citys} />
                                 {this.state.errorcitys ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                 ! City Required
                                    </Text>
                                )
                                :null
                            }
                                
                            </View>
                            <View style={this.state.category == 'C' ? {display: 'none'} : Styles.overview}>
                                <Text style={this.state.category == 'C' ? {display: 'none'} : Styles.overviewTitle}>Nationality</Text>
                                <Picker note
                                    mode="dropdown"
                                    style={this.state.category == 'C' ? {display: 'none'} : Styles.textInput}
                                    selectedValue={this.state.nationality_descs}
                                    onValueChange={(val)=>this.setState({nationality_descs:val})}
                                >
                                    <Picker.Item label="Choose Nationality" />
                                    {this.state.nationality.map((data, key) =>
                                        <Picker.Item key={key} label={data.descs} value={data.nationality_cd} />
                                    )}
                                </Picker>
                                
                                    {this.state.category == 'C' ? null : this.state.errornationality_descs ? (
                                            <Text
                                                style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 25,
                                                    color: "red",
                                                    fontSize: 12
                                                }}
                                            >
                                                ! Select Nationality Required
                                            </Text>
                                        ) : null}
                                
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Your Address</Text>
                                <TextInput
                                    style={Styles.textInput}
                                    multiline={true}
                                    numberOfLines={1}
                                    onChangeText={val => this.setState({addresses : val})}
                                    maxLength= {60}
                                    value={this.state.addresses}
                                />
                                
                            {this.state.erroraddresses ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                 ! Address Required
                                    </Text>
                                )
                                :null
                            }
                                <TextInput
                                    style={Styles.textInput}
                                    multiline={true}
                                    numberOfLines={1}
                                    onChangeText={val => this.setState({address2 : val})} 
                                    maxLength= {60}
                                    value={this.state.address2}
                                />
                                
                            {/* {this.state.erroraddress2 ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                ! Address Required
                                    </Text>
                                )
                                :null
                            } */}
                                <TextInput
                                    style={Styles.textInput}
                                    multiline={true}
                                    numberOfLines={1}
                                    onChangeText={val => this.setState({address3 : val})} 
                                    maxLength= {60}
                                    value={this.state.address3}
                                />
                                
                            {/* {this.state.erroraddress3 ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                ! Address Required
                                    </Text>
                                )
                                :null
                            } */}
                            </View>

                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Post Code</Text>
                                <TextInput
                                    style={Styles.textInput}
                                    multiline={false}
                                    numberOfLines={1}
                                    keyboardType={"phone-pad"}
                                    onChangeText={val => this.setState({post_cd : val})} 
                                    value={this.state.post_cd}
                                />
                                
                            {this.state.errorpost_cd ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                 ! Post Code Required
                                    </Text>
                                )
                                :null
                            }
                            </View>
                            {/* <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Booking Type</Text>
                                <Picker note
                                    mode="dropdown"
                                    style={Styles.textInput}
                                    selectedValue={this.state.bookingtp}
                                    onValueChange={(val)=>this.selectAmount(val)}
                                >
                                    <Picker.Item label="Choose Booking Type" />
                                    {this.state.booking_type.map((data, key) =>
                                        <Picker.Item key={key} label={data.descs} value={data.nup_type} />
                                    )}
                                </Picker>
                                
                                {this.state.errorbookingtp ? (
                                        <Text
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 25,
                                                color: "red",
                                                fontSize: 12
                                            }}
                                        >
                                            ! Select Booking Type Required
                                        </Text>
                                    ) : null}
                            </View> */}
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Amount</Text>
                                 
                                {this.state.amounts.length == 0 ?
                                    <TextInput 
                                    style={Styles.textInputBold} 
                                    keyboardType="numeric" 
                                    value={this.state.amt}
                                    editable={false} 
                                    onChangeText={(val)=>this.setState({amt:val})}  
                                    />
                                    :
                                    <View>
                                        {this.state.amounts.map((data, key) =>
                                        <TextInput key={key} 
                                        style={Styles.textInputBold} 
                                        keyboardType="numeric" 
                                        value={numFormat(data.value)}
                                        editable={false} 
                                        label = {data.label}
                                        />
                                        )}
                                    </View>
                                    }
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>No. Referensi Bukti Bayar</Text>
                                <TextInput
                                    style={Styles.textInput}
                                    multiline={true}
                                    // numberOfLines={5}
                                    onChangeText={val => this.setState({remarks : val})} 
                                    value={this.state.remarks}
                                />
                                
                                {this.state.errorremarks ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                 ! Remarks Required
                                    </Text>
                                )
                                :null
                                }
                            </View>
                            <View style={this.state.category == 'C' ? {display: 'none'} : Styles.containImageTop}>
                                <Text 
                                style={this.state.category == 'C' ? {display: 'none'} : [
                                    Style.textBlack, 
                                    {paddingTop: 5}
                                ]}
                                
                                >
                                    Upload KTP
                                </Text>
                                <TouchableOpacity style={this.state.category == 'C' ? {display: 'none'} : {
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10
                                    }}
                                    onPress={() => this.showAlert("pictUrlKTP")}
                                    pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlKTP == null || this.state.pictUrlKTP =='' ?
                                            <View>
                                                <Image
                                                style={this.state.category == 'C' ? {display: 'none'} : {width: 200, height: 130}}
                                                source={uri = require("../../assets/images/ktp.png")} 
                                                />
                                            </View>
                                        :

                                        <Image style={this.state.category == 'C' ? {display: 'none'} : {width: 200, height: 130}} source={this.state.pictUrlKTP} />
                                    }
                                </TouchableOpacity>
                                {this.state.errorpictUrlKTP ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                 ! KTP Required
                                    </Text>
                                )
                                :null
                                }
                            </View>
                            <View style={Styles.containImageTop}>
                                <Text 
                                    style={[
                                        Style.textBlack, 
                                        {paddingTop: 5}
                                    ]}
                                >
                                    Upload NPWP
                                </Text>
                                <TouchableOpacity 
                                    style={{
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10,
                                    }}
                                    onPress={() => this.showAlert("pictUrlNPWP")}
                                    pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlNPWP == null || this.state.pictUrlNPWP =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={uri = require("../../assets/images/ktp.png")} />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={this.state.pictUrlNPWP} />
                                    }
                                </TouchableOpacity>
                                {this.state.errorpictUrlNPWP ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                 ! NPWP Required
                                    </Text>
                                )
                                :null
                                }
                            </View>
                            <View style={Styles.containImageTop}>
                                <Text 
                                style={[
                                    Style.textBlack, 
                                    {paddingTop: 5}
                                ]}
                                
                                >
                                    Upload Bukti Transfer
                                </Text>
                                <TouchableOpacity 
                                    style={{
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10
                                    }}
                                    onPress={() => this.showAlert("pictUrlBuktiTF")}
                                    pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlBuktiTF == null || this.state.pictUrlBuktiTF =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={uri = require("../../assets/images/ktp.png")} />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={this.state.pictUrlBuktiTF} />
                                    }
                                </TouchableOpacity>
                                {this.state.errorpictUrlBuktiTF ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                 ! Bukti Transfer Required
                                    </Text>
                                )
                                :null
                                }
                            </View>
                            <View style={Styles.overview}>
                                <Button rounded warning full
                                    style={{ marginTop: 16, borderRadius: 10 }}
                                    onPress={()=>this.submit()}>
                                    
                                    {
                                        !this.state.isLoaded ? (
                                            <ActivityIndicator color="#fff" />
                                        ):(
                                            <Text style={Styles.signInBtnText}>CONFIRM</Text>
                                        )
                                    }
                                    
                                   
                                </Button>
                            </View>
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
export default BookingPage;