import theme from "./Utils/theme";

export default {
    Menus: {
        "& div.MuiMenu-paper": {
            top: "250!important"
        }
    },
    rotate: {
        transform: "rotate(90deg)",
    },
    WidgetIcon: {
        fontSize: "25px",
        color: "white",
    },
    ItemIcon: {
        [theme.breakpoints.between('xs', 'sm')]: {
            fontSize: "11vh"
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            fontSize: "7vh"
        },

    },
    ItemIconExternal: {
        [theme.breakpoints.between('xs', 'sm')]: {
            width: "65px",
            height: "65px"
        },

    },
    ItemIconBilling: {
        [theme.breakpoints.between('xs', 'sm')]: {
           transform: "scale(1.8)"
        },

    },
    iconButton: {
        "&:hover": {
            backgroundColor: "white"
        }
    },
    LineItem: {
        minHeight: "100%",
        "&:hover": {
            backgroundColor: "white"
        },
        justifyContent: "center"

    },
    label: {
        fontSize: "12px",
        color: "#7a727a",
        [theme.breakpoints.between('xs', 'md')]: {
            display: 'none'
        },
    },
    paper: {
        overflowY: "hidden",
        [theme.breakpoints.between('xs', 'sm')]: {
            maxHeight: "60vh",
            minHeight: "60vh",
            minWidth: "35vw",
            maxWidth: "35vw",
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            maxHeight: "42vh",
            minHeight: "42vh",
            minWidth: "25vw",
            maxWidth: "25vw",
            top: "-12px"
        },
        zIndex: "1601"
    },
    menu: {
        "& .MuiPaper-root": {
            top: "7vh!important",
        }
    }
}