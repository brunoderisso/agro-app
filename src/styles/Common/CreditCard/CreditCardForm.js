import theme from "../../Utils/theme";
import sizes from "../../Utils/DashboardTheme";

const styles = {
    paddingInput: {
        marginBottom: "24px"
    },
    title: {
        textAlign: "center",
        fontSize: "25px",
        fontWeight: 600,
        paddingBottom: "15px",
    },
    cardContainer: {
        padding: "40px 24px 24px 24px",
        borderRadius: "8px",
        width: "min-content"
    },
    iconSize: {
        transform: "scale(0.7)"
    },
    nextButton: {
        borderRadius: "4px",
        padding: "8px 16px",
        color: theme.colors.onPrimary,
        backgroundColor: theme.colors.primary[40],
        "&:hover": {
            backgroundColor: theme.colors.primary[30],
        }
    },
    prevButton: {
        borderRadius: "4px",
        padding: "8px 16px",
        color: theme.colors.primary[40],
        borderColor: theme.colors.primary[40],
        "&:hover": {
            backgroundColor: theme.colors.primary[95],
        }
    },
    cleanButton: {
        color: theme.colors.primary[40],
        "&:hover": {
            backgroundColor: theme.colors.primary[95],
        }
    },
    iconColor: {
        color: theme.colors.onPrimaryContainer
    },
    cardComponentPosition: {
        position: "absolute",
        top: "-30%",
        transform: "translate(-50%, 0%)",
        left: "50%",
        [theme.breakpoints.up(sizes.xxlg)]: {
            top: "-25%",
        },
    },
    container: {
        paddingTop: "200px",
        [theme.breakpoints.down(sizes.xl)]: {
            paddingTop: "160px",
        },
    },
    alignCenter: {
        justifyContent: 'center',
        alignContent: 'center'
    }
}

export default styles;