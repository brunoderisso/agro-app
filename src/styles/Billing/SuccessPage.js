import { makeStyles } from "@material-ui/core";
import theme from "../Utils/theme";

const useStyles = makeStyles(() => ({
    cardContainer: {
        maxWidth: "400px",
        padding: "24px",
        color: theme.colors.onPrimaryContainer
    },
    productName: {
        fontSize: "16px",
        fontWeight: 600,
        color: theme.colors.onPrimaryContainer
    },
    intervalText: {
        color: theme.colors.outline
    },
    subtotal: {
        fontSize: "12px",
        fontWeight: 600,
        color: theme.colors.onPrimaryContainer
    },
    textCupom: {
        color: theme.colors.secondary,
        fontWeight: 600,
        fontSize: "12px"
    },
    total: {
        fontSize: "32px",
        fontWeight: 600
    },
    button: {
        color: theme.colors.primary[40],
        borderColor: theme.colors.primary[40],
        "&:hover":{
            backgroundColor: theme.colors.primary[95],
        }
    },
    message: {
        fontSize: "16px",
        fontWeight: 400,
        textAlign: 'center'
    },
    link: {
        color: theme.colors.primary[40]
    }
}));

export default useStyles;