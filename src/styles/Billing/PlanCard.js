import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    container: {
        backgroundColor: theme.colors.onPrimary,
        borderRadius: "8px",
        minWidth: "290px",
        margin: "0 12px",
        padding: "40px 24px 24px 24px",
        // "-webkit-box-shadow": "10px 10px 8px -3px rgba(0,0,0,0.49)",
        // "-moz-box-shadow": "10px 10px 8px -3px rgba(0,0,0,0.49)",
        // boxShadow: "10px 10px 8px -3px rgba(0,0,0,0.49)",
        position: "relative",
        [theme.breakpoints.up(sizes.lg)]: {
            width: "290px"
        }
    },
    creditCardIcon:{
        color: theme.colors.primary[40]
    },
    button: {
        backgroundColor: theme.colors.primary[40],
        color: "white",
        padding: "8px 16px",
        "&:hover":{
            backgroundColor: theme.colors.primary[30],
        }
    },
    buttonText: {
        color: "white",
    },
    cardTitle: {
        color: theme.colors.onPrimaryContainer,
        textAlign: "center",
        fontWeight: "600"
    },
    price: {
        fontSize: "4vw",
        [theme.breakpoints.up(sizes.lg)]: {
            fontSize: "2.5vw",
        },
        fontWeight: "600",
        lineHeight: "96px",
        color: theme.colors.onPrimaryContainer,
        margin: "0px 8px"
    },
    cardHeader: {
        lineHeight: "96px",
        textAlign: "center",
        display: "flex",
        justifyContent: "center"
    },
    priceInterval: {
        lineHeight: "96px",
        color: theme.colors.onPrimaryContainer,
        textAlign: "left"
    },
    priceCurrency: {
        lineHeight: "96px",
        color: theme.colors.onPrimaryContainer,
        textAlign: "right"
    },
    divider: {
        margin: "24px 0px",
    },
    subtitle: {
        textAlign: "center",
        color: theme.colors.onSurface,
    },
    contentList: {
        margin: "24px 0px",
    },
    featureIcon: {
        color: theme.colors.primary[40],
        marginTop: "1px"
    },
    featureText: {
        color: theme.colors.onSurface,
        textAlign: "left"
    }
}

export default styles;