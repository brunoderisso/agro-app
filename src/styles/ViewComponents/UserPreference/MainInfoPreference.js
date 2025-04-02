import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "24px 0 24px 0",
    gap: "16px"
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  mainColorAvatar: {
    backgroundColor: theme.colors.primary[95]
  },
  secondaryColorAvatar: {
    backgroundColor: theme.colors.neutral[95]
  },
  avatarText: {
    fontSize: "21px"
  },
  mainColor: {
    color: theme.colors.onPrimaryContainer,
  },
  h6Text: {
    fontSize: "20px"
  },
  containerInfo: {
    flexDirection: "column"
  },
  outlineColor: {
    color: theme.colors.outline
  },
  containerMainInfo: {
    marginBottom: "8px"
  }
}))

export default useStyles;