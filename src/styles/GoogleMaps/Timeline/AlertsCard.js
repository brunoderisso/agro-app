import theme from "../../Utils/theme";

export default {
  container: {
    padding: "8px 8px 12px 8px",
    backgroundColor: theme.colors.onPrimaryContainerTransparent[60],
  },
  iconBt: {
    color: theme.colors.onPrimary,
    fontSize: '12px'
  },
  text: {
    fontWeight: 500,
    fontSize: "10px",
    lineHeight: "12px",
    color: theme.colors.onPrimary
  },
  textEvent: {
    fontWeight: 500,
    fontSize: "10px",
    lineHeight: "14px",
    color: theme.colors.onPrimary
  },
  containerBt: {
    "&:hover": {
      backgroundColor: theme.colors.primaryThirtyTransparent,
    }
  },
  containerHeader: {
    marginBottom: "4px"
  },
  containerContent: {
    marginTop: "16px"
  },
  alertIcon: {
    transform: "scale(0.50)",
    marginLeft: "-5px"
  },
}