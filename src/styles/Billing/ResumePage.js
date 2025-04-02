import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    container: {
        backgroundColor: theme.colors.predizadark,
        height: "calc(100vh - 64px)",
        padding: "20px",
        position: "relative",
        [theme.breakpoints.down(sizes.xs)]: {
            padding: "0px",
        }
    },
    slider: {
        marginLeft: "100px",
        width: "calc(100% - 200px)",
        [theme.breakpoints.down(sizes.xs)]: {
            width: "calc(100% - 80px)",
            marginLeft: "40px",
        }
    },
    main: {
        ".slick-dots li.slick-active": {
            // your code here
            color: "white!important"
        }
    }
}

export default styles;