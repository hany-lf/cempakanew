import React, {Component} from 'react';
import {SafeAreaView, ActivityIndicator} from 'react-native';
import {
  Scene,
  Router,
  Actions,
  Stack,
  ActionConst,
} from 'react-native-router-flux';
import {Root} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

import Home from './Home/Home';
import Login from './Intro/Intro';
import SignupGuest from './Signup/SignupGuest';
import SignupAgent from './Signup/SignupAgent';
import Reset from './ResetPass/Reset';
import Search from './Find/Search';
import Calcu from './Calcu/Calcu';
import Notif from './Notif/Notif';
import Akun from './Akun/Akun';
import AkunHome from './Akun/AkunHome';
import PDFViewer from './components/PDFViewer/index';

import PropertyDetail from './Property/PropertyDetail';

import Categoris from './Categoris/Categoris';
import Unitgoris from './Categoris/Unitgoris';
import Unittype from './Categoris/Unittype';
import UnitDetail from './Categoris/UnitDetail';

import {Tab} from 'native-base';
import ChouseFloor from './Categoris/ChouseFloor';
import ChooseTower from './Categoris/ChooseTower';
import ChouseUnit from './Categoris/ChouseUnit';
import ChooseZone from './Categoris/ChooseZone';
import UnitInfo from './Categoris/UnitInfo';
import UnitEnquiry from './Categoris/UnitEnquiry';

//Reservation
import MyReservationProjectPage from './Reservation/myReservation';

//Unit
import MyUnitPage from './MyUnit/myUnit';
import MyUnitDetailPage from './MyUnit/myUnitDetail';

//Billing
import MyBillingPage from './MyBilling/myBilling';

//Profile
import Profile from './Profile';

//Feed
import Feed from './Feed/Feed';

//News And Promo
import NewsPage from './Feed/Feed';

//Booking
import BookingPage from './Booking/Booking';
import FormPayment from './Booking/FormPayment';

//MyBooking
import MyBookingProjectPage from './MyBooking/MyBooking';

//Project
import Project from './Project/Search';

//Download
import DownloadPage from './Download/Download';

//Download
import NewsAndPromoDetail from './NewsAndPromo/NewsAndPromoDetail';

//Report
import ReportPage from './Reports/Reports';

//Report New
import ReportNew from './ReportNew/ReportNew';
import ReportProspect from './ReportNew/ReportProspect';
import ReportFollowUp from './ReportNew/ReportFollowUp';
import ReportListProspect from './ReportNew/ReportListProspect';
import ReportListFollowUp from './ReportNew/ReportListFollowUp';
//Comission
import Comission from './Comission/Comission';

// NUP
import NUPPage from './NUP';
import NUPPay from './NUP/NUP_Pay';
import NUPDetail from './NUP/NUPDetail';
import NUPTerm from './NUP/NUPTerm';

import Dashboard from './Reports/Dashboard';

import {_storeData, _getData} from '@Component/StoreAsync';

import Menu from './Menu/Menu';

//prospect
import ProspectPage from './Prospect/Prospect';
import AddProspect from './Prospect/AddProspect';
import ListProspect from './Prospect/ListProspect';

import FollowupProspect from './Prospect/FollowupProspect';
import DetailProspect from './Prospect/Detail';
import DetailPage from './Prospect/DetailPage';
import InterestProjectProspect from './Prospect/InterestProjectProspect';
import AddProject from './Prospect/AddProject';
import AddFollowUp from './Prospect/AddFollowUp';
import DetailFollowUp from './Prospect/DetailFollowUp';
import AddFutureAction from './Prospect/AddFutureAction';

//interest project
import AddInterest from './Interest/AddInterest';
import DetailInterest from './Interest/DetailInterest';

//attachment
import AddAttachment from './Prospect/AddAttachment';

//Attendance
import AttendancePage from './Attendance/Attendance';

//Survey
import SurveyPage from './Survey/Survey';
import SurveyDetail from './Survey/SurveyDetail';

const TabIcon = ({focused, iconName}) => {
  var color = focused ? '#343393' : '#7f8c8d';
  return (
    <Icon
      name={iconName}
      color={color}
      size={24}
      style={{marginTop: 8}}
      textStyle={color}
    />
  );
};

class Routes extends Component {
  constructor() {
    super();

    this.state = {
      hasLogin: false,
      isLoaded: false,
    };
  }

