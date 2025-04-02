import { makeStyles } from "@material-ui/core";
import theme from "../Utils/theme";
//import sizes from "../Utils/DashboardTheme";
/* const drawerWidth = "240px" */
const useStyles = makeStyles(() => ({

    titleDrower: {
        fontFamily: "Poppins",
        fontSize: "24px",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "32.016px",
        color: theme.colors.onPrimaryContainer
    },
    bodyDrower: {

    },

    containerManagement: {

    },
    autocomplete: {
        "& .MuiInput-underline:after": {
            display: "none"

        },
        "& .MuiAutocomplete-clearIndicator::after": {
            content: "none",
            display: "none"
        },
        marginBottom: "21px",
    },
    areaButton: {
        fontFamily: "Poppins",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "24px", /* 171.429% */
        letterSpacing: "0.4px",
        textTransform: "uppercase",
        color: theme.colors.primary[40]
    },
    gatewaysBox: {
        marginTop: "24px",
        borderRadius: "4px",
        background: theme.colors.onPrimary,
        /* Elevation/1 */
        boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0.20), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        width: "352px",
        padding: "8px 24px 16px 24px",
        gap: "8px",
        cursor: "pointer"
    },
    gatewaysFlex: {
        display: "flex",
        justifyContent: "space-between",
    },
    gatewaysText: {
        color: theme.colors.onPrimaryContainer,
        fontFamily: "Poppins",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "32px", /* 266.667% */
        letterSpacing: "1px",
        textTransform: "uppercase"
    },
    gatewaysTotal: {
        fontFamily: "Poppins",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "20px", /* 166.667% */
        letterSpacing: "0.4px",
        color: theme.colors.outline
    },
    gatewaysValue: {
        fontFamily: "Poppins",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "24px", /* 171.429% */
        letterSpacing: "0.1px",
        color: theme.colors.onPrimaryContainer
    },
    gatewaysFlexState: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "8px",
    },
    gatewaysActive: {
        display: "flex",
        flexDirection: "column",
    },
    gatewaysInAlert: {
        display: "flex",
        flexDirection: "column",
    },
    gatewaysInactive: {
        display: "flex",
        flexDirection: "column"
    },
    gatewaysTextActive: {
        fontFamily: 'Poppins',
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '32.016px',
        color: theme.colors.secondary
    },
    gatewaysTextInAlert: {
        fontFamily: 'Poppins',
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '32.016px',
        color: "#FFB900"
    },
    gatewaysTextInactive: {
        fontFamily: 'Poppins',
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '32.016px',
        color: theme.colors.error[40]
    },
   




}));

export default useStyles;