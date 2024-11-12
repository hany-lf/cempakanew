import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Style, Colors} from '../Themes';
import Styles from './Style';
import {
  Container,
  Content,
  Header,
  Button,
  Icon,
  Spinner,
  Toast,
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Geolocation from '@react-native-community/geolocation';
import ImagePicker from 'react-native-image-crop-picker';
import {_storeData, _getData} from '@Component/StoreAsync';
import RNFetchBlob from 'rn-fetch-blob';
import {urlApi} from '@Config/services';
import moment from 'moment';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

class AttendancePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: '',
      longitude: '',

      //isLoaded: false,
      isLoaded: true,
      isLoadedSubmit: true,
      isSuccess: false,
      isDone: false,
      isHighAccurate: true,

      address: '',
      foto: require('../../assets/images/user.png'),
      isFotoAv: false,
      email: '',
      nama: '',
      attend_sess: 1,
      attend_curr: 0,
      hd: '',

      //curTime: "",
      day: '',
      time: '',
      nowTime: '',

      day_server: '',
      time_server: '',
      nowTime_server: '',

      currentTime: '',
      dataTime: new Date(),
      diss: new Date('01-01-1970 00:03:44'),
      location: '',
      default_location: '',
    };

    this.showCamera = this.showCamera.bind(this);
    this.handleAbsent = this.handleAbsent.bind(this);
  }

  async componentDidMount() {
    const attend_sess = await _getData('@sessAttended');
    const attend_curr = await _getData('@currAttended');
    //const attend_sess = await _getData("@AttendanceSession");

    const data = {
      email: await _getData('@User'),
      nama: await _getData('@Name'),
      hd: new Headers({
        Token: await _getData('@Token'),
      }),
      attend_sess,
      attend_curr,
    };

    if (attend_curr == attend_sess) {
      this.setState({isDone: true});
    }
    this.setState(data, () => this.getTime(), this.getLocationDefault()); //untuk load time
    //this.setState(data, () => this.getGeo()); //langsung load location
    //this.setState(data); //tanpa load locations

    this.myInterval = setInterval(() => {
      this.getTime();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  getTime = () => {
    fetch(urlApi + 'c_attendance/getTime', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {
        if (!res.Error) {
          const resData = res.Data;

          this.setState({dataTime: resData.date_time});
          //   let hour =  moment(this.state.dataTime).format("H");
          // let minutes = moment(this.state.dataTime).format("mm");
          // let seconds = moment(this.state.dataTime).format("ss");
          // let am_pm = 'pm';

          // if( minutes < 10 )
          // {
          //     minutes = '0' + minutes;
          // }

          // if( seconds < 10 )
          // {
          //     seconds = '0' + seconds;
          // }

          this.setState({
            //  currentTime: hour + ':' + minutes + ':' + seconds  ,
            day_server: moment(this.state.dataTime).format('dddd'),
            time_server: moment(this.state.dataTime).format('MMMM DD YYYY'),
            nowTime_server: moment(this.state.dataTime).format('H:mm:ss'),
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  getLocationDefault = () => {
    fetch(urlApi + 'c_attendance/getLocationDefault', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {
        if (!res.Error) {
          const resData = res.Data;

          this.setState({
            location: resData.location_default,
            default_location: resData,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  getGeo = () => {
    const options = {
      timeout: 5000,
      maximumAge: 1000,
      enableHighAccuracy: false,
    };

    //this.setState({ isLoaded: false }, () => {
    //  Geolocation.getCurrentPosition(this.geoSuccess, this.geoError, options);
    //});

    this.setState({isLoaded: !this.state.isLoaded}, () => {
      Geolocation.getCurrentPosition(this.geoSuccess, this.geoError, options);
    });
  };

  geoSuccess = async position => {
    const {latitude, longitude} = position.coords;
    // const apiKey = "AIzaSyBY0EdmxQjo65OoFYIlQZ8jQ1FS8VOTFC8";
    const apiKey = 'AIzaSyDob2sgyF1CMvdN3dv-ZaIN4939EzQ6YVU';
    let messageToast = '';
    this.setState({latitude, longitude});

    if (!position.mocked) {
      await fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          latitude +
          ',' +
          longitude +
          '&key=' +
          apiKey,
      )
        .then(response => response.json())
        .then(res => {
          console.log('ADDRESS GEOCODE is BACK!! => ', res);
          if (res.status == 'OK') {
            const address = res.results[0].formatted_address;
            console.log('adress', address);
            //this.setState({ address, isLoaded: true, isSuccess: true }, () => {
            //  messageToast = "Your address " + address;
            //});
            this.setState(
              {address, isLoaded: !this.state.isLoaded, isSuccess: true},
              () => {
                messageToast = 'Your address ' + address;
              },
            );

            this.map.animateToRegion(
              {
                latitude,
                longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              },
              1000,
            );
          } else {
            res.status == 'ZERO_RESULTS'
              ? (messageToast = `Your Location doesn't available in maps`)
              : null;
            //this.setState({ isLoaded: true, isSuccess: false });
            this.setState({isLoaded: !this.state.isLoaded, isSuccess: false});
          }
        });
    } else {
      messageToast = `You are using mocked gps`;
    }

    Toast.show({
      text: messageToast,
      duration: 3000,
    });
  };

  geoError = error => {
    console.log('error', error);
    Toast.show({
      text: error.message + ', Please make sure your GPS is on.',
      duration: 3000,
    });
    this.setState({
      //isLoaded: true,
      isLoaded: !this.state.isLoaded,
      isSuccess: false,
      isHighAccurate: false,
    });
  };

  showCamera() {
    ImagePicker.openCamera({
      cropping: true,
      width: 500,
      height: 800,
    })
      .then(image => {
        console.log('received image', image);

        this.setState({isFotoAv: true, foto: {uri: image.path}});
      })
      .catch(e => console.log('tag', e));
  }

  handleAbsent() {
    this.setState({isLoadedSubmit: !this.state.isLoadedSubmit});
    const data = this.state;
    const formData = {
      email: data.email,
      nama: data.nama,
      coor: data.latitude + ',' + data.longitude,
      positions: data.address,
      pict_url: data.foto.uri,
      //attend_sess: data.attend_sess,
      attend_sess: data.attend_curr,
    };
    let fileName = 'Test.jpg';
    let fileImg = RNFetchBlob.wrap(data.foto.uri);
    console.log('formData', formData);

    RNFetchBlob.fetch(
      'POST',
      urlApi + '/c_attendance/saveAttendance/IFCAPB',
      {
        'Content-Type': 'multipart/form-data',
        Token: this.state.token,
      },
      [
        {name: 'photo', filename: fileName, data: fileImg},
        {name: 'data', data: JSON.stringify(formData)},
      ],
    ).then(resp => {
      console.log('res_if', resp);
      let res = JSON.parse(resp.data);
      console.log('res', res);
      alert(res.Pesan);
      if (!res.Error) {
        _storeData('@sessAttended', formData.attend_sess);
        Actions.pop();
      } else {
        this.setState({isLoadedSubmit: !this.state.isLoadedSubmit}, () => {
          alert(res.Pesan);
        });
      }
    });
  }

  render() {
    const {isLoaded, isSuccess, isFotoAv, foto, isLoadedSubmit} = this.state;

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
            <Text style={Style.actionBarText}>{'Absent'.toUpperCase()}</Text>
          </View>
          <View style={Style.actionBarRight}></View>
        </Header>
        <ScrollView>
          {/* <View>
              <Text style={Style.textBlack}>{this.state.curTime}</Text>
            </View> */}
          <View style={Styles.wrapday}>
            <Text style={Style.textday}>{this.state.day_server}</Text>
            <Text style={Style.texttime}>{this.state.nowTime_server}</Text>
            <Text style={Style.textdate}>{this.state.time_server}</Text>
          </View>

          <View style={Styles.wrapBtnCheck}>
            <Button primary small full large rounded onPress={this.getGeo}>
              <Text style={Style.textWhite}>Check Location</Text>
            </Button>
          </View>

          <View>
            {!this.state.default_location.latitude &&
            !this.state.default_location.longitude ? (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Spinner size="large" />
                <Text style={Style.textBlack}>Please Wait</Text>
              </View>
            ) : isSuccess ? (
              <MapView
                //ref={mapRef}
                ref={map => (this.map = map)}
                style={Styles.map}
                showsUserLocation={true}
                followsUserLocation={true}>
                <MapView.Marker
                  coordinate={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                  }}
                  title={this.state.address}
                  draggable
                />
              </MapView>
            ) : (
              <MapView
                provider={PROVIDER_GOOGLE}
                style={Styles.map}
                initialRegion={{
                  latitude: this.state.default_location.latitude,
                  longitude: this.state.default_location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showsUserLocation={true}>
                <MapView.Marker
                  coordinate={{
                    latitude: this.state.default_location.latitude,
                    longitude: this.state.default_location.longitude,
                  }}
                  title={this.state.default_location.location_default}
                  draggable
                />
              </MapView>
            )}
          </View>

          <View style={Styles.wrapday}>
            <Text style={Style.textloc}>Your Location</Text>
          </View>

          <View
            style={[Styles.wrapLocation]}
            //onPress={this.showCamera}
          >
            {!this.state.isLoaded ? (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Spinner size="large" />
                <Text style={Style.textBlack}>Try to get your location</Text>
              </View>
            ) : isSuccess ? (
              <View>
                <Text style={Style.textshow}>{this.state.address}</Text>
              </View>
            ) : (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={Style.textshow}>
                  {this.state.default_location.location_default}
                </Text>
              </View>
            )}
          </View>

          {isSuccess ? (
            <TouchableOpacity
              style={[Styles.wrapImg, {borderWidth: 1, borderColor: '#333'}]}
              onPress={this.showCamera}>
              <Image
                style={[Styles.wrapImg, {resizeMode: 'cover'}]}
                source={foto}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[Styles.wrapImg, {borderWidth: 1, borderColor: '#888888'}]}
              disabled={true}
              //onPress={this.getGeo}
            >
              <Image
                style={[Styles.wrapImg, {resizeMode: 'cover'}]}
                source={foto}
              />
            </TouchableOpacity>
          )}
          <View style={Styles.wrapBtn}>
            <Button
              primary
              small
              full
              large
              rounded
              disabled={
                isSuccess == true && isFotoAv == true && isLoadedSubmit == true
                  ? false
                  : true
              }
              onPress={this.handleAbsent}>
              {!this.state.isLoadedSubmit ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={Style.textWhite}>Absent</Text>
              )}
            </Button>
          </View>
        </ScrollView>
      </Container>
    );
  }
}
export default AttendancePage;
