import { makeStyles } from '@material-ui/core';

import theme from '../Utils/theme';
import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles(() => ({
    container: {
        width: "28%",
        borderRadius: "8px",
        padding: "40px 24px 24px 24px",
        flexDirection: "column",
        alignItems: "center",
        [theme.breakpoints.down(sizes.sm)]: {
           width: "444px"
        },
    }
}));

export default useStyles;