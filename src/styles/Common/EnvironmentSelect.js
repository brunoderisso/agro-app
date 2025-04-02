import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        gap: "16px"
    },
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        backgroundColor: theme.colors.primary[95]
    },
    textAvatar: {
        color: theme.colors.onPrimaryContainer,
        fontSize: "15px"
    },
    iconButton: {
        "&:hover": {
            backgroundColor: "white"
        }
    },
    menuItems: {
        '& .MuiMenu-paper': {
            minWidth: "296px",
            '& ul': {
                '& li': {
                    maxHeight: "48px",
                    color: theme.colors.onPrimaryContainer,
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "20.02px",
                    letterSpacing: "0.14993999898433685px",
                    textAlign: "left",
                }
            }
        }
    },
    iconSearch: {
        marginRight: '16px',
        marginLeft: '18px'
    },
    searchLabel: {
        width: "100%",
        '& div': {
            height: "40px",
            fontSize: '12px'
        },
        '& .MuiInput-underline:before': {
            display: "none"
        },

        '& label.Mui-focused': {
            marginLeft: '-12px',
        },
        '& label.MuiFormLabel-root.Mui-focused': {
            color: theme.colors.primary[40]

        },
        '& .MuiInput-underline:after': {
            /*  borderBottom: '2px solid ' + theme.colors.primary[40] */
        }
    },
    PinIcon: {
        fontSize: "25px",
        color: "white"
    },
    envNameTitle: {
        margin: "0 8px",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "24px",
        letterSpacing: "0.4px",
        textAlign: "center",
        color: "#FFFFFF",
        "@media (max-width: 600px)": {
            display: "none"
        }
    },
    envNameArrow: {
        margin: "0 4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    envNameBellIcon: {
        marginLeft: "6px",
        marginRight: "-6px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    containerButton: {
        display: "flex",
        alignItems: "center"
    }
}));

export default useStyles;