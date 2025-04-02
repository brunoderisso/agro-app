import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  inputs: {
    "& .MuiInputBase-input": {
      fontSize: "12px",
      fontWeight: 400,
      color: theme.colors.onPrimaryContainer
    },
    "& label.Mui-focused": {
      color: theme.colors.primary[40],
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: theme.colors.primary[40],
      },
    },
    "& .MuiSelect-root": {
      height: "14px"
    },
    "& .MuiInputBase-root": {
      height: "39px",
      backgroundColor: theme.colors.onPrimary,
    },
  },
  textFieldLabel: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
    backgroundColor: theme.colors.onPrimary
  },
  inputAdornment: {
    marginRight: "3px",
    marginLeft: "-5px",
    "& .MuiTypography-colorTextSecondary": {
      color: theme.colors.onPrimaryContainer,
      fontSize: "12px",
      fontWeight: 400,
    }
  }
}))

export default useStyles;