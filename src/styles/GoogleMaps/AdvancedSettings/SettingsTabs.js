import { makeStyles } from "@material-ui/core";

import theme from "../../Utils/theme";

const useStyles = makeStyles(() => ({
    indicatorSelectedTab: {
        backgroundColor: theme.colors.primary[40],
    },
    selectedTab: {
        color: theme.colors.primary[40],
    },
    tabWidth: {
        minWidth: "140px"
    }
}));

export default useStyles;