  async componentDidMount() {
    try {
      const isLogin = await _getData('@isLogin');
      console.log('isLogin: ', isLogin);
      if (isLogin) {
        this.setState({hasLogin: true, isLoaded: true});
      } else {
        this.setState({hasLogin: null, isLoaded: true});
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }

  render() {
    if (!this.state.isLoaded) {
      return <ActivityIndicator />;
    } else {
      return (
        <Root>
          <Router>
            <Scene key="root" headerLayoutPreset="center">
              <Scene
                key="Login"
                initial={!this.state.hasLogin}
                component={Login}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="tabbar"
                initial={this.state.hasLogin}
                hideNavBar
                translucent={true}
                tabs={true}>
                <Scene
                  key="home"
                  component={Home}
                  navTransparent={true}
                  hideNavBar={true}
                  title=""
                  tabBarLabel="Home"
                  // titleStyle=""
                  // labelStyle={{color: "#ad1819"}}
                  // activeTintColor="#ad1819"
                  // inactiveTintColor="#fff"
                  iconName="home"
                  icon={TabIcon}
                  // color="#ad1819"
                  // tintColor="#ad1819"
                />
                <Scene
                  key="ListingProjectPage"
                  component={Search}
                  navTransparent={true}
                  hideNavBar={true}
                  title=""
                  tabBarLabel="Project"
                  // color="#343393"
                  iconName="building-o"
                  icon={TabIcon}
                />
                <Scene
                  key="Menu"
                  component={Menu}
                  navTransparent={true}
                  hideNavBar={true}
                  title=""
                  tabBarLabel="Menu"
                  iconName="bars"
                  icon={TabIcon}
                />
                {/* <Scene
                key="notif"
                component={Notif}
                navTransparent={true}
                hideNavBar={true}
                title=""
                tabBarLabel="Notification"
                iconName="bell"
                icon={TabIcon}
              /> */}
                <Scene
                  key="akun"
                  component={AkunHome}
                  navTransparent={true}
                  hideNavBar={true}
                  title=""
                  tabBarLabel="Akun"
                  iconName="user"
                  icon={TabIcon}
                />
              </Scene>
              <Scene
                key="propertydetail"
                component={PropertyDetail}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="categoris"
                component={Categoris}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="unitgoris"
                component={Unitgoris}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="unittype"
                component={Unittype}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="unitdetail"
                component={UnitDetail}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="chousefloor"
                component={ChouseFloor}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="ProductProjectPage"
                component={ChooseTower}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="chouseunit"
                component={ChouseUnit}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="chooseZone"
                component={ChooseZone}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="unitinfo"
                component={UnitInfo}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="UnitEnquiryProjectPage"
                component={UnitEnquiry}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="profile"
                component={Profile}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="MyReservationProjectPage"
                component={MyReservationProjectPage}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="MyUnitPage"
                component={MyUnitPage}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="MyUnitDetailPage"
                component={MyUnitDetailPage}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="SimulasiPage"
                component={Calcu}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="NewsPage"
                component={NewsPage}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="BookingPage"
                component={BookingPage}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="MyBookingProjectPage"
                component={MyBookingProjectPage}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="FormPayment"
                component={FormPayment}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="project"
                component={Project}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="TWPBillProjectPage"
                component={MyBillingPage}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="ProjectDownloadPage"
                component={DownloadPage}
                hideNavBar={true}
                title=""
              />
              {/* //!! Sementara diubah Dulu */}
              <Scene
                key="ReportProject"
                component={ReportNew}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="ReportProspect"
                component={ReportProspect}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="ReportFollowUp"
                component={ReportFollowUp}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="ReportListProspect"
                component={ReportListProspect}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="ReportListFollowUp"
                component={ReportListFollowUp}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="Dashboard"
                component={Dashboard}
                hideNavBar={false}
                title=""
              />
              <Scene
                key="NewsAndPromoDetail"
                component={NewsAndPromoDetail}
                hideNavBar={true}
                title=""
              />

              {/*//! Sementara diubah  */}
              <Scene
                key="ReportNew"
                component={ReportPage}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="ComissionPage"
                component={Comission}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="NUPPage"
                component={NUPPage}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="SignupGuest"
                component={SignupGuest}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="SignupAgent"
                component={SignupAgent}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="ResetPass"
                component={Reset}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="PDFViewer"
                component={PDFViewer}
                hideNavBar={true}
                title=""
              />
              <Scene key="menu" component={Akun} hideNavBar={true} title="" />
              <Scene key="Feed" component={Feed} hideNavBar={true} title="" />
              <Scene
                key="NUPPay"
                component={NUPPay}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="NUPDetail"
                component={NUPDetail}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="NUPTerm"
                component={NUPTerm}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="ProspectPage"
                component={ProspectPage}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="AddProspect"
                component={AddProspect}
                hideNavBar={true}
                title=""
                animationEnabled={true}
                useNativeDriver={true} // Tambahkan ini
              />
              <Scene
                key="ListProspect"
                component={ListProspect}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="FollowupProspect"
                component={FollowupProspect}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="Detail"
                component={DetailProspect}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="DetailPage"
                component={DetailPage}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="InterestProjectProspect"
                component={InterestProjectProspect}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="AddProject"
                component={AddProject}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="AddFollowUp"
                component={AddFollowUp}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="DetailFollowUp"
                component={DetailFollowUp}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="AddFutureAction"
                component={AddFutureAction}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="AddInterest"
                component={AddInterest}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="DetailInterest"
                component={DetailInterest}
                hideNavBar={true}
                title=""
              />
              <Scene
                key="AddAttachment"
                component={AddAttachment}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="AttendancePage"
                component={AttendancePage}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="SurveyPage"
                component={SurveyPage}
                hideNavBar={true}
                title=""
              />

              <Scene
                key="SurveyDetail"
                component={SurveyDetail}
                hideNavBar={true}
                title=""
              />
            </Scene>
          </Router>
        </Root>
      );
    }
  }
}

export default Routes;
