import theme from "../Utils/theme";

const styles = {
    containerList:{
        zIndex: 999,
        position: "fixed",
        top: "136px",
        backgroundColor: "white",
        borderRadius: "0px 0px 10px 10px"
    },
    infoPoligons:{
        textAlign: "center",
        lineHeight: "20px",
        padding: "10px",
        color: "#7e7e7e",
        position: "relative",
        top: "20px"
    },
    thumb: {
        background: theme.colors.predizadark,
        borderRadius: "2em",
    },
    polygonItemList:{
        '&:hover':{
            backgroundColor: "rgba(0,0,200,0.1)"
        }
    },
    btPrimary: {
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
        },
    },
    textBtPrimary: {
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '0.4px',
        color: theme.colors.primary[40],
    },
}

export default styles;