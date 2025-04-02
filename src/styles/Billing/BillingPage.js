
import theme from "../Utils/theme";
//import sizes from "../Utils/DashboardTheme";
const styles = {
    stepper: {
        color: "#FF0000"
    },
    root: {
        color: theme.colors.primary[40],
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    active: {
        color: theme.colors.primary[40],
    },
    stepperBackground: {
        backgroundColor: theme.colors.background,
        padding: "0px 24px",
        marginTop: "40px"
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: theme.colors.primary[40],
        textAlign: "center",
        lineHeight: "24px"
    },
    circleInactive: {
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: theme.colors.inactive,
        textAlign: "center",
        lineHeight: "24px"
    },
    completed: {
        color: "white",
        zIndex: 1,
        fontSize: 22,
    },
    activeStep: {
        color: "white",
        fontSize: "12px",
        fontWeight: "500",
    },
    labelColor: {
        color: theme.colors.primary[40]
    },
    messageColor: {
        color: theme.colors.onPrimaryContainer,
        textAlign: "center",
        margin: "40px 0px",
        fontWeight: 500
    },
    primaryContainer: {
        backgroundColor: theme.colors.background
    }
}

export default styles;