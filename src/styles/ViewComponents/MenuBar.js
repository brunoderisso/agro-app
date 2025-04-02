import { makeStyles } from "@material-ui/core";
import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles((theme) => ({
    avatarButtonColor: {
        "@media (max-width: 326px)": {
            padding: 0
        },
        "& span": {
            "& div": {
                backgroundColor: theme.colors.onPrimary,
                color: theme.colors.primary[30],
                fontFamily: "Poppins",
                fontSize: "20px",
                fontWeight: 500,
                lineHeight: "40px",
                letterSpacing: "0.15px",
                textAlign: "center",

            }
        }
    },
    textMenu: {
        color: theme.colors.onPrimaryContainer
    },
    Menus: {
        [theme.breakpoints.down(sizes.xs)]: {
            top: "15vh!important"
        },
        [theme.breakpoints.up(sizes.xs)]: {
            top: "12vh!important"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            top: "10vh!important"
        },
        [theme.breakpoints.up(sizes.md)]: {
            top: "9vh!important"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            top: "9vh!important"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            top: "6vh!important"
        },
        [theme.breakpoints.up(sizes.xxl)]: {
            top: "5vh!important"
        },
    },
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    nested: {
        paddingLeft: theme.spacing(4),
        '&:focus': {
            backgroundColor: theme.palette.primary.main,

            '& $primary': {
                color: theme.palette.common.white,
            },
        },
    },
    primary: {},
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    icon: {
        marginRight: "16px"

    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.colors.primary[30],
        padding: "0 35px",
        "@media (max-width: 700px)": {
            padding: 0

        },
        "@media (max-width: 380px)": {
            "& .MuiToolbar-gutters": {
                paddingLeft: "5px",
                paddingRight: "5px"
            }
        }
    },
    logo: {
        height: "auto",
        maxHeight: "65px",
        maxWidth: "100%"
    }
}));

export default useStyles;