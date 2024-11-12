import React, {Component} from 'react';
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
  Modal,
  Animated,
  FlatList,
} from 'react-native';
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
} from 'native-base';
import {SearchBar} from 'react-native-elements';
import {Style, Colors} from '../Themes';
import {Actions} from 'react-native-router-flux';
import TabBar from '@Component/TabBar';
import Styles from './Style';
import {_storeData, _getData} from '@Component/StoreAsync';
import {urlApi} from '@Config/services';
import Shimmer from '@Component/Shimmer';
import {Input} from 'react-native-elements';
import moment from 'moment';
// import DateTimePicker from "react-native-modal-datetime-picker";
// import DatePicker from "react-native-modal-datetime-picker";
import {DateInput, MinuteInput, DatetimeInput} from '../components/Input';
import Timer from 'jest-jasmine2/build/jasmine/Timer';
import {isIfStatement} from '@babel/types';
// import { FlatList } from "react-native-gesture-handler";
// import {RNPicker} from "rn-modal-picker";

// import styles, { colors } from "./styles/index";

import RNPickerSelect from 'react-native-picker-select';

class AddInterest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      business_id: '',
      project_no: '',
      property_cd: '',
      lot_no: '',
      project_no: '',
      rent_flag: '',
      buy_flag: '',
      // descs: '',
      entity_cd: '',

      getproperty: [],
      getproject: [],
      // project: [],
      getlot: [],
      zoomproject: '',
      zoomproperty: '',

      modalVisible: false,

      // scrollY: new Animated.Value(0),
      loadMore: false,
      search: '',
      audit_user: '',
      data_follow: [],
    };

    this.arrayholder = [];
    console.log('props detail follow up', props);
  }

  async componentDidMount() {
    // Actions.refresh({ backTitle: () => this.props.datas.business_id });
    const project = await _getData('@UserProject');
    const dataProspect = await _getData('statusProspect');
    // const audit_user = await _getData('@UserId');
    // const name = await _getData('@Name');
    console.log('data prospect', dataProspect);
    // console.log('usrid',audit_user);
    // console.log('nameid', name);

    // console.log(tpm);
    const data = {
      business_id: dataProspect.business_id,
      audit_user: await _getData('@UserId'),
      // descs : this.props.datas.descs,
      // lot_no : this.props.datas.lot_no,
      // property_cd: this.props.datas.property_cd,
      // buy_flag: this.props.datas.buy_flag,
      // rent_flag : this.props.datas.rent_flag,
      // // rowID: this.props.datas.rowID,

      entity_cd: project[0].entity_cd,
      data_follow: await _getData('statusProspect'),
      // project_no: this.props.datas.project_no
    };
    isMount = true;
    this.setState(data, () => {
      console.log('data di list', data);
      this.zoomProject();
      this.zoomProperty();
      this.getLotNo();
      this.getEntity();
      // this.updateFollowUp()
      // this.getDataListProspect(this.props.datas)
      // this.getDataFollowUp(this.props.datas)
      // this.getStatus()
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onChange = () => {
    this.setState({open: true});
  };
  onClose = () => {
    this.setState({open: false});
  };

  zoomProject = async () => {
    // const project = await _getData('@UserProject');
    // const dataProspect = await _getData("statusProspect");
    // const {occupation} = dataProspect
    // const {occupation_cd} = this.state
    const {entity_cd} = this.state;
    const {project_no} = this.state;
    // const {project_no} = project[0].project_no
    // const {entity_cd} = this.state

    // console.log('array project', project);
    console.log('entity_cd _getdata', entity_cd);
    console.log('project_no _getdata', project_no);
    // console.log('this state property', property_cd);
    // const province = this.props.items
    console.log('urlapi zoomprojek', urlApi + 'c_project/zoomProject/IFCAPB2/');
    {
      isMount
        ? fetch(urlApi + 'c_project/zoomProject/IFCAPB2/', {
            method: 'GET',
            // method:'POST',
            // body: JSON.stringify({entity_cd,project_no})

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
                this.setState({getproject: resData});
                console.log('getproject', res);
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  // alert(res.Pesan)
                  alert('Project Kosong');
                  this.setState({project_no: '', getproject: []});
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  chooseProject = zoomproject => {
    console.log('project change', zoomproject);

    // alert(val);

    // alert(val);
    if (zoomproject) {
      this.setState({project_no: zoomproject}, () => {
        // alert(selProv);
        this.zoomProperty(zoomproject);
        this.getEntity(zoomproject);
        this.state.lot_no = '';
        this.state.getlot = '';
        // this.getComission(val,'')
      });
    }
  };

  getEntity = async zoomproject => {
    console.log('zoom project when project no is null', {
      project_no: zoomproject,
    });
    {
      isMount
        ? fetch(urlApi + 'c_project/getEntity/', {
            // method:'GET',
            method: 'POST',
            body: JSON.stringify({project_no: zoomproject}),

            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({entity_cd: resData[0].entity_cd});
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  // alert(res.Pesan)
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  zoomProperty = async zoomproject => {
    console.log('zoom project when project no is null', {
      project_no: zoomproject,
    });
    {
      isMount
        ? fetch(urlApi + 'c_property/zoomProperty/IFCAPB2/', {
            // method:'GET',
            method: 'POST',
            body: JSON.stringify({project_no: zoomproject}),

            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({getproperty: resData});
                console.log('zoom property', res);
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  // alert(res.Pesan)
                  alert('Property Kosong');
                  this.setState({property_cd: '', getproperty: []});
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };

  chooseProperty = zoomproperty => {
    console.log('property change', zoomproperty);

    // alert(val);

    // alert(val);
    if (zoomproperty) {
      this.setState({property_cd: zoomproperty}, () => {
        // alert(selProv);
        this.getLotNo(zoomproperty);
        this.state.lot_no = '';
        this.state.getlot = '';

        // this.getComission(val,'')
      });
    }
  };

  getLotNo = async zoomproperty => {
    console.log('get lotno when where null', {
      project_no: this.state.project_no,
      property_cd: zoomproperty,
      entity_cd: this.state.entity_cd,
    });
    console.log('url api lotno', urlApi + `c_lot/getLot/IFCAPB2/`);
    {
      isMount
        ? fetch(urlApi + 'c_lot/getLot/IFCAPB2/', {
            // method:'GET',
            method: 'POST',
            body: JSON.stringify({
              project_no: this.state.project_no,
              property_cd: zoomproperty,
              entity_cd: this.state.entity_cd,
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
                this.setState({getlot: resData}, function () {
                  this.arrayholder = resData;
                });
              } else {
                this.setState({isLoaded: !this.state.isLoaded}, () => {
                  // alert(res.Pesan)
                  alert('Lot No Kosong');
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
        : null;
    }
  };
  selectedItem = item => {
    console.log('item select lot no', item);

    // alert(val);

    // alert(val);
    if (item) {
      this.setState({lot_no: item});
      // this.setModalVisible(!this.state.modalVisible)
    }
    this.setModalVisible(!this.state.modalVisible);
  };

  renderRow = ({item}) => {
    console.log('item', item);
    return (
      // <TouchableOpacity >
      <ListItem
        style={{height: 20, marginVertical: 1}}
        // onValueChange={(val)=>this.alert(val)}
        onPress={() => this.selectedItem(item.value)}
        // onPress={()=>alert(item.value)}
        // onPress={(val)=>{
        // //    const valvalue = this.state.getocupation.filter(item=>item.value==val)
        //     console.log('value', this.state.getlot.filter(item=>item.value==val));
        // //    this.setState({occupation:val,occupation:statuspros})
        // }}
      >
        <Text
          style={{
            fontFamily: 'Montserrat-Regular',
            color: '#333',
            paddingBottom: 8,
            paddingTop: 8,
            fontSize: 15,
          }}>
          {item.value}
        </Text>
      </ListItem>

      // </TouchableOpacity>

      // <Text>tes</Text>
    );
  };

  updateSearch = search => {
    console.log('input search', search);
    this.setState({search});

    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function (item) {
      //bisa juga pakai getlot
      //applying filter for the inserted text in search bar
      const itemData = item.value ? item.value.toUpperCase() : ''.toUpperCase();
      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      getlot: newData,
      text: search,
    });
  };

  receiveProps = () => {
    // this.tes();
    isMount = true;
    // alert('refresh');
    this.getDataListProspect();
  };

  getDataListProspect = async () => {
    const status_cd = this.state.data_follow.status_cd;
    const email = await _getData('@User');
    const business_id = '';
    // alert(isMount);
    {
      isMount
        ? fetch(urlApi + 'c_prospect/getprospect/IFCAPB/', {
            method: 'POST',
            body: JSON.stringify({status_cd, email, business_id}),
            // headers : this.state.hd,
          })
            .then(response => response.json())
            .then(res => {
              if (!res.Error) {
                const resData = res.Data;

                this.setState({detail: resData});
                this.setState({entryDate: res.DataFollow});
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

  submitFollowUp = () => {
    const {
      business_id,

      project_no,
      property_cd,
      lot_no,
      rent_flag,
      buy_flag,
      entity_cd,
      audit_user,
      data_follow,
      //    status,
    } = this.state;

    const formData = {
      business_id: business_id,
      project_no: project_no,
      property_cd: property_cd,
      lot_no: lot_no,
      rent_flag: rent_flag,
      buy_flag: buy_flag,
      entity_cd: entity_cd,
      audit_user: audit_user,
      data_follow: data_follow,
    };
    console.log('update follow up', formData);

    fetch(urlApi + 'c_prospect_lot/submitFollowUp/IFCAPB2/', {
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
        if (!res.Error) {
          alert(res.Pesan);
          Actions.Detail({
            datas: data_follow,
            onBack: () => this.receiveProps(),
          });
          // _storeData('@Name',name)
          // _storeData('@Handphone',hp)
          // _storeData('@ProfileUpdate',true)
        }
        console.log('insert follow up sukses', res);
      })
      .catch(error => {
        console.log(error);
      });
  };

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
              {/* {"Low".toUpperCase()} */}
              {/* {data.descs} */}
              {/* {this.state.status_cd.toUpperCase()} */}
              {/* {this.state.descs.toUpperCase()} */}
              Add Interest Project
            </Text>
          </View>
          <View style={Style.actionBarRight} />
        </Header>

        <ScrollView>
          <View>
            <View style={{paddingVertical: 10}} pointerEvents="none">
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <Icon
                  solid
                  name="star"
                  style={Styles.iconSub}
                  type="FontAwesome"
                />
                <Text style={Styles.overviewTitles_regular}>Prospect ID</Text>
              </View>
              <TextInput
                style={Styles.textInput_medium}
                placeholder={'Prospect ID'}
                value={this.state.business_id}
                onChangeText={text => this.setState({business_id: text})}
              />
            </View>

            {this.state.getproject.length == 0 ? (
              <ActivityIndicator />
            ) : (
              <View style={{paddingVertical: 10}}>
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                  <Icon
                    solid
                    name="star"
                    style={Styles.iconSub}
                    type="FontAwesome"
                  />
                  <Text style={Styles.overviewTitles_regular}>
                    Project Name
                  </Text>
                </View>
                {Platform.OS == 'ios' ? (
                  <View style={{flex: 1}}>
                    <RNPickerSelect
                      style={{
                        inputIOS: {
                          fontFamily: 'Montserrat-Regular',
                          borderBottomWidth: 1,
                          borderColor: '#CCC',
                          fontSize: 14,
                          width: '100%',
                          borderRadius: 5,
                          textAlignVertical: 'bottom',
                          paddingVertical: 0.5,
                          paddingHorizontal: 20,
                          color: '#666',
                          // backgroundColor: this.state.disabledetailindividu ? '#f3f3f3' :  'white'
                        },
                      }} // to ensure the text is never behind the icon}}
                      //   placeholder={'cityy'}
                      placeholder={{
                        label: 'Choose a project...',
                        value: null,
                        color: '#9EA0A4',
                      }}
                      value={this.state.salutation}
                      selectedValue={this.state.project_no}
                      onValueChange={zoomproject =>
                        this.chooseProject(zoomproject)
                      }
                      items={this.state.getproject.map((data, key) => ({
                        key: key,
                        label: data.label,
                        value: data.value,
                      }))}
                    />
                  </View>
                ) : (
                  <View style={{flex: 1}}>
                    <RNPickerSelect
                      //   placeholder={'cityy'}
                      placeholder={{
                        label: 'Choose a project...',
                        value: null,
                        color: '#9EA0A4',
                      }}
                      selectedValue={this.state.project_no}
                      // style={Styles.textInput}
                      useNativeAndroidPickerStyle={false}
                      style={{inputAndroid: {color: 'black'}}}
                      onValueChange={zoomproject =>
                        this.chooseProject(zoomproject)
                      }
                      items={this.state.getproject.map((data, key) => ({
                        key: key,
                        label: data.label,
                        value: data.value,
                      }))}
                      // items={[
                      //   {label: 'Male', value: 'Male'},
                      //   {label: 'Female', value: 'Female'},
                      // ]}
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
                )}

                {/* <TextInput style={Styles.textInput} placeholder={'Occupation'} value={occupation} onChangeText={(val)=>{this.setState({occupation:val})}}/> */}
              </View>
            )}

            <View style={{paddingVertical: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <Icon
                  solid
                  name="star"
                  style={Styles.iconSub}
                  type="FontAwesome"
                />
                <Text style={Styles.overviewTitles_regular}>Property Name</Text>
              </View>
              {Platform.OS == 'ios' ? (
                <View style={{flex: 1}}>
                  <RNPickerSelect
                    style={{
                      inputIOS: {
                        fontFamily: 'Montserrat-Regular',
                        borderBottomWidth: 1,
                        borderColor: '#CCC',
                        fontSize: 14,
                        width: '100%',
                        borderRadius: 5,
                        textAlignVertical: 'bottom',
                        paddingVertical: 0.5,
                        paddingHorizontal: 20,
                        color: '#666',
                        // backgroundColor: this.state.disabledetailindividu ? '#f3f3f3' :  'white'
                      },
                    }} // to ensure the text is never behind the icon}}
                    //   placeholder={'cityy'}
                    placeholder={{
                      label: 'Choose a property...',
                      value: null,
                      color: '#9EA0A4',
                    }}
                    value={this.state.property_cd}
                    selectedValue={this.state.property_cd}
                    onValueChange={zoomproperty =>
                      this.chooseProperty(zoomproperty)
                    }
                    items={this.state.getproperty.map((data, key) => ({
                      key: key,
                      label: data.label,
                      value: data.value,
                    }))}
                  />
                </View>
              ) : (
                <View style={{flex: 1}}>
                  <RNPickerSelect
                    //   placeholder={'cityy'}
                    placeholder={{
                      label: 'Choose a property...',
                      value: null,
                      color: '#9EA0A4',
                    }}
                    selectedValue={this.state.property_cd}
                    // style={Styles.textInput}
                    useNativeAndroidPickerStyle={false}
                    style={{inputAndroid: {color: 'black'}}}
                    onValueChange={zoomproperty =>
                      this.chooseProperty(zoomproperty)
                    }
                    items={this.state.getproperty.map((data, key) => ({
                      key: key,
                      label: data.label,
                      value: data.value,
                    }))}
                    // items={[
                    //   {label: 'Male', value: 'Male'},
                    //   {label: 'Female', value: 'Female'},
                    // ]}
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
              )}

              {/* <TextInput style={Styles.textInput} placeholder={'Occupation'} value={occupation} onChangeText={(val)=>{this.setState({occupation:val})}}/> */}
            </View>

            <View style={{paddingVertical: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <Icon
                  solid
                  name="star"
                  style={Styles.iconSub}
                  type="FontAwesome"
                />
                <Text style={Styles.overviewTitles_regular}>Lot No</Text>
              </View>
              <Item rounded style={{height: 35}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible(true);
                  }}
                  style={{width: '100%'}}>
                  <TextInput
                    style={Styles.textInput_nobottom}
                    placeholder={'Lot No'}
                    value={this.state.lot_no}
                    onChangeText={val => {
                      this.setState({lot_no: val});
                    }}
                    editable={false}
                  />
                  {/* <Right style={{position:'absolute',right:10}}>
                                            <Icon solid name='sort-down' type="FontAwesome" style={{fontSize: 15,top: 3,right:1, color: '#666'}} />
                                        </Right>     */}
                </TouchableOpacity>
              </Item>
              <View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => this.alert('Modal has been closed.')}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',

                      // backgroundColor: Colors.twitter,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}>
                      <Text style={{fontWeight: 'bold', color: 'red'}}>
                        Close
                      </Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        width: 300,
                        height: 300,
                        backgroundColor: Colors.white,
                        borderRadius: 8,
                        borderColor: '#555',
                        borderWidth: 1,
                      }}>
                      {/* loadmore looping in here */}

                      <View style={{height: 300}}>
                        <SearchBar
                          placeholder="Search Here..."
                          onChangeText={this.updateSearch}
                          value={this.state.search}
                          containerStyle={{
                            backgroundColor: Colors.white,
                            height: 40,
                            borderRadius: 8,
                            borderWidth: 0,
                            borderColor: Colors.white,
                            borderBottomColor: Colors.white,
                          }}
                          inputContainerStyle={{
                            height: 30,
                            borderBottomColor: Colors.white,
                          }}
                        />
                        <FlatList
                          style={{
                            marginTop: 10,
                            marginBottom: 20,
                            marginRight: 20,
                          }}
                          data={this.state.getlot}
                          renderItem={this.renderRow}
                          keyExtractor={(item, index) => item.value}
                        />
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>

            <View style={{paddingVertical: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <Icon
                  solid
                  name="star"
                  style={Styles.iconSub}
                  type="FontAwesome"
                />
                <Text style={Styles.overviewTitles_regular}>Rent</Text>
              </View>
              {Platform.OS == 'ios' ? (
                <View style={{flex: 1}}>
                  <RNPickerSelect
                    value={this.state.rent_flag}
                    placeholder={{
                      label: 'Choose one...',
                      value: null,
                      color: '#9EA0A4',
                    }}
                    selectedValue={this.state.rent_flag}
                    style={{
                      inputIOS: {
                        fontFamily: 'Montserrat-Regular',
                        borderBottomWidth: 1,
                        borderColor: '#CCC',
                        fontSize: 14,
                        width: '100%',
                        borderRadius: 5,
                        textAlignVertical: 'bottom',
                        paddingVertical: 0.5,
                        paddingHorizontal: 20,
                        color: '#666',
                        // backgroundColor: this.state.disabledetailindividu ? '#f3f3f3' :  'white'
                      },
                    }} // to ensure the text is never behind the icon}}
                    onValueChange={val => this.setState({rent_flag: val})}
                    items={[
                      {label: 'Yes', value: 'Y'},
                      {label: 'No', value: 'N'},
                    ]}
                  />
                </View>
              ) : (
                <View style={{flex: 1}}>
                  <RNPickerSelect
                    //   placeholder={'cityy'}
                    placeholder={{
                      label: 'Choose a property...',
                      value: null,
                      color: '#9EA0A4',
                    }}
                    selectedValue={this.state.rent_flag}
                    // style={Styles.textInput}
                    useNativeAndroidPickerStyle={false}
                    style={{inputAndroid: {color: 'black'}}}
                    onValueChange={val => this.setState({rent_flag: val})}
                    // items={this.state.getproperty.map((data, key) => ({
                    //   key: key,
                    //   label: data.label,
                    //   value: data.value,
                    // }))}
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
              )}

              {/* <TextInput style={Styles.textInput} placeholder={'Province'} value={city} onChangeText={(val)=>{this.setState({province:val})}}/> */}
            </View>
            <View style={{paddingVertical: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <Icon
                  solid
                  name="star"
                  style={Styles.iconSub}
                  type="FontAwesome"
                />
                <Text style={Styles.overviewTitles_regular}>Buy</Text>
              </View>
              {Platform.OS == 'ios' ? (
                <View style={{flex: 1}}>
                  <RNPickerSelect
                    value={this.state.buy_flag}
                    placeholder={{
                      label: 'Choose one...',
                      value: null,
                      color: '#9EA0A4',
                    }}
                    selectedValue={this.state.buy_flag}
                    style={{
                      inputIOS: {
                        fontFamily: 'Montserrat-Regular',
                        borderBottomWidth: 1,
                        borderColor: '#CCC',
                        fontSize: 14,
                        width: '100%',
                        borderRadius: 5,
                        textAlignVertical: 'bottom',
                        paddingVertical: 0.5,
                        paddingHorizontal: 20,
                        color: '#666',
                        // backgroundColor: this.state.disabledetailindividu ? '#f3f3f3' :  'white'
                      },
                    }} // to ensure the text is never behind the icon}}
                    onValueChange={val => this.setState({buy_flag: val})}
                    items={[
                      {label: 'Yes', value: 'Y'},
                      {label: 'No', value: 'N'},
                    ]}
                  />
                </View>
              ) : (
                <View style={{flex: 1}}>
                  <RNPickerSelect
                    //   placeholder={'cityy'}
                    placeholder={{
                      label: 'Choose buy...',
                      value: null,
                      color: '#9EA0A4',
                    }}
                    selectedValue={this.state.buy_flag}
                    // style={Styles.textInput}
                    useNativeAndroidPickerStyle={false}
                    style={{inputAndroid: {color: 'black'}}}
                    onValueChange={val => this.setState({buy_flag: val})}
                    // items={this.state.getproperty.map((data, key) => ({
                    //   key: key,
                    //   label: data.label,
                    //   value: data.value,
                    // }))}
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
              )}

              {/* <TextInput style={Styles.textInput} placeholder={'Province'} value={city} onChangeText={(val)=>{this.setState({province:val})}}/> */}
            </View>
          </View>
          {/* {this.state.props == 0 ?
                            <ActivityIndicator />
                        : 
                    
                    } */}
        </ScrollView>

        <Button
          full
          style={{backgroundColor: Colors.navyUrban}}
          onPress={() => {
            this.submitFollowUp();
            // alert('update follow up')
          }}>
          <Text>Submit</Text>
        </Button>
      </Container>
    );
  }
}

export default AddInterest;

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
