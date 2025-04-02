import { makeStyles } from "@material-ui/core";
import theme from "../Utils/theme";
//import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        marginTop: 63,
        padding: "40px 48px 120px 48px"
    },
    chartContainer: {
        paddingTop: "24px"
    },
    cardContainer:{
        padding: "24px"
    },
    textColor: {
        color: theme.colors.onPrimaryContainer
    },
    mainTitle: {
        fontSize: "32px",
        fontWeight: 500,
        color: theme.colors.onPrimaryContainer
    },
    chart: {
        '& > div > div > div > span:last-child': {
            marginLeft: "-10px"
        }
    },
    tableTitle: {
        fontSize: "24px",
        fontWeight: 600,
        color: theme.colors.onPrimaryContainer

    }
}));

export default useStyles;