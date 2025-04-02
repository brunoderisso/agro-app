import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  grow: {
        flexGrow: 1,
      },
      grid: {
        padding: 10,
      },
      textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 100,
      },
      appBar: {
        top: 'auto',
        bottom: 0,
        margin: 0,
        left: 0,
        rigth: 0,
      },
      xs: {
        [theme.breakpoints.between('xs', 'sm')]: {
          display: 'none'
        },
      },
      selectedxs:{
        [theme.breakpoints.between('xs', 'sm')]: {
          display: 'none'
        },
        color: theme.colors.primary[40],
        fontColor: theme.colors.onPrimaryContainer
      },
      md: {
        [theme.breakpoints.between('md', 'xl')]: {
          display: 'none'
        },
      }
}))

export default useStyles;