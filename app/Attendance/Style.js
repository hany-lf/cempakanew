const React = require("react-native");
const { Platform } = React;

export default {
    layoutContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  
    homeBg: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  
    wrapBtn: { width: "80%", marginTop: 20 },
    
    wrapBtnCheck: { width: "80%", marginTop: 10, marginBottom: 15 },
    
    wrapday: {
      marginBottom: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    
    wrapImg: { width: 340, height: 340, borderRadius: 5 },
    
    wrapLocation: {
        width: 340,
        height: 100,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#333",
    },
    map: {
      width: 340,
      height: 340,
      borderRadius: 5,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#333",
    }, 
    mapMarkerContainer: { left: "47%", position: "absolute", top: "42%" },
    mapMarker: { fontSize: 40, color: "red" },
    deatilSection: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 10,
      display: "flex",
      justifyContent: "flex-start",
    },
  };
  
