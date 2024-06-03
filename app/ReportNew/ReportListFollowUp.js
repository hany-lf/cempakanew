import React, { Component } from "react";
import {
    StatusBar,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SegmentedControlIOS,
    TextInput,
    ScrollView,
    ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    Textarea
} from 'native-base'
import {
    Table,
    Row,
    Rows,
    TableWrapper,
    Cell
} from "react-native-table-component";
import nbStyles from "./Style3";
import ModalSelector from "react-native-modal-selector";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import numFormat from "@Component/numFormat";
import { Style, Colors } from "../Themes";
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config/services";
import {  MinuteInput, DateInput, DatetimeInput } from "../components/Input";

class ReportListFollowUp extends Component {
   

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            totalInv: 0,
            dataRow: [],
            jumlah: 0,
            user_id: '',
            isLoad : true,
            widthArr: [120, 80, 120, 200],
            alignText: [
                { margin: 6, color: "#444",fontFamily: "Montserrat-Regular",textAlign : 'left'}, 
                { margin: 6, color: "#444",fontFamily: "Montserrat-Regular",textAlign : 'left'},
                { margin: 6, color: "#444",fontFamily: "Montserrat-Regular",textAlign : 'center'},
                { margin: 6, color: "#444",fontFamily: "Montserrat-Regular",textAlign : 'center'},
                { margin: 6, color: "#444",fontFamily: "Montserrat-Regular",textAlign : 'center'}
            ]
        };
    }

    async componentDidMount() {
        isMount = true;
        const data = {
            email: await _getData("@User"),
            user_id : await _getData('@UserId')
        };
        
        this.setState(data, () => {
            this.getDataReport();
        });
    }

    getDataReport = () => {
        const status = this.props.status;
        const { startDate, endDate } = this.props;
        this.setState({isLoad : true})

        const formData = {
            status: status? status : '',
            date_start: startDate,
            date_end: endDate,
            user_id: this.state.user_id
        };
        console.log('formData',formData);
        {isMount ? 
        fetch(urlApi + "c_prospect/getListFollowUp/IFCAPB2/", {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(res => {
                if(!res.Error){
                    const resData = res.Data;
                    const data = [];
                    resData.map(val => {
                        data.push([
                            val.Nama_Prospek,
                            val.Status_Descs,
                            val.Tgl_Follow_Up,
                            val.Aktivitas
                        ]);
                    });
                    console.log("data", data);
                    this.setState({
                        dataRow: data,
                    });
                }
                this.setState({isLoad : false})
               
            })
            .catch(error => {
                this.setState({isLoad : false})
                console.log(error);
            }) : null
        }
    };

    render() {
        
        const tables = {
            tableHead: ["Nama", "Status", "Tanggal","Aktivitas"],
        };

        return (
            <Container>
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
                            {"Report Follow Up".toUpperCase()}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight} />

                </Header>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.state.dataRow.length > 0 ? (
                        <View style={nbStyles.wrap}>
                            
                            <Text style={Style.textBlack}>
                                Periode :{" "}
                                {moment(this.props.startDate).format("DD MMM YYYY")} -{" "}
                                {moment(this.props.endDate).format("DD MMM YYYY")}{" "}
                            </Text>
                            <ScrollView horizontal={true}>
                            <Table style={{marginBottom: 20}}>
                                <Row
                                    data={tables.tableHead}
                                    style={styles.head}
                                    textStyle={[Style.textBlack,styles.textHeader]}
                                    widthArr={this.state.widthArr}
                                />
                                {this.state.dataRow.map((rowData,index)=>
                                    <Row
                                        key={index}
                                        data={rowData}
                                        style={[styles.row, index%2 && {backgroundColor: '#f3f3f3'}]}
                                        textStyle={styles.text}
                                        widthArr={this.state.widthArr}
                                    />
                                )}
                               
                            </Table>
                            </ScrollView>

                        </View>
                    ) :  (
                        <View style={nbStyles.nullList}>
                            <Text style={[Style.textBlack, Style.textLarge]}>
                                Data Empty
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </Container>
        );
    }
}
export default ReportListFollowUp;
const styles = StyleSheet.create({
    input: {
        height: 40,
        backgroundColor: "#f5f5f5",
        color: "black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: null,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    inputs: {
        height: 80,
        backgroundColor: "#f5f5f5",
        color: "black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: null,
        borderRadius: 10
    },
    head: { height: 40, backgroundColor: "#f1f8ff" },
    textHeader: { margin: 6, textAlign: 'center' },
    text: { margin: 6, color: "#444",fontFamily: "Montserrat-Regular", textAlign: 'center'},
    row: {  backgroundColor: '#fff' }
});
