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
        color: theme.colors.primary[40],
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
        /* 266.667% */
        letterSpacing: "1px",
        textTransform: "uppercase",
        lineHeight: 0,
        display: "flex",
        alignItems: "center"
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
    tabPanel: {
        paddingBottom: "100px"
    },
    containerFlexPages: {
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-between"
    },
    tabsPrimary: {
        /*    "& span": {
               backgroundColor: "#0053DB"
           }, */
        borderBottom: "1px solid" + theme.colors.inactive,
        "& .MuiTabs-flexContainer": {
            justifyContent: "space-around",
            marginTop: "14px",
            "& button": {
                color: "#0053DB"
            }
        }
    },
    prospectStyle: {
        marginTop: "24px",
        "& div": {
            "& p": {
                display: "flex",
                flexWrap: "wrap"
            }
        }
    },
    prospectBox: {
        display: "flex",
        width: " 50%",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "4px",
        fontSize: "12px",
    },
    prospectValue: {
        fontFamily: "Poppins",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "24px",
        letterSpacing: "0.1px",
        color: theme.colors.onPrimaryContainer
    },
    totalValue: {
        display: "flex",
        width: "90px",
        justifyContent: "space-between",
        padding: "10px",
        "& #totalReduce": {
            /* Subtitle 2 */
            fontFamily: "Poppins",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "24px", /* 171.429% */
            letterSpacing: "0.1px",
            display: "flex",
            justifyContent: "space-between",
            color: theme.colors.onPrimaryContainer

        }
    },
    iconButton: {
        padding: 0,
        minWidth: "auto",
    },
    iconProp: {
        color: theme.colors.onPrimary
    },
    boldTextLabelFilter: {
        color: theme.colors.onPrimary,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: 0.4,
        textTransform: 'uppercase'
    },
    itemLabelFilter: {
        '&:hover': {
            backgroundColor: 'inherit',
        },
        '&.MuiListItem-gutters': {
            paddingLeft: 0,
            paddingRight: 0
        }
    },
    textLabelFilter: {
        color: theme.colors.onPrimary,
        textAlign: 'center',
        fontSize: 12,
        lineHeight: '20px',
        letterSpacing: 0.4
    },
    labelFilter: {
        display: 'flex',
        padding: '4px 16px',
        alignItems: 'center',
        margin: "2px",
        gap: 8,
        borderRadius: 24,
        backgroundColor: theme.colors.outline
    },
    containerFilter: {
        display: 'flex',
        flexWrap: "wrap"
    },
    titleBoxAllLocations: {
        display: "flex",
        alignItems: "center"
    },
    containerFilterCheckBoxFlex: {
        display: "flex",
        padding: "6px",
        justifyContent: "space-between"
    },
    containerFilterCheckBox: {
        "& span": {
            fontFamily: "Poppins",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "20px",
            letterSpacing: "0.4px",
            textAlign: "left",
            color: theme.colors.onPrimaryContainer
        },
        "& .css-dcuyt8-MuiButtonBase-root-MuiCheckbox-root.Mui-checked, .css-dcuyt8-MuiButtonBase-root-MuiCheckbox-root.MuiCheckbox-indeterminate": {
            color: theme.colors.onPrimaryContainer

        }
    },
    titleMarket: {
        color: theme.colors.onPrimaryContainer,
        paddingLeft: "6px",
        fontFamily: "Poppins",
        fontSize: "18px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "24px", /* 171.429% */
        letterSpacing: "0.4px",
        textTransform: "uppercase",
    },
    containerFilterMarket: {
        display: "flex",
        padding: "6px"
    },
    thumb: {
        background: "#AEAEAE",
        borderRadius: "2em",
    },
    scrollList: {
        '& > div': {
            display: "flex"
        }
    },
    root: {
        "& .MuiAccordion-root:before": {
            opacity: 0
        },
        "& div": {
            padding: 0
        },
        width: '100%'
    },
    selectInput: {
        color: theme.colors.primary[40],
        fontFamily: "Poppins",
        fontSize: "14px",
        fontWeight: "500",
        lineHeight: "24px",
        letterSpacing: "0.4px",
        textAlign: "center",

        "& .MuiSelect-icon": {
            display: "none"
        },
        "&::before": {
            display: "none"
        },
        "&::after": {
            display: "none"
        }

    },
    textFieldSearch: {
        fontFamily: "Poppins",
        fontSize: "12px",
        fontWeight: "400",
        lineHeight: "20px",
        letterSpacing: "0.4px",
        textAlign: "left",
    }
}));

export default useStyles;