import React, {Component} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  // Icon,
} from 'react-native';
// import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  Textarea,
} from 'native-base';
// import {Picker} from '@react-native-community/picker';
import RNPickerSelect from 'react-native-picker-select';

import Styles from './Style';
import {urlApi} from '@Config/services';
import {Style, Colors} from '../Themes';
import {Actions} from 'react-native-router-flux';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import {_storeData, _getData} from '@Component/StoreAsync';
import moment from 'moment';
import TabBar from '@Component/TabBar';
import {DateInput, MinuteInput, DatetimeInput} from '../components/Input';

class AddProspect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      company: true,
      individu: true,
      disable: true,
      enabled: false,
      makatrue: true,
      makafalse: false,

      status_cd: '',
      // status: '',
      email: '',
      detail: [],
      classCd: [],
      class_cd: '',
      prov: [],
      prov2: [],
      getstatus: [],
      getcity: [],
      getdistrict: [],
      getvillage: [],
      getpostcode: [],
      getmedia: [],
      getocupation: [],

      salutationcd: [],
      salutation_cd: '',
      descs: '',
      // birthdate: moment().format('YYYY-MM-DD HH:M:SS'),
      birthdate: new Date(),

      //tab 1
      business_id: '',
      descs: '',
      vip: '',
      category: '',
      getstatus: [],
      status_cd: '',
      status: '',

      //tab2
      salutation: '',
      name: '',
      addr1: '',
      addr2: '',
      addr3: '',
      post_cd: '',
      village: '',
      district: '',
      city: '',
      province_cd: '',
      tel_no: '',
      handphone: '', //handphone/wa
      hp: '', //alternate hp
      hp2: '', //alternate hp2
      email_addr: '',
      marital_status: '',

      //tab 3
      // marital_status: '',
      sex: '',
      spouse_name: '',
      spouse_hp: '',
      co_name: '', //company name
      co_addr1: '',
      co_post_cd: '',
      occupation: '',
      occupation_cd: '',
      contact_person: '', //contact
      media: '',
      media_cd: '',

      selProv: '',
      selCity: '',
      selDistrict: '',
      selVillage: '',
      zoomprovince: '',
      zoomcity: '',
      zoomdistrict: '',
      zoomvillage: '',
      zoompostcd: '',

      //tab Interest
      datainterest: [],
      property_cd: '',
      project_name: '',
      lot_no: '',
      rent: '',
      buy: '',
      provdescs: '',
      userId: '',

      chosenDate: new Date(),
    };
    this.setDate = this.setDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  setDate(chosenDate) {
    this.setState({chosenDate: moment(chosenDate).format('YYYY-MM-DD')});
  }

  async componentDidMount() {
    isMount = true;
    const data = {
      userId: await _getData('@UserId'),
    };
    console.log('userId', _getData('@UserId'));
    this.setState(data, () => {
      this.getProvince();
      // this.getCity()
      // this.getDistrict()
      // this.getVillage()
      this.getSalutation();
      this.getClassCode();
      this.getMedia();
      this.getStatus();
      // this.getOccupation()
    });
  }

  componentWillUnmount() {
    isMount = false;
  }

  // ----------------- GET DROPDOWN --------------------------
  getOccupation = () => {
    {
      isMount
        ? fetch(urlApi + 'c_ocupation/getOcupation/IFCAPB2/', {
            method: 'GET',
            // headers: {
            //     'Accept': 'application/json',
            //     'Content-Type': 'application/json'
            //   }
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({getocupation: resData});
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
              console.log('getocupation', res);
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  getProvince = () => {
    {
      isMount
        ? fetch(urlApi + 'c_prospect/zoom_province/IFCAPB2/', {
            method: 'GET',
            // method:'POST',
            // body: JSON.stringify({province_cd})
            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({prov: resData});
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
              console.log('getprov', res);
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  getCity = zoomprovince => {
    {
      isMount
        ? fetch(urlApi + 'c_prospect/zoom_city/IFCAPB2/', {
            // method:'GET',
            method: 'POST',
            body: JSON.stringify({province_cd: zoomprovince}),

            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({getcity: resData});
                console.log('zoom city', res);
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  getDistrict = zoomcity => {
    {
      isMount
        ? fetch(urlApi + 'c_prospect/zoom_district/IFCAPB2/', {
            // method:'GET',
            method: 'POST',
            body: JSON.stringify({
              city: zoomcity,
              province_cd: this.state.province_cd,
            }),

            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                // resData.map((data)=>{
                //     this.setState(prevState=>({
                //         agentDT : [...prevState.agentDT, {label: data.agent_name, value:data.agent_cd}]
                //     }))
                // })
                this.setState({getdistrict: resData});
                console.log('zoom district', res);
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  getVillage = zoomdistrict => {
    {
      isMount
        ? fetch(urlApi + 'c_prospect/zoom_village/IFCAPB2/', {
            // method:'GET',
            method: 'POST',
            body: JSON.stringify({
              province_cd: this.state.province_cd,
              city: this.state.city,
              district: zoomdistrict,
            }),

            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                // resData.map((data)=>{
                //     this.setState(prevState=>({
                //         agentDT : [...prevState.agentDT, {label: data.agent_name, value:data.agent_cd}]
                //     }))
                // })
                this.setState({getvillage: resData});
                console.log('zoom village', res);
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  getPostCode = zoomvillage => {
    {
      isMount
        ? fetch(urlApi + 'c_prospect/zoom_postcode/IFCAPB2/', {
            // method:'GET',
            method: 'POST',
            body: JSON.stringify({
              province_cd: this.state.province_cd,
              city: this.state.city,
              district: this.state.district,
              village: zoomvillage,
            }),

            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                // resData.map((data)=>{
                //     this.setState(prevState=>({
                //         agentDT : [...prevState.agentDT, {label: data.agent_name, value:data.agent_cd}]
                //     }))
                // })
                this.setState({getpostcode: resData});
                console.log('zoom postcode', res);
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  getSalutation = () => {
    {
      isMount
        ? fetch(urlApi + 'c_salutation/getSalutation/IFCAPB2/', {
            method: 'GET',
            // body: JSON.stringify({salutation})
            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;

                console.log('getsalutation', res);
                this.setState({salutationcd: resData});
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
              // console.log('salutation',res);
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  getClassCode = () => {
    {
      isMount
        ? fetch(urlApi + 'c_class/getClass/IFCAPB2/', {
            method: 'GET',
            // body: JSON.stringify({class_cd})
            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;

                // console.log('classcode',res);
                this.setState({classCd: resData});
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
              // console.log('classcode',res);
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  getMedia = () => {
    {
      isMount
        ? fetch(urlApi + 'c_media/getMedia/IFCAPB2/', {
            method: 'GET',
            // method:'POST',
            // body: JSON.stringify({media_cd})

            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                // resData.map((data)=>{
                //     this.setState(prevState=>({
                //         agentDT : [...prevState.agentDT, {label: data.agent_name, value:data.agent_cd}]
                //     }))
                // })
                this.setState({getmedia: resData});
                console.log('media', res);
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  getStatus = () => {
    // const dataProspect = await _getData("statusProspect");
    // const {status_cd} = dataProspect
    {
      isMount
        ? fetch(urlApi + 'c_status/getStatus2/IFCAPB2/', {
            method: 'POST',
            // body: JSON.stringify({status_cd})
            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;

                console.log('getstatus', res);
                this.setState({getstatus: resData});
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  alert(res.Pesan);
                });
              }
              // console.log('salutation',res);
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };
  //  ----------------- END GET DROPDOWN --------------------------

  validating = validationData => {
    const keys = Object.keys(validationData);
    const errorKey = [];
    let isValid = false;

    keys.map((data, key) => {
      if (validationData[data].require) {
        console.log('data', data);
        if (data == 'nohp') {
          let isError =
            !this.state[data] ||
            this.state[data].length == 0 ||
            this.state.nohp.substring(0, 1) != '0'
              ? true
              : false;
          let error = 'error' + data;
          errorKey.push(isError);
          this.setState({[error]: isError});
        } else {
          let isError =
            !this.state[data] || this.state[data].length == 0 ? true : false;
          let error = 'error' + data;
          errorKey.push(isError);
          this.setState({[error]: isError});
        }
      }
    });
    // console.log('keys',keys);
    for (var i = 0; i < errorKey.length; i++) {
      if (errorKey[i]) {
        isValid = false;
        break;
      }
      isValid = true;
    }

    return isValid;
  };

  // ----------------- CHOOSE DROPDOWN --------------------------

  chooseProv = zoomprovince => {
    console.log('prov change', zoomprovince);

    // alert(val);

    // alert(val);
    if (zoomprovince) {
      this.setState({province_cd: zoomprovince}, () => {
        // alert(selProv);
        this.getCity(zoomprovince);

        // this.getComission(val,'')
      });
    }
  };

  chooseCity = zoomcity => {
    console.log('city change', zoomcity);
    // alert(val);
    if (zoomcity) {
      this.setState({city: zoomcity}, () => {
        // alert(val);
        this.getDistrict(zoomcity);
        // this.getComission(val,'')
      });
    }
  };

  chooseDistrict = zoomdistrict => {
    if (zoomdistrict) {
      this.setState({district: zoomdistrict}, () => {
        this.getVillage(zoomdistrict);

        // this.getComission(val,'')
      });
    }
  };

  chooseVillage = zoomvillage => {
    if (zoomvillage) {
      this.setState({village: zoomvillage}, () => {
        // this.getPostCode(zoomvillage)
        // this.getComission(val,'')
      });
    }
  };
  //  ----------------- END CHOOSE DROPDOWN --------------------------

  changeform = cat => {
    if (cat == 'C') {
      this.setState({category: cat});
      // this.setState(previousState=>({company: previousState.company}))
      this.setState({individu: false});
    } else {
      this.setState({category: cat});
      this.setState({individu: true});
      // this.setState(previousState=>({company: !previousState.company}))
    }
  };
  onValueChange(value) {
    this.setState({
      selected: value,
    });
  }

  // ----------------------- SAVE THE DATA --------------------------

  async onSubmit() {
    const {
      class_cd,
      birthdate,
      vip,
      category,
      salutation,
      name,
      addr1,
      addr2,
      addr3,
      post_cd,
      village,
      district,
      city,
      province_cd,
      tel_no,
      handphone,
      hp,
      hp2,
      email_addr,
      marital_status,
      sex,
      spouse_name,
      spouse_hp,
      co_name,
      occupation,
      contact_person,
      media_cd,
      status_cd,
      // status,

      chosenDate,
      userId,
    } = this.state;

    const formData = {
      email_login: await _getData('@User'),
      class_cd: class_cd,
      // birthdate: this.state.chosenDate,
      birthdate: birthdate,
      // birthdate: moment(chosenDate).format("YYYY-MM-DD"),
      vip: vip,
      category: category,
      salutation: salutation,
      name: name,
      addr1: addr1,
      addr2: addr2,
      addr3: addr3,
      post_cd: post_cd,
      village: village,
      district: district,
      city: city,
      province_cd: province_cd,
      tel_no: tel_no,
      handphone: handphone,
      hp: hp,
      hp2: hp2,
      email_addr: email_addr,
      marital_status: marital_status,
      sex: sex,
      spouse_name: spouse_name,
      spouse_hp: spouse_hp,
      co_name: co_name,
      occupation: occupation,
      contact_person: contact_person,
      media_cd: media_cd,
      status_cd: status_cd,
      userID: userId,
      // status: status[0].label
    };

    const isValid = this.validating({
      category: {require: true},
      class_cd: {require: true},
      vip: {require: true},
      status_cd: {require: true},
      name: {require: this.state.category == 'C' ? false : true},
    });

    console.log('save prospect', formData);

    if (isValid) {
      fetch(urlApi + 'c_prospect/insertProspec/IFCAPB2/', {
        method: 'POST',
        body: JSON.stringify(formData),
        // headers :{
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //     'Token' : this.state.token
        // }
      })
        .then(response => response.json())
        .then(res => {
          console.log(res);
          if (!res.Error) {
            alert(res.Pesan);

            Actions.ProspectPage();
            // _storeData('@Name',name)
            // _storeData('@Handphone',hp)
            // _storeData('@ProfileUpdate',true)
          }
          console.log('update other information', res);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      if (this.state.errorcategory == true) {
        alert('Business Type Harus Diisi !');
      } else if (this.state.errorclass_cd == true) {
        alert('Class Harus Diisi !');
      } else if (this.state.errorvip == true) {
        alert('VIP Harus Diisi !');
      } else if (this.state.errorstatus_cd == true) {
        alert('Status Harus Diisi !');
      } else if (this.state.errorname == true) {
        alert('Name Harus Diisi !');
      }
    }
  }

  // ----------------------- END SAVE THE DATA --------------------------

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
              onPress={Actions.pop}>
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
              {'Add Prospect'.toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight} />
        </Header>
        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}>
          <View style={{flex: 1}}>
            <ProgressSteps>
              <ProgressStep
                label="Prospect Type"
                onNext={this.onNextStep}
                errors={this.state.errors}
                nextBtnStyle={{
                  backgroundColor: Colors.navyUrban,
                  borderRadius: 5,
                  width: 100,
                }}
                nextBtnTextStyle={{
                  color: Colors.white,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                {/* <View style={{ alignItems: 'center' }}> */}
                {/* {this.state.getstatus.length == 0 ?
                             <ActivityIndicator />
                         : */}
                <View>
                  <View style={Styles.overview}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                      <Icon
                        solid
                        name="star"
                        style={Styles.iconSub}
                        type="FontAwesome5"
                      />
                      <Text style={Styles.overviewTitles}>Business Type</Text>
                    </View>

                    {Platform.OS == 'android' ? (
                      <View
                        style={{
                          flex: 1,
                          // height: Platform.OS == 'ios' ? 50 : 0,
                        }}>
                        <RNPickerSelect
                          placeholder={{
                            label: 'Choose Business Type...',
                            value: null,
                            color: '#9EA0A4',
                          }}
                          // style={{inputAndroid: {color: 'black'}}}
                          useNativeAndroidPickerStyle={false}
                          style={{
                            inputAndroid: {
                              // backgroundColor: 'transparent',
                              color: 'black',
                            },
                            iconContainer: {
                              top: 5,
                              right: 15,
                            },
                          }}
                          selectedValue={this.state.category}
                          onValueChange={cat => this.changeform(cat)}
                          // textInputProps={{underlineColorAndroid: 'cyan'}}
                          items={[
                            //   {label: 'Choose Business Type'},
                            {label: 'Individu', value: 'I'},
                            {label: 'Company', value: 'C'},
                          ]}
                        />
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      </View>
                    ) : (
                      <View style={{flex: 1, height: 40}}>
                        <RNPickerSelect
                          placeholder={{
                            label: 'Choose Business Type...',
                            value: null,
                            color: '#9EA0A4',
                          }}
                          items={[
                            //   {label: 'Choose Business Type'},
                            {label: 'Individu', value: 'I'},
                            {label: 'Company', value: 'C'},
                          ]}
                          onValueChange={cat => this.changeform(cat)}
                          style={{
                            inputAndroid: {
                              backgroundColor: 'transparent',
                            },
                            iconContainer: {
                              top: 5,
                              right: 15,
                            },
                          }}
                          selectedValue={this.state.category}
                          useNativeAndroidPickerStyle={false}
                          textInputProps={{underlineColorAndroid: 'cyan'}}
                          // Icon={() => {
                          //   return (
                          //     <Icon
                          //       size={1.5}
                          //       color="gray"
                          //       name="chevron-down"
                          //     />
                          //   );
                          // }}
                        />
                      </View>
                    )}

                    {/* <RNPickerSelect 
                                    mode="dropdown"
                                    style={Styles.textInput}
                                    selectedValue={this.state.category}
                                    onValueChange={(cat)=>this.changeform(cat)}
                            >
                                <Picker.Item label="Choose Business Type" />
                                <Picker.Item label="Individu" value="I" />
                                <Picker.Item label="Company" value="C" />
                            </RNPickerSelect> */}
                    {/* </Item> */}

                    {this.state.errorcategory ? (
                      <Text
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 25,
                          color: 'red',
                          fontSize: 12,
                        }}>
                        ! Category Required
                      </Text>
                    ) : null}
                  </View>
                  <View style={Styles.overview}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                      <Icon
                        solid
                        name="star"
                        style={Styles.iconSub}
                        type="FontAwesome5"
                      />
                      <Text style={Styles.overviewTitles}>Class</Text>
                    </View>
                    {/* <Item rounded style={{ height: 35 }}>
                                            <Picker note
                                                mode="dropdown"
                                                style={Styles.textInput}
                                                selectedValue={this.state.class_cd}
                                                onValueChange={(val) => this.setState({ class_cd: val })}
                                            >
                                                <Picker.Item label="Choose Class" />
                                                {this.state.classCd.map((data, key) =>
                                                    <Picker.Item key={key} label={data.label} value={data.value} />
                                                )}
                                            </Picker>
                                        </Item> */}
                    {Platform.OS == 'android' ? (
                      <View style={{flex: 1}}>
                        <RNPickerSelect
                          selectedValue={this.state.class_cd}
                          placeholder={{
                            label: 'Choose Class...',
                            value: null,
                            color: '#9EA0A4',
                          }}
                          // style={Styles.textInput}
                          useNativeAndroidPickerStyle={false}
                          style={{inputAndroid: {color: 'black'}}}
                          onValueChange={val => this.setState({class_cd: val})}
                          items={this.state.classCd.map((data, key) => ({
                            label: data.label,
                            value: data.value,
                          }))}
                        />
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      </View>
                    ) : (
                      <View style={{flex: 1, height: 40}}>
                        <RNPickerSelect
                          placeholder={{
                            label: 'Choose Class Type...',
                            value: null,
                            color: '#9EA0A4',
                          }}
                          items={this.state.classCd.map((data, key) => ({
                            label: data.label,
                            value: data.value,
                          }))}
                          onValueChange={val => this.setState({class_cd: val})}
                          style={{
                            inputAndroid: {
                              backgroundColor: 'transparent',
                            },
                            iconContainer: {
                              top: 5,
                              right: 15,
                            },
                          }}
                          selectedValue={this.state.class_cd}
                          useNativeAndroidPickerStyle={false}
                          textInputProps={{underlineColorAndroid: 'cyan'}}
                          // Icon={() => {
                          //   return (
                          //     <Icon
                          //       size={1.5}
                          //       color="gray"
                          //       name="chevron-down"
                          //     />
                          //   );
                          // }}
                        />
                      </View>
                    )}

                    {this.state.errorclass_cd ? (
                      <Text
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 25,
                          color: 'red',
                          fontSize: 12,
                        }}>
                        ! Class Required
                      </Text>
                    ) : null}
                  </View>
                  <View style={Styles.overview}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                      <Icon
                        solid
                        name="star"
                        style={Styles.iconSub}
                        type="FontAwesome5"
                      />
                      <Text style={Styles.overviewTitles}>VIP</Text>
                    </View>
                    {/* <Item rounded style={{ height: 35 }}>
                                            <Picker note
                                                mode="dropdown"
                                                style={Styles.textInput}
                                                selectedValue={this.state.vip}
                                                onValueChange={(val) => this.setState({ vip: val })}
                                            >
                                                <Picker.Item label="Choose One" />
                                                <Picker.Item label="Yes" value="Y" />
                                                <Picker.Item label="No" value="N" />
                                            </Picker>
                                        </Item> */}
                    {Platform.OS == 'android' ? (
                      <View style={{flex: 1}}>
                        <RNPickerSelect
                          placeholder={{
                            label: 'Choose VIP...',
                            value: null,
                            color: '#9EA0A4',
                          }}
                          useNativeAndroidPickerStyle={false}
                          style={{inputAndroid: {color: 'black'}}}
                          selectedValue={this.state.vip}
                          onValueChange={val => this.setState({vip: val})}
                          items={[
                            {label: 'Yes', value: 'Y'},
                            {label: 'No', value: 'N'},
                          ]}
                        />
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      </View>
                    ) : (
                      <View style={{flex: 1, height: 50}}>
                        <RNPickerSelect
                          placeholder={{
                            label: 'Choose VIP...',
                            value: null,
                            color: '#9EA0A4',
                          }}
                          useNativeAndroidPickerStyle={false}
                          style={{inputAndroid: {color: 'black'}}}
                          selectedValue={this.state.vip}
                          onValueChange={val => this.setState({vip: val})}
                          items={[
                            {label: 'Yes', value: 'Y'},
                            {label: 'No', value: 'N'},
                          ]}
                        />
                      </View>
                    )}

                    {this.state.errorvip ? (
                      <Text
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 25,
                          color: 'red',
                          fontSize: 12,
                        }}>
                        ! VIP Required
                      </Text>
                    ) : null}
                  </View>

                  <View style={Styles.overview}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                      <Icon
                        solid
                        name="star"
                        style={Styles.iconSub}
                        type="FontAwesome5"
                      />
                      <Text style={Styles.overviewTitles}>Status</Text>
                    </View>
                    {Platform.OS == 'android' ? (
                      <View style={{flex: 1}}>
                        <RNPickerSelect
                          selectedValue={this.state.status_cd}
                          useNativeAndroidPickerStyle={false}
                          style={{inputAndroid: {color: 'black'}}}
                          onValueChange={val => {
                            const statuspros = this.state.getstatus.filter(
                              item => item.value == val,
                            );
                            console.log(
                              'status change',
                              this.state.getstatus.filter(
                                item => item.value == val,
                              ),
                            );
                            this.setState({status_cd: val, status: statuspros});
                          }}
                          items={this.state.getstatus.map((data, key) => ({
                            itemKey: key,
                            label: data.label,
                            value: data.value,
                          }))}
                        />
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      </View>
                    ) : (
                      <View style={{flex: 1, height: 50}}>
                        <RNPickerSelect
                          selectedValue={this.state.status_cd}
                          useNativeAndroidPickerStyle={false}
                          style={{inputAndroid: {color: 'black'}}}
                          onValueChange={val => {
                            const statuspros = this.state.getstatus.filter(
                              item => item.value == val,
                            );
                            console.log(
                              'status change',
                              this.state.getstatus.filter(
                                item => item.value == val,
                              ),
                            );
                            this.setState({status_cd: val, status: statuspros});
                          }}
                          items={this.state.getstatus.map((data, key) => ({
                            itemKey: key,
                            label: data.label,
                            value: data.value,
                          }))}
                        />
                      </View>
                    )}

                    {/* <Item rounded style={{ height: 35 }}>
                                            <Picker

                                                iosHeader="Select one"
                                                mode="dropdown"
                                                // style={{ width: 180,height: 40 }}
                                                style={Styles.textInput}
                                                selectedValue={this.state.status_cd}
                                                onValueChange={(val) => {
                                                    const statuspros = this.state.getstatus.filter(item => item.value == val)
                                                    console.log('status change', this.state.getstatus.filter(item => item.value == val));
                                                    this.setState({ status_cd: val, status: statuspros })
                                                }}
                                            // onValueChange={(val)=>{
                                            //     const statuspros = this.state.getstatus.filter(item=>item.value==val)
                                            //     this.setState({status_cd:val})
                                            // }}
                                            >
                                                <Picker.Item label="Choose Status" />
                                                {this.state.getstatus.map((data, key) =>
                                                    <Picker.Item key={key} label={data.label} value={data.value} />
                                                )}
                                                {/* <Picker.Item label="tes" value="1" />
                        <Picker.Item label="tes2" value="2" /> */}

                    {this.state.errorstatus_cd ? (
                      <Text
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 25,
                          color: 'red',
                          fontSize: 12,
                        }}>
                        ! Status Required
                      </Text>
                    ) : null}
                  </View>
                </View>
                {/* } */}
                {/* </View> */}
              </ProgressStep>

              {this.state.individu ? (
                <ProgressStep
                  label={`*Detail Information Individu`}
                  nextBtnStyle={{
                    backgroundColor: Colors.navyUrban,
                    borderRadius: 5,
                    width: 100,
                  }}
                  nextBtnTextStyle={{
                    color: Colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}
                  previousBtnStyle={{
                    backgroundColor: Colors.navyUrban,
                    borderRadius: 5,
                    width: 100,
                  }}
                  previousBtnTextStyle={{
                    color: Colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  <View style={Styles.overview}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}> */}
                    {/* <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" /> */}
                    <Text style={Styles.overviewTitle}>Salutation</Text>
                    {/* </View> */}
                    {/* <Item rounded style={{ height: 35 }}>
                                            <Picker
                                                placeholder="Select Salutation"
                                                mode="dropdown"
                                                style={Styles.textInput}
                                                selectedValue={this.state.salutation}
                                                onValueChange={(val) => this.setState({ salutation: val })}
                                            >
                                                <Picker.Item label="Choose Salutation" />
                                                {this.state.salutationcd.map((data, key) =>
                                                    <Picker.Item key={key} label={data.label} value={data.value} />
                                                )}
                                            </Picker>
                                        </Item> */}
                    <View
                      style={{flex: 1, height: Platform.OS == 'ios' ? 50 : 0}}>
                      <RNPickerSelect
                        selectedValue={this.state.status_cd}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        onValueChange={val => this.setState({salutation: val})}
                        items={this.state.salutationcd.map((data, key) => ({
                          itemKey: key,
                          label: data.label,
                          value: data.value,
                        }))}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                      <Icon
                        solid
                        name="star"
                        style={Styles.iconSub}
                        type="FontAwesome5"
                      />
                      <Text style={Styles.overviewTitles}>Name</Text>
                    </View>
                    <Input
                      style={Styles.textInput}
                      value={this.state.name}
                      onChangeText={name => this.setState({name})}
                    />

                    {this.state.errorname ? (
                      <Text
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 25,
                          color: 'red',
                          fontSize: 12,
                        }}>
                        ! Name Required
                      </Text>
                    ) : null}
                  </View>
                  <View style={Styles.overview}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}> */}
                    {/* <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" /> */}
                    <Text style={Styles.overviewTitle}>Address</Text>
                    {/* </View> */}
                    <Input
                      style={Styles.textInput}
                      multiline={true}
                      numberOfLines={2}
                      maxLength={60}
                      value={this.state.addr1}
                      onChangeText={addr1 => this.setState({addr1})}
                    />
                    <Input
                      style={Styles.textInput}
                      multiline={true}
                      numberOfLines={2}
                      maxLength={60}
                      value={this.state.addr2}
                      onChangeText={addr2 => this.setState({addr2})}
                    />
                    <Input
                      style={Styles.textInput}
                      multiline={true}
                      numberOfLines={2}
                      maxLength={60}
                      value={this.state.addr3}
                      onChangeText={addr3 => this.setState({addr3})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Province</Text>
                    {/* <Item rounded style={{ height: 35 }}>
                                            <Picker
                                                mode="dropdown"
                                                style={Styles.textInput}
                                                selectedValue={this.state.province_cd}
                                                // onValueChange={(val)=>this.setState({province_cd:val})}
                                                onValueChange={(zoomprovince) => this.chooseProv(zoomprovince)}
                                            >
                                                <Picker.Item label="Choose Province" />
                                                {this.state.prov.map((data, key) =>
                                                    <Picker.Item key={key} label={data.label} value={data.value} />
                                                )}
                                            </Picker>
                                        </Item> */}
                    <View
                      style={{
                        flex: 1,
                        // height: Platform.OS == 'ios' ? 50 : 0
                      }}>
                      <RNPickerSelect
                        selectedValue={this.state.province_cd}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        onValueChange={zoomprovince =>
                          this.chooseProv(zoomprovince)
                        }
                        items={this.state.prov.map((data, key) => ({
                          itemKey: key,
                          label: data.label,
                          value: data.value,
                        }))}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>City</Text>
                    {/* <Item rounded style={{ height: 35 }}>
                                            <Picker
                                                mode="dropdown"
                                                style={Styles.textInput}
                                                selectedValue={this.state.city}
                                                onValueChange={(zoomcity) => this.chooseCity(zoomcity)}
                                            >
                                                <Picker.Item label="Choose City" />
                                                {this.state.getcity.map((data, key) =>
                                                    <Picker.Item key={key} label={data.label} value={data.value} />
                                                )}
                                            </Picker>
                                        </Item> */}
                    <View
                      style={{
                        flex: 1,
                        // height: Platform.OS == 'ios' ? 50 : 0
                      }}>
                      <RNPickerSelect
                        selectedValue={this.state.city}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        onValueChange={zoomcity => this.chooseCity(zoomcity)}
                        items={this.state.getcity.map((data, key) => ({
                          itemKey: key,
                          label: data.label,
                          value: data.value,
                        }))}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>District</Text>
                    {/* <Item rounded style={{ height: 35 }}>
                                            <Picker
                                                mode="dropdown"
                                                style={Styles.textInput}
                                                selectedValue={this.state.district}
                                                onValueChange={(zoomdistrict) => this.chooseDistrict(zoomdistrict)}
                                            >
                                                <Picker.Item label="Choose District" />
                                                {this.state.getdistrict.map((data, key) =>
                                                    <Picker.Item key={key} label={data.label} value={data.value} />
                                                )}
                                            </Picker>
                                        </Item> */}
                    <View
                      style={{
                        flex: 1,
                        // height: Platform.OS == 'ios' ? 50 : 0
                      }}>
                      <RNPickerSelect
                        selectedValue={this.state.district}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        onValueChange={zoomdistrict =>
                          this.chooseDistrict(zoomdistrict)
                        }
                        items={this.state.getdistrict.map((data, key) => ({
                          itemKey: key,
                          label: data.label,
                          value: data.value,
                        }))}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Village</Text>
                    {/* <Item rounded style={{ height: 35 }}>
                                            <Picker
                                                mode="dropdown"
                                                style={Styles.textInput}
                                                selectedValue={this.state.village}
                                                onValueChange={(zoomvillage) => this.chooseVillage(zoomvillage)}
                                            >
                                                <Picker.Item label="Choose Village" />
                                                {this.state.getvillage.map((data, key) =>
                                                    <Picker.Item key={key} label={data.label} value={data.value} />
                                                )}
                                            </Picker>
                                        </Item> */}
                    <View
                      style={{
                        flex: 1,
                        // height: Platform.OS == 'ios' ? 50 : 0
                      }}>
                      <RNPickerSelect
                        selectedValue={this.state.village}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        onValueChange={zoomvillage =>
                          this.chooseVillage(zoomvillage)
                        }
                        items={this.state.getvillage.map((data, key) => ({
                          itemKey: key,
                          label: data.label,
                          value: data.value,
                        }))}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Post Code</Text>
                    <TextInput
                      keyboardType="number-pad"
                      style={Styles.textInput}
                      value={this.state.post_cd}
                      onChangeText={post_cd => this.setState({post_cd})}
                    />
                    {/* <Item rounded style={{height: 35}}>
                        <Picker note 
                                mode="dropdown"
                                style={Styles.textInput}
                                selectedValue={this.state.post_cd}
                                onValueChange={(val)=>this.setState({post_cd:val})}
                        >
                            <Picker.Item label="Choose Postcode" />
                             {this.state.getpostcode.map((data, key) =>
                                <Picker.Item key={key} label={data.label} value={data.value} />
                              )}
                        </Picker>
                        </Item> */}
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Telephone</Text>
                    <TextInput
                      keyboardType="number-pad"
                      style={Styles.textInput}
                      value={this.state.tel_no}
                      onChangeText={tel_no => this.setState({tel_no})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}> */}
                    {/* <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" /> */}
                    <Text style={Styles.overviewTitle}>
                      Handphone / Whatsapp
                    </Text>
                    {/* </View> */}
                    <TextInput
                      keyboardType="number-pad"
                      style={Styles.textInput}
                      value={this.state.handphone}
                      onChangeText={handphone => this.setState({handphone})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>
                      Alternatif Handphone
                    </Text>
                    <TextInput
                      keyboardType="number-pad"
                      style={Styles.textInput}
                      value={this.state.hp}
                      onChangeText={hp => this.setState({hp})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>
                      Alternatif Handphone 2
                    </Text>
                    <TextInput
                      keyboardType="number-pad"
                      style={Styles.textInput}
                      value={this.state.hp2}
                      onChangeText={hp2 => this.setState({hp2})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}> */}
                    {/* <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" /> */}
                    <Text style={Styles.overviewTitle}>Email</Text>
                    {/* </View> */}
                    <TextInput
                      keyboardType="email-address"
                      style={Styles.textInput}
                      value={this.state.email_addr}
                      onChangeText={email_addr => this.setState({email_addr})}
                    />
                  </View>
                </ProgressStep>
              ) : (
                <ProgressStep
                  label={`Detail Information Company`}
                  nextBtnStyle={{
                    backgroundColor: Colors.navyUrban,
                    borderRadius: 5,
                    width: 100,
                  }}
                  nextBtnTextStyle={{
                    color: Colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}
                  previousBtnStyle={{
                    backgroundColor: Colors.navyUrban,
                    borderRadius: 5,
                    width: 100,
                  }}
                  previousBtnTextStyle={{
                    color: Colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  <View style={Styles.overview}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}> */}
                    {/* <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" /> */}
                    <Text style={Styles.overviewTitle}>Address</Text>
                    {/* </View> */}
                    <TextInput
                      style={Styles.textInput}
                      numberOfLines={2}
                      multiline={true}
                      value={this.state.addr1}
                      onChangeText={addr1 => this.setState({addr1})}
                    />
                    <TextInput
                      style={Styles.textInput}
                      numberOfLines={2}
                      multiline={true}
                      value={this.state.addr2}
                      onChangeText={addr2 => this.setState({addr2})}
                    />
                    <TextInput
                      style={Styles.textInput}
                      numberOfLines={2}
                      multiline={true}
                      value={this.state.addr3}
                      onChangeText={addr3 => this.setState({addr3})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Province</Text>
                    {/* <Item rounded style={{ height: 35 }}>
                                                <Picker
                                                    mode="dropdown"
                                                    style={Styles.textInput}
                                                    selectedValue={this.state.province_cd}
                                                    // onValueChange={(val)=>this.setState({province_cd:val})}
                                                    onValueChange={(zoomprovince) => this.chooseProv(zoomprovince)}
                                                >
                                                    <Picker.Item label="Choose Province" />
                                                    {this.state.prov.map((data, key) =>
                                                        <Picker.Item key={key} label={data.label} value={data.value} />
                                                    )}
                                                </Picker>
                                            </Item> */}
                    <View
                      style={{flex: 1, height: Platform.OS == 'ios' ? 50 : 0}}>
                      <RNPickerSelect
                        selectedValue={this.state.province_cd}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        onValueChange={zoomprovince =>
                          this.chooseProv(zoomprovince)
                        }
                        items={this.state.prov.map((data, key) => ({
                          itemKey: key,
                          label: data.label,
                          value: data.value,
                        }))}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>City</Text>
                    {/* <Item rounded style={{ height: 35 }}>
                                                <Picker
                                                    mode="dropdown"
                                                    style={Styles.textInput}
                                                    selectedValue={this.state.city}
                                                    onValueChange={(zoomcity) => this.chooseCity(zoomcity)}
                                                >
                                                    <Picker.Item label="Choose City" />
                                                    {this.state.getcity.map((data, key) =>
                                                        <Picker.Item key={key} label={data.label} value={data.value} />
                                                    )}
                                                </Picker>
                                            </Item> */}
                    <View
                      style={{flex: 1, height: Platform.OS == 'ios' ? 50 : 0}}>
                      <RNPickerSelect
                        selectedValue={this.state.city}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        onValueChange={zoomcity => this.chooseCity(zoomcity)}
                        items={this.state.getcity.map((data, key) => ({
                          itemKey: key,
                          label: data.label,
                          value: data.value,
                        }))}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>District</Text>
                    {/* <Item rounded style={{ height: 35 }}>
                                                <Picker
                                                    mode="dropdown"
                                                    style={Styles.textInput}
                                                    selectedValue={this.state.district}
                                                    onValueChange={(zoomdistrict) => this.chooseDistrict(zoomdistrict)}
                                                >
                                                    <Picker.Item label="Choose District" />
                                                    {this.state.getdistrict.map((data, key) =>
                                                        <Picker.Item key={key} label={data.label} value={data.value} />
                                                    )}
                                                </Picker>
                                            </Item> */}
                    <View
                      style={{flex: 1, height: Platform.OS == 'ios' ? 50 : 0}}>
                      <RNPickerSelect
                        selectedValue={this.state.district}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        onValueChange={zoomdistrict =>
                          this.chooseDistrict(zoomdistrict)
                        }
                        items={this.state.getdistrict.map((data, key) => ({
                          itemKey: key,
                          label: data.label,
                          value: data.value,
                        }))}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Village</Text>
                    {/* <Item rounded style={{ height: 35 }}>
                                                <Picker
                                                    mode="dropdown"
                                                    style={Styles.textInput}
                                                    selectedValue={this.state.village}
                                                    onValueChange={(zoomvillage) => this.chooseVillage(zoomvillage)}
                                                >
                                                    <Picker.Item label="Choose Village" />
                                                    {this.state.getvillage.map((data, key) =>
                                                        <Picker.Item key={key} label={data.label} value={data.value} />
                                                    )}
                                                </Picker>
                                            </Item> */}
                    <View
                      style={{flex: 1, height: Platform.OS == 'ios' ? 50 : 0}}>
                      <RNPickerSelect
                        selectedValue={this.state.village}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        onValueChange={zoomvillage =>
                          this.chooseVillage(zoomvillage)
                        }
                        items={this.state.getvillage.map((data, key) => ({
                          itemKey: key,
                          label: data.label,
                          value: data.value,
                        }))}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Post Code</Text>
                    <TextInput
                      keyboardType="number-pad"
                      style={Styles.textInput}
                      value={this.state.post_cd}
                      onChangeText={post_cd => this.setState({post_cd})}
                    />
                    {/* <Item rounded style={{height: 35}}>
                            <Picker note 
                                    mode="dropdown"
                                    style={Styles.textInput}
                                    selectedValue={this.state.post_cd}
                                    onValueChange={(val)=>this.setState({post_cd:val})}
                            >
                                <Picker.Item label="Choose Post Code" />
                                {this.state.getpostcode.map((data, key) =>
                                    <Picker.Item key={key} label={data.label} value={data.value} />
                                )}
                            </Picker>
                            </Item> */}
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Telephone</Text>
                    <TextInput
                      keyboardType="number-pad"
                      style={Styles.textInput}
                      value={this.state.tel_no}
                      onChangeText={tel_no => this.setState({tel_no})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}> */}
                    {/* <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" /> */}
                    <Text style={Styles.overviewTitle}>
                      Handphone / Whatsapp
                    </Text>
                    {/* </View> */}
                    <TextInput
                      keyboardType="number-pad"
                      style={Styles.textInput}
                      value={this.state.handphone}
                      onChangeText={handphone => this.setState({handphone})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>
                      Alternatif Handphone
                    </Text>
                    <TextInput
                      keyboardType="number-pad"
                      style={Styles.textInput}
                      value={this.state.hp}
                      onChangeText={hp => this.setState({hp})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>
                      Alternatif Handphone 2
                    </Text>
                    <TextInput
                      keyboardType="number-pad"
                      style={Styles.textInput}
                      value={this.state.hp2}
                      onChangeText={hp2 => this.setState({hp2})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}> */}
                    {/* <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" /> */}
                    <Text style={Styles.overviewTitle}>Email</Text>
                    {/* </View> */}
                    <TextInput
                      keyboardType="email-address"
                      style={Styles.textInput}
                      value={this.state.email_addr}
                      onChangeText={email_addr => this.setState({email_addr})}
                    />
                  </View>
                </ProgressStep>
              )}

              {this.state.individu ? (
                <ProgressStep
                  label={`Other Information Individu`}
                  onSubmit={this.onSubmit}
                  nextBtnStyle={{
                    backgroundColor: Colors.navyUrban,
                    borderRadius: 5,
                    width: 100,
                  }}
                  nextBtnTextStyle={{
                    color: Colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}
                  previousBtnStyle={{
                    backgroundColor: Colors.navyUrban,
                    borderRadius: 5,
                    width: 100,
                  }}
                  previousBtnTextStyle={{
                    color: Colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  {/* <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Birth Date</Text>
                <View style={Styles.dateInput}>
                    <DatePicker onDateChange={this.setDate} locale={"en"} />
                
                </View>
            </View> */}
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Birth Date</Text>
                    <View style={Styles.dateInput}>
                      {/* <DatePicker onDateChange={this.setDate } locale={"en"} 
                    onValueChange={(val) =>this.setState({birthdate:val}) } 
                    onValueChange={(val) =>alert(val) } 
                     /> */}

                      <DatetimeInput
                        name="birthdate"
                        label="Birthdate"
                        mode="date"
                        minimumDate={new Date(1900, 1, 1)}
                        onChange={(name, val) =>
                          this.setState({birthdate: val})
                        }
                        value={this.state.birthdate}
                      />
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Married</Text>
                    {/* <Item rounded style={{ height: 35 }}>
                                            <Picker note
                                                mode="dropdown"
                                                style={Styles.textInput}
                                                selectedValue={this.state.marital_status}
                                                onValueChange={(val) => this.setState({ marital_status: val })}
                                            >
                                                <Picker.Item label="Choose One" />
                                                <Picker.Item label="Yes" value="Y" />
                                                <Picker.Item label="No" value="N" />
                                            </Picker>
                                        </Item> */}
                    <View
                      style={{flex: 1, height: Platform.OS == 'ios' ? 50 : 0}}>
                      <RNPickerSelect
                        selectedValue={this.state.marital_status}
                        onValueChange={val =>
                          this.setState({marital_status: val})
                        }
                        items={[
                          {label: 'Choose One'},
                          {label: 'Yes', value: 'Y'},
                          {label: 'No', value: 'N'},
                        ]}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Sex</Text>
                    {/* <Item rounded style={{ height: 35 }}>
                                            <Picker note
                                                mode="dropdown"
                                                style={Styles.textInput}
                                                selectedValue={this.state.sex}
                                                onValueChange={(val) => this.setState({ sex: val })}
                                            >
                                                <Picker.Item label="Choose Sex" />
                                                <Picker.Item label="Male" value="M" />
                                                <Picker.Item label="Female" value="F" />
                                            </Picker>
                                        </Item> */}
                    <View
                      style={{flex: 1, height: Platform.OS == 'ios' ? 50 : 0}}>
                      <RNPickerSelect
                        selectedValue={this.state.sex}
                        onValueChange={val => this.setState({sex: val})}
                        items={[
                          {label: 'Choose One'},
                          {label: 'Male', value: 'M'},
                          {label: 'Female', value: 'F'},
                        ]}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Spouse Name</Text>
                    <Input
                      style={Styles.textInput}
                      value={this.state.spouse_name}
                      onChangeText={spouse_name => this.setState({spouse_name})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Company Name</Text>
                    <Input
                      style={Styles.textInput}
                      value={this.state.co_name}
                      onChangeText={co_name => this.setState({co_name})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}> */}
                    {/* <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" /> */}
                    <Text style={Styles.overviewTitle}>Occupation</Text>
                    {/* </View> */}
                    <Input
                      style={Styles.textInput}
                      value={this.state.occupation}
                      onChangeText={occupation => this.setState({occupation})}
                    />
                    {/* <Item rounded style={{height: 35}}>
                <Picker 
                    placeholder="Occupation"
                    selectedValue={this.state.occupation}
                    onValueChange={(val)=>this.setState({occupation:val})}
                    // onValueChange={(val)=>alert(val)}
                >
                    <Picker.Item label="Choose Occupation" />
                    {this.state.getocupation.map((data, key) =>
                        <Picker.Item key={key} label={data.label} value={data.value} />
                    )}
                </Picker>
                </Item> */}
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Contact</Text>
                    <Input
                      style={Styles.textInput}
                      value={this.state.contact_person}
                      onChangeText={contact_person =>
                        this.setState({contact_person})
                      }
                    />
                  </View>
                  <View style={Styles.overview}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}> */}
                    {/* <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" /> */}
                    <Text style={Styles.overviewTitle}>Media</Text>
                    {/* </View> */}
                    {/* <Item rounded style={{ height: 35 }}>
                                            <Picker
                                                placeholder="Media"
                                                selectedValue={this.state.media_cd}
                                                onValueChange={(val) => this.setState({ media_cd: val })}
                                            >
                                                <Picker.Item label="Choose Media" />
                                                {this.state.getmedia.map((data, key) =>
                                                    <Picker.Item key={key} label={data.label} value={data.value} />
                                                )}
                                            </Picker>
                                        </Item> */}
                    <View
                      style={{flex: 1, height: Platform.OS == 'ios' ? 50 : 0}}>
                      <RNPickerSelect
                        selectedValue={this.state.media_cd}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        onValueChange={val => this.setState({media_cd: val})}
                        items={this.state.getmedia.map((data, key) => ({
                          itemKey: key,
                          label: data.label,
                          value: data.value,
                        }))}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </ProgressStep>
              ) : (
                <ProgressStep
                  label={`Other Information Company`}
                  onSubmit={this.onSubmit}
                  nextBtnStyle={{
                    backgroundColor: Colors.navyUrban,
                    borderRadius: 5,
                    width: 100,
                  }}
                  nextBtnTextStyle={{
                    color: Colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}
                  previousBtnStyle={{
                    backgroundColor: Colors.navyUrban,
                    borderRadius: 5,
                    width: 100,
                  }}
                  previousBtnTextStyle={{
                    color: Colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Company Name</Text>
                    <Input
                      style={Styles.textInput}
                      value={this.state.co_name}
                      onChangeText={co_name => this.setState({co_name})}
                    />
                  </View>
                  <View style={Styles.overview}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}> */}
                    {/* <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" /> */}
                    <Text style={Styles.overviewTitle}>Occupation</Text>
                    {/* </View> */}
                    <Input
                      style={Styles.textInput}
                      value={this.state.occupation}
                      onChangeText={occupation => this.setState({occupation})}
                    />
                    {/* <Item rounded style={{height: 35}}>
                <Picker 
                    placeholder="Occupation"
                    selectedValue={this.state.occupation}
                    onValueChange={(val)=>this.setState({occupation:val})}
                >
                    <Picker.Item label="Choose Occupation" />
                    {this.state.getocupation.map((data, key) =>
                        <Picker.Item key={key} label={data.label} value={data.value} />
                    )}
                </Picker>
                </Item> */}
                  </View>
                  <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>Contact</Text>
                    <Input
                      style={Styles.textInput}
                      value={this.state.contact_person}
                      onChangeText={contact_person =>
                        this.setState({contact_person})
                      }
                    />
                  </View>
                  <View style={Styles.overview}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}> */}
                    {/* <Icon solid name='star' style={Styles.iconSub} type="FontAwesome5" /> */}
                    <Text style={Styles.overviewTitle}>Media</Text>
                    {/* </View> */}
                    <View
                      style={{flex: 1, height: Platform.OS == 'ios' ? 50 : 0}}>
                      <RNPickerSelect
                        selectedValue={this.state.media_cd}
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        onValueChange={val => this.setState({media_cd: val})}
                        items={this.state.getmedia.map((data, key) => ({
                          itemKey: key,
                          label: data.label,
                          value: data.value,
                        }))}
                      />
                      {Platform.OS == 'android' ? (
                        <Text
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                          }}>
                          {' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </ProgressStep>
              )}
            </ProgressSteps>
          </View>
        </Content>
      </Container>
    );
  }
}
export default AddProspect;

const styles = StyleSheet.create({
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
