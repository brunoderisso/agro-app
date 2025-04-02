import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    buttonColor: {
        color: theme.colors.primary[40]
    },
    tableCell: {
        padding: "16px 0px",
        maxWidth: "150px",
        overflow: "hidden"
    },
    removeButton: {
        color: theme.colors.error[40]
    },
    confirmButton: {
        color: theme.colors.primary[40]
    },
    selectRoot: {
        "&:focus": {
            backgroundColor: "transparent", // remover o fundo cinza no foco
        },
    },
    focused: {
        color: theme.colors.onPrimaryContainer,  // Cor do texto e da borda quando em foco
    },
    icon: {
        color: "gray",  // Cor padrão do ícone
    },
    iconFocused: {
        color: theme.colors.onPrimaryContainer,  // Cor do ícone quando o campo está em foco
    },
    textFieldRoot: {
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "gray", // Cor padrão da borda
            },
            "&:hover fieldset": {
                borderColor: "black", // Cor da borda no hover
            },
            "&.Mui-focused fieldset": {
                borderColor: theme.colors.onPrimaryContainer, // Cor da borda quando o campo está em foco
            },
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: theme.colors.onPrimaryContainer,  // Cor do sublinhado ao focar
        },
        "& .MuiInput-underline:before": {
            borderBottomColor: "gray", // Cor do sublinhado normal
        },
        "& .MuiInput-underline:hover:before": {
            borderBottomColor: "black", // Cor do sublinhado ao passar o mouse
        },
    },
}));

export default useStyles;