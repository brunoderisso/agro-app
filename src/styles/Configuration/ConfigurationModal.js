import { makeStyles } from "@material-ui/core";
//import sizes from "../Utils/DashboardTheme";
/* const drawerWidth = "240px" */
const useStyles = makeStyles((theme) => ({
    modalContainer: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: theme.colors.onPrimary,
        padding: "24px 40px",
        width: "650px",
        height: "525px",
        borderRadius: "8px"
    },
    textColor: {
        color: theme.colors.onPrimaryContainer
    },
    body: {
        height: "100%"
    },
    stepper: {
        padding: "0px"
    },
    step: {
        "& .MuiStepIcon-active": {
            color: theme.colors.onPrimaryContainer
        }
    },
    title: {
        fontWeight: 600
    },
    btPrimary: {
        '& span': {
            gap: '8px'
        },
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
        },
    },
    btText: {
        color: theme.colors.primary[40]
    },
    marginButton: {
        marginLeft: "24px"
    }
}));

export default useStyles;