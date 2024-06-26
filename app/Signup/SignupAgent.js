//import react in project
import React from "react";
import {
    PermissionsAndroid,
    Text,
    View,
    Image,
    StatusBar,
    Platform,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    BackHandler,
    I18nManager,
    StyleSheet,
    Alert
} from "react-native";
import {
    Container,
    Button,
    Icon,
    Right,
    Item,
    Input,
    Header,
    Left,
    Body,
    Title,
    ListItem
    // CheckBox
} from "native-base";
import { CheckBox } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
//import all the required component
import AppIntroSlider from "react-native-app-intro-slider";
import styles from "./styles";
import { Style, Colors } from "../Themes";
import { Actions } from "react-native-router-flux";
import { _storeData, _getData } from "@Component/StoreAsync";
import DeviceInfo from "react-native-device-info";
import { urlApi } from "@Config/services";
import RNPickerSelect from "react-native-picker-select";
import { ScrollView } from "react-native-gesture-handler";
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "rn-fetch-blob";
import RadioGroup from 'react-native-custom-radio-group'

const userType = [
    {
        key: 1,
        label: "Inhouse",
        value: "I"
    },
    {
        key: 2,
        label: "Member",
        value: "M"
    }
];



class SignupGuest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataProject: [],
            dataGroup:[],
            isLoaded: true,
            radioSelected: "",
            email: "",
            fullname: "",
            nik: "",
            nohp: "",
            pictUrl: require("../../assets/images/ktp.png"),

            selectedType: "",
            selectedGroup: [],
            selectItem:[]
        };
    }

    radioClick(id) {
        this.setState({
          radioSelected: id
        })
      }

    componentDidMount() {
        this.getGroupAgent();
    }

    chooseType = val => {
        this.setState({ selectedType: val });
    };

    chooseGroup = val => {
        this.setState({ selectedGroup: val });
    };

    getProject = () => {
        fetch(urlApi + "c_auth/getProjects/", {
            method: "GET"
        })
            .then(response => response.json())
            .then(res => {
                console.log("res", res);
                if (!res.Error) {
                    this.setState({ dataProject: res.Data });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    getGroupAgent = () => {
        fetch(urlApi + "c_auth/getGroupAgent/", {
            method: "GET"
        })
            .then(response => response.json())
            .then(res => {
                console.log("res", res);
                if (!res.Error) {
                    this.setState({ dataGroup: res.Data, selectItem: res.DataSelect });
                }
                console.log('dataGroup',this.state.dataGroup);
            })
            .catch(error => {
                console.log(error);
            });
    };

    validating = validationData => {
        const keys = Object.keys(validationData);
        const errorKey = [];
        let isValid = false;

        keys.map((data, key) => {
            if (validationData[data].require) {
                let isError =
                    !this.state[data] || this.state[data].length == 0
                        ? true
                        : false;
                let error = "error" + data;
                errorKey.push(isError);
                this.setState({ [error]: isError });
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

    submit = () => {
        const {
            selectedType,
            email,
            fullname,
            nik,
            nohp,
            pictUrl,
           selectedGroup
        //    radioSelected
        } = this.state;

        const frmData = {
            group_type: 'I', //selectedType,
            user_email: email,
            full_name: fullname,
            nomor_induk: nik,
            phone_no: nohp,
            pictUrl: pictUrl,
            group: selectedGroup,
            // group: radioSelected,
            filename: "KTP_RegisAgent_" + email + ".png"
        };
        console.log('frmData',frmData);
        const isValid = this.validating({
            email: { require: true },
            fullname: { require: true },
            nik: { require: true },
            nohp: { require: true },
            // selectedType: { require: true },
            selectedGroup: { require: true }
            // radioSelected: { require: true }
        });

        let fileName = "KTP_RegisAgent_" + email + ".png";
        let fileImg = "";

        if (pictUrl.uri && isValid ) {
            fileImg = RNFetchBlob.wrap(
                this.state.pictUrl.uri.replace("file://", "")
            );
               
        
            RNFetchBlob.fetch(
                "POST",
                urlApi + "/c_auth/SignUpAgent",
                {
                    "Content-Type": "multipart/form-data"
                },
                [
                    { name: "photo", filename: fileName, data: fileImg },
                    { name: "data", data: JSON.stringify(frmData) }
                ]
            ).then(resp => {
                const res = JSON.parse(resp.data);
                // console.log("res", res);
                alert(res.Pesan);
                if (!res.Error) {
                    Actions.pop();
                }
            });
        } else {
            alert("Please assign your ID Picture");
        }
    };

    handleCheck = data => {
        const { dataGroup } = this.state;
       
        dataGroup.forEach(datas => {
            
            if ((datas.group_cd === data.group_cd) && (datas.group_name === data.group_name)) {
                if (datas.checked) {
                    datas.checked = false;
                } else {
                    datas.checked = true;
                }
            }
        });

        this.setState({ dataGroup }, () => {
            const selectedGroup = this.state.dataGroup.filter(
                item => item.checked
            );
            this.setState({ selectedGroup });
        });
    };

    showAlert = () => {
        Alert.alert(
            "Select a Photo",
            "Choose the place where you want to get a photo",
            [
                { text: "Gallery", onPress: () => this.fromGallery() },
                { text: "Camera", onPress: () => this.fromCamera() },
                {
                    text: "Cancel",
                    onPress: () => console.log("User Cancel"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    };

    fromCamera() {
        ImagePicker.openCamera({
            cropping: true,
            width: 200,
            height: 200
        })
            .then(image => {
                console.log("received image", image);

                this.setState({ pictUrl: { uri: image.path } });
            })
            .catch(e => console.log("tag", e));
    }

    fromGallery(cropping, mediaType = "photo") {
        ImagePicker.openPicker({
            multiple: false,
            width: 200,
            height: 200
        })
            .then(image => {
                console.log("received image", image);

                this.setState({ pictUrl: { uri: image.path } });
            })
            .catch(e => console.log("tag", e));
    }

    render() {
        const groupAgent = [
            {
                value: "3000",
                label: "PT Depok Cipta Sejati"
            },
            {
                value: "2000",
                label: "PT Sartika Cipta Sejati"
            },
            {
                value: "1000",
                label: "PT Inten Cipta Sejati"
            },
            {
                value: "NIS1",
                label: "Non IFCA System Agent PT ICS"
            },
            {
                value: "NIS2",
                label: "Non IFCA System Agent PT SCS"
            }
        ];
        
       
        return (
            <Container>
                <ImageBackground style={styles.backgroundImage}>
                    <Header style={styles.header}>
                        <Left style={styles.left}>
                            <Button
                                transparent
                                style={Style.actionBarBtn}
                                onPress={Actions.pop}
                            >
                                <Icon
                                    active
                                    name="arrow-left"
                                    style={Style.textBlack}
                                    type="MaterialCommunityIcons"
                                />
                            </Button>
                        </Left>
                        <Body style={styles.body}>
                            <Text style={[Style.textBlack, Style.textMedium]}>
                                {"Sign Up as Agent"}
                            </Text>
                        </Body>
                        <Right style={styles.right}></Right>
                    </Header>
                    <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
                        <View
                            style={[
                                styles.inputFieldStyles,
                                { justifyContent: "flex-start" }
                            ]}
                        >
                            <View>
                                <View style={styles.containEmail}>
                                    <Input
                                        ref="email"
                                        style={styles.inputEmail}
                                        editable={
                                            this.props.data ? false : true
                                        }
                                        keyboardType="email-address"
                                        onChangeText={val =>
                                            this.setState({ email: val })
                                        }
                                        returnKeyType="next"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        underlineColorAndroid="transparent"
                                        textAlign={
                                            I18nManager.isRTL ? "right" : "left"
                                        }
                                        placeholder="Email"
                                        placeholderTextColor="rgba(0,0,0,0.20)"
                                        value={this.state.email}
                                    />
                                    {this.state.erroremail ? (
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
                                    ) : null}
                                </View>
                                <View style={styles.containMid}>
                                    <Input
                                        ref="fullname"
                                        style={styles.inputEmail}
                                        editable={true}
                                        onChangeText={val =>
                                            this.setState({ fullname: val })
                                        }
                                        returnKeyType="next"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        underlineColorAndroid="transparent"
                                        textAlign={
                                            I18nManager.isRTL ? "right" : "left"
                                        }
                                        placeholder="Full Name"
                                        placeholderTextColor="rgba(0,0,0,0.20)"
                                        value={this.state.fullname}
                                    />
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
                                    ) : null}
                                </View>
                                <View style={styles.containMid}>
                                    <Input
                                        ref="nik"
                                        style={styles.inputEmail}
                                        editable={true}
                                        onChangeText={val =>
                                            this.setState({ nik: val })
                                        }
                                        keyboardType="numeric"
                                        returnKeyType="next"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        underlineColorAndroid="transparent"
                                        textAlign={
                                            I18nManager.isRTL ? "right" : "left"
                                        }
                                        placeholder="NIK"
                                        placeholderTextColor="rgba(0,0,0,0.20)"
                                        value={this.state.nik}
                                    />
                                    {this.state.errornik ? (
                                        <Text
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 25,
                                                color: "red",
                                                fontSize: 12
                                            }}
                                        >
                                            ! NIK Required
                                        </Text>
                                    ) : null}
                                </View>
                                <View style={styles.containMid}>
                                    <Input
                                        ref="nohp"
                                        style={styles.inputEmail}
                                        editable={true}
                                        onChangeText={val =>
                                            this.setState({ nohp: val })
                                        }
                                        keyboardType="numeric"
                                        returnKeyType="next"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        underlineColorAndroid="transparent"
                                        lkk
                                        textAlign={
                                            I18nManager.isRTL ? "right" : "left"
                                        }
                                        placeholder="Handphone"
                                        placeholderTextColor="rgba(0,0,0,0.20)"
                                        value={this.state.nohp}
                                    />
                                    {this.state.errornohp ? (
                                        <Text
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 25,
                                                color: "red",
                                                fontSize: 12
                                            }}
                                        >
                                            ! No Hp Required
                                        </Text>
                                    ) : null}
                                </View>
                                {/* <View style={[styles.containMid]}>
                                    <RNPickerSelect
                                        style={pickerSelectStyles}
                                        items={userType}
                                        onValueChange={val =>
                                            this.chooseType(val)
                                        }
                                        placeholder={{
                                            key: 0,
                                            label: "Select User Type"
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                    />
                                    {this.state.errorselectedType ? (
                                        <Text
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 25,
                                                color: "red",
                                                fontSize: 12
                                            }}
                                        >
                                            ! Select User Type Required
                                        </Text>
                                    ) : null}
                                </View> */}
                                
                                <View style={[styles.containMid]}>
                                    
                                    <RNPickerSelect
                                        style={pickerSelectStyles}
                                        items = {this.state.selectItem}
                                        onValueChange={val =>
                                            this.chooseGroup(val)
                                        }
                                        placeholder={{
                                            key: 0,
                                            label: "Select Group"
                                        }}
                                        useNativeAndroidPickerStyle={false}

                                        
                                    />
                                    
                                    {this.state.errorselectedGroup ? (
                                        <Text
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 25,
                                                color: "red",
                                                fontSize: 12
                                            }}
                                        >
                                            ! Select Group Required
                                        </Text>
                                    ) : null}
                                </View>
                                {/* <View                   //RADIO BUTTON
                                    style={[
                                        styles.containMid,
                                        { height: null, paddingBottom: 10, paddingLeft: 20, alignItems: 'flex-start' }
                                    ]}
                                > 
                                <Text
                                style={[
                                    Style.textBlack,
                                    { paddingTop: 5, paddingLeft: 5, fontSize: 17 }
                                ]}
                                >
                                    Select Group Agent
                                </Text>
                                    {this.state.dataGroup.map((data, key) => {
                                        return (
                                            <View
                                               style={styles.checkboxWrap}
                                                key={key}
                                            >
                                            
                                            <TouchableOpacity key={data} onPress={this.radioClick.bind(this, data)}>
                                            <View style={{
                                            height: 24,
                                            width: 24,
                                            borderRadius: 12,
                                            borderWidth: 2,
                                            borderColor: '#000',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            }}>
                                            {
                                                data == this.state.radioSelected ?
                                                <View style={{
                                                    height: 12,
                                                    width: 12,
                                                    borderRadius: 6,
                                                    backgroundColor: '#000',
                                                }} /> 
                                                : null
                                            }
                                            </View>
                                              
                                            </TouchableOpacity>
                                                
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    paddingLeft : 10
                                                }}
                                            >
                                                {data.group_name}
                                            </Text>
                                            

                                             </View>
                                        );
                                        
                                    })}
                                  
                                            {this.state.errorradioSelected ? (
                                            <Text
                                                style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 25,
                                                    color: "red",
                                                    fontSize: 12
                                                }}
                                            >
                                                ! Select Group Required
                                            </Text>
                                             ) : null}  

                                             
                                </View> */}
                                <View style={[styles.containImage]}>
                                    <Text
                                        style={[
                                            Style.textBlack,
                                            { paddingTop: 5 }
                                        ]}
                                    >
                                        Upload Photo KTP
                                    </Text>
                                    <TouchableOpacity
                                        style={{
                                            padding: 2,
                                            borderWidth: 1,
                                            borderColor: "#d3d3d3",
                                            margin: 10
                                        }}
                                        onPress={this.showAlert}
                                    >
                                        <Image
                                            style={{ width: 200, height: 100 }}
                                            source={this.state.pictUrl}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <View
                        style={styles.signbtnSec}
                        pointerEvents={this.state.isLoaded ? "auto" : "none"}
                    >
                        <Button
                            style={styles.signInBtn}
                            onPress={() => this.submit()}
                        >
                            {!this.state.isLoaded ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.signInBtnText}>
                                    Register Now
                                </Text>
                            )}
                        </Button>
                    </View>
                </ImageBackground>
            </Container>
        );
    }
}
export default SignupGuest;

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 4,
        color: "black",
        paddingRight: 30 // to ensure the text is never behind the icon
    },
    inputAndroid: {
        ...styles.inputEmail,
        fontSize: 17
    }
});
