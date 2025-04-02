import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    slider: {
        width: "945px",
        [theme.breakpoints.down(sizes.xmd)]: {
            width: "750px",
        },
        [theme.breakpoints.down(sizes.xsm)]: {
            width: "90%",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            width: "100%",
            marginLeft: "40px",
        },
        "& .slick-list": {
            textAlign: "-webkit-center"
        },
        "& .slick-slide": {
            height: "auto!important" // ← that must not be ignored
        },
        "& .slick-track": {
            display: "flex!important",
            flexDirection: "row!important",
            flexWrap: "nowrap!important",
            alignItems: "stretch!important",
        }
    },
    main: {
        ".slick-dots li.slick-active": {
            color: "white!important"
        }
    },
    progressBar: {
        width: '100%',
        margin: '40px 0',
        padding: '0 12px'
    },
    wrapperArrow: {
        display: 'flex',
        width: '46px',
        height: '46px',
        backgroundColor: theme.colors.onPrimary,
        filter: `drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.20))
                drop-shadow(0px 6px 10px rgba(0, 0, 0, 0.14))
                drop-shadow(0px 1px 18px rgba(0, 0, 0, 0.12))`,
        position: 'absolute',
        top: '50%',
        borderRadius: '50%',
        justifyContent: 'center',
        cursor: 'pointer',
        "& .slick-next": {
            right: 15,
            top: '37%',
            width: 13,
            height: 13,
        },
        "& .slick-prev": {
            left: 15,
            top: '37%',
            width: 13,
            height: 13,
        },
    },
    leftArrow: {
        left: -55
    },
    rightArrow: {
        right: -55
    }
}

export default styles;