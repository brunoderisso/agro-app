

import theme from "../../theme";
import sizes from "../../components/DashboardTheme";


export default {
    box: {
        [theme.breakpoints.down(sizes.xs)]: {
            minHeight: "48px"
        },
        [theme.breakpoints.up(sizes.xs)]: {
            minHeight: "48px"
    
        },
        [theme.breakpoints.up(sizes.sm)]: {
            minHeight: "40px"
    
        },
        [theme.breakpoints.up(sizes.md)]: {
            minHeight: "35px"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            minHeight: "28px"
    
        },
        [theme.breakpoints.up(sizes.xl)]: {
            minHeight: "15px"
    
        },
        [theme.breakpoints.up(sizes.xxl)]: {
        },
      },
      width: {
        [theme.breakpoints.down(sizes.xs)]: {
          width: "75vw"
    
        },
        [theme.breakpoints.up(sizes.xs)]: {
          width: "75vw"
    
        },
        [theme.breakpoints.up(sizes.sm)]: {
          width: "39vw"
    
        },
        [theme.breakpoints.up(sizes.md)]: {
          width: "28vw"
    
        },
        [theme.breakpoints.up(sizes.lg)]: {
          width: "28vw"
    
        },
        [theme.breakpoints.up(sizes.xl)]: {
          width: "28vw"
    
        },
        [theme.breakpoints.up(sizes.xxl)]: {
        },
      },
}