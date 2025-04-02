import theme from "../../Utils/theme";

const styles = {
    importButton: {
        color: theme.colors.primary[40]
    },
    margin: {
        marginBottom: "24px"
    },
    sizeInput: {
      "& .MuiFormHelperText-root": {
        color: theme.colors.onSurfaceVariant,
        fontSize: "12px"
      }
    },
    inputs: {
        "& .MuiInputBase-input": {
            fontSize: "12px",
            fontWeight: 400
        },
        '& label.Mui-focused': {
            color: theme.colors.primary[40],
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: theme.colors.primary[40],
            },
        }
    },
    errorMessage: {
        color: "red",
        marginBottom: "5px"
    },
    iconButton: {
        padding: "6px 0",
        minWidth: "auto",
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
        },
    },
    disableIcon: {
        '& span': {
            '& svg': {
                '& path': {
                    fill: theme.colors.outline
                }
            }
        }
    },
    subTitle: {
        color: theme.colors.onPrimaryContainer,
        fontSize: "12px",
        lineHeight: "32px",
        letterSpacing: "1px"
    },
    iconProp: {
        color: theme.colors.onPrimaryContainer,
        fontSize: theme.iconProp.fontSize,
    },
    contentConfirmIcon: {
        display: 'flex',
        gap: '16px',
        flexDirection: 'row-reverse',
    }
}

export default styles;