const React = require("react-native");
const { Platform } = React;
import { Fonts, Metrics, Colors } from "../Themes/";

export default {
  layoutContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  homeBg: {
    flex: 1,
    paddingBottom: 30,
  },

  section: {
    flex: 1,
    paddingLeft: 0,
    alignItems: "center",
    width: "100%"
  },
  trash: {
    justifyContent: "center"
  },

  item: {
    width: "100%",
    flexDirection: "column"
  },
  record: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#DDD",
    marginLeft: 0,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    justifyContent: "center"
  },
  recordLast: {
    flexDirection: "row",
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingVertical: 15
  },
  itemImg: {
    width: 100,
    height: 68,
    borderRadius: 5
  },
  itemInfo: {
    flex: 1,
    paddingHorizontal: 15
  },
  itemTitle: {
    color: "#333",
    fontSize: 14,
    fontFamily: Fonts.type.sfuiDisplaySemibold,
    marginTop: 32,
    lineHeight: 16,



  },
  itemLocation: {
    color: "#666",
    fontSize: 11,
    fontFamily: Fonts.type.sfuiDisplaySemibold,

    marginBottom: 5,
    lineHeight: 16
  },
  itemDate: {
    color: "#999",
    fontSize: 10,
    fontFamily: Fonts.type.sfuiDisplaySemibold
  },
  itemRow: {
    flexDirection: "row"
  },
  itemOverview: {
    flexGrow: 1,
    flexDirection: "row"
  },
  itemIcon: {
    color: "#999",
    marginRight: 5,
    fontSize: 18
  },
  itemNo: {
    color: "#333",
    marginRight: 5,
    fontFamily: Fonts.type.sfuiDisplaySemibold,

    marginTop: 5,
    fontSize: 12
  },

  crv: {
    borderRadius: 8
  },
  sHeader: {
    color: '#333',
    fontSize: 14,
    fontFamily: Fonts.type.sfuiDisplaySemibold,
    marginTop: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  cHeader: {
    color: '#333',
    fontSize: 14,
    fontFamily: Fonts.type.sfuiDisplaySemibold,
    marginTop: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginRight: 100
  },
  sBtn: {
    padding: 1,
    backgroundColor: "#fb5f26",
    color: '#FFF',
    width: 120
  },
  sLink: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: Fonts.type.sfuiDisplaySemibold,
  },
  headerUnit: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  city: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  btnCity: {
    width: '30%',
    height: 75,
    marginBottom: 10,
    marginTop: 16,
    backgroundColor: '#DFE3EE',
    borderRadius: 10,
    shadowColor: '#eee',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 1,
  },
  btnCityImg: {
    flex: 1,
  },
  btnCityLocation: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCityText: {
    color: '#8B9DC3',
    fontFamily: Fonts.type.sfuiDisplaySemibold,
    fontSize: 12,
  },


  flatCity: {
    paddingLeft: 20,
  },
  itemCity: {
    width: 150,
    marginLeft: 5,
    marginRight: 5,
  },
  itemCityCount: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 64,
  },
  itemCityLocation: {
    color: '#FFF',
    fontFamily: Fonts.type.sfuiDisplaySemibold,
    fontSize: 13,
  },
  itemCityImg: {
    marginBottom: 10,
    width: 150,
    height: 64,
    borderRadius: 5,
    textAlign: 'center'
  },
  textInput: {
    fontFamily: Fonts.type.sfuiDisplaySemibold,
    borderBottomWidth: 0,
    borderColor: '#DDD',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 12,
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  textInputBold: {
    fontFamily: Fonts.type.bold,
    fontWeight: 'bold',
    borderBottomWidth: 0,
    borderColor: '#DDD',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 12,
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    color: 'black'
  },
  overviewTitle: {
    flex: 1,
    fontFamily: Fonts.type.sfuiDisplaySemibold,
  },
  containImageTop: {
    backgroundColor: "#fff",
    width: Metrics.WIDTH * 0.92,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    elevation: 3
  },
  overview: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,

  },
  hidden: {
    width: '0%',
    height: '0%',
    backgroundColor: 'transparent'
  },
  btnMedium: {
    backgroundColor: Colors.goldUrban,
    // height: Metrics.HEIGHT * 0.10,
    height: 40,
    width: 300,
    paddingLeft: 20,
    paddingRight: 20,
    // width: '100%',
    alignSelf: "center",
    elevation: 3,
    // shadowColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5
  }
};
