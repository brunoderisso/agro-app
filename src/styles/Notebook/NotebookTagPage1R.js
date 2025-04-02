import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    containerTag: {
        width: "205px",
        height: "327px",
        background: "white",
        borderRadius: "20px",
        padding: "25px",
        [theme.breakpoints.down(sizes.xl)]: {
            height: "329px",
        },
    },
    verticalText: {
        writingMode: "vertical-rl",
        position: "relative",
        left: "-12px",
        top: "25px",
        fontSize: "13px",
    },
    titleText: {
        fontSize: "15px",
    },
    codeText: {
        fontSize: "18px",
    },
    infoText: {
        fontSize: "10px",
    },
    downloadButton: {
        marginLeft: "55px",
        marginTop: "5px",
    },
    buttonConfig:{
        fontSize: "10px"
    }

}

export default styles;