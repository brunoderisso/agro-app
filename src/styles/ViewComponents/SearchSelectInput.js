import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    selectInputForm: {
        '& fieldset': {
            border: "none"
        }
    },
    selectInput: {
        color: theme.colors.primary[40],
        fontFamily: "Poppins",
        fontSize: "14px",
        fontWeight: "500",
        lineHeight: "24px",
        letterSpacing: "0.4px",
        textAlign: "center",

        "& .MuiSelect-icon": {
            display: "none"
        },
        "&::before": {
            display: "none"
        },
        "&::after": {
            display: "none"
        }

    },
    selectInputListSubheader: {
        height: "32px",
        background: theme.colors.background,

        "& div": {
            "& div": {
                "& fieldset": {
                    border: "none"
                }
            }
        }
    },
    textFieldSearch: {
        fontFamily: "Poppins",
        fontSize: "12px",
        fontWeight: "400",
        lineHeight: "20px",
        letterSpacing: "0.4px",
        textAlign: "left",
        width: "240px",
        "& div": {
            paddingRight: 0,
            "& input": {
                fontFamily: "Poppins",
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "20px",
                letterSpacing: "0.4px",
                textAlign: "left",

            },
            "& MuiInputAdornment-root": {
                marginLeft: "24px"
            }
        }
    },
    hrStyle: {
        borderTop: "1px solid #C5C6D0",
        margin: 0
    },
    listItemsSelect: {
        display: "flex"
    },
    rollableContainer: {
        maxHeight: 190,
        overflowY: 'auto', // Habilita a rolagem vertical
        '&::-webkit-scrollbar': {
            width: '6px', // Largura da barra de rolagem
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: theme.colors.inactive, // Cor de fundo da barra de rolagem
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.colors.outline, // Cor do botão da barra de rolagem
            borderRadius: '2em', // Borda do botão da barra de rolagem
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555', // Cor do botão da barra de rolagem ao passar o mouse
        },
    }
}));

export default useStyles;